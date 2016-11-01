import {createComponent} from '../fixtures';

describe('component', () => {
  let component;

  beforeEach(() => {
    component = createComponent();
  });

  it('should have actions', () => {
    component.should.have.property('actions');
  });

  it('should have reducers', () => {
    component.should.have.property('reducers');
  });

  it('should have sagas', () => {
    component.should.have.property('sagas');
  });
});
