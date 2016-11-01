import chai from 'chai';
import immutable from 'chai-immutable';
import sinon from 'sinon-chai';
import generator from 'chai-generator';
import fuzzy from 'chai-fuzzy';
import promise from 'chai-as-promised';
import fetch from 'node-fetch';
import utils from 'mocha/lib/utils';

// chai
chai.use(immutable);
chai.use(sinon);
chai.use(generator);
chai.use(fuzzy);
chai.use(promise);
chai.should();

// global fetch
global.fetch = fetch;

// Patch Mocha --watch to exclude /node_modules|dist|vendor/
const files = utils.files;
utils.files = (...args) => files(...args).filter((path) => !path.match(
  /node_modules|dist|vendor/
));
