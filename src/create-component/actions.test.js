import {spy} from 'sinon';
import {actionCreator} from './actions';

const fixtures = {};

fixtures.createDummyStateObject = () => {
  const toJS = spy(() => {
    return {};
  });
  const stateObject = () => {
    return {
      toJS: spy(() => {
        return {};
      })
    };
  };

  stateObject.toJS = toJS;

  return stateObject;
};

describe('actionCreator', () => {
  // it('should throw without arguments', () => {
  //   actionCreator.should.throw();
  // });
  it('should return action object', () => {
    const action = actionCreator({
      preAction: {
        label: 'test'
      }
    });

    action.should.be.an('object');
    action.should.have.a.property('test');
  });
  describe('action object', () => {
    let action;

    beforeEach(() => {
      action = actionCreator({
        preAction: {
          label: 'test'
        }
      }).test;
    });

    it('should be a function', () => {
      action.should.be.a('function');
    });
    it('should return a dispatcherer function', () => {
      action.should.not.throw();
      action().should.be.a('function');
    });

    describe('dispatcherer', () => {
      let dispatcherer;

      beforeEach(() => {
        dispatcherer = actionCreator({
          preAction: {
            label: 'test'
          }
        }).test();
      });

      it('should be a function', () => {
        dispatcherer.should.be.a('function');
      });
      it('should throw on empty', () => {
        dispatcherer.should.throw();
      });
      it('should work with a dispatcher', () => {
        dispatcherer(() => {});
      });

      describe('dispatcher', () => {
        let data, dispatcher, state;

        beforeEach(() => {
          dispatcher = spy();
          state = fixtures.createDummyStateObject();
          data = {some: 'data'};
          actionCreator({
            preAction: {
              label: 'test'
            }
          }).test(data)(dispatcher, state);
        });

        it('should have been called once', () => {
          dispatcher.should.have.been.called;
        });
        it('should have been called with data', () => {
          dispatcher.should.have.been.calledWith({
            data,
            type: 'test'
          });
        });
      });
    });
  });
});
