import _ from 'lodash';
import Immutable from 'immutable';
import {createReducer} from 'redux-create-reducer';
import {mandatory} from '../utils/misc';
import {fetchActions, miscActions} from '../defaults';
import createReducerHandler from './reducer';
import {createActionHelper} from './actions';
import createApi from './api';
import {createSagasHelper} from './sagas';

export default function createComponent ({
  apiUrl = mandatory('Need an apiUrl'),
  name = mandatory('Need an name'),
  initialState = {},
  request: {options: requestOpts} = {},
  actions: actionOpts = {},
  resource,
  wrapped = false
} = {}) {
  const preActions = _.merge({}, fetchActions, miscActions);

  const initialStateImmutable = Immutable.Map(initialState);
  const reducerHandlers = _.reduce(preActions, createReducerHandler({
    name
  }), {});
  const reducers = createReducer(initialStateImmutable, reducerHandlers);

  const actions = createActionHelper({
    actionOpts,
    name,
    preActions
  });

  const api = createApi({
    apiUrl,
    name,
    requestOpts,
    resource
  });

  const sagas = createSagasHelper({
    actions,
    api,
    name,
    preActions
  });

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
