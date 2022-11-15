import { hexToRgb } from '../../../components/appFabrica/comps/colorPickerPackage/colorUtils';
import Model from '../../model';

class CssFile {
  private IS_FILE_BUILDING_MODE = false;

  private hid: string | undefined;

  private IS_DEV_MODE = Model.ob().set.devMode;

  private IS_CSS_LOG_MODE = false;

  private static thisObject: any = null;

  public static buildByHid(hid: string | undefined) {
    if (!this.thisObject) {
      this.thisObject = new CssFile();
    }
    return this.thisObject.build(hid);
  }

  public build(hid: string | undefined): void {
    if (! hid) {
      return;
    }

    this.hid = hid;

    this.getDefCss();
    this.getCss(Model.ob().data.getJsn(), hid);
  }

  private getHid(): string | undefined {
    return this.hid;
  }

  private getJustVal(crName: string, prop: string): string {
    return Model.ob().data.getDataShort(crName.split('-').join('_'), prop);
  }

  /**
   *  @access private
   *  @example: getValue('c0-i0', 'fontSize', true, true);
   *  @returns a string cascade value of state.
   *    If there is not such value it returns a default value;
   *    see more in the DataPackage.DataModel.getData()
   */
  private getValue(crNameCssStyle: string, prop: string, isConvertToEm = false, extension = ''): string {
    const crName = crNameCssStyle.split('-').join('_');
    const crType = Model.ob().container.getCrType(crName);
    let value = Model.ob().data.getDataShort(crName, prop);
    if (value === Model.ob().data.getDefaultData(crType, prop)) {
      return '';
    }
    if (value && isConvertToEm) {
      value = Number(this.pxToEm(Number(value), crName, prop)).toString();
    }
    if (value && extension) {
      value += extension;
    }
    return value;
  }

  private getDefaultValue(crType: string, prop: string, isConvertToEm = false, isEmAtTheEnd = false): string {
    let value = Model.ob().data.getDefaultData(crType, prop);
    if (value && isConvertToEm) {
      value = this.pxToEm(Number(value), crType, prop).toString();
    }
    if (value && isEmAtTheEnd) {
      value += 'em';
    }
    return value;
  }

  private getCssEl(prop: string, value: string): string {
    const tab = '\t';
    const br = '\n\r';
    return value ? `${tab}${prop}: ${value};${br}` : '';
  }

