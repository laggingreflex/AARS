import _ from 'lodash';
import Immutable from 'immutable';
import {createReducer} from 'redux-create-reducer';
import {takeEvery} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import restApiRequest from './utils/rest-api-request';
import {deepCamelCase} from './utils/misc';
import {fetchActions, miscActions, crudPreOperations} from './defaults';

export default function createCRUDComponent ({
  apiUrl,
  name,
  initialState = {},
  actions: actionOpts,
  operations: customCrudOperations,
  wrapped
} = {}) {
  /* PREP */
  const preActions = fetchActions;
  const preActionsReducer = (operation) => {
    return _.reduce(preActions, (all, action) => {
      const namedOpActionLabel = deepCamelCase(name, operation.label, action.label);

      return _.merge(all, {
        [namedOpActionLabel]: {
          action,
          operation
        }
      });
    }, {});
  };
  const preOperations = customCrudOperations || crudPreOperations;
  const preOperationsReducer = () => {
    return _.reduce(preOperations, (all, operation) => {
      return _.merge(all, preActionsReducer(operation));
    }, {});
  };
  const preOperationsActions = _.merge({},
    preOperationsReducer(),
    _.reduce(miscActions, (all, action, label) => {
      return _.assign(all, {
        [label]: {
          action,
          operation: {}
        }
      });
    }, {})
  );

  /* REDUCERS */
  const initialStateImmutable = Immutable.Map(initialState);
  const reducerHandlers = _.reduce(preOperationsActions, (all, pre) => {
    const namedOpActionLabel = deepCamelCase(name, pre.operation.label, pre.action.label);
    const dataLabel = pre.action.dataLabel || pre.operation.dataLabel || 'data';
    const reducer = (state, action) => {
      return state.merge(_.merge({
        [dataLabel]: action[dataLabel]
      }, pre.action.state));
    };

    return _.merge(all, {
      [namedOpActionLabel]: reducer});
  }, {});
  const reducers = createReducer(initialStateImmutable, reducerHandlers);

  /* ACTIONS */
  const actions = _.reduce(preOperationsActions, (all, pre) => {
    const namedOpActionLabel = deepCamelCase(name, pre.operation.label, pre.action.label);
    const opActionLabel = deepCamelCase(pre.operation.label, pre.action.label);
    const dataLabel = pre.action.dataLabel || pre.operation.dataLabel || 'data';
    const actionLabel = pre.action.label;
    const action = (data) => {
      return (dispatch, state) => {
        let dataWrap;

        if (pre.action.wrapData) {
          dataWrap = {data};
        } else {
          dataWrap = data;
        }

        if (_.isFunction(_.get(actionOpts, actionLabel))) {
          dataWrap = actionOpts[actionLabel](dataWrap, state) || dataWrap;
        }

        return dispatch({
          [dataLabel]: dataWrap,
          type: namedOpActionLabel
        });
      };
    };

    return _.merge(all, {
      [opActionLabel]: action});
  }, {});

  /* API */
  const api = _.reduce(preOperations, (all, preOp, opLabel) => {
    return _.merge(all, {
      [opLabel] ({authorization, ...data}) {
        return restApiRequest({
          apiUrl,
          authorization,
          data,
          resource: name + '/' + opLabel
            // ...requestOpts
        });
      }
    });
  }, {});

  /* SAGAS */
  const sagas = _.reduce(preOperations, (all, preOp, opLabel) => {
    const namedOpLabel = deepCamelCase(name, opLabel);
    const getNamedOpActionLabel = (action) => {
      return deepCamelCase(name, opLabel, preActions[action].label);
    };
    const getOpActionLabel = (action) => {
      return deepCamelCase(opLabel, preActions[action].label);
    };

    return _.merge(all, {
      *[namedOpLabel] () {
        yield* takeEvery(getNamedOpActionLabel('request'), function*(dataWrap) {
          const apiRequest = api[opLabel];
          const requestData = dataWrap[preActions.request.dataLabel];
          const successAction = actions[getOpActionLabel('success')];
          const failureAction = actions[getOpActionLabel('failure')];

          let apiRequestError, apiRequestResult;

          try {
            apiRequestResult = yield call(apiRequest, requestData);
          } catch (err) {
            apiRequestError = err.message;
          }

          let actionResult;

          if (apiRequestResult) {
            try {
              actionResult = successAction(apiRequestResult);
            } catch (err) {
              actionResult = err.message;
              console.error('Unexpected successAction Error:', err);
            }
          } else if (apiRequestError) {
            try {
              actionResult = failureAction(apiRequestError);
            } catch (err) {
              actionResult = err.message;
              console.error('Unexpected failureAction Error:', err);
            }
          } else {
            console.error('Unexpected saga apiRequest call Error: Neither result nor error received');
          }

          yield put(actionResult);

          // // All above was expanded from following few lines for debugging
          // try {
          //     yield put(actions[getOpActionLabel('success')](yield call(api[opLabel], requestData)));
          // } catch (error) {
          //     console.log('error:', error);
          //     yield put(actions[getOpActionLabel('failure')](error.message));
          // }
        });
      }
    });
  }, {});

  /* RETURN */
  const component = {
    actions,
    reducers,
    sagas
  };

  if (wrapped) {
    return {
      [name]: component};
  } else {
    return component;
  }
}
