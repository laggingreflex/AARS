import {takeEvery} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {deepCamelCase, mandatory} from '../utils/misc';

export const rootSagaCreator = ({
  requestlabel,
  saga
}) => {
  return function * () {
    yield* takeEvery(requestlabel, saga);
  };
};

export const sagaCreator = ({
  api = mandatory('Need an api'),
  failureAction = mandatory('Need a failureAction'),
  requestDataLabel = 'requestData',
  successAction = mandatory('Need a successAction')
}) => {
  return function *saga (dataWrap = {}) {
    const data = dataWrap[requestDataLabel] || {};

    try {
      const apiResult = yield call(api.request, data);
      const successActionResult = successAction(apiResult);

      yield put(successActionResult);
    } catch (error) {
      const failureActionResult = failureAction(error.message);

      yield put(failureActionResult);
    }
  };
};

export const createSagasHelper = ({
  name,
  preActions,
  actions,
  api
}) => {
  const failureAction = actions[preActions.failure.label];
  const requestDataLabel = preActions.request.dataLabel || 'data';
  const requestlabel = deepCamelCase(name, preActions.request.label);
  const successAction = actions[preActions.success.label];

  const saga = sagaCreator({
    api,
    failureAction,
    requestDataLabel,
    successAction
  });

  const rootSaga = rootSagaCreator({
    requestlabel,
    saga
  });

  return {
    [name]: rootSaga
  };
};
