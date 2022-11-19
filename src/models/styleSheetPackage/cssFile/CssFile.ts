import { hexToRgb as hexToRgbOutFn } from '../../../components/appFabrica/comps/colorPickerPackage/colorUtils';
import Container from '../../dataPackage/containerModel';
import Data from '../../dataPackage/dataModel';
import Model from '../../model';
import { setClassRule } from '../styleSheetModel';

const IS_FILE_BUILDING_MODE = false;

// const IS_DEV_MODE = Model.ob().set.devMode;

const IS_CSS_LOG_MODE = false;

let hid: string | undefined = undefined;

const buildByHid = (_hid: string | undefined): void => {
  if (! _hid) {
    return;
  }

  hid = _hid;

  getDefCss();
  getCss(Data.getJsn(), hid);
}

/**
* 
*  ╭───────────────────────────────────────────────────────────────╮
*  │                                                               │
*  │                                                               │
*  │             P R I V A T E  F U N C T I O N S                  │
*  │                                                               │
*  │                                                               │
*  ╰───────────────────────────────────────────────────────────────╯
*/

const getHid = (): string | undefined => hid;

const getJustVal = (crName: string, prop: string): string => {
  return Data.getDataShort(crName.split('-').join('_'), prop);
}

/**
 * @example: getValue('c0-i0', 'fontSize', true, true)=> ;
 * @returns a string cascade value of state.
 *    If there is not such value it returns a default value;
 *    see more in the DataPackage.DataModel.getData()
 */
const getValue = (crNameCssStyle: string, prop: string, isConvertToEm = false, extension = ''): string => {
  const crName = crNameCssStyle.split('-').join('_');
  const crType = Container.getCrType(crName);
  let value = Data.getDataShort(crName, prop);
  if (value === Data.getDefaultData(crType, prop)) {
    return '';
  }
  if (value && isConvertToEm) {
    value = Number(pxToEm(Number(value), crName, prop)).toString();
  }
  if (value && extension) {
    value += extension;
  }
  return value;
}

const getDefaultValue = (crType: string, prop: string, isConvertToEm = false, isEmAtTheEnd = false): string => {
  let value = Data.getDefaultData(crType, prop);
  if (value && isConvertToEm) {
    value = pxToEm(Number(value), crType, prop).toString();
  }
  if (value && isEmAtTheEnd) {
    value += 'em';
  }
  return value;
}

const getCssEl = (prop: string, value: string): string => {
  const tab = '\t';
  const br = '\n\r';
  return value ? `${tab}${prop}: ${value};${br}` : '';
}

const getDefCss = () => {
  const hid = getHid();

  // get_google_font_url
  /* Navigation (pager) */
  // get_slider_navigation_css_part(jsn, hid);
  /** Defaults */
  setClassRule(
    `.cntrh${hid}`,
    `
        margin: 0 auto;
        position: absolute;
        width: 100%;
        height: 70vh;
        user-select: none;
        background-color: #1c1c1c;
        overflow: hidden;
        border: none;
    `,
  );
  setClassRule(
    `.cntrh${hid} .slide_imgh${hid}`,
    `   position: absolute;
        width: 100%;
        height: 100%;
    `,
  );

  setClassRule(
    '.animated',
    `
      animation-iteration-count: 1;
      animation-timing-function: ease;
      animation-fill-mode: both;
    `,
  );

  setClassRule(
    `.cntnrh${hid}, .videoh${hid}, .subSlugh${hid}, .mainSlugh${hid}, .btnDatah${hid}`,
    `
      display: block;
      position: absolute;
      box-sizing: border-box;
    `,
  );

  setDefaultValue('cntnr');
  setDefaultValue('mainSlug');
  setDefaultValue('subSlug');
  setDefaultValue('btnData');
}

const setDefaultValue = (cr: string) => {
  const hid = getHid();
  const br = '\n\r';
  const prop = `.${cr}h${hid}`;
  const value = `${getDefCssStyle(cr)}${getDefContainer(cr)}`;

  if (IS_CSS_LOG_MODE) {
    console.log(prop, `{${br}${value}${br}}`);
  }
  setClassRule(prop, value);
}

const getDefCssStyle = (crDefType: string): string => {
  const tab = '\t';
  const br = '\n\r';
  let out = '';

  /* Font Family */
  out += getCssEl('font-family', getDefaultValue(crDefType, 'fontFamily'));

  out += getCssEl('overflow', getDefaultValue(crDefType, 'overflow'));

  /* Font Color */
  out += getCssEl('color', getDefaultCssRgbaColorStyle('color'));

  /* All */
  const bounds = [
    {
      prop: 'fontSize', cssProp: 'font-size', em: true, isConvertToEm: true,
    },
    { prop: 'textTransform', cssProp: 'text-transform', em: false },
    { prop: 'textAlign', cssProp: 'text-align', em: false },
    { prop: 'fontStyle', cssProp: 'font-style', em: false },
    { prop: 'textDecoration', cssProp: 'text-decoration', em: false },
    { prop: 'fontWeight', cssProp: 'font-weight', em: false },
    { prop: 'lineHeight', cssProp: 'line-height', em: true },
    { prop: 'letterSpacing', cssProp: 'letter-spacing', em: true },
    { prop: 'wordSpacing', cssProp: 'word-spacing', em: true },
  ];

  bounds
  .some((el) => {
    out += getCssEl(el.cssProp, getDefaultValue(crDefType, el.prop, el.isConvertToEm, el.em));
    return false;
  });

  /* Text Shadow */
  out += tab;
  out += 'text-shadow: ';
  // out += `${getDefaultValue(crDefType, 'textShadowLR', false, true)} `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'textShadowLR')))}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'textShadowTB')))}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'textShadowBlur')))}em `;
  out += getDefaultCssRgbaColorStyle('text-shadow');
  out += ';';
  out += br;

  return out;
}

const getDefaultCssRgbaColorStyle = (prop: string): string => {
  switch (prop) {
    case 'color':
      return 'rgba( 255, 255, 255, 1 )';
    default:
      return 'rgba( 0, 0, 0, 1 )';
  }
}

