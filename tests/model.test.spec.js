import { expect } from 'chai';
import Model from '../src/controllers/model.js';

describe('Test Model', () => {
  const model = new Model();
  // beforeEach(() => {
  //   model = new Model();
  // });

  describe('model.getTimerID()', () => {
    it('first get should return empty string', () => {
      expect(model.getTimerID()).to.be.equal('');
    });
  });

  describe('model.setTimerID()', () => {
    it('should return an error if nothing was passed', () => {
      expect(model.setTimerID.bind(model)).to.throw(Error);
    });
    it('should return an error if non-natural value or 0 passed', () => {
      expect(model.setTimerID.bind(model, 2.2)).to.throw(Error);
      expect(model.setTimerID.bind(model, -2)).to.throw(Error);
      expect(model.setTimerID.bind(model, -2.2)).to.throw(Error);
      expect(model.setTimerID.bind(model, NaN)).to.throw(Error);
      expect(model.setTimerID.bind(model, Infinity)).to.throw(Error);
      expect(model.setTimerID.bind(model, -Infinity)).to.throw(Error);
      expect(model.setTimerID.bind(model, 'hello')).to.throw(Error);
      expect(model.setTimerID.bind(model, '12')).to.throw(Error);
      expect(model.setTimerID.bind(model, true)).to.throw(Error);
      expect(model.setTimerID.bind(model, false)).to.throw(Error);
      expect(model.setTimerID.bind(model, null)).to.throw(Error);
    });
  });

  describe('model.validCrName', () => {
    it('should be an Array', () => {
      expect(model.validCrName).to.be.instanceOf(Array);
    });
    it('should be greater than one', () => {
      expect(model.validCrName.length).to.be.greaterThan(1);
    });
    it('should be equal 3', () => {
      expect(model.validCrName.length).to.be.equal(3);
    });
    it('check members', () => {
      expect(model.validCrName).to.have.members(['cs', 'i', 'c']);
      expect(model.validCrName.includes('cs')).to.be.true;
      expect(model.validCrName.includes('i')).to.be.true;
      expect(model.validCrName.includes('c')).to.be.true;
      expect(model.validCrName.includes('cz')).to.be.false;
      expect(model.validCrName[0]).to.be.equal('cs');
      expect(model.validCrName[0]).to.be.match(/cs/);
    });
  });
});
