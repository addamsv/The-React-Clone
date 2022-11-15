const validCrNameStart = { akf: true, grt: true, grd: true, tsc: true, bsc: true, hvr: true };

const validCrNames: any = {
  cs: false, hdr: false, i: true, c: true, rwd: true, akf: true,
  grt: true, grd: true, tsc: true, bsc: true, hvr: true,
};

const isNum = (num = '256') => !Number.isNaN(Number(num));

const isCrRoot = (crName: string): boolean => crName.split('_').length <= 1;

const isJsnObj = (obj: any): boolean => obj && typeof obj === 'object' && obj.constructor === Object;

const isCrTypeHasValidName = (crType: string): boolean => {
  const crTypes = ['hdr', 'form', 'video', 'cntnr', 'btnData', 'mainSlug', 'subSlug', 'btnData'];
  return crTypes.some((type) => crType === type);
}

/** Converts (String) crLink into JSON Obj
*
* @param  {string} crName - link
* @param  {string} val - the value.
* @return  {JSON} 'crLink' - with the required prop and the value.
*/
const getCrLnkJsn = (crName = 'c0_cs', val: any = null) => {
  const cmnPropArr = crName.split('_'); //  this.getCrDestArrWithoutLastEl(`${crName}_lastEl`);
  // console.log(crName.split('_'), this.getCrDestArrWithoutLastEl(`${crName}_lastEl`));

  const depth = cmnPropArr.length - 1;
  return getCrsJSNk(cmnPropArr, depth, val);
}

/**
*  Converts String crLink into JSON Obj
*
* @param  {Array} cmnPropArr - Link
* @param  {Number} depth - The Depth of the Link.
* @param  {String|Number} val - The Value.
* @param  {Number} it - Iterations of the Recursion.
*
* @return  {JSON} crLink
*/
const getCrsJSNk = (cmnPropArr: any, depth: number, val: any = null, it = 0): JSON => {
  const jsn: any = {};
  jsn[cmnPropArr[it]] = depth === it
    ? val
    : getCrsJSNk(cmnPropArr, depth, val, Number(it) + 1);
  return jsn;
}

/**  Validate JSON obj */
const getValidJsn = (json: any) => {
  const jsn = json;
  Object
  .keys(jsn)
  .some((prop) => {
    if (Object.prototype.hasOwnProperty.call(jsn, prop)) {
      if (jsn[prop] === '') {
        delete jsn[prop];
      } else if (isJsnObj(jsn[prop])) {
        jsn[prop] = getValidJsn(jsn[prop]);
      }
    }
    return false;
  });
  return jsn;
}

/** Merge two incoming JSON */
const jsnMrg = (json: any, jsnIn: any): JSON => {
  const jsn = json;
  Object
  .keys(jsnIn)
  .some((cmnProp) => {
    if (Object.prototype.hasOwnProperty.call(jsnIn, cmnProp)) {
      if (!Object.prototype.hasOwnProperty.call(jsn, cmnProp)) {
        jsn[cmnProp] = jsnIn[cmnProp];
      } else if (isJsnObj(jsn[cmnProp]) && isJsnObj(jsnIn[cmnProp])) {
        jsn[cmnProp] = jsnMrg(jsn[cmnProp], jsnIn[cmnProp]);
      }
    }
    return false;
  });
  return jsn;
}

/**
* @param  {JSON} jsn - Model
* @param  {String} crName - Container Name
* @param  {Array} cmnPropArr - Common Property Array
* @param  {Number} depth - Path's Depth
* @param  {Number} it - iteration counter
* @return  {JSON} obj.
*/
const getJsonWithRemovedCr = (json: any = {}, crName = 'c0', cmnPropArr: any, depth: number, it = 0): JSON => {
  const jsn = json;
  // jsn.hasOwnProperty(cmnPropArr[it])
  if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
    if ((depth === it) && jsn[cmnPropArr[it]] && validateCrName(cmnPropArr[it])) {
      delete jsn[cmnPropArr[it]];
      return jsn;
    }
    if (isJsnObj(jsn[cmnPropArr[it]])) {
      jsn[cmnPropArr[it]] = getJsonWithRemovedCr(
        jsn[cmnPropArr[it]],
        crName,
        cmnPropArr,
        depth,
        Number(it) + 1,
      );
    }
  }
  return jsn;
}

