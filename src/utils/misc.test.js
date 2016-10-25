import {mergeNew} from './misc.js';

describe('mergeNew', () => {
  const a1 = {a: 1};
  const b2 = mergeNew(a1, {b: 2});
  it('old should not have been overwritten', () => {
    expect(a1).toEqual(jasmine.objectContaining({a: 1}));
    expect(a1).not.toEqual(jasmine.objectContaining({b: 2}));
  });
  it('new should be a merge with old', () => {
    expect(b2).toEqual(jasmine.objectContaining({a: 1, b: 2}));
  });
});
