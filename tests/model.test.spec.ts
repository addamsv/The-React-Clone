import { expect } from 'chai';
import Model from '../src/models/model';

describe('Test Model', () => {
  const model = new Model();
  // beforeEach(() => {
  //   model = new Model();
  // });

  describe('model.getTimerID()', () => {
    it('first get should return null', () => {
      expect(model.animation.getTimerID()).to.be.equal(null);
    });
  });

  describe('model.animation.setTimerID()', () => {
    it('should return an error if nothing was passed', () => {
      expect(model.animation.setTimerID.bind(model)).to.throw(Error);
    });
  });

  describe('model.validCrName', () => {
    it('should be an Array', () => {
      expect(model.container.validCrName).to.be.instanceOf(Array);
    });
    it('should be greater than one', () => {
      expect(model.container.validCrName.length).to.be.greaterThan(1);
    });
    it('should be equal 3', () => {
      expect(model.container.validCrName.length).to.be.equal(3);
    });
    it('check members', () => {
      expect(model.container.validCrName).to.have.members(['cs', 'i', 'c']);
      expect(model.container.validCrName.includes('cs')).to.be.true;
      expect(model.container.validCrName.includes('i')).to.be.true;
      expect(model.container.validCrName.includes('c')).to.be.true;
      expect(model.container.validCrName.includes('cz')).to.be.false;
      expect(model.container.validCrName[0]).to.be.equal('cs');
      expect(model.container.validCrName[0]).to.be.match(/cs/);
    });
  });
});
