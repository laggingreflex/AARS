import {
  createComponent,
  createCRUD,
  preAuth,
  postAuth,
  groupComponents
} from '../src';

describe('imports', () => {
  describe('createComponent', () => {
    it('should be a function', () => {
      createComponent.should.be.a('function');
    });
  });
  describe('createCRUD', () => {
    it('should be a function', () => {
      createCRUD.should.be.a('function');
    });
  });
  describe('preAuth', () => {
    it('should be a function', () => {
      preAuth.should.be.a('function');
    });
  });
  describe('postAuth', () => {
    it('should be a function', () => {
      postAuth.should.be.a('function');
    });
  });
  describe('groupComponents', () => {
    it('should be a function', () => {
      groupComponents.should.be.an('object');
    });
  });
});
