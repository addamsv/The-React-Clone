import Model from "../model";
import Container from "./containerModel";

let jsn = undefined as any;

const Data = {

  custom: undefined as Array<ISection> | undefined,

  getJsn: (): any | undefined => jsn,

  getDataShort: (crName = '', crProp = ''): string => Data.getData(null, crName, crProp),

  getDefaultData: (crType: string, prop: string): string => {
    if (Model.ob().set && Model.ob().set[crType] && Model.ob().set[crType][prop]) {
      const defVal = Model.ob().set[crType][prop];

      return Array.isArray(defVal) ? defVal[0] : defVal;
    }

    const defaultType = Model.ob().set[crType || 'cntnr'].dflt;

    const defaultValue = Model.ob().set[defaultType][prop];

    return Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
  },

  setJsn: (json: any): void => { jsn = json },

  setJsnDirectly: (json: any): void => {
    jsn = json;
    Model.ob().setJsnByHidToCustomData();
  },

  getSortedDefaultRwdModeArrayByWidth: (setRvd = Model.ob().set.rwd): any => {
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
  },

  /** @example: getData(json, crName, 'backgroundImage', 'getIMG') */
  getData: (json: any = null, crName = '', crProp = '', containerType = ''): string => {
    const jsn = json || Data.getJsn();
    const crType = containerType || Container.getCrType(crName);

    const validType = ['description', 'ptID', 'timeout', 'name', 'postType', 'type', 'priority', 'heightPercent',
      'speed', 'pause', 'autostop', 'fastOnEvent', 'mainPage', 'pauseOnPagerHover'];

    if (crName === 'hdr' && validType.includes(crProp)) {
      const val = Container.getCrVal(jsn, crName, crProp);
      if (val) {
        return val;
      }
      return crType === 'getIMG' ? Model.ob().set.dfltImg : Data.getDefaultData(crType, crProp);
    }

    const val = getCascadeVal(jsn, crName, crProp, Model.ob().getRWDMode());

    if (val) {
      return val;
    }

    return crType === 'getIMG' ? Model.ob().set.dfltImg : Data.getDefaultData(crType, crProp);
  },


}

/** Cascading RWD Cr Vals */
const getCascadeVal = (jsn: any, crName: string, crProp: string, mode: string): string => {
  if (mode === Model.ob().set.rwdDflt) {
    return Container.getCrVal(jsn, crName, crProp, mode);
  }

  let inheritRWDMode = '';

  let retVal = Container.getCrVal(jsn, crName, crProp, mode);

  if (retVal === '') {
    inheritRWDMode = getInheritRWDMode(mode);
    retVal = Container.getCrVal(jsn, crName, crProp, inheritRWDMode);
  }

  return retVal || getCascadeVal(jsn, crName, crProp, inheritRWDMode);
}

/**
* !!!Important is that Model.ob().set.rwd must to be
* arranged ascending by with up to Model.ob().set.rwdDflt mode!!!
*/
const getInheritRWDMode = (mode: string): string => {
  let nextModeFlag = false;
  let retVal = '';

  const a = Data.getSortedDefaultRwdModeArrayByWidth();

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
export default Data;
