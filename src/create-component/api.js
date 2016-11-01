import _ from 'lodash';
import restApiRequest from '../utils/rest-api-request';

export default ({name, apiUrl, resource, requestOpts}) => {
  return {
    request: ({authorization, ...data}) => {
      return restApiRequest(_.merge({
        apiUrl,
        authorization,
        data,
        resource: resource || name
      }, requestOpts));
    }
  };
};
