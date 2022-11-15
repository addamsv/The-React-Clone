import { expect } from 'chai';
import ColorPickerModel from '../src/models/colorPickerPackage/colorPickerModel';

describe('Color Picker Model Test', () => {
  const colorPickerModel = new ColorPickerModel();

  describe('rgbToHex: rgbToHex(num, num, num):', () => {
    it('rgbToHex: random values test', () => {
      expect(colorPickerModel.rgbToHex(12, 22, 33)).to.be.equal('#0c1621');
      expect(colorPickerModel.rgbToHex(106, 106, 106)).to.be.equal('#6a6a6a');
      expect(colorPickerModel.rgbToHex()).to.be.equal('#000000');
    });
    it('rgbToHex: should return an error if non-natural or less then zero value passed', () => {
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, 2.2, 0, 255)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, 0, 0, 256)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, -2, 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, 0, -2.2, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, NaN, 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, Infinity, 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, -Infinity, 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, 'hello', 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, '12', 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, true, 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, false, 0, 1)).to.throw(Error);
      expect(colorPickerModel.rgbToHex.bind(colorPickerModel, null, 0, 1)).to.throw(Error);
    });
  });
  describe('Contrast: getContrast(hex: string, cntInp: string): number', () => {
    it('Contrast: random values test', () => {
      expect(colorPickerModel.getContrast('#400ee2')).to.be.equal(16);
    });
    it('Contrast: should return an error if non-natural or less then zero value passed', () => {
      expect(colorPickerModel.getContrast.bind(colorPickerModel, 2.2)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, 0)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, -2)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, -2.2)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, NaN)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, Infinity)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, -Infinity)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, 'hello')).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, '12')).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, true)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, false)).to.throw(Error);
      expect(colorPickerModel.getContrast.bind(colorPickerModel, null)).to.throw(Error);
    });
  });
});
