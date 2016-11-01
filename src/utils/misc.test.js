import {
  mergeNew,
  deepCamelCase,
  mandatory
} from './misc.js';


describe('utils misc', () => {
  describe('mergeNew', () => {
    let a1, b2;
    beforeEach(() => {
      a1 = {propa: 1};
      b2 = mergeNew(a1, {propb: 2});
    });
    it('should be a function', () => {
      mergeNew.should.be.a('function');
    });
    it('old should not have been overwritten', () => {
      a1.should.deep.equal({propa: 1});
      a1.should.not.contain({propb: 2});
    });
    it('new should be a merge with old', () => {
      b2.should.contain(a1).and.contain({propb: 2});
    });
  });
  describe('deepCamelCase', () => {
    it('should work on (one)', () => {
      deepCamelCase('one').should.equal('one');
    });
    it('should work on (one, two)', () => {
      deepCamelCase('one', 'two').should.equal('oneTwo');
    });
    it('should work on (one, two, three)', () => {
      deepCamelCase('one', 'two', 'three').should.equal('oneTwoThree');
    });
  });
  describe('mandatory', () => {
    it('should throw', () => {
      mandatory.should.throw();
    });
  });
});
