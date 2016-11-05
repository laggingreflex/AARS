import {spy} from 'sinon';
import {
  sagaCreator,
  createSagasHelper
} from './sagas';

const createFixtures = () => {
  const fixtures = {};

  fixtures.data = {
    actions: {
      failure: {error: 'message'},
      request: {request: 'data'},
      success: {data: 'success'}
    },
    api: {
      request: {request: 'data'}
    }
  };

  fixtures.actions = {
    failure: spy(() => {
      return fixtures.data.actions.failure;
    }),
    request: spy(() => {
      return fixtures.data.actions.request;
    }),
    success: spy(() => {
      return fixtures.data.actions.success;
    })
  };
  fixtures.api = {
    request: spy(() => {
      return fixtures.data.api.request;
    })
  };

  fixtures.preActions = {
    failure: {
      label: 'failure'
    },
    request: {
      label: 'request'
    },
    success: {
      label: 'success'
    }
  };

  fixtures.name = 'test';

  fixtures.createTestSagas = () => {
    return createSagasHelper({
      actions: fixtures.actions,
      api: fixtures.api,
      name: fixtures.name,
      preActions: fixtures.preActions
    });
  };

  fixtures.sagaCreator = () => {
    return sagaCreator({
      api: fixtures.api,
      failureAction: fixtures.actions.failure,
      successAction: fixtures.actions.success
    });
  };

  return fixtures;
};

describe('sagaCreator', () => {
  let fixtures, saga;

  beforeEach(() => {
    fixtures = createFixtures();
    saga = fixtures.sagaCreator();
  });

  it('should throw ', () => {
    sagaCreator.should.throw();
    (() => sagaCreator({})).should.throw();
    (() => sagaCreator({api:'some'})).should.throw();
    (() => sagaCreator({api:'some', failureAction(){}})).should.throw();
  });
  it('should be a generator', () => {
    saga().next.should.be.a('function');
  });

  it('should yield CALL', () => {
    const iterator = saga();
    const CALL = iterator.next();

    CALL.value.CALL.fn.should.be.a('function');
  });
  it('should call the api', () => {
    saga().next().value.CALL.fn();
    fixtures.api.request.should.have.been.called;
  });
  it('should yield PUT', () => {
    const iterator = saga();

    iterator.next();

    const PUT = iterator.next();

    PUT.value.PUT.action.should.deep.equal(fixtures.data.actions.success);
  });
});

describe('createSagasHelper', () => {
  it('should be a function', () => {
    createSagasHelper.should.be.a('function');
  });
  it('should throw without arguments', () => {
    createSagasHelper.should.throw();
  });
  it('should not throw with proper arguments', () => {
    createFixtures().createTestSagas.should.not.throw();
  });
  describe('sagas', () => {
    let fixtures, sagas;

    beforeEach(() => {
      fixtures = createFixtures();
      sagas = fixtures.createTestSagas();
    });

    it('should be an object', () => {
      sagas.should.be.an('object');
    });

    it('should contain saga wrapped in "test"', () => {
      sagas.should.have.a.property('test');
    });

    describe('saga', () => {
      let fixtures, saga;

      beforeEach(() => {
        fixtures = createFixtures();
        saga = fixtures.createTestSagas().test;
      });

      it('should be a generator', () => {
        const iterator = saga();

        iterator.should.have.a.property('next');
        iterator.next.should.be.a('function');
      });

      describe('iterator', () => {
        let fixtures, saga;

        beforeEach(() => {
          fixtures = createFixtures();
          saga = fixtures.createTestSagas().test();
        });

        it('should take test', () => {
          saga.should.deep.yield({
            '@@redux-saga/IO': true,
            TAKE: {
              pattern: 'testRequest'
            }
          });
        });
      });
    });
  });
});
