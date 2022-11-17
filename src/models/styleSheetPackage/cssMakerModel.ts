import DOM from '../../utils/dom';
import { changeCSSClass } from '../../utils/css';
import TransformCss from './cssComponents/transformCss';
import Model from '../model';
import Animation from '../../components/app/components/mainMenu/components/animationMenu/animationModel';
import Data from '../dataPackage/dataModel';
import Container from '../dataPackage/containerModel';
import { addCSSRule, getClassRule, getKeyframesRule, getStyleSheet } from './styleSheetModel';

const hexToRgb = (hex: string): string => {
  return parseInt(hex, 16).toString();
}

const validateHex = (hex: string): string => {
  hex = hex.replace(/[^0-9abcdefABCDEF]/g, '').toLowerCase();
  return hex.length > 6 ? hex.substring(0, 6) : hex;
}

/**
 * getRgbFromHexString(str)
 */
const hexToRgbJSN = (hex: string): { red: string, grn: string, blu: string } => {
  hex =  validateHex(hex);
  if (hex.length === 6) {
    return {
      red: hexToRgb(hex.slice(0, 2)),
      grn: hexToRgb(hex.slice(2, 4)),
      blu: hexToRgb(hex.slice(4, 6)),
    };
  }
  throw new Error('Incorrect RGB format');
}

