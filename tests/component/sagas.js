import {createComponent} from '../fixtures';

describe('sagas', () => {
  let sagas;

  beforeEach(() => {
    sagas = createComponent().sagas.test;
  });

  it('should return a generator', () => {
    sagas().should.be.a('generator');
  });
  it('should TAKE request', () => {
    sagas().next().value.should.have.property('TAKE');
    sagas().next().value.TAKE.should.deep.equal({pattern: 'testRequest'});
  });
});
