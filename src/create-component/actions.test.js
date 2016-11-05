import { spy } from 'sinon';
import { Map } from 'immutable';

import { actionCreator } from './actions';

describe( 'actionCreator', () => {
  it( 'should create an action that calls dispatch', () => {
    const action = actionCreator( {
      label: 'label',
      name: 'test'
    } );
    const dispatcher = action();
    const dispatch = spy();
    dispatcher( dispatch );
    dispatch.should.have.been.called;
  } );
  it( 'should wrapData and call hook', () => {
    const data = { some: 'data' };
    const hook = spy();
    const action = actionCreator( {
      hook,
      label: 'label',
      name: 'test',
      wrapData: true
    } );
    const dispatcher = action( data );
    const dispatch = spy();

    dispatcher( dispatch, Map );
    dispatch.should.have.been.calledWith( {
      data: { data },
      type: 'testLabel'
    } );
    hook.should.have.been.calledWith( { data } );
  } );
} );
