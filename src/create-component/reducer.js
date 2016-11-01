import _ from 'lodash';
import {deepCamelCase} from '../utils/misc';

export default ({name}) => {
  return (all, preAction) => {
    const label = preAction.label;
    const namedLabel = deepCamelCase(name, label);
    const dataLabel = preAction.dataLabel || 'data';

    const reducer = (state, action) => {
      return state.merge(_.merge({
        [dataLabel]: action[dataLabel]
      }, preAction.state));
    };

    return _.merge(all, {[namedLabel]: reducer});
  };
};
