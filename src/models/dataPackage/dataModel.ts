import Model from "../model";

interface IDataModel {
  getJsn(): any | undefined;
  getDataShort(crName: string, crProp: string): string;
  getDefaultData(crType: string, prop: string): string;
  setJsnDirectly(json: JSON): void;
  getData(json: any, crName: string, crProp: string, containerType: string): string
  custom: (Array<ISection> | undefined);
  jsn: ISection | undefined;
  getSortedDefaultRwdModeArrayByWidth(setRvd: any): any;
}

class DataModel implements IDataModel {
  public jsn: any = undefined;

  public custom: (Array<ISection> | undefined) = undefined;

  public getJsn(): any | undefined {
    return this.jsn;
  }

  public getDataShort(crName = '', crProp = ''): string {
    return this.getData(null, crName, crProp);
  }

  public getDefaultData(crType: string, prop: string): string {
    if (Model.ob().set && Model.ob().set[crType] && Model.ob().set[crType][prop]) {
      const defVal = Model.ob().set[crType][prop];

      return Array.isArray(defVal) ? defVal[0] : defVal;
    }

    const defaultType = Model.ob().set[crType || 'cntnr'].dflt;

    const defaultValue = Model.ob().set[defaultType][prop];

    return Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
  }

  public setJsn(json: JSON): void {
    this.jsn = json;
  }

  setJsnDirectly(json: JSON): void {
    this.jsn = json;
  }

  // setJsnFromInputField() {
  //   this.jsn = this.getJsnFromInputField();
  // }

  // private getJsnFromInputField(): JSON {
  //   const { value } = document.getElementById(this.destID) as HTMLInputElement;
  //   if (value) {
  //     return JSON.parse(value);
  //   }
  //   return this.jsonDefault;
  // }

  /** @example: getData(json, crName, 'backgroundImage', 'getIMG') */
  public getData(json: any = null, crName = '', crProp = '', containerType = ''): string {
    const jsn = json || this.getJsn();
    const crType = containerType || Model.ob().container.getCrType(crName);

    const validType = ['description', 'ptID', 'timeout', 'name', 'postType', 'type', 'priority', 'heightPercent',
      'speed', 'pause', 'autostop', 'fastOnEvent', 'mainPage', 'pauseOnPagerHover'];

    if (crName === 'hdr' && validType.includes(crProp)) {
      const val = Model.ob().container.getCrVal(jsn, crName, crProp);
      if (val) {
        return val;
      }
      return crType === 'getIMG' ? Model.ob().set.dfltImg : this.getDefaultData(crType, crProp);
    }

    const val = this.getCascadeVal(jsn, crName, crProp, Model.ob().getRWDMode());

    if (val) {
      return val;
    }

    return crType === 'getIMG' ? Model.ob().set.dfltImg : this.getDefaultData(crType, crProp);
  }

  /** Cascading RWD Cr Vals */
  getCascadeVal(jsn: any, crName: string, crProp: string, mode: string): string {
    if (mode === Model.ob().set.rwdDflt) {
      return Model.ob().container.getCrVal(jsn, crName, crProp, mode);
    }

    let inheritRWDMode = '';

    let retVal = Model.ob().container.getCrVal(jsn, crName, crProp, mode);

    if (retVal === '') {
      inheritRWDMode = this.getInheritRWDMode(mode);
      retVal = Model.ob().container.getCrVal(jsn, crName, crProp, inheritRWDMode);
    }

    return retVal || this.getCascadeVal(jsn, crName, crProp, inheritRWDMode);
  }

  /**
  * !!!Important is that Model.ob().set.rwd must to be
  * arranged ascending by with up to Model.ob().set.rwdDflt mode!!!
  */
  getInheritRWDMode(mode: string): string {
    let nextModeFlag = false;
    let retVal = '';

    const a = this.getSortedDefaultRwdModeArrayByWidth();

    Object
      .keys(a)
      .some((rwdMode) => {
        if (mode === Model.ob().set.rwdDflt) {
          retVal = mode;
        }
        if (retVal === '' && a[rwdMode].width === Model.ob().set.rwdDflt) {
          retVal = a[rwdMode].width;
        }
        if (retVal === '' && nextModeFlag) {
          retVal = a[rwdMode].width;
        }
        if (a[rwdMode].width === mode) {
          nextModeFlag = true;
        }
        return false;
      });

    return retVal;
  }

  getSortedDefaultRwdModeArrayByWidth(setRvd = Model.ob().set.rwd): any {
    const a: any = [];
    let ai = 0;
    let hold = [];

    Object
      .keys(setRvd)
      .some((rwdMode) => {
        a[ai] = setRvd[rwdMode];
        ai += 1;
        return false;
      });

    for (let pass = 1; pass < ai; pass += 1) {
      for (let i = 0; i < ai - 1; i += 1) {
        if (Number(a[i].width) > Number(a[i + 1].width)) {
          hold = a[i];
          a[i] = a[i + 1];
          a[i + 1] = hold;
        }
      }
    }
    return a;
  }

  getDefaultJSNData(cr: string) {
    if (Model.ob().set) {
      return ((Model.ob().set[cr]) ? Model.ob().set[cr] : Model.ob().set[Model.ob().set[cr].dflt]);
    }
    return false;
  }
}

export default DataModel;
export {IDataModel}
