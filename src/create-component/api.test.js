import {spy} from 'sinon';
import api, {
  __RewireAPI__ as rewireApi // eslint-disable-line
} from './api';

describe('create-component api', () => {
  let restApiRequest;

  beforeEach(() => {
    restApiRequest = spy();
    rewireApi.__set__('restApiRequest', restApiRequest);
  });
  afterEach(() => {
    rewireApi.__ResetDependency__('restApiRequest');
  });

  it('should call restApiRequest', () => {
    api({}).request({});
    restApiRequest.should.have.been.called;
  });
  it('should call restApiRequest with args', () => {
    const apiUrl = 'some url';
    const authorization = 'some auth';
    const data = {some: 'data'};
    const name = 'test';

    api({
      apiUrl,
      name
    }).request({
      authorization,
      data
    });
    restApiRequest.should.have.been.calledWith({
      apiUrl,
      authorization,
      data: {data},
      resource: name
    });
  });
});
