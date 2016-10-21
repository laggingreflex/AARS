import assert from 'assert';
import {
  createComponent,
  createCRUD,
  preAuth,
  postAuth,
  groupComponents
} from '../src';

describe('imports', () => {
  it('exist', () => {
    assert(createComponent);
    assert(createCRUD);
    assert(preAuth);
    assert(postAuth);
    assert(groupComponents);
  });
});
