import _ from 'lodash';

export const mergeNew = (oldOpts, newPreOpts, newPostOpts) => {
    return _.merge({}, newPreOpts, oldOpts, newPostOpts);
};

export const deepCamelCase = (...labels) => {
    return _.camelCase(labels.reduce((prev, current) => {
        return _.camelCase(prev || '') + _.capitalize(current || '');
    }));
};