  private getDefCss() {
    const hid = this.getHid();

    // get_google_font_url
    /* Navigation (pager) */
    // get_slider_navigation_css_part(jsn, hid);
    /** Defaults */
    Model.ob().styleSheetMdl.setClassRule(
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
    Model.ob().styleSheetMdl.setClassRule(
      `.cntrh${hid} .slide_imgh${hid}`,
      `   position: absolute;
          width: 100%;
          height: 100%;
      `,
    );

    Model.ob().styleSheetMdl.setClassRule(
      '.animated',
      `
        animation-iteration-count: 1;
        animation-timing-function: ease;
        animation-fill-mode: both;
      `,
    );

    Model.ob().styleSheetMdl.setClassRule(
      `.cntnrh${hid}, .videoh${hid}, .subSlugh${hid}, .mainSlugh${hid}, .btnDatah${hid}`,
      `
        display: block;
        position: absolute;
        box-sizing: border-box;
      `,
    );

    this.setDefaultValue('cntnr');
    this.setDefaultValue('mainSlug');
    this.setDefaultValue('subSlug');
    this.setDefaultValue('btnData');
  }

  private setDefaultValue(cr: string) {
    const hid = this.getHid();
    const br = '\n\r';
    const prop = `.${cr}h${hid}`;
    const value = `${this.getDefCssStyle(cr)}${this.getDefContainer(cr)}`;

    if (this.IS_CSS_LOG_MODE) {
      console.log(prop, `{${br}${value}${br}}`);
    }
    Model.ob().styleSheetMdl.setClassRule(prop, value);
  }

  private getDefCssStyle(crDefType: string): string {
    // const hid = this.getHid();
    const tab = '\t';
    const br = '\n\r';
    let out = '';

    /* Font Family */
    out += this.getCssEl('font-family', this.getDefaultValue(crDefType, 'fontFamily'));

    out += this.getCssEl('overflow', this.getDefaultValue(crDefType, 'overflow'));

    /* Font Color */
    out += this.getCssEl('color', this.getDefaultCssRgbaColorStyle('color'));

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

    // let cssValue = '';
    bounds.some((el) => {
      out += this.getCssEl(el.cssProp, this.getDefaultValue(crDefType, el.prop, el.isConvertToEm, el.em));
      return false;
    });

    /* Text Shadow */
    out += tab;
    out += 'text-shadow: ';
    // out += `${this.getDefaultValue(crDefType, 'textShadowLR', false, true)} `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'textShadowLR')))}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'textShadowTB')))}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'textShadowBlur')))}em `;
    out += this.getDefaultCssRgbaColorStyle('text-shadow');
    out += ';';
    out += br;

    return out;
  }

  private getDefaultCssRgbaColorStyle(prop: string): string {
    switch (prop) {
      case 'color':
        return 'rgba( 255, 255, 255, 1 )';
      default:
        return 'rgba( 0, 0, 0, 1 )';
    }
  }

  private getDefContainer(crDefType: string): string {
    let out = '';
    const br = '\n\r';
    const tab = '\t';

    out += `${tab}display: block;${br}${tab}position: absolute;${br}`;
    /* Color */
    out += `${tab}background-color: ${this.hexToRgbaCSSDefault(crDefType, 'backgroundColor')}${br}`;

    /* Gradient */

    /* Image Prop */
    out += `${tab}background-repeat:${Model.ob().data.getDefaultData(crDefType, 'backgroundRepeat')};${br}`;
    out += `${tab}background-attachment:${Model.ob().data.getDefaultData(crDefType, 'backgroundAttachment')};${br}`;
    out += `${tab}background-position:${Model.ob().data.getDefaultData(crDefType, 'backgroundPosition')};${br}`;
    out += `${tab}background-size: ${Model.ob().data.getDefaultData(crDefType, 'backgroundSize')};${br}`;

    /* Filters */
    out += `${tab}filter: none;${br}`;

    out += `${tab}overflow: ${Model.ob().data.getDefaultData(crDefType, 'overflow')};${br}`;

    /* Paddings */
    let top = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'paddingTop')))}em`;
    let right = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'paddingRight')))}em`;
    let bottom = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'paddingBottom')))}em`;
    let left = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'paddingLeft')))}em`;

    out += `${tab}padding: ${(top === right && right === bottom && bottom === left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

    // /* Margins */
    top = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'marginTop')))}em`;
    right = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'marginRight')))}em`;
    bottom = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'marginBottom')))}em`;
    left = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'marginLeft')))}em`;

    out += `${tab}margin: ${(top === right && right === bottom && bottom === left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

    out += `${tab}transform: none;${br}`;

    /* Border */
    const borderType = Model.ob().data.getDefaultData(crDefType, 'borderType');

    if (!borderType) {
      out += `${tab}border: none;${br}`;
    } else {
      const borderTopWeight = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderTopWeight'))).toString()}em`;
      const borderRightWeight = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderRightWeight'))).toString()}em`;
      const borderBottomWeight = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderBottomWeight'))).toString()}em`;
      const borderLeftWeight = `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderLeftWeight'))).toString()}em`;

      const clr = this.hexToRgbaCSSDefault(crDefType, 'borderColor');

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
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderTopLeftRadius'))).toString()}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderTopRightRadius'))).toString()}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderBottomRightRadius'))).toString()}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'borderBottomLeftRadius'))).toString()}em;${br}`;

    /* Box Shadow */
    out += `${tab}box-shadow: `;
    out += `${Model.ob().data.getDefaultData(crDefType, 'boxShadowPosition')} `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'boxShadowLR'))).toString()}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'boxShadowTB'))).toString()}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'boxShadowBlur'))).toString()}em `;
    out += `${this.pxToEm(Number(Model.ob().data.getDefaultData(crDefType, 'boxShadowSpread'))).toString()}em `;
    out += `${this.getDefaultCssRgbaColorStyle('textShadowColor')};${br}`;

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

  private hexToRgbaCSSDefault(crName: string, prop: string): string {
    const hexVal = Model.ob().data.getDefaultData(crName, prop);
    const opacity = Model.ob().data.getDefaultData(crName, `${prop}Opacity`);
    const red = hexToRgb(hexVal.slice(1, 3));
    const green = hexToRgb(hexVal.slice(3, 5));
    const blue = hexToRgb(hexVal.slice(5, 7));

    return `rgba( ${red}, ${green}, ${blue}, ${opacity} )`;
  }

  private hexToRgb(hexVal: string): string {
    const red = hexToRgb(hexVal.slice(1, 3));
    const green = hexToRgb(hexVal.slice(3, 5));
    const blue = hexToRgb(hexVal.slice(5, 7));

    return `${red}, ${green}, ${blue}`;
  }

  private hexToRgbaCSS(cr: string, prop: string): string {
    const crName = cr.split('-').join('_');

    const hexVal = Model.ob().data.getDataShort(crName, prop);
    const opacity = Model.ob().data.getDataShort(crName, `${prop}Opacity`);
    /* isBorder */
    // if (prop !== 'borderColor' && prop.indexOf('border') === 0 && prop.lastIndexOf('Color') !== -1) {
    // hexVal = (hexVal === Model.ob().data.getDefaultData(Model.ob().container.getCrType(crName), prop)) ? Model.ob().data.getDataShort(crName, 'borderColor') : hexVal;
    // opacity = (opacity === Model.ob().data.getDefaultData(Model.ob().container.getCrType(crName), `${prop}Opacity`)) ? Model.ob().data.getDataShort(crName, 'borderColorOpacity') : opacity;
    // }
    // const red = hexToRgb(hexVal.slice(1, 3));
    // const green = hexToRgb(hexVal.slice(3, 5));
    // const blue = hexToRgb(hexVal.slice(5, 7));

    return `rgba( ${this.hexToRgb(hexVal)}, ${opacity} )`;
  }

  private getCss(jsn: any, hid: string, prevCrName = ''): string {
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
              out += this.hdrRwdCssStyles(crJsn, hid);
              break;
            default:
              crNameDivider = prevCrName ? '-' : '';
              cssName = `h${hid}${crNameDivider}${prevCrName}-${crName}-${crType}`;
              out += this.crRwdCssStyles(`${prevCrName}${crNameDivider}${crName}`, crType, crJsn, cssName);

              if (crType === 'cntnr') {
                out += this.getCss(crJsn, hid, `${prevCrName}${crNameDivider}${crName}`);
              }
          }
        }
        return false;
      });
    return out;
  }

  private hdrRwdCssStyles(crJsn: any, hid: string): void {
    Model.ob().styleSheetMdl.setClassRule(`.cntrh${hid}`, 'height: 70vh;');

    if (this.IS_CSS_LOG_MODE) {
      console.log(`.cntrh${hid} {
        height:70vh;
      }`);
    }
  }

  private crRwdCssStyles(crName: string, crType: string, crJsn: any, cssName: string): string {
    const DEFAULT_SETS = Model.ob().set;
    const br = '\n\r';
    const keyframes = this.animationKeyframesStyles(crName, crJsn, cssName, DEFAULT_SETS.rwdDflt);
    const keyframesName = keyframes ? `${cssName}__keyframes` : '';

    let out = '';
    let styles = '';
    let animated = this.animationStyles(crName, keyframesName);

    if (animated) {
      Model.ob().styleSheetMdl.setClassRule(`.${cssName}.animated`, animated);
      animated = `.${cssName}.animated{${br}${animated}}${br}`;
    }

    Object.keys(DEFAULT_SETS.rwd)
      .some((maxWidth: string) => {
        if (crJsn[`rwd${maxWidth}`]) {
          styles = crType === 'cntnr'
            ? this.crCssStyle(crName)
            : this.fontCssStyle(crName);

          if (maxWidth === DEFAULT_SETS.rwdDflt) {
            Model.ob().styleSheetMdl.setClassRule(`.${cssName}`, styles);
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
        ? this.crCssStyle(crName)
        : this.fontCssStyle(crName);
      Model.ob().styleSheetMdl.setClassRule(`.${cssName}`, styles);
      out += `.${cssName} {${br}${styles}}${br}`;
    }

    Model.ob().styleSheetMdl.setClassRule(cssName, '/* position: absolute; */');
    if (this.IS_CSS_LOG_MODE) {
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
  private fontCssStyle(crName: string) {
    const tab = '\t';
    const br = '\n\r';

    let out = '';

    /* color */
    const clr = this.hexToRgbaCSS(crName, 'color');
    const clrDefault = this.hexToRgbaCSSDefault(Model.ob().container.getCrType(crName.split('-').join('_')), 'color');
    out += clr !== clrDefault ? `${tab}color: ${clr};${br}` : '';

    /* Font Family */
    out += this.getCssEl('font-family', this.getValue(crName, 'fontFamily'));

    /* Font-Size */
    out += this.getCssEl('font-size', this.getValue(crName, 'fontSize', true, 'em'));

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
      out += this.getCssEl(el.cssProp, this.getValue(crName, el.prop, false, el.ext));
      return false;
    });

    /* Text Shadow */
    let div = '';
    const crJsn = Model.ob().container.getCrsJSN(crName.split('-').join('_'));
    let tscOut = '';
    div = '';
    Object.entries(crJsn)
      .some(([tsc, tscJsn]) => {
        if (tsc.substring(0, 3) === 'tsc') {
          tscOut += div + this.getShadow(crName, 'textShadow', tscJsn);
          div = ', ';
        }
        return false;
      });
    const tscDefaultOut = this.getDefaultShadow(Model.ob().container.getCrType(crName.split('-').join('_')), 'textShadow');
    out += this.getCssEl('text-shadow', tscOut !== tscDefaultOut ? tscOut : '');

    /* Cr Styles */
    out += this.crCssStyle(crName);

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
  private animationStyles(crName: string, animationName = ''): string {
    const tab = '\t';
    const br = '\n\r';

    let out = '';

    if (animationName) {
      out += `${tab}animation-name: ${animationName};${br}`;
      out += `${tab}animation-duration: ${this.getJustVal(crName, 'animationDuration')}s;${br}`;
      out += `${tab}animation-iteration-count: ${this.getJustVal(crName, 'iterationCount')};${br}`;
      out += `${tab}animation-timing-function: ${this.getJustVal(crName, 'animationTimingFn')};${br}`;
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
  private animationKeyframesStyles(crName: string, crJsn: any, cssName: string, rwdMode = ''): string {
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
            data += `${br} ${(<any>akfCrJsn).cs.akfTimelinePos}% {${br}${tab}${this.abpFrameStyles(crName, crJsn, rwdMode, akfCrPercentPos)}${br} }`;
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
      Model.ob().styleSheetMdl.setClassRule(`@keyframes ${animationName}`, data);
      out += `@keyframes ${animationName} {${data}${br}}${br}`;
    }

    return out;
  }

  /**
  * Animation Break Point CSS
  */
  private abpFrameStyles(crName: string, crJsn: any, rwdMode: string, abpMode: string): string {
    const tab = '\t';

    let opacity = this.getAbpCascadeVal(crName, crJsn, 'opacity', rwdMode, abpMode);
    opacity = opacity ? this.getWkmmoType('opacity', opacity, 'wkm') : '';

    let translateX = this.getAbpCascadeVal(crName, crJsn, 'translateX', rwdMode, abpMode, '', 'em', 'convert');
    translateX = translateX ? ` translateX( ${translateX} )` : '';// px

    let translateY = this.getAbpCascadeVal(crName, crJsn, 'translateY', rwdMode, abpMode, '', 'em', 'convert');
    translateY = translateY ? ` translateY( ${translateY} )` : '';// px

    let translateZ = this.getAbpCascadeVal(crName, crJsn, 'translateZ', rwdMode, abpMode, '', 'em', 'convert');
    translateZ = translateZ ? ` translateZ( ${translateZ} )` : '';// px

    let rotateX = this.getAbpCascadeVal(crName, crJsn, 'rotateX', rwdMode, abpMode, '', 'deg');
    rotateX = rotateX ? ` rotateX( ${rotateX} )` : '';

    let rotateY = this.getAbpCascadeVal(crName, crJsn, 'rotateY', rwdMode, abpMode, '', 'deg');
    rotateY = rotateY ? ` rotateY( ${rotateY} )` : '';

    let rotateZ = this.getAbpCascadeVal(crName, crJsn, 'rotateZ', rwdMode, abpMode, '', 'deg');
    rotateZ = rotateZ ? ` rotateZ( ${rotateZ} )` : '';

    let skewX = this.getAbpCascadeVal(crName, crJsn, 'skewX', rwdMode, abpMode, '', 'deg');
    skewX = skewX ? ` skewX( ${skewX} )` : '';

    let skewY = this.getAbpCascadeVal(crName, crJsn, 'skewY', rwdMode, abpMode, '', 'deg');
    skewY = skewY ? ` skewY( ${skewY} )` : '';

    let scale = this.getAbpCascadeVal(crName, crJsn, 'scale', rwdMode, abpMode);
    scale = scale ? ` scale( ${scale} )` : '';

    let scaleX = this.getAbpCascadeVal(crName, crJsn, 'scaleX', rwdMode, abpMode);
    scaleX = scaleX ? ` scaleX( ${scaleX} )` : '';

    let scaleY = this.getAbpCascadeVal(crName, crJsn, 'scaleY', rwdMode, abpMode);
    scaleY = scaleY ? ` scaleY( ${scaleY} )` : '';

    const transformData = rotateX + rotateY + rotateZ + skewX + skewY + scale + scaleX + scaleY + translateX + translateY + translateZ;// rotate+
    const transform = transformData ? this.getWkmmoType(`${tab}transform`, transformData, 'wmmo') : '';

    return opacity + transform;
  }

  /**
  * Cascade Value for Animation Break Point CSS
  */
  private getAbpCascadeVal(crName: string, crJsn: any, prop: string, mode: string, prc: string, cssPropName = '', em = '', pxToEm = '', kwmoType = '') {
    const br = '\n\r';
    const tab = '\t';
    let cssPropValue = '';
    const DEFAULT_SETS = Model.ob().set;
    if (mode === DEFAULT_SETS.rwdDflt) {
      if (crJsn[`akf${mode}k${prc}`].cs[prop]) {
        cssPropValue = crJsn[`akf${mode}k${prc}`].cs[prop];
        if (pxToEm) {
          cssPropValue = this.pxToEm(Number(cssPropValue), crName).toString();
        }
        /* for paddings & margins... */
        if (!cssPropName) {
          return cssPropValue + em;
        }
        if (kwmoType) {
          return this.getWkmmoType(tab + cssPropName, cssPropValue + em, kwmoType);
        }
        return `${tab + cssPropName}: ${cssPropValue}${em};${br}`;
      }
      return '';
    }
    return '';
  }

  private getWkmmoType(prop: string, inData: string, type = '') {
    const br = '\n\r';
    const tale = `${prop}: ${inData};${br}`;
    if (this.IS_FILE_BUILDING_MODE) {
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
  *
  * @param crName <String> kebab style
  *
  * @return <String> css styles
  */

  private crCssStyle(crName: string): string {
    const tab = '\t';
    const br = '\n\r';
    // const DEFAULTS = Model.ob().set;

    let out = '';

    /* Background */
    out += this.backgroundCssStyle(crName);

    /* overflow */
    out += this.getCssEl('overflow', this.getValue(crName, 'overflow'));

    /* Position  */
    out += this.widthLeftHeightTopCssProp(crName);

    /* Paddings */
    let top = `${this.pxToEm(Number(this.getJustVal(crName, 'paddingTop')))}em`;
    let right = `${this.pxToEm(Number(this.getJustVal(crName, 'paddingRight')))}em`;
    let bottom = `${this.pxToEm(Number(this.getJustVal(crName, 'paddingBottom')))}em`;
    let left = `${this.pxToEm(Number(this.getJustVal(crName, 'paddingLeft')))}em`;

    out += `${tab}padding: ${(top === right && right === bottom && bottom === left && left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

    /* Margins */
    top = `${this.pxToEm(Number(this.getJustVal(crName, 'marginTop')))}em`;
    right = `${this.pxToEm(Number(this.getJustVal(crName, 'marginRight')))}em`;
    bottom = `${this.pxToEm(Number(this.getJustVal(crName, 'marginBottom')))}em`;
    left = `${this.pxToEm(Number(this.getJustVal(crName, 'marginLeft')))}em`;

    out += `${tab}margin: ${(top === right && right === bottom && bottom === left && left) ? `${top};${br}` : `${top} ${right} ${bottom} ${left};${br}`}`;

    /* Opacity */
    out += this.getCssEl('opacity', this.getValue(crName, 'opacity'));

    /* Transform */
    out += this.getTransform(crName);

    /* Perspective */
    out += this.getPerspective(crName);

    /* Border Width Type & Color */
    const borderType = this.getValue(crName, 'borderType');
    if (borderType) {
      const btw = `${this.pxToEm(Number(this.getJustVal(crName, 'borderTopWeight')))}em`;
      const brw = `${this.pxToEm(Number(this.getJustVal(crName, 'borderRightWeight')))}em`;
      const bbw = `${this.pxToEm(Number(this.getJustVal(crName, 'borderBottomWeight')))}em`;
      const blw = `${this.pxToEm(Number(this.getJustVal(crName, 'borderLeftWeight')))}em`;

      const clr = this.hexToRgbaCSS(crName, 'borderColor');

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
    top = `${this.getValue(crName, 'borderTopLeftRadius', true, 'em')}`;
    right = `${this.getValue(crName, 'borderTopRightRadius', true, 'em')}`;
    bottom = `${this.getValue(crName, 'borderBottomLeftRadius', true, 'em')}`;
    left = `${this.getValue(crName, 'borderBottomRightRadius', true, 'em')}`;

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
    const crJsn = Model.ob().container.getCrsJSN(crName.split('-').join('_'));
    Object.entries(crJsn)
      .some(([bsc, bscJsn]) => {
        if (bsc.substring(0, 3) === 'bsc') {
          bscOut += div + this.getShadow(crName, 'boxShadow', bscJsn);
          div = ', ';
        }
        return false;
      });
    const bscDefaultOut = this.getDefaultShadow(Model.ob().container.getCrType(crName.split('-').join('_')), 'boxShadow');
    out += this.getCssEl('box-shadow', bscOut !== bscDefaultOut ? bscOut : '');

    return out;
  }

  private getShadowPropsArr(prop: string) {
    if (prop.indexOf('box') !== -1) {
      return ['Position', 'LR', 'TB', 'Blur', 'Spread', 'Color'];
    }
    return ['LR', 'TB', 'Blur', 'Color'];
  }

  private getDefaultShadow(crType: string, prop: string) {
    const propPostfixArr = this.getShadowPropsArr(prop); // ['Position', 'LR', 'TB', 'Blur', 'Spread', 'Color'];

    return this.getShadow(crType, prop, {
      cs: {
        ...propPostfixArr.map((postfix) => ({ [`${prop}${postfix}`]: this.getDefaultValue(crType, `${prop}${postfix}`) })),
      },
    });
  }

  private getShadowValue(crType: string, prop: string, bscJsn: any): string {
    const value = bscJsn.cs[prop] || this.getDefaultValue(crType, prop);
    if (prop.indexOf('Position') !== -1) {
      return value;
    }
    if (prop.indexOf('Color') !== -1) {
      // console.log(this.hexToRgb(value), ',', bscJsn.cs[`${prop}Opacity`] || this.getDefaultValue(crType, `${prop}Opacity`));
      const opacity = bscJsn.cs[`${prop}Opacity`] || this.getDefaultValue(crType, `${prop}Opacity`);
      return `rgba( ${this.hexToRgb(value)}, ${opacity} )`;
    }
    return value ? `${this.pxToEm(Number(value)).toString()}em` : '';
  }

  private getShadow(crName: string, prop: string, bscJsn: any) {
    const crType = Model.ob().container.getCrType(crName.split('-').join('_'));
    const propPostfixArr = this.getShadowPropsArr(prop); // ['Position', 'LR', 'TB', 'Blur', 'Spread', 'Color'];

    return propPostfixArr.map((postfix) => this.getShadowValue(crType, `${prop}${postfix}`, bscJsn)).join(' ');
  }

  /**
  *       Retrieve Container width,height,top,bottom css prop
  *
  * @param Array objJSON style collection
  * @param Array $ is an array of default settings
  * @return String $css_style css style
  */

  private widthLeftHeightTopCssProp(crName: string) {
    const tab = '\t';
    const br = '\n\r';

    let out = '';

    const widthType = this.getJustVal(crName, 'elFullWidth');
    const width = Number(this.getJustVal(crName, 'elWidth'));

    let borderWeight = 0;
    const [alignY, alignX] = this.getJustVal(crName, 'elTo').split(' ');
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
            elPosX = Number(this.getJustVal(crName, 'elPosX'));
            $xShift = elPosX;
            $left = ($xShift > 0 ? ` + ${this.pxToEm($xShift, crName).toString()}em` : ` - ${this.pxToEm($xShift / (-1), crName).toString()}em`);
            break;
          case 'right':
            to = '100';
            elPosX = Number(this.getJustVal(crName, 'elPosX'));
            borderWeight = Number(this.getJustVal(crName, 'borderRightWeight')) + Number(this.getJustVal(crName, 'borderLeftWeight'));
            $xShift = elPosX - (width + borderWeight);
            $left = ($xShift > 0 ? ` + ${this.pxToEm($xShift, crName).toString()}em` : ` - ${this.pxToEm($xShift / (-1), crName).toString()}em`);
            break;
          default:
            to = '50';
            elPosX = Number(this.getJustVal(crName, 'elPosX'));
            $xShift = elPosX - (width) / 2;
            $left = ($xShift > 0 ? ` + ${this.pxToEm($xShift, crName).toString()}em` : ` - ${this.pxToEm($xShift / (-1), crName).toString()}em`);
            break;
        }

        out += `${tab}width: ${this.pxToEm(width, crName).toString()}em;${br}`;
        out += `${tab}left: calc( ${to}%${$left} );${br}`;
        break;
      default:
        break;
    }

    const heightType = this.getJustVal(crName, 'elFullHeight');
    const height = Number(this.getJustVal(crName, 'elHeight'));
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
            yShift = Number(this.getJustVal(crName, 'elPosY')) / (-1);
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName).toString()}em` : ` - ${this.pxToEm(yShift / (-1), crName).toString()}em`);
            break;
          case 'bottom':
            to = '100';
            yShift = Number(this.getJustVal(crName, 'elPosY')) / (-1) - height;
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName).toString()}em` : ` - ${this.pxToEm(yShift / (-1), crName).toString()}em`);
            break;
          default:
            to = '50';
            yShift = Number(this.getJustVal(crName, 'elPosY')) / (-1) - height / 2;
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName).toString()}em` : ` - ${this.pxToEm(yShift / (-1), crName).toString()}em`);
            break;
        }

        out += `${tab}height: ${this.pxToEm(height, crName).toString()}em;${br}`;
        out += `${tab}top: calc( ${to}%${top} );${br}`;
        break;
      default:
        break;
    }

    return out;
  }

  private backgroundCssStyle(crName: string) {
    const tab = '\t';
    const br = '\n\r';

    let out = '';

    /* Background Color */
    const clr = this.hexToRgbaCSS(crName, 'backgroundColor');
    const clrDefault = this.hexToRgbaCSSDefault(Model.ob().container.getCrType(crName.split('-').join('_')), 'backgroundColor');
    out += clr !== clrDefault ? `${tab}background-color: ${clr};${br}` : '';

    /* Image */
    const bg = this.getValue(crName, 'backgroundImage');
    if (bg) {
      out += `${tab}background-image:url("${bg}");${br}`;
      out += this.getCssEl('background-repeat', this.getValue(crName, 'backgroundRepeat'));
      out += this.getCssEl('background-attachment', this.getValue(crName, 'backgroundAttachment'));
      out += this.getCssEl('background-position', this.getValue(crName, 'backgroundPosition'));
      out += this.getCssEl('background-size', this.getValue(crName, 'backgroundSize'));
    }

    /* Gradient */
    out += this.getGradient(crName, bg);

    /* Filters */
    out += this.getImgFilter(crName);

    return out;
  }

  private getImgFilter(crNameCSS: string): string {
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
    const crType = Model.ob().container.getCrType(crName);
    bounds.some((bound) => {
      value = this.getValue(crName, bound.prop);
      defaultValue = this.getDefaultValue(crType, bound.prop);
      out += (value !== defaultValue && value) ? ` ${bound.cssProp}(${value}${bound.ext})` : '';
      return false;
    });

    return this.getCssEl('filter', out);
  }

  /**
  *
  */
  private getPerspective(crName: string): string {
    let perspectiveOrigin = '';
    const perspective = this.getCssEl('perspective', this.getValue(crName, 'perspective', true, 'em'));
    if (perspective) {
      const perspectiveOriginX = this.getValue(crName, 'perspectiveOriginX', false, '%');
      const perspectiveOriginY = this.getValue(crName, 'perspectiveOriginY', false, '%');
      perspectiveOrigin = this.getCssEl('perspective-origin', `${perspectiveOriginX || '0%'} ${perspectiveOriginY || '0%'}`);
    }
    /* Maybe it must be within getTransform function */
    const transformStyle = this.getCssEl('transform-style', this.getValue(crName, 'transformStyle'));

    return `${perspective}${transformStyle}${perspectiveOrigin}`;
  }

  private getTransform(crName: string): string {
    let out = '';

    /* rotate XYZ */
    const rotateX = this.getValue(crName, 'rotateX', false, 'deg');
    out += rotateX ? ` rotateX(${rotateX})` : '';
    const rotateY = this.getValue(crName, 'rotateY', false, 'deg');
    out += rotateY ? ` rotateY(${rotateY})` : '';
    const rotateZ = this.getValue(crName, 'rotateZ', false, 'deg');
    out += rotateZ ? ` rotateZ(${rotateZ})` : '';

    /* skew XY */
    const skewX = this.getValue(crName, 'skewX', false, 'deg');
    out += skewX ? ` skewX(${skewX})` : '';
    const skewY = this.getValue(crName, 'skewY', false, 'deg');
    out += skewY ? ` skewY(${skewY})` : '';

    /* scale XY */
    const scaleX = this.getValue(crName, 'scaleX');
    out += scaleX ? ` scaleX(${scaleX})` : '';
    const scaleY = this.getValue(crName, 'scaleY');
    out += scaleY ? ` scaleY(${scaleY})` : '';

    /* translate XYZ */
    const translateX = this.getValue(crName, 'translateX', true, 'em');
    out += translateX ? ` translateX(${translateX})` : '';
    const translateY = this.getValue(crName, 'translateY', true, 'em');
    out += translateY ? ` translateY(${translateY})` : '';
    const translateZ = this.getValue(crName, 'translateZ', true, 'em');
    out += translateZ ? ` translateZ(${translateZ})` : '';

    out = this.getCssEl('transform', out);

    return `${out}`;
  }

  private getGradient(cr: string, bgImg = ''): string {
    const tab = '\t';
    const br = '\n\r';

    const crName = cr.split('-').join('_');
    const crType = Model.ob().container.getCrType(crName);
    const crJsn = Model.ob().container.getCrsJSN(crName);
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

    Object.keys(crJsn).some((key) => {
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

    if (data.length && this.IS_CSS_LOG_MODE) {
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
      gradientRepeatType = jsn.cs.gradientRepeatType || this.getDefaultValue(crType, 'gradientRepeatType');
      gradientRepeatType = gradientRepeatType === 'norepeat' ? '' : 'repeating-';

      color = jsn.cs.backgroundColor || this.getDefaultValue(crType, 'backgroundGradientColor');
      opacity = jsn.cs.backgroundColorOpacity || this.getDefaultValue(crType, 'backgroundGradientColorOpacity');
      startColor = `rgba( ${this.hexToRgb(color)}, ${opacity} )`;

      /* radial | linear */
      type = jsn.cs.gradientType || this.getDefaultValue(crType, 'gradientType');

      if (this.IS_CSS_LOG_MODE) {
        console.log('gradientRepeatType: "', gradientRepeatType, '"', startColor, type);
      }

      div = retDataC ? ', ' : '';

      if (type === 'linear' || type === 'repeating-linear') {
        angl = jsn.cs.gradientAngl || this.getDefaultValue(crType, 'gradientAngl'); /* 0 .. 360 */

        grtData = this.getCertainGradient(jsn, crType);

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
        grtData = this.getCertainGradient(jsn, crType);

        if (grtData) {
          /* shape: ellipse || circle */
          shape = jsn.cs.gradientRadialShape || this.getDefaultValue(crType, 'gradientRadialShape'); // ? jsn.cs.gradientRadialShape : 'ellipse';
          /* direction: top | bottom | center | ...
          */

          gradientPosX = `${jsn.cs.gradientPosX || this.getDefaultValue(crType, 'gradientPosX')}%`; // ? jsn.cs.gradientPosX : '50')+'%';
          gradientPosY = `${jsn.cs.gradientPosY || this.getDefaultValue(crType, 'gradientPosY')}%`; //  ? jsn.cs.gradientPosY : '50')+'%';
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
        grtData = this.getCertainGradient(crJsn, crType);

        if (grtData) {
          /*
            direction: top | bottom | center | ...
          */

          gradientPosX = `${jsn.cs.gradientPosX || this.getDefaultValue(crType, 'gradientPosX')}%`; // ? jsn.cs.gradientPosX : '50')+'%';
          gradientPosY = `${jsn.cs.gradientPosY || this.getDefaultValue(crType, 'gradientPosY')}%`;
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

  private getCertainGradient(crJsn: any, crType = 'cntnr') {
    let grtData = '';
    const data: any = [];
    let color = '';
    let opacity = '';
    let pos = '';
    let clr = '';

    Object.keys(crJsn).some((grtEl) => {
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
        color = grtEl.cs.backgroundColor || this.getDefaultValue(crType, 'backgroundGradientColor');
        opacity = grtEl.cs.backgroundColorOpacity || this.getDefaultValue(crType, 'backgroundGradientColorOpacity');

        clr = `rgba( ${this.hexToRgb(color)}, ${opacity} )`;

        pos = grtEl.cs.grdLinePos;
        grtData += `, ${clr} ${pos}%`;
      }

      return false;
    });
    return grtData;
  }

  private pxToEm(px: number, crName = '', valType = ''): number {
    if (valType === 'fontSize' || !crName) {
      return px / 16;
    }

    const crFontSize = Number(this.getJustVal(crName, 'fontSize'));

    const occ = crFontSize / 16 || 1;
    return px / (16 * occ);
  }
}

export default CssFile;