const CssMaker = {
  getRootCrName(crName: string) {
    return (crName.split('_'))[0];
  },

  convertCrNameToCssCrName(crName: string, divTypeToSplit = '_', divTypeToConvert = '-') {
    return divTypeToSplit === '_' ? crName.replace(/_/g, divTypeToConvert) : crName.replace(/-/g, divTypeToConvert);
  },

  pxToEm(pixel: number | string, crName = '', valType = ''): number {
    const px = Number(pixel);
    if (! px) {
      return 0;
    }

    if (valType === 'fontSize' || !crName) {
      return px / 16;
    }

    const crFontSize = Number(Data.getDataShort(crName, 'fontSize'));
    const occ = crFontSize / 16 || 1;
    return px / (16 * occ);
  },

  getCrDeepLvl(crName: string) {
    const crSpl = crName.split('_');
    return crSpl.length;
  },

  getRemakeSceneFrameEv(crName: string): CustomEvent {
    return new CustomEvent('remakeSceneFrameEv', { detail: { crName } });
  },

  isCrRoot(crName: string) {
    return crName.split('_').length <= 1;
  },

  isCrScene(crName: string) {
    return this.isCrRoot(crName);
  },

  /**
  *
  *
  *
  *
  *
  *
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │                       C S S   M O D E L                       │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  getDefaultBoxCSS(crName: string) {
    const out = `${''
    + ' '}${this.widthLeftCssProp(crName)} ${this.heightTopCssProp(crName)
    } background-color: ${this.getPropColorCSSVal(crName, 'backgroundColor')};`
    + ` padding-top: ${this.pxToEm(Data.getDataShort(crName, 'paddingTop'), crName)}em;`
    + ` padding-bottom: ${Data.getDataShort(crName, 'paddingBottom')}em;`
    + ` border: ${this.getBorder(crName, 'border')};`
    + ` border-radius: ${Data.getDataShort(crName, 'borderRadius')};`
    + ` box-shadow: ${this.getPropLRTBBlCSSVal(crName, 'boxShadow')};`;
    // " box-shadow: "+Data.getDataShort(crName, 'boxShadowPosition')+" "+
    // this.pxToEm(Data.getDataShort(crName, 'boxShadowLR'),crName)+"em "+
    // this.pxToEm(Data.getDataShort(crName, 'boxShadowTB'),crName)+"em "+
    // this.pxToEm(Data.getDataShort(crName, 'boxShadowBlur'),crName)+"em "+
    // this.pxToEm(Data.getDataShort(crName, 'boxShadowSpread'),crName)+"em "+
    // this.getPropColorCSSVal(crName,'boxShadowColor')+";"+
    // Data.getDataShort(crName, 'boxShadowColor')textShadowPosition
    // '';
    return out;
  },

  getDefaultCSS(crName: string) {
    const crType = Container.getCrType(crName);

    switch (crType) {
      case ('cntnr'):
        // var
        //   crSpl = crName.split("_"),
        //   this.isCrScene = ( crSpl.length > 1 ? false : true );
        if (this.isCrRoot(crName)) { // this.isCrScene==true
          /* Cr is a Scene */
          return ' width: 100%;'
              + ' height: 100%;'
              + ' background-size: cover;'
              + ' background-position: center center;';
          // background-color: rgba( 78, 78, 78, 0 );
          // background-size: cover;
          // background-position-x: center;
          // background-position-y: center;
        }
        return this.getDefaultBoxCSS(crName);
        // "left: calc( 50%"+left+" );
        // width:"+this.pxToEm(width,crName)+"em;
        // height: "+this.pxToEm(height,crName)+"em;
        // top: calc( 50%"+top+");";
      case ('stdWrp'):
        return `${''
          + ' background-color: '}${this.getPropColorCSSVal(crName, 'backgroundColor')};`;
        // " height: "+Data.getDataShort( crName, 'elHeight')+"em;";

        // .std-section{
        //     display: block; position: relative;
        //     width: 100%;
        //     background-color: #fff;
        //     overflow: hidden;
        // }
        // .std-section__wrapper{
        //     max-width: 1200px;
        //     margin: 0 auto;
        //     display: flex;
        //     flex-direction: column;
        //     justify-content: center;
        //     align-items: flex-start;
        //     font-family: Arial;
        //     padding: 80px 0;
        // }
        // @media (max-width: 1210px){
        //     .std-section__wrapper{
        //         padding:80px 10px;
        //         max-width: 900px;
        //     }
        // }
        // @media (max-width: 910px){
        // }
      case ('form'):

        return `${''
          + ' background-color: '}${this.getPropColorCSSVal(crName, 'backgroundColor')};`;
      case ('video'):
        return `${''
          + ' background-color: '}${this.getPropColorCSSVal(crName, 'backgroundColor')};`
          + ` height: ${this.pxToEm(Data.getDataShort(crName, 'elHeight'))}em;`
          + ` width: ${this.pxToEm(Data.getDataShort(crName, 'elWidth'))}em;${
            this.getDefaultBoxCSS(crName)}`;
      case ('mainSlug'):
      case ('subSlug'):
      case ('btnData'):
        return `${''
          + ' font-family: '}${Data.getDataShort(crName, 'fontFamily')};`
          + ` font-size: ${this.pxToEm(Data.getDataShort(crName, 'fontSize'))}em;`
          + ` text-shadow: ${this.getPropLRTBBlCSSVal(crName, 'textShadow')};`
          + ` text-transform: ${Data.getDataShort(crName, 'textTransform')};`
          + ` line-height: ${Data.getDataShort(crName, 'lineHeight')}em;`
          + ` word-spacing: ${Data.getDataShort(crName, 'wordSpacing')}em;`
          + ` letter-spacing: ${Data.getDataShort(crName, 'letterSpacing')}em;`
          + ` text-align: ${Data.getDataShort(crName, 'textAlign')};`
          + ` color: ${this.getPropColorCSSVal(crName, 'color')};${
            this.getDefaultBoxCSS(crName)}`;
      default:
        return this.getDefaultBoxCSS(crName);
    }
  },

  getHoverCssAkfObj() {
    return true
  },

  isCrHoverType(crName: string) {
    const crNameSplitArr = crName.split('_');
    const actualGrdInd = crNameSplitArr.length - 1;
    return crNameSplitArr[actualGrdInd].substring(0, 3) === 'hvr';
  },

  isCrHdrType(crName: string) {
    const crNameSplitArr = crName.split('_');
    const actualGrdInd = crNameSplitArr.length - 1;
    return crNameSplitArr[actualGrdInd].substring(0, 3) === 'hdr';
  },

  isCrAkfType(crName: string) {
    const crNameSplitArr = crName.split('_');
    const actualGrdInd = crNameSplitArr.length - 1;
    return crNameSplitArr[actualGrdInd].substring(0, 3) === 'akf';
  },

  getCertainPosCssAkfObj(crName: string) {
    let keyframes: any = getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
    let l;
    let pos;
    if (keyframes) {
      pos = `${Data.getDataShort(crName, 'akfTimelinePos')}%`;
      l = keyframes.cssRules.length;
      for (let i = 0; i < l; i += 1) {
        if (keyframes[i].keyText === pos) {
          keyframes = keyframes[i];
          break;
        }
      }
      return keyframes;
    }
    return false;
  },

  rewriteAkfObj(crName: string) {
    const cssClassName = this.getCssClassName(crName, false);
    let duration;
    let obItself;
    let obResult;

    const cssObj: any = getClassRule(`.${cssClassName}.animated`);
    if (cssObj) {
      obItself = document.getElementById(cssClassName);
      changeCSSClass(obItself, 'animated', 'animate');
      changeCSSClass(obItself, 'animate', 'animated');
      obResult = parseFloat((<HTMLInputElement>document.getElementById('time')).value);

      duration = cssObj.style.animationDuration;
      duration = parseFloat(duration.replace('s', ''));
      if (duration > obResult) {
        cssObj.style.animationDelay = `-${obResult}s`;
      } else {
        cssObj.style.animationDelay = `-${duration}s`;
      }

      Animation.pause();
    }
  },

  makeCSSRules(crName: string, originalArgValType = '', value = '', oldVal = '') {
    if (originalArgValType === 'fontSize') {
      this.makeCSSRules(crName, 'elToFSize');
      this.makeCSSRules(crName, 'elPosXFSize');
      this.makeCSSRules(crName, 'elPosYFSize');
      this.makeCSSRules(crName, 'borderWeightFSize');
      this.makeCSSRules(crName, 'borderTopWeightFSize');
      this.makeCSSRules(crName, 'borderRightWeightFSize');
      this.makeCSSRules(crName, 'borderBottomWeightFSize');
      this.makeCSSRules(crName, 'borderLeftWeightFSize');
      this.makeCSSRules(crName, 'textShadowPositionFSize');
      this.makeCSSRules(crName, 'boxShadowPositionFSize');
    }

    if (this.isCrHdrType(crName)) {
      if (originalArgValType === 'heightPercent') {
        const cssObj: any = getClassRule('.scale-100-percent');
        if (!cssObj) {
          const ss = getStyleSheet();
          ss?.addRule('.scale-100-percent', `height: ${value}vh; overflow: hidden;`, ss.cssRules.length);
          // cssObj = getClassRule('cntnrh5');
          return;
        }

        cssObj.style.height = `${value}vh`;
        // console.log('cr is Hdr type', originalArgValType, value, cssObj);
      }

      return;
    }

    let valType = originalArgValType;
    const cssClassName = this.getCssClassName(crName);
    let cssObj: any = getClassRule(cssClassName);
    // const cssVal = '';
    // const cssPairs = '';
    // const cssName = Model.ob().set.cssNames[valType];
    // let hoverFlag = false;
    let akFlag = false;

    if (this.isCrHoverType(crName)) {
      // cssObj = this.getHoverCssAkfObj(crName);
      // hoverFlag = true;
      return;
    }

    if (this.isCrAkfType(crName)) {
      cssObj = this.getCertainPosCssAkfObj(crName);
      akFlag = true;
    }

    if (!cssObj) {
      const ss = getStyleSheet();
      ss?.addRule(cssClassName, this.getDefaultCSS(crName), ss.cssRules.length);
      cssObj = getClassRule(cssClassName);
    }

    if (valType === 'backgroundColor' || valType === 'backgroundColorOpacity') {
      const crNameSplitArr = crName.split('_');
      const actualGrdInd = crNameSplitArr.length - 1;
      const c = crNameSplitArr[actualGrdInd].substring(0, 3);
      if (c === 'grt') {
        valType = `grt${valType}`;
      }
    }
    if (valType === 'priority') {
      const crNameSplitArr = crName.split('_');
      const actualGrdInd = crNameSplitArr.length - 1;
      const c = crNameSplitArr[actualGrdInd].substring(0, 3);
      switch (c) {
        case ('grd'):
          valType = 'grdPriority';
          break;
        case ('bsc'):
          valType = 'boxShadowPriority';
          break;
        case ('tsc'):
          valType = 'textShadowPriority';
          break;
        default: break;
      }
    }

    switch (valType) {
      case ('content'): {
        const elID = this.getCssClassName(crName, false);
        DOM.eraseEl(elID);
        const elIn = DOM.element(elID);
        if (elIn) {
          elIn.innerHTML += value;
        }
        // DOM.pastTextValue(elID, value);
        return;
      }

      case 'fontFamily': {
        const validFontValue = {
          Arial: true, Helvetica: true, Verdana: true, Trebuchet: true, Georgia: true, 'Times New Roman': true, Tahoma: true, Palatino: true, 'Gill Sans': true,
        };
        if (!(value in validFontValue)) {
          const cssRule = `\n@import url('https://fonts.googleapis.com/css?family=${value}');\n`;
          this.commitCSS('athm-ext-inline-css', cssRule);
        }
        cssObj.style.fontFamily = `"${value}"`;
        return;
      }

      case 'addKeyframe':
      case 'remKeyframe':
      case 'animationDuration':
        cssObj = getClassRule(`${cssClassName}.animated`);
        cssObj.style.animationDuration = `${value}s`;
        this.rewriteAkfObj(crName);
        return;

      case 'iterationCount':
        cssObj = getClassRule(`${cssClassName}.animated`);
        cssObj.style.animationIterationCount = value;
        return;

      case 'animationTimingFn':
        cssObj = getClassRule(`${cssClassName}.animated`);
        cssObj.style.animationTiming = value;
        return;

      case 'akfTimelinePos': {
        const oldValue = `${oldVal}%`;
        const keyframes: any = getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
        for (let i = 0, l = keyframes.cssRules.length; i < l; i += 1) {
          if (keyframes[i].keyText === oldValue) {
            keyframes[i].keyText = `${value}%`;
            break;
          }
        }
        return;
      }

      case 'priority':
        /* priority for blocks */
        document.dispatchEvent(this.getRemakeSceneFrameEv(this.getRootCrName(crName)));
        // this.remakeSceneFrame(this.getRootCrName(crName));
        return;

      case 'url':
        return;

      case 'elPosXFSize':
      case 'elFullWidth':
      case 'elWidth':
      case 'elPosX':
        this.widthLeftCssProp(crName, cssObj, valType, value);
        return;
      case 'elPosYFSize':
      case 'elFullHeight':
      case 'elHeight':
      case 'elPosY':
        this.heightTopCssProp(crName, cssObj, valType, value);
        return;
      case 'elToFSize':
      case 'elTo':
        this.widthLeftCssProp(crName, cssObj, valType, value);
        this.heightTopCssProp(crName, cssObj, valType, value);
        return;

      case 'perspective':
      case 'transformStyle':
      case 'perspectiveOriginX':
      case 'perspectiveOriginY':
        // perspective: 550px;
        // transform-style: preserve-3d;
        // perspective-origin: 150% 150%;
        // console.log(valType+': ' + value);
        cssObj.style.perspective = (valType === 'perspective' ? value : Data.getDataShort(crName, 'perspective')) + Model.ob().set.cssNames.perspectiveAttr;
        // console.log('perspective: ' + cssObj.style.perspective);
        cssObj.style.transformStyle = (valType === 'transformStyle' ? value : Data.getDataShort(crName, 'transformStyle'));
        // console.log('transformStyle: ' + cssObj.style.transformStyle);
        cssObj.style.perspectiveOrigin = `${(valType === 'perspectiveOriginX' ? value : Data.getDataShort(crName, 'perspectiveOriginX')) + Model.ob().set.cssNames.perspectiveOriginAttr} ${valType === 'perspectiveOriginY' ? value : Data.getDataShort(crName, 'perspectiveOriginY')}${Model.ob().set.cssNames.perspectiveOriginAttr}`;
        // console.log('perspectiveOrigin: ' + cssObj.style.perspectiveOrigin);

        cssObj.style.transform = this.getTransformCss(crName, valType, value);
        if (akFlag) {
          this.rewriteAkfObj(crName);
        }
        return;

      // case 'rotate': is deprecated
      case 'rotateX':
      case 'rotateY':
      case 'rotateZ':
      case 'skewX':
      case 'skewY':
      case 'scale':
      case 'scaleX':
      case 'scaleY':
      case 'translateZ':
      case 'translateX':
      case 'translateY':
        cssObj.style.transform = this.getTransformCss(crName, valType, value);
        // console.log(cssObj.style.transform);
        if (akFlag) {
          // const keyframes = this
          //   .mdl
          //   .styleSheetMdl
          //   .getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`) as any;
          // console.log(keyframes);
          // console.log('transform...'+this.getTransformCss(crName,valType,value));
          this.rewriteAkfObj(crName);
        }
        return;

      case 'blur':
      case 'brightness':
      case 'contrast':
      case 'grayscale':
      case 'hue-rotate':
      case 'invert':
      case 'saturate':
      case 'sepia':
        cssObj.style.filter = this.getImgFilterCss(crName, valType, value);
        return;

      case 'heightPercent':
      case 'timeout':
      case 'pauseOnPagerHover':
      case 'autostop':
        return;

      case 'borderWeightFSize':
      case 'borderWeight':
      case 'borderType':
      case 'borderColor':
      case 'borderColorOpacity':
        this.getBorder(crName, 'border', valType, '', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        // console.log(cssObj.style);
        return;

      case 'borderTopWeightFSize':
      case 'borderTopWeight':
      case 'borderTopType':
      case 'borderTopColor':
      case 'borderTopColorOpacity':
        this.getBorder(crName, 'border', valType, 'Top', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;// cssObj.style.borderTop =

      case 'borderRightWeightFSize':
      case 'borderRightWeight':
      case 'borderRightType':
      case 'borderRightColor':
      case 'borderRightColorOpacity':
        this.getBorder(crName, 'border', valType, 'Right', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;// cssObj.style.borderRight =

      case 'borderBottomWeightFSize':
      case 'borderBottomWeight':
      case 'borderBottomType':
      case 'borderBottomColor':
      case 'borderBottomColorOpacity':
        this.getBorder(crName, 'border', valType, 'Bottom', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;// cssObj.style.borderBottom =

      case 'borderLeftWeightFSize':
      case 'borderLeftWeight':
      case 'borderLeftType':
      case 'borderLeftColor':
      case 'borderLeftColorOpacity':
        cssObj.style.borderLeft = this.getBorder(crName, 'border', valType, 'Left', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;

      case 'color':
      case 'colorOpacity':
        cssObj.style.color = this.getPropColorCSSVal(crName, 'color', valType, value);
        return;

      case 'textShadowPositionFSize':
      case 'textShadowPriority':
      case 'textShadowPosition':
      case 'textShadowLR':
      case 'textShadowTB':
      case 'textShadowBlur':
      case 'textShadowSpread':
      case 'textShadowColor':
      case 'textShadowColorOpacity':
        cssObj.style.textShadow = this.getPropLRTBBlCSSVal(crName, 'textShadow', valType, value);// +" "+this.getPropColorCSSVal(crName,'textShadowColor',valType,value);
        return;

      case 'boxShadowPositionFSize':
      case 'boxShadowPriority':
      case 'boxShadowPosition':
      case 'boxShadowLR':
      case 'boxShadowTB':
      case 'boxShadowBlur':
      case 'boxShadowSpread':
      case 'boxShadowColor':
      case 'boxShadowColorOpacity':
        cssObj.style.boxShadow = this.getPropLRTBBlCSSVal(crName, 'boxShadow', valType, value);// +" "+this.getPropColorCSSVal(crName,'boxShadowColor',valType,value);
        return;

      case 'backgroundColor':
      case 'backgroundColorOpacity':
        cssObj.style.backgroundColor = this.getPropColorCSSVal(crName, 'backgroundColor', valType, value);
        return;

      case 'backgroundImage':
      case 'grdPriority':
      case 'grtbackgroundColor':
      case 'grtbackgroundColorOpacity':
      case 'grdLinePos':
      case 'gradientType':
      case 'gradientAngl':
      case 'gradientPosX':
      case 'gradientPosY':
        cssObj.style.backgroundImage = this.getBgGradientAndImage(crName, valType, value);
        if (valType === 'grtbackgroundColor' || valType === 'grtbackgroundColorOpacity') {
          const elt = document.getElementById(`stop_color_bg_id_${crName}`);
          if (elt) {
            addCSSRule(`.${elt.getAttribute('data-stp-clrbg-slctr')}`, 'backgroundColor', this.getPropColorCSSVal(crName, 'backgroundColor', (valType === 'grtbackgroundColor' ? 'backgroundColor' : 'backgroundColorOpacity'), value));
          }
        }
        return;

      default:
        cssObj.style[valType] = this.getPropCSSVal(value, Model.ob().set.cssNames[`${valType}Attr`], crName, valType);
        if (akFlag) {
          this.rewriteAkfObj(crName);
        }
    }

    // this.commitCSS('athm-ext-inline-css', `${cssClassName} {${cssPairs}}`);
  },

  getPropLRTBBlCSSVal(crName: string, valType: string, actualValType = '', value = '') {
    const lastCrNamePrefix = Container.getCrNameWithoutNum(
      Container.getLastCrNameInDest(crName),
    );
    const crNameSplitArr = crName.split('_');
    const actualGrdInd = crNameSplitArr.length - 1;
    const mainCrName = this.getMainGrdCrName(crNameSplitArr, lastCrNamePrefix);
    let div = '';
    const jsnCr = Container.getCrsJSN(mainCrName);
    let isValue;
    let tempOut = '';
    const a = this.getSortedCrByPriority(jsnCr, lastCrNamePrefix);

    Object
      .keys(a)
      .some((c) => {
        isValue = (crNameSplitArr[actualGrdInd] === a[c].crName ? value : 'none');
        tempOut += `${div + this.getCertainShadow(`${mainCrName}_${a[c].crName}`, valType, actualValType, isValue)} ${this.getPropColorCSSVal(`${mainCrName}_${a[c].crName}`, `${valType}Color`, valType, isValue)}`;
        div = ', ';
        return false;
      });

    return tempOut;
  },

  /**
  *       Retrieve Container width,height,top,bottom css prop
  *
  * @param crName is name of the container
  * @param inArgCssObj is a css obj
  * @param valType is type of the value
  * @param value is a value
  * @return String css style
  */
  widthLeftCssProp(crName: string, inArgCssObj: any = null, valType = '', value = ''): string {
    let out = '';
    const cssObj = inArgCssObj;
    const widthType = Data.getDataShort(crName, 'elFullWidth');

    switch (widthType) {
      case 'flWdth':
        if (cssObj) {
          cssObj.style.width = '100%';
          cssObj.style.left = '0px';
          cssObj.style.right = '0px';
        }

        out += 'width: 100%; left: 0; right: 0;';
        break;

      default: {
        let to = '50';
        let left = '';
        const width = parseInt((valType === 'elWidth' ? value : Data.getDataShort(crName, 'elWidth')), 10);
        const borderWeight = (parseInt(Data.getDataShort(crName, 'borderRightWeight'), 10) + parseInt(Data.getDataShort(crName, 'borderLeftWeight'), 10));
        const elTo = (valType === 'elTo' ? value : Data.getDataShort(crName, 'elTo'));
        const alignX = elTo.split(' ');
        let xShift;
        let elPosX;

        switch (alignX[1]) {
          case 'left':
            to = '0';
            xShift = parseInt((valType === 'elPosX' ? value : Data.getDataShort(crName, 'elPosX')), 10); // xShift = elPosX;
            left = (xShift > 0 ? ` + ${this.pxToEm(xShift, crName)}em` : ` - ${this.pxToEm(xShift / (-1), crName)}em`);
            break;
          case 'right':
            to = '100';
            elPosX = parseInt((valType === 'elPosX' ? value : Data.getDataShort(crName, 'elPosX')), 10);
            xShift = elPosX - (width + borderWeight);// +padding_x+margin_x
            left = (xShift > 0 ? ` + ${this.pxToEm(xShift, crName)}em` : ` - ${this.pxToEm(xShift / (-1), crName)}em`);
            break;
          default:
            to = '50';
            elPosX = parseInt(valType === 'elPosX' ? value : Data.getDataShort(crName, 'elPosX'), 10);
            xShift = elPosX - (width) / 2;
            left = (xShift > 0 ? ` + ${this.pxToEm(xShift, crName)}em` : ` - ${this.pxToEm(xShift / (-1), crName)}em`);
            break;
        }

        // cssObj = getClassRule(this.getCssClassName(crName));
        if (cssObj) {
          cssObj.style.width = `${this.pxToEm(width, crName)}em`;
          cssObj.style.left = `calc( ${to}%${left} )`;
        }

        out += `width: ${this.pxToEm(width, crName)}em; left: calc( ${to}%${left} );`;
        break;
      }
    }

    return out;
  },

  heightTopCssProp(crName: string, inArgCssObj: any = null, valType = '', value = '') {
    let out = '';
    const cssObj = inArgCssObj;
    const heightType = Data.getDataShort(crName, 'elFullHeight');

    switch (heightType) {
      case 'flHgth':
        if (cssObj) {
          cssObj.style.height = '100%';
          cssObj.style.top = '0px';
          cssObj.style.right = '0px';
        }
        out += 'height: 100%; top: 0; right: 0;';
        break;

      default: {
        let to = '50';
        const height = parseInt((valType === 'elHeight' ? value : Data.getDataShort(crName, 'elHeight')), 10);
        const elTo = (valType === 'elTo' ? value : Data.getDataShort(crName, 'elTo'));
        const alignY = elTo.split(' ');
        let yShift;
        let top;

        switch (alignY[0]) {
          case 'top':
            to = '0';
            yShift = (parseInt((valType === 'elPosY' ? value : Data.getDataShort(crName, 'elPosY')), 10) / (-1));// Data.getDataShort(crName, 'elPosY')
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName)}em` : ` - ${this.pxToEm(yShift / (-1), crName)}em`);
            break;
          case 'bottom':
            to = '100';
            yShift = (parseInt((valType === 'elPosY' ? value : Data.getDataShort(crName, 'elPosY')), 10) / (-1)) - height;// Data.getDataShort(crName, 'elPosY')
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName)}em` : ` - ${this.pxToEm(yShift / (-1), crName)}em`);
            break;
          default:
            to = '50';
            yShift = (parseInt((valType === 'elPosY' ? value : Data.getDataShort(crName, 'elPosY')), 10) / (-1)) - height / 2;// Data.getDataShort(crName, 'elPosY')
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName)}em` : ` - ${this.pxToEm(yShift / (-1), crName)}em`);
            break;
        }

        if (cssObj) {
          cssObj.style.height = `${this.pxToEm(height, crName)}em`;
          cssObj.style.top = `calc( ${to}%${top} )`;
        }

        out += `height: ${this.pxToEm(height, crName)}em; top: calc( ${to}%${top} );`;
        break;
      }
    }

    return out;
  },

  getCertainShadow(crName: string, valType: string, actualValType = '', value = '') {
    let bsp = '';
    if (valType === 'boxShadow') {
      if (`${valType}Position` === actualValType && value !== 'none') {
        bsp = `${value} `;
      } else {
        bsp = Data.getDataShort(crName, `${valType}Position`);
        bsp = (bsp !== '' ? `${bsp} ` : '');
      }
    }
    return `${bsp// (valType=='boxShadow'  ?   ( valType+'Position' == actualValType  && value!='none' ? value+' ' : Data.getDataShort( crName, valType+'Position' )+' ' )  :   '')+
        + this.pxToEm((`${valType}LR` === actualValType && value !== 'none' ? value : Data.getDataShort(crName, `${valType}LR`)), crName)}em ${
      this.pxToEm((`${valType}TB` === actualValType && value !== 'none' ? value : Data.getDataShort(crName, `${valType}TB`)), crName)}em ${
      this.pxToEm((`${valType}Blur` === actualValType && value !== 'none' ? value : Data.getDataShort(crName, `${valType}Blur`)), crName)}em${
      valType === 'boxShadow' ? ` ${this.pxToEm((`${valType}Spread` === actualValType && value !== 'none' ? value : Data.getDataShort(crName, `${valType}Spread`)), crName)}em` : ''}`;
  },

  // eslint-disable-next-line max-len
  // repeating-linear-gradient(), radial-gradient(ellipse at 80% 80%), repeating-radial-gradient(), conic-gradient(), repeating-conic-gradient()

  /* Webkit (Safari/Chrome 10) */
  // eslint-disable-next-line max-len
  // background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #2E2E28), color-stop(1, #4D4C48));
  /* Webkit (Chrome 11+) */
  // background-image: -webkit-linear-gradient(top, #2E2E28 0%, #4D4C48 100%);
  /* Mozilla Firefox */
  // background-image: -moz-linear-gradient(top, #2E2E28 0%, #4D4C48 100%);
  /* IE10+ */
  // background: -ms-linear-gradient(top,  #2E2E28 0%,#4D4C48 100%);
  /* Opera */
  // background-image: -o-linear-gradient(top, #2E2E28 0%, #4D4C48 100%);
  /* W3C */
  // background: linear-gradient(top,  #2E2E28 0%,#4D4C48 100%);

  getBgGradientAndImage(crName: string, valType = '', value = '') {
    const crNameSplitArr = crName.split('_');
    const actualGrdInd = crNameSplitArr.length - 2;
    const mainCrType = Container.getCrType(crName);
    const mainCrName = this.getMainGrdCrName(crNameSplitArr);
    let bgImg = (valType === 'backgroundImage' ? value : Data.getDataShort(mainCrName, 'backgroundImage'));
    let grdts = '';
    let grd = null;
    let div = '';
    const jsnCr = Container.getCrsJSN(mainCrName);
    let el;
    const a = this.getSortedCrByPriority(jsnCr);

    Object
    .keys(a)
    .some((c) => {
      grd = this.getCertainGradient(mainCrType, `${mainCrName}_${a[c].crName}`, valType, (crNameSplitArr[actualGrdInd] === a[c].crName ? value : 'none'));
      if (grd && crNameSplitArr[actualGrdInd] === a[c].crName) {
        el = document.getElementById(`${mainCrName}_${crNameSplitArr[actualGrdInd]}_gradient__dynamic`);

        if (el) {
          el.setAttribute('style',
            `background-image: ${grd.WebkitSafariChrome10};`
            + `background-image: -webkit-${grd.forPannelType};`
            + `background-image: -moz-${grd.forPannelType};`
            + `background-image: -ms-${grd.forPannelType};`
            + `background-image: -o-${grd.forPannelType};`
            + `background-image: ${grd.forPannelType}`);
        }
      }
      if (grd) {
        grdts += div + grd.w3c;
        div = ', ';
      }
      return false;
    });

    bgImg = bgImg !== '' ? `url("${bgImg}")` : '';
    if (bgImg === '') {
      div = '';
    }
    return grdts + div + bgImg;
  },

  getMainGrdCrName(crArr: any, lastCrNamePrefix = 'grd') {
    let out = '';
    let d = '';
    Object
    .keys(crArr)
    .some((i) => {
      if (crArr[i].substring(0, 3) === lastCrNamePrefix) {
        return true;
      }
      out += d + crArr[i];
      d = '_';
      return false;
    });
    return out;
  },

  getCertainGradient(mainCrType: string, grdCrName: string, valType = '', value = '') {
    let outDataGrd = '';
    let outDataGrdWebKit = '';
    const outData = { w3c: '', forPannelType: '', WebkitSafariChrome10: '' };
    let color;

    let opacity;
    let pos;
    const jsnCr = Container.getCrsJSN(grdCrName);
    const a = this.getSortedCrByGrdLinePos(jsnCr);
    const gradientType = (valType === 'gradientType' && value !== 'none' ? value : Data.getDataShort(grdCrName, 'gradientType'));
    const gradientPosX = (valType === 'gradientPosX' && value !== 'none' ? value : Data.getDataShort(grdCrName, 'gradientPosX'));
    const gradientPosY = (valType === 'gradientPosY' && value !== 'none' ? value : Data.getDataShort(grdCrName, 'gradientPosY'));
    const gradientAngl = (valType === 'gradientAngl' && value !== 'none' ? value : Data.getDataShort(grdCrName, 'gradientAngl'));
    let i = 0;

    Object.keys(a).some((c) => {
      if (a[c].cs.grdLinePos) {
        pos = a[c].cs.grdLinePos;
        color = (a[c].cs.backgroundColor) ? a[c].cs.backgroundColor : Data.getDefaultData(mainCrType, 'backgroundColor');
        opacity = (a[c].cs.backgroundColorOpacity) ? a[c].cs.backgroundColorOpacity : Data.getDefaultData(mainCrType, 'backgroundColorOpacity');
        const { red, grn, blu } = hexToRgbJSN(color);
        outDataGrd += `${', rgba('}${red}, ${grn}, ${blu}, ${opacity}) ${pos}%`;
        outDataGrdWebKit += `, color-stop(${pos / 100}, rgba(${red}, ${grn}, ${blu}, ${opacity}))`;
        i += 1;
      }
      return false;
    });
    if (i < 2) {
      return null;
    }
    switch (gradientType) {
      case 'linear':
      case 'repeating-linear':
        outData.w3c = `${gradientType}-gradient(${gradientAngl}deg${outDataGrd})`;
        break;
      case 'radial':
      case 'repeating-radial':
        outData.w3c = `${gradientType}-gradient(ellipse at ${gradientPosX}% ${gradientPosY}%${outDataGrd})`;
        break;
      case 'conic':
      case 'repeating-conic':
        outData.w3c = `${gradientType}-gradient(from ${gradientAngl}deg at ${gradientPosX}% ${gradientPosY}%${outDataGrd})`;
        break;
      default: break;
    }
    outData.forPannelType = `linear-gradient(to right${outDataGrd})`;
    outData.WebkitSafariChrome10 = `-webkit-gradient(linear, left center, right center${outDataGrdWebKit})`;
    return outData;
  },

  getBorder(crName: string, valType: string, actualValType = '', topRightBottomLeft = '', value = '', inArgCssObj = '') {
    // this.getBorder(crName,'border',valType,'Left',value,cssObj);
    const cssObj = inArgCssObj as any;
    const borderType = (actualValType === `${valType}Type` ? value : Data.getDataShort(crName, `${valType}Type`));
    const borderWeight = this.pxToEm((actualValType === `${valType + topRightBottomLeft}Weight` ? value : Data.getDataShort(crName, `${valType + topRightBottomLeft}Weight`)), crName) + Model.ob().set.cssNames[`${valType}WeightAttr`];
    const borderColor = this.getPropColorCSSVal(crName, 'borderColor', actualValType, value);
    if (cssObj !== '') {
      cssObj.style[valType + topRightBottomLeft] = `${borderWeight} ${borderType} ${borderColor}`;
      return null;
    }
    if (borderType === '') {
      return 'none';
    }
    return `${borderWeight} ${borderType} ${borderColor}`;
  },

  getImgFilterCss(crName: string, valType: string, value = '') {
    return `${''
    + 'blur('}${valType === 'blur' ? value : Data.getDataShort(crName, 'blur')}${Model.ob().set.cssNames.blurAttr}) `
    + `brightness(${valType === 'brightness' ? value : Data.getDataShort(crName, 'brightness')}${Model.ob().set.cssNames.brightnessAttr}) `
    + `contrast(${valType === 'contrast' ? value : Data.getDataShort(crName, 'contrast')}${Model.ob().set.cssNames.contrastAttr}) `
    + `grayscale(${valType === 'grayscale' ? value : Data.getDataShort(crName, 'grayscale')}${Model.ob().set.cssNames.grayscaleAttr}) `
    + `hue-rotate(${valType === 'hue-rotate' ? value : Data.getDataShort(crName, 'hue-rotate')}${Model.ob().set.cssNames['hue-rotateAttr']}) `
    + `invert(${valType === 'invert' ? value : Data.getDataShort(crName, 'invert')}${Model.ob().set.cssNames.invertAttr}) `
    + `saturate(${valType === 'saturate' ? value : Data.getDataShort(crName, 'saturate')}${Model.ob().set.cssNames.saturateAttr}) `
    + `sepia(${valType === 'sepia' ? value : Data.getDataShort(crName, 'sepia')}${Model.ob().set.cssNames.sepiaAttr}) `;
  },

  getTransformCss(crName: string, valType: string, value = '') {
    return TransformCss.component(Model.ob()).get({ crName, valType, value });
  },

  getSortedCrByPriority(jsnCr: any, crNamePrefix = 'grd') {
    const a: any = [];
    let ai = 0;
    let hold = [];
    let lastCrName;

    /* sort by grd-priority and add crName */

    Object.keys(jsnCr).some((c) => {
      lastCrName = Container.getLastCrNameInDest(c);
      if (Container.getCrNameWithoutNum(lastCrName) === crNamePrefix) {
        a[ai] = jsnCr[c];
        a[ai].crName = c;
        ai += 1;
      }
      return false;
    });

    for (let pass = 1; pass < ai; pass += 1) {
      for (let i = 0; i < ai - 1; i += 1) {
        if (Number(a[i].cs.priority) > Number(a[i + 1].cs.priority)) {
          hold = a[i];
          a[i] = a[i + 1];
          a[i + 1] = hold;
        }
      }
    }
    return a;
  },

  getSortedCrByGrdLinePos(jsnCr: any) {
    const a: any = [];
    let ai = 0;
    let hold = [];

    Object.keys(jsnCr).some((c) => {
      if (c.substring(0, 3) === 'grt') {
        a[ai] = jsnCr[c];
        ai += 1;
      }
      return false;
    });

    for (let pass = 1; pass < ai; pass += 1) {
      for (let i = 0; i < ai - 1; i += 1) {
        if (Number(a[i].cs.grdLinePos) > Number(a[i + 1].cs.grdLinePos)) {
          hold = a[i];
          a[i] = a[i + 1];
          a[i + 1] = hold;
        }
      }
    }
    return a;
  },

  getCssClassName(crName: string, isSelector = true) {
    const cmnPropArr = Container.getCrDestArrWithoutLastEl(`${crName}_cs`);
    const pre = (cmnPropArr[cmnPropArr.length - 1]).substring(0, 3);
    let depth = (pre === 'akf' || pre === 'grt' || pre === 'grd' || pre === 'tsc' || pre === 'bsc' || pre === 'hvr') ? cmnPropArr.length - 2 : cmnPropArr.length - 1;
    const crAr = crName.split('_');
    let strCr = '';

    if ((cmnPropArr[cmnPropArr.length - 1]).substring(0, 3) === 'grt' && (cmnPropArr[cmnPropArr.length - 2]).substring(0, 3) === 'grd') {
      depth = cmnPropArr.length - 3;
    }

    for (let i = 0; i <= depth; i += 1) {
      strCr += `-${crAr[i]}`;
    }

    strCr = `h${Model.ob().getHID()}${strCr}-${Container.getCrType(crName)}`;

    return ((isSelector ? '.' : '') + strCr);
  },

  commitCSS(id = 'athm-ext-inline-css', css: string): boolean {
    const el = document.getElementById(id);
    if (el && (typeof (el) === 'object')) {
      const elIn = DOM.element(el);
      if (elIn) {
        elIn.innerHTML += css;
      }
      // DOM.pastTextValue(el, css);
      return true;
    }
    // if (document.getElementById('athm-cstm-css')) {
    //   DOM.beforeEl('athm-cstm-css', React.createElement('style', { id, type: 'text/css' }, ...[css]));
    //   return true;
    // }
    // DOM.renderA(React.createElement('style', { id, type: 'text/css' }, ...[css]), document.body);
    return true;
  },

  getPropCSSVal(val: string, attr: string, crName = '', valType = '') {
    let out = val + attr;

    switch (attr) {
      case 'px':
        out = `${this.pxToEm(Number(val), crName, valType)}em`;
        break;
      case 'em':
        out = `${val}em`;
        break;
      case '':
        out = val;
        break;
      default: break;
    }
    return out;
  },

  getPropColorCSSVal(crName: string, valType: string, actualValType = '', value = '') {
    const hexColor = (valType === actualValType && value !== 'none' ? value : Data.getDataShort(crName, valType));
    const opacity = (`${valType}Opacity` === actualValType && value !== 'none' ? value : Data.getDataShort(crName, `${valType}Opacity`));

    if (opacity === '1') {
      return hexColor;
    }

    const { red, grn, blu } = hexToRgbJSN(hexColor);

    return `rgba( ${red}, ${grn}, ${blu}, ${opacity} )`;
  }
}

export default CssMaker;
