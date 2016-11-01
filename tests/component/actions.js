import {spy} from 'sinon';
import {createComponent} from '../fixtures';

describe('actions', () => {
  let actions;

  beforeEach(() => {
    actions = createComponent().actions;
  });

  const actionTester = ({actionLabel, dataLabel, type}) => {
    it('should have ' + actionLabel, () => {
      actions.should.have.property(actionLabel);
    });

    describe(actionLabel, () => {
      let action;

      beforeEach(() => {
        action = createComponent().actions[actionLabel];
      });
      it('should be a function', () => {
        action.should.be.a('function');
      });
      it('should return a dispatch function', () => {
        action().should.be.a('function');
      });
      it('dispatch function should be called', () => {
        const dispatch = spy();
        const data = {some: 'data'};
        const state = {some: 'state'};

        action(data)(dispatch, state);
        dispatch.should.have.been.calledOnce; // eslint-disable-line
        dispatch.args[0][0].should.deep.equal({
          [dataLabel]: data,
          type
        });
      });
    });
  };

  actionTester({
    actionLabel: 'request',
    dataLabel: 'requestData',
    type: 'testRequest'
  });
  actionTester({
    actionLabel: 'success',
    dataLabel: 'data',
    type: 'testSuccess'
  });
  actionTester({
    actionLabel: 'failure',
    dataLabel: 'error',
    type: 'testFailure'
  });
});
