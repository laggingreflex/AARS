import restApiRequest from '../utils/rest-api-request';

export default ({
  apiUrl,
  name,
  resource,
  requestOpts
}) => {
  return {
    request: ({
      authorization,
      ...data
    }) => {
      return restApiRequest({
        apiUrl,
        authorization,
        data,
        resource: resource || name,
        ...requestOpts
      });
    }
  };
};
