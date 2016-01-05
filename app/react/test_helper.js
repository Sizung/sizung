import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';
import hook from 'css-modules-require-hook'; // Used to make css-modules work in tests

chai.use(chaiImmutable);
chai.use(sinonChai);
chai.use(dirtyChai);
