class TransformCss {
  public static thisObject: any = null;

  private mdl: any = null;

  public static component(mdl: any) {
    if (!this.thisObject) {
      this.thisObject = new TransformCss();
      this.thisObject.init(mdl);
    }
    return this.thisObject;
  }

  public init(mdl: any) {
    this.mdl = mdl;
  }

  public get({
    crName = '',
    valType = '',
    value = '',
  } = {}): string {
    const rotate = this.getRotate({ crName, valType, value });
    const skew = this.getSkew({ crName, valType, value });
    const scale = this.getScale({ crName, valType, value });
    const translate = this.getTranslate({ crName, valType, value });

    return `${rotate}${skew}${scale}${translate}`;
  }

  // matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
  // scale( scaleX, scaleY );
  // skew( skewX, skewY );
  public getScale({
    crName = '',
    valType = '',
    value = '',
  } = {}): string {
    const scaleX = this.getPart(crName, 'scale', 'X', valType, value);
    const scaleY = this.getPart(crName, 'scale', 'Y', valType, value);
    return `${scaleX}${scaleY}`;
  }

  // getScaleXY(crName: string, valType: string, value = '') {
  // eslint-disable-next-line max-len
  //   return `${valType === 'scaleX' ? value : this.mdl.data.getDataShort(crName, 'scaleX')}${this.mdl.set.cssNames.scaleAttr}, ${
  // eslint-disable-next-line max-len
  //     valType === 'scaleY' ? value : this.mdl.data.getDataShort(crName, 'scaleY')}${this.mdl.set.cssNames.scaleAttr}`;
  // }

  public getSkew({
    crName = '',
    valType = '',
    value = '',
  } = {}): string {
    const skewX = this.getPart(crName, 'skew', 'X', valType, value);
    const skewY = this.getPart(crName, 'skew', 'Y', valType, value);
    return `${skewX}${skewY}`;
  }

  public getRotate({
    crName = '',
    valType = '',
    value = '',
  } = {}): string {
    const rotateX = this.getPart(crName, 'rotate', 'X', valType, value);
    const rotateY = this.getPart(crName, 'rotate', 'Y', valType, value);
    const rotateZ = this.getPart(crName, 'rotate', 'Z', valType, value);
    return `${rotateX}${rotateY}${rotateZ}`;
  }

  public getTranslate({
    crName = '',
    valType = '',
    value = '',
  } = {}): string {
    const translateX = this.getPart(crName, 'translate', 'X', valType, value, true);
    const translateY = this.getPart(crName, 'translate', 'Y', valType, value, true);
    const translateZ = this.getPart(crName, 'translate', 'Z', valType, value, true);
    return `${translateX}${translateY}${translateZ}`;
  }

  private getPart(crName: string, propType: string, postFix: string, valType: string, value: string = '0', isPxToEm = false): string {
    const prop = `${propType}${postFix}`;
    let propsValue = `${valType === prop ? value : this.getData(crName, prop)}`;
    if (propsValue === this.mdl.data.getDefaultData(this.mdl.container.getCrType(crName), prop)) {
      return '';
    }
    if (isPxToEm) {
      propsValue = this.pxToEm(Number(propsValue), crName).toString();
    }
    return ` ${prop}( ${propsValue}${this.getAttr(`${propType}Attr`)} )`;
  }

  private getAttr(attrName: string) {
    return this.mdl ? this.mdl.set.cssNames[attrName] : '';
  }

  private getData(crName: string, prop: string) {
    return this.mdl ? this.mdl.data.getDataShort(crName, prop) : '0';
  }

  private pxToEm(px: number, crName: string = '', valType: string = ''): number {
    if (valType === 'fontSize' || !crName) {
      return px / 16;
    }
    const crFontSize: number = Number(this.mdl.data.getDataShort(crName, 'fontSize'));
    const occ = crFontSize / 16 || 1;
    return px / (16 * occ);
  }
}

export default TransformCss;
