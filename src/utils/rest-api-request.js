export const handleResponse = (response) => {
  let contentType, extractBody;

  try {
    contentType = response.headers.get('content-type');
  } catch (error) {
    throw new Error('Invalid response object. ' + error.message);
  }

  try {
    if (contentType && contentType.includes('application/json')) {
      extractBody = response.json();
    } else {
      extractBody = response.text();
    }
  } catch (error) {
    throw new Error('Invalid response object. ' + error.message);
  }

  return extractBody.then((body) => {
    if (200 <= response.status && response.status < 300) {
      return body;
    }

    const error = new Error( body.error || ( response.status + ' ' + ( response.statusText || '' ) ) ); // eslint-disable-line

    error.statusCode = response.status;
    error.httpResponse = response;
    error.response = body;

    throw error;
  });
};

export default async({
  apiUrl,
  resource,
  method = 'post',
  authorization,
  data
} = {}) => {
  if (!apiUrl && !resource) {
    throw new Error('Need an apiUrl or a resource');
  }

  let url;

  if (apiUrl) {
    url = apiUrl;
  } else {
    url = '';
  }
  if (resource) {
    url += '/' + resource;
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

  const fetchResponse = await fetch(url, opts);
  const handledResponse = handleResponse(fetchResponse);

  return handledResponse;
};
