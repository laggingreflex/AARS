import createComponent from './';

describe('createComponent', () => {
  it('should throw without arguments', () => {
    createComponent.should.throw();
    createComponent.should.throw({});
  });
  it('should throw without name', () => {
    createComponent.should.throw({apiUrl: 'test'});
    createComponent.should.throw({name: 'test'});
  });
  it('should return an object', () => {
    createComponent({
      apiUrl: 'http://api.server.com',
      name: 'test'
    }).should.be.an('object');
  });
  it('should return a wrapper object', () => {
    createComponent({
      apiUrl: 'http://api.server.com',
      name: 'test',
      wrapped: true
    }).test.should.be.an('object');
  });
});
