import _ from 'lodash';
import Immutable from 'immutable';
import {createReducer} from 'redux-create-reducer';
import {takeEvery} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import restApiRequest from './utils/rest-api-request';
import {deepCamelCase} from './utils/misc';
import {fetchActions, miscActions} from './defaults';

function mandatory (message) {
  throw new Error(message || 'Required field missing');
}

export default function createComponent ({
  apiUrl = mandatory('Need an apiUrl'),
  name = mandatory('Need an name'),
  initialState = {},
  request: {options: requestOpts} = {},
  actions: actionOpts = {} ,
  resource,
  wrapped = false
} = {}) {
  const preActions = _.merge({}, fetchActions, miscActions);

  const initialStateImmutable = Immutable.Map(initialState);
  const reducerHandlers = _.reduce(preActions, (all, preAction) => {
    const label = preAction.label;
    const namedLabel = deepCamelCase(name, label);
    const dataLabel = preAction.dataLabel || 'data';

    return _.merge(all, {
      [namedLabel] (state, action) {
        return state.merge(_.merge({
          [dataLabel]: action[dataLabel]
        }, preAction.state));
      }
    });
  }, {});
  const reducers = createReducer(initialStateImmutable, reducerHandlers);

  const actions = _.reduce(preActions, (all, preAction) => {
    const label = preAction.label;
    const dataLabel = preAction.dataLabel || 'data';
    const namedLabel = deepCamelCase(name, label);

    return _.merge(all, {
      [label] (data) {
        return (dispatch, state) => {
          let dataWrap;

          if (preAction.wrapData) {
            dataWrap = {data};
          } else {
            dataWrap = data;
          }

          if (_.isFunction(_.get(actionOpts, label))) {
            dataWrap = actionOpts[label](dataWrap, state().toJS()[name]) || dataWrap;
          }

          return dispatch({
            [dataLabel]: dataWrap,
            type: namedLabel
          });
        };
      }
    });
  }, {});

  const api = {
    request: ({authorization, ...data}) => {
      return restApiRequest(_.merge({
        apiUrl,
        authorization,
        data,
        resource: resource || name
      }, requestOpts));
    }
  };

  const sagas = {
    *[name] () {
      yield* takeEvery(deepCamelCase(name, preActions.request.label), function*(dataWrap) {
        const data = dataWrap[preActions.request.dataLabel || 'data'];

        try {
          yield put(actions[preActions.success.label](yield call(api.request, data)));
        } catch (error) {
          yield put(actions[preActions.failure.label](error.message));
        }
      });
    }
  };

  const component = {
    actions,
    reducers,
    sagas
  };

  if (wrapped) {
    return {
      [name]: component
    };
  } else {
    return component;
  }
}
