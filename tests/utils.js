import assert from 'assert';
import * as misc from '../src/utils/misc';

describe('utils', () => {
  describe('misc', () => {
    it('mergeNew', () => {
      const a1 = {a: 1};
      const b2 = misc.mergeNew(a1, {b:2});
      // old should not have been overwritten
      assert.deepEqual(a1, {a:1});
      // new should be a merge with old
      assert.deepEqual(b2, {a:1,b:2});
    });
  });
});
