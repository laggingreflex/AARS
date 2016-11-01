import {stub, spy} from 'sinon';
import api, {
  handleResponse
} from './rest-api-request';

const fixtures = {};

fixtures.getDummyResponse = (opts = {}) => {
  const response = {};
  const headers = response.headers = {};

  headers.get = (arg) => {
    return opts[arg] || 'text';
  };
  response.json = async() => {
    return opts.json || {some: 'data'};
  };
  response.text = async() => {
    return opts.text || 'some data';
  };
  response.status = opts.status || 200;

  if (opts.promise) {
    return Promise.resolve(response);
  } else {
    return response;
  }
};

fixtures.getDummyResponses = {
  badJson: (opts) => {
    return fixtures.getDummyResponse({
      'content-type': 'json',
      status: 404,
      ...opts
    });
  },
  badText: (opts) => {
    return fixtures.getDummyResponse({
      status: 404,
      ...opts
    });
  },
  goodJson: (opts) => {
    return fixtures.getDummyResponse({
      'content-type': 'application/json',
      ...opts
    });
  },
  goodText: (opts) => {
    return fixtures.getDummyResponse({...opts});
  }
};

fixtures.stubFetch = ({
  response = fixtures.getDummyResponses.goodText()
} = {}) => {
  return stub(global, 'fetch');
};

describe('utils rest-api-request', () => {
  describe('handleResponse', () => {
    it('should throw on invalid response', () => {
      handleResponse.should.throw();
      (() => {
        handleResponse({
          headers: {
            get: () => {
              return 'text';
            }
          }
        });
      }).should.throw();
    });
    it('should handle good text response', () => {
      return handleResponse(
        fixtures.getDummyResponses.goodText()
      ).should.be.fulfilled;
    });
    it('should handle good JSON response', () => {
      return handleResponse(
        fixtures.getDummyResponses.goodJson()
      ).should.be.fulfilled;
    });
    it('should handle 404 test', () => {
      return handleResponse(
        fixtures.getDummyResponses.badText()
      ).should.be.rejected;
    });
    it('should handle 404 JSON', () => {
      return handleResponse(
        fixtures.getDummyResponses.badJson()
      ).should.be.rejected;
    });
  });

  describe('api', () => {
    let fetch;

    beforeEach(async() => {
      fetch = stub(global, 'fetch');
    });

    afterEach(() => {
      fetch.restore();
    });

    it('should reject when no api or resource', () => {
      return api().should.be.rejected;
    });

    it('should reject with bad url', () => {
      fetch.returns(fixtures.getDummyResponses.badText({promise: true}));

      return api({apiUrl: 'bad'}).should.be.rejected;
    });

    it('should work with just url', () => {
      fetch.returns(fixtures.getDummyResponses.goodText({promise: true}));

      return api({apiUrl: 'https://some-url.com'});
    });
    it('should work with just resource', () => {
      fetch.returns(fixtures.getDummyResponses.goodText({promise: true}));

      return api({resource: 'some.res'});
    });

    it('should call fetch with the url', () => {
      const url = 'https://some-url.com';

      fetch
        .withArgs(url)
        .returns(fixtures.getDummyResponses.goodText({promise: true}));

      api({apiUrl: url});

      fetch.should.have.been.calledWith(url);
    });

    it('should return text data', () => {
      const text = 'some text';

      fetch.returns(fixtures.getDummyResponses.goodText({
        promise: true,
        text
      }));

      return api({apiUrl: 'good'}).should.eventually.equal(text);
    });
    it('should return JSON data', () => {
      const json = {some: 'data'};

      fetch.returns(fixtures.getDummyResponses.goodJson({
        json,
        promise: true
      }));

      return api({apiUrl: 'good'}).should.eventually.equal(json);
    });

    it('should pass data as body to fetch', () => {
      const url = 'some url';
      const data = {some: 'data'};

      fetch.returns(fixtures.getDummyResponses.goodJson({promise: true}));

      api({
        apiUrl: url,
        data
      });

      fetch.should.have.been.calledWithMatch(url, {
        body: JSON.stringify(data)
      });
    });
    it('should pass authorization to fetch', () => {
      const url = 'some url';
      const authorization = 'some token';

      fetch.returns(fixtures.getDummyResponses.goodJson({promise: true}));

      api({
        apiUrl: url,
        authorization
      });

      fetch.should.have.been.calledWithMatch(url, {
        headers: {
          Authorization: 'Bearer ' + authorization
        }
      });
    });
  });
});
