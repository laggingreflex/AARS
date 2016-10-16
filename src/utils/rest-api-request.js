import _ from 'lodash';
import { routeActions } from 'react-router-redux';

export const handleResponse = (response) => {
  let extractBody;

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    extractBody = response.json();
  } else {
    extractBody = response.text();
  }

  return extractBody.then((body) => {
    if (200 <= response.status && response.status < 300) {
      return body;
    }

    /* eslint-disable no-extra-parens */
    const error = new Error(body.error || (response.status + ' ' + response.statusText));
    /* eslint-enable */

    error.statusCode = response.status;
    error.httpResponse = response;
    error.response = body;

    throw error;
  });
};

export const handleBadResponse = (dispatch) => {
  return (response) => {
    const statusCode = _.get(response, 'response.statusCode');

    if (statusCode === 401) {
      // dispatch(AuthenticationActionCreator.loginFailure(response));
      dispatch(routeActions.push('/login'));
    } else if (statusCode === 404) {
      dispatch(routeActions.push('/not-found'));
    } else {
      dispatch(routeActions.push('/server-error'));
    }
  };
};

export default ({
  apiUrl,
  resource,
  method = 'post',
  authorization,
  data = {}
}) => {
  if (!resource) {
    throw new Error('Need a resource for API');
  }

  const opts = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method
  };

  if (authorization) {
    opts.headers.Authorization = 'Bearer ' + authorization;
  }

  if (data) {
    opts.body = JSON.stringify(data);
  }

  return fetch(apiUrl + '/' + resource, opts).then(handleResponse);
};