const getDefContainer = (crDefType: string): string => {
  let out = '';
  const br = '\n\r';
  const tab = '\t';

  out += `${tab}display: block;${br}${tab}position: absolute;${br}`;
  /* Color */
  out += `${tab}background-color: ${hexToRgbaCSSDefault(crDefType, 'backgroundColor')}${br}`;

  /* Gradient */

  /* Image Prop */
  out += `${tab}background-repeat:${Data.getDefaultData(crDefType, 'backgroundRepeat')};${br}`;
  out += `${tab}background-attachment:${Data.getDefaultData(crDefType, 'backgroundAttachment')};${br}`;
  out += `${tab}background-position:${Data.getDefaultData(crDefType, 'backgroundPosition')};${br}`;
  out += `${tab}background-size: ${Data.getDefaultData(crDefType, 'backgroundSize')};${br}`;

  /* Filters */
  out += `${tab}filter: none;${br}`;

  out += `${tab}overflow: ${Data.getDefaultData(crDefType, 'overflow')};${br}`;

  /* Paddings */
  let top = `${pxToEm(Number(Data.getDefaultData(crDefType, 'paddingTop')))}em`;
  let right = `${pxToEm(Number(Data.getDefaultData(crDefType, 'paddingRight')))}em`;
  let bottom = `${pxToEm(Number(Data.getDefaultData(crDefType, 'paddingBottom')))}em`;
  let left = `${pxToEm(Number(Data.getDefaultData(crDefType, 'paddingLeft')))}em`;

  out += `${tab}padding: ${(top === right && right === bottom && bottom === left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

  // /* Margins */
  top = `${pxToEm(Number(Data.getDefaultData(crDefType, 'marginTop')))}em`;
  right = `${pxToEm(Number(Data.getDefaultData(crDefType, 'marginRight')))}em`;
  bottom = `${pxToEm(Number(Data.getDefaultData(crDefType, 'marginBottom')))}em`;
  left = `${pxToEm(Number(Data.getDefaultData(crDefType, 'marginLeft')))}em`;

  out += `${tab}margin: ${(top === right && right === bottom && bottom === left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

  out += `${tab}transform: none;${br}`;

  /* Border */
  const borderType = Data.getDefaultData(crDefType, 'borderType');

  if (!borderType) {
    out += `${tab}border: none;${br}`;
  } else {
    const borderTopWeight = `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderTopWeight'))).toString()}em`;
    const borderRightWeight = `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderRightWeight'))).toString()}em`;
    const borderBottomWeight = `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderBottomWeight'))).toString()}em`;
    const borderLeftWeight = `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderLeftWeight'))).toString()}em`;

    const clr = hexToRgbaCSSDefault(crDefType, 'borderColor');

    if (
      borderTopWeight === borderRightWeight
      && borderRightWeight === borderBottomWeight
      && borderBottomWeight === borderLeftWeight
      && borderLeftWeight
    ) {
      out += `${tab}border: ${borderTopWeight} ${borderType} ${clr};${br}`;
    } else {
      out += borderTopWeight ? `${tab}border-top: ${borderTopWeight} ${borderType} ${clr};${br}` : '';
      out += borderRightWeight ? `${tab}border-right: ${borderRightWeight} ${borderType} ${clr};${br}` : '';
      out += borderBottomWeight ? `${tab}border-bottom: ${borderBottomWeight} ${borderType} ${clr};${br}` : '';
      out += borderLeftWeight ? `${tab}border-left: ${borderLeftWeight} ${borderType} ${clr};${br}` : '';
    }
  }

  /* Border Radius */
  out += `${tab}border-radius: `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderTopLeftRadius'))).toString()}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderTopRightRadius'))).toString()}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderBottomRightRadius'))).toString()}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'borderBottomLeftRadius'))).toString()}em;${br}`;

  /* Box Shadow */
  out += `${tab}box-shadow: `;
  out += `${Data.getDefaultData(crDefType, 'boxShadowPosition')} `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'boxShadowLR'))).toString()}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'boxShadowTB'))).toString()}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'boxShadowBlur'))).toString()}em `;
  out += `${pxToEm(Number(Data.getDefaultData(crDefType, 'boxShadowSpread'))).toString()}em `;
  out += `${getDefaultCssRgbaColorStyle('textShadowColor')};${br}`;

  return out;
}

/**
 * Converter From Hex to RGBA color.
 *
 * @param color full format color "#ffffff"
 * @param opacity float
 *
 * @return String "rgba( R, G, B, Op );"
 */

const hexToRgbaCSSDefault = (crName: string, prop: string): string => {
  const hexVal = Data.getDefaultData(crName, prop);
  const opacity = Data.getDefaultData(crName, `${prop}Opacity`);
  const red = hexToRgbOutFn(hexVal.slice(1, 3));
  const green = hexToRgbOutFn(hexVal.slice(3, 5));
  const blue = hexToRgbOutFn(hexVal.slice(5, 7));

  return `rgba( ${red}, ${green}, ${blue}, ${opacity} )`;
}

const hexToRgb = (hexVal: string): string => {
  const red = hexToRgbOutFn(hexVal.slice(1, 3));
  const green = hexToRgbOutFn(hexVal.slice(3, 5));
  const blue = hexToRgbOutFn(hexVal.slice(5, 7));

  return `${red}, ${green}, ${blue}`;
}

const hexToRgbaCSS = (cr: string, prop: string): string => {
  const crName = cr.split('-').join('_');

  const hexVal = Data.getDataShort(crName, prop);
  const opacity = Data.getDataShort(crName, `${prop}Opacity`);
  /* isBorder */
  // if (prop !== 'borderColor' && prop.indexOf('border') === 0 && prop.lastIndexOf('Color') !== -1) {
  // hexVal = (hexVal === Data.getDefaultData(Container.getCrType(crName), prop)) ? Data.getDataShort(crName, 'borderColor') : hexVal;
  // opacity = (opacity === Data.getDefaultData(Container.getCrType(crName), `${prop}Opacity`)) ? Data.getDataShort(crName, 'borderColorOpacity') : opacity;
  // }
  // const red = hexToRgb(hexVal.slice(1, 3));
  // const green = hexToRgb(hexVal.slice(3, 5));
  // const blue = hexToRgb(hexVal.slice(5, 7));

  return `rgba( ${hexToRgb(hexVal)}, ${opacity} )`;
}

const getCss = (jsn: any, hid: string, prevCrName = ''): string => {
  let out = '';
  let crType = '';
  let cssName = '';
  let crNameDivider = '';
  Object.entries(jsn)
    .some(([crName, crJsn]) => {
      crType = (<any>crJsn).cs && (<any>crJsn).cs.type ? (<any>crJsn).cs.type : false;
      if (crType) {
        switch (crType) {
          case 'hdr':
            out += hdrRwdCssStyles(crJsn, hid);
            break;
          default:
            crNameDivider = prevCrName ? '-' : '';
            cssName = `h${hid}${crNameDivider}${prevCrName}-${crName}-${crType}`;
            out += crRwdCssStyles(`${prevCrName}${crNameDivider}${crName}`, crType, crJsn, cssName);

            if (crType === 'cntnr') {
              out += getCss(crJsn, hid, `${prevCrName}${crNameDivider}${crName}`);
            }
        }
      }
      return false;
    });
  return out;
}

const hdrRwdCssStyles = (crJsn: any, hid: string): void => {
  setClassRule(`.cntrh${hid}`, 'height: 70vh;');

  if (IS_CSS_LOG_MODE) {
    console.log(`.cntrh${hid} {
      height:70vh;
    }`);
  }
}

const crRwdCssStyles = (crName: string, crType: string, crJsn: any, cssName: string): string => {
  const DEFAULT_SETS = Model.ob().set;
  const br = '\n\r';
  const keyframes = animationKeyframesStyles(crName, crJsn, cssName, DEFAULT_SETS.rwdDflt);
  const keyframesName = keyframes ? `${cssName}__keyframes` : '';

  let out = '';
  let styles = '';
  let animated = animationStyles(crName, keyframesName);

  if (animated) {
    setClassRule(`.${cssName}.animated`, animated);
    animated = `.${cssName}.animated{${br}${animated}}${br}`;
  }

  Object.keys(DEFAULT_SETS.rwd)
    .some((maxWidth: string) => {
      if (crJsn[`rwd${maxWidth}`]) {
        styles = crType === 'cntnr'
          ? crCssStyle(crName)
          : fontCssStyle(crName);

        if (maxWidth === DEFAULT_SETS.rwdDflt) {
          setClassRule(`.${cssName}`, styles);
          out += `.${cssName} {${br}${styles}}${br}`;
          return false;
        }
        out += `@media only screen and (max-width: ${maxWidth}px) {${br}`
                  + ` .${cssName} {${br}`
                      + `${styles} }${br}`
                  + `}${br}`;
      }
      return false;
    });

  if (!out) {
    styles = crType === 'cntnr'
      ? crCssStyle(crName)
      : fontCssStyle(crName);
    setClassRule(`.${cssName}`, styles);
    out += `.${cssName} {${br}${styles}}${br}`;
  }

  setClassRule(cssName, '/* position: absolute; */');
  if (IS_CSS_LOG_MODE) {
    console.log(keyframes + animated + out);
  }
  return keyframes + animated + out;
}

/**
*   Retrieve Typography CSS Style Collection
*
* @param Array ObjJSON  of the style collection
* @param Array is an array of default settings
* @return String $css_style css
*/
const fontCssStyle = (crName: string) => {
  const tab = '\t';
  const br = '\n\r';

  let out = '';

  /* color */
  const clr = hexToRgbaCSS(crName, 'color');
  const clrDefault = hexToRgbaCSSDefault(Container.getCrType(crName.split('-').join('_')), 'color');
  out += clr !== clrDefault ? `${tab}color: ${clr};${br}` : '';

  /* Font Family */
  out += getCssEl('font-family', getValue(crName, 'fontFamily'));

  /* Font-Size */
  out += getCssEl('font-size', getValue(crName, 'fontSize', true, 'em'));

  const bounds = [
    { prop: 'textTransform', cssProp: 'text-transform', ext: '' },
    { prop: 'textAlign', cssProp: 'text-align', ext: '' },
    { prop: 'fontStyle', cssProp: 'font-style', ext: '' },
    { prop: 'textDecoration', cssProp: 'text-decoration', ext: '' },
    { prop: 'fontWeight', cssProp: 'font-weight', ext: '' },
    { prop: 'lineHeight', cssProp: 'line-height', ext: 'em' },
    { prop: 'letterSpacing', cssProp: 'letter-spacing', ext: 'em' },
    { prop: 'wordSpacing', cssProp: 'word-spacing', ext: 'em' },
  ];

  bounds.some((el) => {
    out += getCssEl(el.cssProp, getValue(crName, el.prop, false, el.ext));
    return false;
  });

  /* Text Shadow */
  let div = '';
  const crJsn = Container.getCrsJSN(crName.split('-').join('_'));
  let tscOut = '';
  div = '';
  Object.entries(crJsn)
    .some(([tsc, tscJsn]) => {
      if (tsc.substring(0, 3) === 'tsc') {
        tscOut += div + getShadow(crName, 'textShadow', tscJsn);
        div = ', ';
      }
      return false;
    });
  const tscDefaultOut = getDefaultShadow(Container.getCrType(crName.split('-').join('_')), 'textShadow');
  out += getCssEl('text-shadow', tscOut !== tscDefaultOut ? tscOut : '');

  /* Cr Styles */
  out += crCssStyle(crName);

  return out;
}

/**
*   Retrieve Container Animation CSS Style Collection
*
* @param Array objJSON style collection
* @param Array is an array of default settings
* @param String $animation_name
* @return String $css_style css
*/
const animationStyles = (crName: string, animationName = ''): string => {
  const tab = '\t';
  const br = '\n\r';

  let out = '';

  if (animationName) {
    out += `${tab}animation-name: ${animationName};${br}`;
    out += `${tab}animation-duration: ${getJustVal(crName, 'animationDuration')}s;${br}`;
    out += `${tab}animation-iteration-count: ${getJustVal(crName, 'iterationCount')};${br}`;
    out += `${tab}animation-timing-function: ${getJustVal(crName, 'animationTimingFn')};${br}`;
  }

  return out;
}

/**
* Retrieve Keyframe Animation CSS Style Collection
*
* @param Array objJSON style collection
* @param Array is an array of default settings
* @param String $animation_name
* @return String $css_style css
*/
const animationKeyframesStyles = (crName: string, crJsn: any, cssName: string, rwdMode = ''): string => {
  const br = '\n\r';
  const tab = '\t';

  const animationName = `${cssName}__keyframes`;
  let out = '';
  let data = '';
  Object
    .entries(crJsn)
    .some(([el, akfCrJsn]) => {
      if (el.substring(0, 3) === 'akf') {
        const [akfCrRWDMode, akfCrPercentPos] = el.substring(3).split('k');
        if (akfCrRWDMode === rwdMode && (<any>akfCrJsn).cs.akfTimelinePos) {
          data += `${br} ${(<any>akfCrJsn).cs.akfTimelinePos}% {${br}${tab}${abpFrameStyles(crName, crJsn, rwdMode, akfCrPercentPos)}${br} }`;
        }
      }
      return false;
    });

  /* Important to Slider Trigger! */
  if (!data) {
    const splittedCrName = crName.split('-');
    if (splittedCrName[0].substring(0, 1) === 'c' && splittedCrName.length === 1) {
      /* Scene (Root (first cr)) Container Name Here */
      data += `${br}${tab}0% {}`;
    }
  }

  if (data) {
    setClassRule(`@keyframes ${animationName}`, data);
    out += `@keyframes ${animationName} {${data}${br}}${br}`;
  }

  return out;
}

// class Person {
//   constructor (public Name : string, public Age: number) {}
// }

// var list = new Array<Person>();
// list.push(new Person("Baby", 1));
// list.push(new Person("Toddler", 2));
// list.push(new Person("Teen", 14));
// list.push(new Person("Adult", 25));

// var oldest_person = list.reduce( (a, b) => a.Age > b.Age ? a : b );
// alert(oldest_person.Name);
/**
* Animation Break Point CSS
*/
const transformPropArr = [
  {propName: 'translateX', measur: 'em'},
  {propName: 'translateY', measur: 'em'},
  {propName: 'translateZ', measur: 'em'},
  {propName: 'rotateX', measur: 'deg'},
  {propName: 'rotateY', measur: 'deg'},
  {propName: 'rotateZ', measur: 'deg'},
  {propName: 'skewX', measur: 'deg'},
  {propName: 'skewY', measur: 'deg'},
  {propName: 'scale', measur: ''},
  {propName: 'scaleX', measur: ''},
  {propName: 'scaleY', measur: ''},
];

const abpFrameStyles = (crName: string, crJsn: any, rwdMode: string, abpMode: string): string => {
  const tab = '\t';

  const transformStyles = transformPropArr
    .reduce((accum, curr) => {
      const isConvert = curr.measur === 'em' ? 'convert' : '';
      const val = getAbpCascadeVal(
        crName, crJsn, curr.propName, rwdMode, abpMode, '', curr.measur, isConvert
      );
      return `${accum}${val ? ` ${curr.propName}( ${val} )` : ''}`;
    }, '');
  // transformStyles ? getWkmmoType(`${tab}transform`, transformStyles, 'wmmo') : '';

  let opacity = getAbpCascadeVal(crName, crJsn, 'opacity', rwdMode, abpMode);
  opacity = opacity ? getWkmmoType('opacity', opacity, 'wkm') : '';

  let translateX = getAbpCascadeVal(crName, crJsn, 'translateX', rwdMode, abpMode, '', 'em', 'convert');
  translateX = translateX ? ` translateX( ${translateX} )` : '';

  let translateY = getAbpCascadeVal(crName, crJsn, 'translateY', rwdMode, abpMode, '', 'em', 'convert');
  translateY = translateY ? ` translateY( ${translateY} )` : '';

  let translateZ = getAbpCascadeVal(crName, crJsn, 'translateZ', rwdMode, abpMode, '', 'em', 'convert');
  translateZ = translateZ ? ` translateZ( ${translateZ} )` : '';

  let rotateX = getAbpCascadeVal(crName, crJsn, 'rotateX', rwdMode, abpMode, '', 'deg');
  rotateX = rotateX ? ` rotateX( ${rotateX} )` : '';

  let rotateY = getAbpCascadeVal(crName, crJsn, 'rotateY', rwdMode, abpMode, '', 'deg');
  rotateY = rotateY ? ` rotateY( ${rotateY} )` : '';

  let rotateZ = getAbpCascadeVal(crName, crJsn, 'rotateZ', rwdMode, abpMode, '', 'deg');
  rotateZ = rotateZ ? ` rotateZ( ${rotateZ} )` : '';

  let skewX = getAbpCascadeVal(crName, crJsn, 'skewX', rwdMode, abpMode, '', 'deg');
  skewX = skewX ? ` skewX( ${skewX} )` : '';

  let skewY = getAbpCascadeVal(crName, crJsn, 'skewY', rwdMode, abpMode, '', 'deg');
  skewY = skewY ? ` skewY( ${skewY} )` : '';

  let scale = getAbpCascadeVal(crName, crJsn, 'scale', rwdMode, abpMode);
  scale = scale ? ` scale( ${scale} )` : '';

  let scaleX = getAbpCascadeVal(crName, crJsn, 'scaleX', rwdMode, abpMode);
  scaleX = scaleX ? ` scaleX( ${scaleX} )` : '';

  let scaleY = getAbpCascadeVal(crName, crJsn, 'scaleY', rwdMode, abpMode);
  scaleY = scaleY ? ` scaleY( ${scaleY} )` : '';

  const transformData = rotateX + rotateY + rotateZ + skewX + skewY + scale + scaleX + scaleY + translateX + translateY + translateZ;// rotate+

  const transform = transformData ? getWkmmoType(`${tab}transform`, transformData, 'wmmo') : '';

  return opacity + transform;
}

/**
* Cascade Value for Animation Break Point CSS
*/
const getAbpCascadeVal = (crName: string, crJsn: any, prop: string, mode: string, prc: string, cssPropName = '', em = '', isPxToEm = '', kwmoType = '') => {
  const br = '\n\r';
  const tab = '\t';
  let cssPropValue = '';
  const DEFAULT_SETS = Model.ob().set;
  if (mode === DEFAULT_SETS.rwdDflt) {
    if (crJsn[`akf${mode}k${prc}`].cs[prop]) {
      cssPropValue = crJsn[`akf${mode}k${prc}`].cs[prop];
      if (isPxToEm) {
        cssPropValue = pxToEm(Number(cssPropValue), crName).toString();
      }
      /* for paddings & margins... */
      if (!cssPropName) {
        return cssPropValue + em;
      }
      if (kwmoType) {
        return getWkmmoType(tab + cssPropName, cssPropValue + em, kwmoType);
      }
      return `${tab + cssPropName}: ${cssPropValue}${em};${br}`;
    }
    return '';
  }
  return '';
}

const getWkmmoType = (prop: string, inData: string, type = '') => {
  const br = '\n\r';
  const tale = `${prop}: ${inData};${br}`;
  if (IS_FILE_BUILDING_MODE) {
    switch (type) {
      case 'wmmo':
        return `-webkit-${tale}-moz-${tale}-ms-${tale}-o-${tale}${tale}`;
      case 'wkm':
        return `-webkit-${tale}-khtml-${tale}-moz-${tale}${tale}`;
      case 'wmo':
        return `-webkit-${tale}-moz-${tale}-o-${tale}${tale}`;
      case 'wm':
        return `-webkit-${tale}-moz-${tale}${tale}`;
      case 'w':
        return `-webkit-${tale}${tale}`;
      default:
        return '';
    }
  }
  return tale;
}

/**
*   Retrieve Container with Background.. Image.. CSS Styles Collection
* @param crName kebab style
*/
const crCssStyle = (crName: string): string => {
  const tab = '\t';
  const br = '\n\r';
  // const DEFAULTS = Model.ob().set;

  let out = '';

  /* Background */
  out += backgroundCssStyle(crName);

  /* overflow */
  out += getCssEl('overflow', getValue(crName, 'overflow'));

  /* Position  */
  out += widthLeftHeightTopCssProp(crName);

  /* Paddings */
  let top = `${pxToEm(Number(getJustVal(crName, 'paddingTop')))}em`;
  let right = `${pxToEm(Number(getJustVal(crName, 'paddingRight')))}em`;
  let bottom = `${pxToEm(Number(getJustVal(crName, 'paddingBottom')))}em`;
  let left = `${pxToEm(Number(getJustVal(crName, 'paddingLeft')))}em`;

  out += `${tab}padding: ${(top === right && right === bottom && bottom === left && left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

  /* Margins */
  top = `${pxToEm(Number(getJustVal(crName, 'marginTop')))}em`;
  right = `${pxToEm(Number(getJustVal(crName, 'marginRight')))}em`;
  bottom = `${pxToEm(Number(getJustVal(crName, 'marginBottom')))}em`;
  left = `${pxToEm(Number(getJustVal(crName, 'marginLeft')))}em`;

  out += `${tab}margin: ${(top === right && right === bottom && bottom === left && left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

  /* Opacity */
  out += getCssEl('opacity', getValue(crName, 'opacity'));

  /* Transform */
  out += getTransform(crName);

  /* Perspective */
  out += getPerspective(crName);

  /* Border Width Type & Color */
  const borderType = getValue(crName, 'borderType');
  if (borderType) {
    const btw = `${pxToEm(Number(getJustVal(crName, 'borderTopWeight')))}em`;
    const brw = `${pxToEm(Number(getJustVal(crName, 'borderRightWeight')))}em`;
    const bbw = `${pxToEm(Number(getJustVal(crName, 'borderBottomWeight')))}em`;
    const blw = `${pxToEm(Number(getJustVal(crName, 'borderLeftWeight')))}em`;

    const clr = hexToRgbaCSS(crName, 'borderColor');

    if (btw === brw && brw === bbw && bbw === blw && blw && clr) {
      out += `${tab}border: ${btw} ${borderType} ${clr};${br}`;
    } else {
      out += btw ? `${tab}border-top: ${btw} ${borderType} ${clr};${br}` : '';
      out += brw ? `${tab}border-right: ${brw} ${borderType} ${clr};${br}` : '';
      out += bbw ? `${tab}border-bottom: ${bbw} ${borderType} ${clr};${br}` : '';
      out += blw ? `${tab}border-left: ${blw} ${borderType} ${clr};${br}` : '';
    }
  }

  /* Border Radius */
  top = `${getValue(crName, 'borderTopLeftRadius', true, 'em')}`;
  right = `${getValue(crName, 'borderTopRightRadius', true, 'em')}`;
  bottom = `${getValue(crName, 'borderBottomLeftRadius', true, 'em')}`;
  left = `${getValue(crName, 'borderBottomRightRadius', true, 'em')}`;

  if (top === right && right === bottom && bottom === left && left) {
    out += `${tab}border-radius: ${top};${br}`;
  } else {
    out += top ? `${tab}border-top-left-radius: ${top}${br}` : '';
    out += right ? `${tab}border-top-right-radius: ${right}${br}` : '';
    out += bottom ? `${tab}border-bottom-left-radius: ${bottom}${br}` : '';
    out += left ? `${tab}border-bottom-right-radius: ${left}${br}` : '';
  }

  /* Box Shadow */
  let bscOut = '';
  let div = '';
  const crJsn = Container.getCrsJSN(crName.split('-').join('_'));
  Object.entries(crJsn)
    .some(([bsc, bscJsn]) => {
      if (bsc.substring(0, 3) === 'bsc') {
        bscOut += div + getShadow(crName, 'boxShadow', bscJsn);
        div = ', ';
      }
      return false;
    });
  const bscDefaultOut = getDefaultShadow(Container.getCrType(crName.split('-').join('_')), 'boxShadow');
  out += getCssEl('box-shadow', bscOut !== bscDefaultOut ? bscOut : '');

  return out;
}

const getShadowPropsArr = (prop: string) => {
  if (prop.indexOf('box') !== -1) {
    return ['Position', 'LR', 'TB', 'Blur', 'Spread', 'Color'];
  }
  return ['LR', 'TB', 'Blur', 'Color'];
}

const getDefaultShadow = (crType: string, prop: string) => {
  const propPostfixArr = getShadowPropsArr(prop); // ['Position', 'LR', 'TB', 'Blur', 'Spread', 'Color'];

  return getShadow(crType, prop, {
    cs: {
      ...propPostfixArr.map((postfix) => ({ [`${prop}${postfix}`]: getDefaultValue(crType, `${prop}${postfix}`) })),
    },
  });
}

const getShadowValue = (crType: string, prop: string, bscJsn: any): string => {
  const value = bscJsn.cs[prop] || getDefaultValue(crType, prop);
  if (prop.indexOf('Position') !== -1) {
    return value;
  }
  if (prop.indexOf('Color') !== -1) {
    // console.log(hexToRgb(value), ',', bscJsn.cs[`${prop}Opacity`] || getDefaultValue(crType, `${prop}Opacity`));
    const opacity = bscJsn.cs[`${prop}Opacity`] || getDefaultValue(crType, `${prop}Opacity`);
    return `rgba( ${hexToRgb(value)}, ${opacity} )`;
  }
  return value ? `${pxToEm(Number(value)).toString()}em` : '';
}

const getShadow = (crName: string, prop: string, bscJsn: any) => {
  const crType = Container.getCrType(crName.split('-').join('_'));
  const propPostfixArr = getShadowPropsArr(prop); // ['Position', 'LR', 'TB', 'Blur', 'Spread', 'Color'];

  return propPostfixArr.map((postfix) => getShadowValue(crType, `${prop}${postfix}`, bscJsn)).join(' ');
}

/**
*       Retrieve css prop
*/
const widthLeftHeightTopCssProp = (crName: string) => {
  const tab = '\t';
  const br = '\n\r';

  let out = '';

  const widthType = getJustVal(crName, 'elFullWidth');
  const width = Number(getJustVal(crName, 'elWidth'));

  let borderWeight = 0;
  const [alignY, alignX] = getJustVal(crName, 'elTo').split(' ');
  let to = '';
  let elPosX: number;
  let $xShift: number;
  let $left: string;

  switch (widthType) {
    case 'flWdth':
      out += `${tab}width: 100%;${br}`;
      out += `${tab}left: 0px;${br}`;
      out += `${tab}right: 0px;${br}`;
      break;

    case 'default':
      switch (alignX) {
        case 'left':
          to = '0';
          elPosX = Number(getJustVal(crName, 'elPosX'));
          $xShift = elPosX;
          $left = ($xShift > 0 ? ` + ${pxToEm($xShift, crName).toString()}em` : ` - ${pxToEm($xShift / (-1), crName).toString()}em`);
          break;
        case 'right':
          to = '100';
          elPosX = Number(getJustVal(crName, 'elPosX'));
          borderWeight = Number(getJustVal(crName, 'borderRightWeight')) + Number(getJustVal(crName, 'borderLeftWeight'));
          $xShift = elPosX - (width + borderWeight);
          $left = ($xShift > 0 ? ` + ${pxToEm($xShift, crName).toString()}em` : ` - ${pxToEm($xShift / (-1), crName).toString()}em`);
          break;
        default:
          to = '50';
          elPosX = Number(getJustVal(crName, 'elPosX'));
          $xShift = elPosX - (width) / 2;
          $left = ($xShift > 0 ? ` + ${pxToEm($xShift, crName).toString()}em` : ` - ${pxToEm($xShift / (-1), crName).toString()}em`);
          break;
      }

      out += `${tab}width: ${pxToEm(width, crName).toString()}em;${br}`;
      out += `${tab}left: calc( ${to}%${$left} );${br}`;
      break;
    default:
      break;
  }

  const heightType = getJustVal(crName, 'elFullHeight');
  const height = Number(getJustVal(crName, 'elHeight'));
  let yShift: number;
  let top: string;
  to = '';
  switch (heightType) {
    case 'flHgth':
      out += `${tab}height: 100%;${br}`;
      break;

    case 'default':
      switch (alignY) {
        case 'top':
          to = '0';
          yShift = Number(getJustVal(crName, 'elPosY')) / (-1);
          top = (yShift > 0 ? ` + ${pxToEm(yShift, crName).toString()}em` : ` - ${pxToEm(yShift / (-1), crName).toString()}em`);
          break;
        case 'bottom':
          to = '100';
          yShift = Number(getJustVal(crName, 'elPosY')) / (-1) - height;
          top = (yShift > 0 ? ` + ${pxToEm(yShift, crName).toString()}em` : ` - ${pxToEm(yShift / (-1), crName).toString()}em`);
          break;
        default:
          to = '50';
          yShift = Number(getJustVal(crName, 'elPosY')) / (-1) - height / 2;
          top = (yShift > 0 ? ` + ${pxToEm(yShift, crName).toString()}em` : ` - ${pxToEm(yShift / (-1), crName).toString()}em`);
          break;
      }

      out += `${tab}height: ${pxToEm(height, crName).toString()}em;${br}`;
      out += `${tab}top: calc( ${to}%${top} );${br}`;
      break;
    default:
      break;
  }

  return out;
}

const backgroundCssStyle = (crName: string) => {
  const tab = '\t';
  const br = '\n\r';

  let out = '';

  /* Background Color */
  const clr = hexToRgbaCSS(crName, 'backgroundColor');
  const clrDefault = hexToRgbaCSSDefault(Container.getCrType(crName.split('-').join('_')), 'backgroundColor');
  out += clr !== clrDefault ? `${tab}background-color: ${clr};${br}` : '';

  /* Image */
  const bg = getValue(crName, 'backgroundImage');
  if (bg) {
    out += `${tab}background-image:url("${bg}");${br}`;
    out += getCssEl('background-repeat', getValue(crName, 'backgroundRepeat'));
    out += getCssEl('background-attachment', getValue(crName, 'backgroundAttachment'));
    out += getCssEl('background-position', getValue(crName, 'backgroundPosition'));
    out += getCssEl('background-size', getValue(crName, 'backgroundSize'));
  }

  /* Gradient */
  out += getGradient(crName, bg);

  /* Filters */
  out += getImgFilter(crName);

  return out;
}

const getImgFilter = (crNameCSS: string): string => {
  const bounds = [
    { prop: 'blur', cssProp: 'blur', ext: 'px' },
    { prop: 'brightness', cssProp: 'brightness', ext: '%' },
    { prop: 'contrast', cssProp: 'contrast', ext: '%' },
    { prop: 'grayscale', cssProp: 'grayscale', ext: '%' },
    { prop: 'hue-rotate', cssProp: 'hue-rotate', ext: 'deg' },
    { prop: 'invert', cssProp: 'invert', ext: '%' },
    { prop: 'saturate', cssProp: 'saturate', ext: '%' },
    { prop: 'sepia', cssProp: 'sepia', ext: '%' },
  ];
  let out = '';
  let value = '';
  let defaultValue = '';
  const crName = crNameCSS.split('-').join('_');
  const crType = Container.getCrType(crName);
  bounds.some((bound) => {
    value = getValue(crName, bound.prop);
    defaultValue = getDefaultValue(crType, bound.prop);
    out += (value !== defaultValue && value) ? ` ${bound.cssProp}(${value}${bound.ext})` : '';
    return false;
  });

  return getCssEl('filter', out);
}

/**
*
*/
const getPerspective = (crName: string): string => {
  let perspectiveOrigin = '';
  const perspective = getCssEl('perspective', getValue(crName, 'perspective', true, 'em'));
  if (perspective) {
    const perspectiveOriginX = getValue(crName, 'perspectiveOriginX', false, '%');
    const perspectiveOriginY = getValue(crName, 'perspectiveOriginY', false, '%');
    perspectiveOrigin = getCssEl('perspective-origin', `${perspectiveOriginX || '0%'} ${perspectiveOriginY || '0%'}`);
  }
  /* Maybe it must be within getTransform function */
  const transformStyle = getCssEl('transform-style', getValue(crName, 'transformStyle'));

  return `${perspective}${transformStyle}${perspectiveOrigin}`;
}

const getTransform = (crName: string): string => {
  let out = '';

  /* rotate XYZ */
  const rotateX = getValue(crName, 'rotateX', false, 'deg');
  out += rotateX ? ` rotateX(${rotateX})` : '';
  const rotateY = getValue(crName, 'rotateY', false, 'deg');
  out += rotateY ? ` rotateY(${rotateY})` : '';
  const rotateZ = getValue(crName, 'rotateZ', false, 'deg');
  out += rotateZ ? ` rotateZ(${rotateZ})` : '';

  /* skew XY */
  const skewX = getValue(crName, 'skewX', false, 'deg');
  out += skewX ? ` skewX(${skewX})` : '';
  const skewY = getValue(crName, 'skewY', false, 'deg');
  out += skewY ? ` skewY(${skewY})` : '';

  /* scale XY */
  const scaleX = getValue(crName, 'scaleX');
  out += scaleX ? ` scaleX(${scaleX})` : '';
  const scaleY = getValue(crName, 'scaleY');
  out += scaleY ? ` scaleY(${scaleY})` : '';

  /* translate XYZ */
  const translateX = getValue(crName, 'translateX', true, 'em');
  out += translateX ? ` translateX(${translateX})` : '';
  const translateY = getValue(crName, 'translateY', true, 'em');
  out += translateY ? ` translateY(${translateY})` : '';
  const translateZ = getValue(crName, 'translateZ', true, 'em');
  out += translateZ ? ` translateZ(${translateZ})` : '';

  out = getCssEl('transform', out);

  return `${out}`;
}

const getGradient = (cr: string, bgImg = ''): string => {
  const tab = '\t';
  const br = '\n\r';

  const crName = cr.split('-').join('_');
  const crType = Container.getCrType(crName);
  const crJsn = Container.getCrsJSN(crName);
  const data: any = [];

  let grtData;
  let type = '';
  let div = '';
  let angl = '';
  let linearData = '';
  let gradientRepeatType = '';
  let color = '';
  let opacity = '';
  let startColor = '';

  let shape = '';
  // let radialData = '';
  // let retDataWebkit = '';
  // let retDataMoz = '';
  // let retDataMs = '';
  // let retDataO = '';
  let gradientPosX = '';
  let gradientPosY = '';
  let retDataC = '';
  let retData = '';
  let radialDataC = '';
  let prefixC = '';

  Object
  .keys(crJsn)
  .some((key) => {
    if (key.substring(0, 3) === 'grd') {
      data.push(crJsn[key]);
    }
    return false;
  });

  /* get ordered by priority */
  data.sort((
    el1: {
      cs: { priority: string; }
    },
    el2: {
      cs: { priority: string; }
    },
  ) => Number(el1.cs.priority) - Number(el2.cs.priority));

  if (data.length && IS_CSS_LOG_MODE) {
    console.log('data', data);
  }

  data.some((
    jsn: {
      cs: {
        backgroundColor: string,
        backgroundColorOpacity: string,
        gradientRepeatType: string;
        gradientType: string;
        gradientAngl: string;
        gradientRadialShape: string;
        gradientPosY: string;
        gradientPosX: string;
      };
    },
  ) => {
    gradientRepeatType = jsn.cs.gradientRepeatType || getDefaultValue(crType, 'gradientRepeatType');
    gradientRepeatType = gradientRepeatType === 'norepeat' ? '' : 'repeating-';

    color = jsn.cs.backgroundColor || getDefaultValue(crType, 'backgroundGradientColor');
    opacity = jsn.cs.backgroundColorOpacity || getDefaultValue(crType, 'backgroundGradientColorOpacity');
    startColor = `rgba( ${hexToRgb(color)}, ${opacity} )`;

    /* radial | linear */
    type = jsn.cs.gradientType || getDefaultValue(crType, 'gradientType');

    if (IS_CSS_LOG_MODE) {
      console.log('gradientRepeatType: "', gradientRepeatType, '"', startColor, type);
    }

    div = retDataC ? ', ' : '';

    if (type === 'linear' || type === 'repeating-linear') {
      angl = jsn.cs.gradientAngl || getDefaultValue(crType, 'gradientAngl'); /* 0 .. 360 */

      grtData = getCertainGradient(jsn, crType);

      if (grtData) {
        linearData = `${gradientRepeatType}${type}-gradient(${angl}deg${grtData})`;

        // retDataWebkit += `${div}-webkit-${linearData}`;
        // retDataMoz += `${div}-moz-${linearData}`;
        // retDataMs += `${div}-ms-${linearData}`;
        // retDataO += `${div}-o-${linearData}`;
        retDataC += `${div}${linearData}`;
      }
    }

    if (type === 'radial' || type === 'repeating-radial') {
      grtData = getCertainGradient(jsn, crType);

      if (grtData) {
        /* shape: ellipse || circle */
        shape = jsn.cs.gradientRadialShape || getDefaultValue(crType, 'gradientRadialShape'); // ? jsn.cs.gradientRadialShape : 'ellipse';
        /* direction: top | bottom | center | ...
        */

        gradientPosX = `${jsn.cs.gradientPosX || getDefaultValue(crType, 'gradientPosX')}%`; // ? jsn.cs.gradientPosX : '50')+'%';
        gradientPosY = `${jsn.cs.gradientPosY || getDefaultValue(crType, 'gradientPosY')}%`; //  ? jsn.cs.gradientPosY : '50')+'%';
        // direction = gradientPosX + gradientPosY;

        // data = grtData +')';
        // prefix   = '-gradient('+direction+', '+shape+', cover';
        prefixC = `-gradient(${shape} at ${gradientPosX}${gradientPosY}`;
        // radialData   = gradientRepeatType+type+ prefix+   data;
        radialDataC = `${gradientRepeatType + type + prefixC + grtData})`;

        // retDataWebkit += div+'-webkit-'+radialData;
        // retDataMoz += div+'-moz-'+radialData;
        // retDataMs += div+'-ms-'+radialData;
        // retDataO += div+'-o-'+radialData;
        retDataC += div + radialDataC;
      }
    }

    if (type === 'conic' || type === 'repeating-conic') {
      grtData = getCertainGradient(crJsn, crType);

      if (grtData) {
        /*
          direction: top | bottom | center | ...
        */

        gradientPosX = `${jsn.cs.gradientPosX || getDefaultValue(crType, 'gradientPosX')}%`; // ? jsn.cs.gradientPosX : '50')+'%';
        gradientPosY = `${jsn.cs.gradientPosY || getDefaultValue(crType, 'gradientPosY')}%`;
        // gradientPosX = crJsn.cs.gradientPosX ? crJsn.cs.gradientPosX+'%' : '50%';
        // gradientPosY = crJsn.cs.gradientPosY ? crJsn.cs.gradientPosY+'%'  : '50%';
        // direction = gradientPosX + gradientPosY;

        // prefix   = '-gradient('+direction;
        prefixC = `-gradient(at ${gradientPosX}${gradientPosY}`;
        // radialData   = gradientRepeatType.type. prefix.   data;
        radialDataC = `${gradientRepeatType + type + prefixC + grtData})`;

        // retDataWebkit += div+'-webkit-'+radialData;
        // retDataMoz += div+'-moz-'+radialData;
        // retDataMs += div+'-ms-'+radialData;
        // retDataO += div+'-o-'+radialData;
        retDataC += div + radialDataC;
      }
    }
    return false;
  });/* end loop */

  if (retDataC) {
    const pref = `${tab}background-image: `;
    const postfix = `${bgImg ? `, url("${bgImg}")` : ''}`;
    retData = `${pref}${retDataC}${postfix};${br}`;
    // `${pref}${retDataWebkit}${postfix}
    // ${pref}${retDataMoz}${postfix}
    // ${pref}${retDataMs}${postfix}
    // ${pref}${retDataO}${postfix}
  }

  return retData;
}

