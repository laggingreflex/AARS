import createComponent from './createComponent';

const fixtures = {};
fixtures.defaults = {
  name: 'test',
  apiUrl: 'http://api.server.com',
};
fixtures.createComponent = () => createComponent(fixtures.defaults);

describe( 'basic', () => {
  it( 'should throw without arguments', () => {
    expect( createComponent ).toThrow();
  } );
  it( 'should return an object', () => {
    const component = fixtures.createComponent();
    expect( component ).toEqual( jasmine.any( Object ) );
  } );
} );

describe( 'actions', () => {
  let component, actions;
  beforeAll( () => {
    component = fixtures.createComponent();
    actions = component.actions;
  } );
  describe( 'request', () => {
    it( 'should be valid', () => {
      expect( actions.request ).toEqual( jasmine.any( Function ) );
    } );
  } );
  describe( 'success', () => {
    it( 'should be valid', () => {
      expect( actions.success ).toEqual( jasmine.any( Function ) );
    } );
  } );
  describe( 'failure', () => {
    it( 'should be valid', () => {
      expect( actions.failure ).toEqual( jasmine.any( Function ) );
    } );
  } );
  describe( 'flush', () => {
    it( 'should be valid', () => {
      expect( actions.flush ).toEqual( jasmine.any( Function ) );
    } );
  } );
} );
