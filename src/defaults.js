/* eslint-disable sorting/sort-object-props */

export const fetchActions = {
  request: {
    label: 'request',
    dataLabel: 'requestData',
    state: {
      error: null,
      isFetching: true,
      result: null
    },
    includeAuthToken: true
  },
  success: {
    label: 'success',
    state: {
      error: null,
      isFetching: false
    }
  },
  failure: {
    label: 'failure',
    dataLabel: 'error',
    state: {
      isFetching: false
    }
  }
};

export const miscActions = {
  flush: {
    label: 'flush',
    state: {
      data: null,
      requestData: null,
      error: null,
      isFetching: null
    }
  }
};

export const crudPreOperations = {
  create: {
    label: 'create',
    dataLabel: 'result'
  },
  read: {
    label: 'read'
  },
  update: {
    label: 'update',
    dataLabel: 'result'
  },
  remove: {
    label: 'remove',
    dataLabel: 'result'
  }
};

/* eslint-enable */