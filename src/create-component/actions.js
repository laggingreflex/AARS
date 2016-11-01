import _ from 'lodash';
import {deepCamelCase} from '../utils/misc';

export const actionCreator = ({
  actionOpts,
  name,
  preAction
}) => {
  const label = preAction.label;
  const dataLabel = preAction.dataLabel || 'data';
  const namedLabel = deepCamelCase(name, label);

  const action = (data) => {
    return (dispatch, state) => {
      let dataWrap;

      if (preAction.wrapData) {
        dataWrap = {data};
      } else {
        dataWrap = data;
      }

      if (_.isFunction(_.get(actionOpts, label))) {
        const actionOpt = actionOpts[label];
        const actionState = state().toJS()[name];

        dataWrap = actionOpt(dataWrap, actionState) || dataWrap;
      }

      return dispatch({
        [dataLabel]: dataWrap,
        type: namedLabel
      });
    };
  };

  return {
    [label]: action
  };
};

export const preActionsReducer = ({name, actionOpts}) => {
  return (all, preAction) => {
    const action = actionCreator({
      actionOpts,
      name,
      preAction
    });

    return _.merge(all, action);
  };
};

export const createActionHelper = ({name, actionOpts, preActions}) => {
  return _.reduce(preActions, preActionsReducer({
    actionOpts,
    name
  }), {});
};
