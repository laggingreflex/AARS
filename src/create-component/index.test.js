import createComponent from './';

describe('createComponent', () => {
  it('should throw without arguments', () => {
    createComponent.should.throw();
  });
  it('should return an object', () => {
    createComponent({
      apiUrl: 'http://api.server.com',
      name: 'test'
    }).should.be.an('object');
  });
});
