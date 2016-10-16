import _ from 'lodash';

const tokenLabel = (opts) => {
    return opts.tokenLabel || 'token';
};

const preAction = (label, opts, data, state) => {
    const action = _.get(opts, 'actions' + label);

    if (_.isFunction(action)) {
        return action(data, state) || data;
    } else {
        return data;
    }
};

export const storeTokenOnSuccess = (opts) => {
    const success = (data, state) => {
        const modifiedData = preAction('success', opts, data, state);

        localStorage.setItem(tokenLabel(opts), modifiedData[tokenLabel(opts)]);
    };

    return _.merge({actions: {success}}, opts);
};

export const injectAuthTokenOnRequest = (opts) => {
    const request = (data, state) => {
        const modifiedData = preAction('request', opts, data, state);

        return _.merge({
            authorization: _.get(modifiedData, tokenLabel(opts)) || localStorage.getItem(tokenLabel(opts))
        }, modifiedData);
    };

    return _.merge({}, opts, {actions: {request}});
};

export const preAuth = (create, opts) => {
    return create(storeTokenOnSuccess(_.merge({wrapped: true}, opts)));
};

export const postAuth = (create, opts) => {
    return create(injectAuthTokenOnRequest(_.merge({wrapped: true}, opts)));
};
