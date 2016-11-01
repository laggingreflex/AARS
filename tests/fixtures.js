import {
  createComponent as _createComponent
} from '../src';

export const data = {
  apiUrl: 'http://api.server.com',
  name: 'test'
};

export const createComponent = () => {
  return _createComponent(data);
};
