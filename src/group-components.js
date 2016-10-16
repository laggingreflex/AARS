import _ from 'lodash';

export const groupActions = (AARScomponents) => {
  return _.reduce(AARScomponents, (all, AARScomponent, name) => {
    return _.merge(all, {
      [name]: AARScomponent.actions
    });
  }, {});
};

export const groupReducers = (AARScomponents) => {
  return _.reduce(AARScomponents, (all, AARScomponent, name) => {
    return _.merge(all, {
      [name]: AARScomponent.reducers
    });
  }, {});
};

export const groupSagas = (AARScomponents) => {
  return _.reduce(AARScomponents, (components, AARScomponent) => {
    return _.merge(components, _.reduce(AARScomponent.sagas, (all, saga, label) => {
      return _.merge(all, {
        [label]: saga
      });
    }, {}));
  }, {});
};

export default {
  actions: groupActions,
  reducers: groupReducers,
  sagas: groupSagas
};
