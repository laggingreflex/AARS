import _ from 'lodash';
import {spy} from 'sinon';
import {createComponent} from '../fixtures';


describe('reducers', () => {
  let reducers;

  beforeEach(() => {
    reducers = createComponent().reducers;
  });

  it('should not throw', () => {
    const action = spy();

    reducers(undefined, action);
  });

  it('should create an initial state', () => {
    const action = spy();
    const state = {some: 'state'};
    const newState = reducers(undefined, action);

    newState.should.be.empty;
  });
  it('should create an initial state', () => {
    const action = spy();
    const state = {some: 'state'};
    const newState = reducers(undefined, action);

    newState.should.be.empty;
  });

  const reducersTester = ({label, dataLabel}) => {
    describe(label, () => {
      let reducer, state;

      beforeEach(() => {
        reducer = createComponent().reducers;
        state = {some: 'state'};
      });

      it('should return a state', () => {
        const newState = reducer(undefined, {
          type: 'test' + _.capitalize(label)
        });

        newState.should.have.property(dataLabel);
      });
    });
  };

  reducersTester({
    label: 'request',
    dataLabel: 'requestData'
  });
  reducersTester({
    label: 'failure',
    dataLabel: 'error'
  });
  reducersTester({
    label: 'success',
    dataLabel: 'data'
  });
});