/**
* @param  {JSON} jsn - Model
* @param  {String} crName - Container Name
* @param  {String} newCrName - New Container Name
* @param  {String} crType - Container Type
* @param  {Array} cmnPropArr - Common Property Array
* @param  {Number} depth - Path's Depth
* @param  {Number} it - iteration counter
* @return  {JSON} obj.
*/
const getJsnWithMadeCr = (json: any = {}, crName = 'c0', newCrName: string, crType: string, cmnPropArr: any, depth: number, priority: string, it = 0): JSON => {
  const jsn = json;
  if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
    if ((depth === it) && jsn[cmnPropArr[it]] && validateCrName(cmnPropArr[it]) === 'c') {
      jsn[cmnPropArr[it]][newCrName] = { cs: { type: crType, priority } };
      return jsn;
    }
    if (isJsnObj(jsn[cmnPropArr[it]])) {
      jsn[cmnPropArr[it]] = getJsnWithMadeCr(
        jsn[cmnPropArr[it]],
        crName,
        newCrName,
        crType,
        cmnPropArr,
        depth,
        priority,
        Number(it) + 1,
      );
    }
  }
  return jsn;
}

/** Get a New cr's Name
*
* @param  {any} jsn - Model
* @param  {string} crName - The Path
* @param  {string} crType - The Type of The Value
* @param  {any} cmnPropArr - Common Property Array
* @param  {number} depth - Depth of the Path
* @param  {number} it - iteration counter
* @return {string} New cr's Name.
*/
const getNewCrNameProc = (jsn: any = {}, crName = 'c0', crType: string, cmnPropArr: any, depth: number, it = 0): string => {
  if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
    if ((depth === it) && jsn[cmnPropArr[it]] && validateCrName(cmnPropArr[it])) {
      let fn = 0;
      while (jsn[cmnPropArr[it]][crType + fn]) {
        fn += 1;
      }
      return crType + fn;
    }
    if (isJsnObj(jsn[cmnPropArr[it]])) {
      return getNewCrNameProc(
        jsn[cmnPropArr[it]],
        crName,
        crType,
        cmnPropArr,
        depth,
        Number(it) + 1,
      );
    }
  }
  return '';
}

/** Get a cr's value
*
* @param  {JSON} jsn - model
* @param  {JSON} jsnCrLnk - obj of a path
* @param  {String} valType type of the value
* @param  {Boolean} val - value
* @return {String} cr's value.
*/
const getCrValProc = (jsn: any = {}, jsnCrLnk: any = {}, valType = 'type', value = ''): string => {
  let val = value;
  if (!val) {
    Object.keys(jsnCrLnk).some((cmnProp) => {
      if (Object.prototype.hasOwnProperty.call(jsn, cmnProp)) {
        if (cmnProp === 'cs' && jsn[cmnProp][valType]) {
          val = jsn[cmnProp][valType];
        } else if (isJsnObj(jsnCrLnk[cmnProp]) && isJsnObj(jsn[cmnProp])) {
          val = getCrValProc(jsn[cmnProp], jsnCrLnk[cmnProp], valType, val);
        }
      }
      return false;
    });
  }
  return val;
}

/** Retrieve cr name was defined in the proper way or FALSE */
const validateCrName = (crName: string): string => {
  if (crName in validCrNames) {
    return crName;
  }
  let validContainer = '';
  Object.keys(validCrNames).some((vCr: string) => {
    if (crName.indexOf(vCr) === 0 && validCrNames[vCr]) { // vCr=='akf' || vCr=='grt' || vCr=='grd' || vCr=='tsc' || vCr=='bsc'
      if (vCr in validCrNameStart) {
        validContainer = vCr;
        return true;
      }
      if (isNum(crName.slice(vCr.length))) {
        validContainer = vCr;
        return true;
      }
    }
    return false;
  });
  return validContainer;
}

export default jsnMrg;
export { validateCrName, getValidJsn, isNum, getCrValProc,
  getNewCrNameProc, getJsnWithMadeCr, getJsonWithRemovedCr,
  getCrLnkJsn, getCrsJSNk, isCrTypeHasValidName, isJsnObj };