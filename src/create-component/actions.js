import _ from 'lodash';
import {deepCamelCase} from '../utils/misc';

export const actionCreator = ({
  name,

  label,
  dataLabel = 'data',
  hook,
  wrapData
}) => {
  const namedLabel = deepCamelCase(name, label);

  return (data) => {
    return (dispatch, state) => {
      if (wrapData) {
        data = {data};
      }

      if (hook) {
        data = hook(data, state().toJS()[name]) || data;
      }

      return dispatch({
        [dataLabel]: data,
        type: namedLabel
      });
    };
  };
};

export const preActionsReducer = ({
  name,
  actionOpts
}) => {
  return (all, preAction) => {
    const action = actionCreator({
      dataLabel: preAction.dataLabel,
      hook: actionOpts[preAction.label],
      label: preAction.label,
      name,
      wrapData: preAction.wrapData
    });

    return _.merge(all, {
      [preAction.label]: action
    });
  };
};

export const createActionHelper = ({
  name,
  actionOpts,
  preActions
}) => {
  return _.reduce(preActions, preActionsReducer({
    actionOpts,
    name
  }), {});
};