const getCertainGradient = (crJsn: any, crType = 'cntnr') => {
  let grtData = '';
  const data: any = [];
  let color = '';
  let opacity = '';
  let pos = '';
  let clr = '';

  Object
  .keys(crJsn)
  .some((grtEl) => {
    if (grtEl.substring(0, 3) === 'grt') {
      data.push(crJsn[grtEl]);
    }
    return false;
  });

  /* get sorted by grdLinePos */
  data.sort((
    el1: {
      cs: { grdLinePos: string; }
    },
    el2: {
      cs: {grdLinePos: string; }
    },
  ) => parseFloat(el1.cs.grdLinePos) - parseFloat(el2.cs.grdLinePos));

  /* certain grad making */
  data.some((grtEl: {
    cs: {
      grdLinePos: string,
      backgroundColor: string,
      backgroundColorOpacity: string,
    },
  }) => {
    if (grtEl.cs.grdLinePos) {
      color = grtEl.cs.backgroundColor || getDefaultValue(crType, 'backgroundGradientColor');
      opacity = grtEl.cs.backgroundColorOpacity || getDefaultValue(crType, 'backgroundGradientColorOpacity');

      clr = `rgba( ${hexToRgb(color)}, ${opacity} )`;

      pos = grtEl.cs.grdLinePos;
      grtData += `, ${clr} ${pos}%`;
    }

    return false;
  });
  return grtData;
}

const pxToEm = (px: number, crName = '', valType = ''): number => {
  if (valType === 'fontSize' || !crName) {
    return px / 16;
  }

  const crFontSize = Number(getJustVal(crName, 'fontSize'));

  const occ = crFontSize / 16 || 1;
  return px / (16 * occ);
}

export default buildByHid;
