import { expect } from 'chai';
// import TransformCss from '../src/models/styleSheetPackage/cssComponents/transformCss';

// class Data {
//   public getDataShort(crName: string = '', prop: string = '') {
//     return crName === 'c0_c2' && (prop === 'rotateY' || prop === 'skewY' || prop === 'scaleY' || prop === 'translateY') ? '15' : this.getDefaultData(crName, prop);
//   }

//   public getDefaultData(crName: string = '', prop: string = '') {
//     if (crName === 'c0_c2') {
//       switch (prop) {
//         case 'scaleX':
//         case 'scaleY':
//           return '1';
//         default:
//           return '0';
//       }
//     }
//     return '0';
//   }
// }

// class ModelTest {
//   public data: Data;

//   public set: any = {
//     cssNames: {
//       rotateAttr: 'em',
//       skewAttr: 'deg',
//       scaleAttr: '%',
//       translateAttr: 'em',
//     },
//   }

//   constructor() {
//     this.data = new Data();
//   }
// }

describe('T E S T', () => {
  // const mdl = new ModelTest();

  describe('getTransformCss:', () => {
    it('getRotate()', () => {
      // expect(TransformCss.component(mdl).getRotate({ crName: 'c0_c2', valType: 'rotateX', value: '33' })).to.be.equal(' rotateX( 33em ) rotateY( 15em )');
      // expect(TransformCss.component(mdl).getRotate({ crName: 'c0_c2', valType: 'rotateY', value: '10' })).to.be.equal(' rotateY( 10em )');
      // expect(TransformCss.component(mdl).getRotate({ crName: 'c0_c2', valType: 'rotateZ', value: '1' })).to.be.equal(' rotateY( 15em ) rotateZ( 1em )');
    });
    it('getTranslate()', () => {
      // expect(TransformCss.component(mdl).getTranslate({ crName: 'c0_c2', valType: 'translateX', value: '33' })).to.be.equal(' translateX( 2.0625em ) translateY( 0.9375em )');
      // expect(TransformCss.component(mdl).getTranslate({ crName: 'c0_c2', valType: 'translateY', value: '10' })).to.be.equal(' translateY( 0.625em )');
      // expect(TransformCss.component(mdl).getTranslate({ crName: 'c0_c2', valType: 'translateZ', value: '1' })).to.be.equal(' translateY( 0.9375em ) translateZ( 0.0625em )');
    });
    it('getSkew()', () => {
      // expect(TransformCss.component(mdl).getSkew({ crName: 'c0_c2', valType: 'skewX', value: '33' })).to.be.equal(' skewX( 33deg ) skewY( 15deg )');
      // expect(TransformCss.component(mdl).getSkew({ crName: 'c0_c2', valType: 'skewY', value: '10' })).to.be.equal(' skewY( 10deg )');
    });
    it('getScale()', () => {
      // expect(TransformCss.component(mdl).getScale({ crName: 'c0_c2', valType: 'scaleX', value: '33' })).to.be.equal(' scaleX( 33% ) scaleY( 15% )');
      // expect(TransformCss.component(mdl).getScale({ crName: 'c0_c2', valType: 'scaleY', value: '10' })).to.be.equal(' scaleY( 10% )');
    });
    it('get()', () => {
      // expect(TransformCss.component(mdl).get({ crName: 'c0_c2', valType: 'scaleX', value: '33' })).to.be.equal('translate: rotateY( 15em ) skewY( 15deg ) scaleX( 33% ) scaleY( 15% ) translateY( 0.9375em )');
      // expect(TransformCss.component(mdl).get({ crName: 'c0_c2', valType: 'scaleY', value: '10' })).to.be.equal('translate: rotateY( 15em ) skewY( 15deg ) scaleY( 10% ) translateY( 0.9375em )');
    });
  });
});
