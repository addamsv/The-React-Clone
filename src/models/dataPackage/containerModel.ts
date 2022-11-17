import getArrSortedByPriority from '../../utils/getArrSortedByPriority';
import Model from '../model';
import jsnMrg, { getCrLnkJsn, getCrValProc, getJsnWithMadeCr, getJsonWithRemovedCr, getNewCrNameProc, getValidJsn, isCrTypeHasValidName, isJsnObj, validateCrName } from './containerPckg/containerPckg';
import Data from './dataModel';

const validCrNameStart = { akf: true, grt: true, grd: true, tsc: true, bsc: true, hvr: true };

const validCrNames: any = {
  cs: false, hdr: false, i: true, c: true, rwd: true, akf: true,
  grt: true, grd: true, tsc: true, bsc: true, hvr: true,
};

const Container = {
  /** Sets, and Gets back the JSON construction
  * @param  {JSON} jsn - JSON that's contained string
  * @param  {String} crName - required param and means the param link
  * @param  {String} valType - required param last Containers link
  * @param  {String} val - the value.
  * @param  {String} rwdMode - the rwdMode.
  *
  * @return {JSON} jsn - with the required prop and the value.
  */
  setCrVal(json: any = null, crName = 'c0', valType = 'type', val: any = null, rwdMode = '') {
    const jsn = json || Data.getJsn();
    const pre = this.getLastCrNameInDest(crName).substring(0, 3);
    let mode = rwdMode !== '' ? `_rwd${rwdMode}` : rwdMode;
    mode = ((pre in validCrNameStart)) ? '' : mode; // pre == 'akf'  ||  pre == 'grt'  ||  pre == 'grd'  ||  pre == 'bsc'   ||  pre == 'tsc'
    if (crName !== 'hdr') {
      // BC.commitNewStep({ crName, prop: valType, value: val, prevValue: State.get(crName, valType).toString() });
      // BC.commitPrevStep();
    }
    if (valType === 'priority') {
      mode = '';
    }
    return jsnMrg(getCrLnkJsn(`${crName}${mode}_cs_${valType}`, val), jsn);
  },

  mkCrAkf(crName = 'c0', mode = 'akf5000k0', akfTimelinePos = '0') { // valType='type', val='Containers', _akf5000k0
    const val = { cs: { akfTimelinePos } };
    Data.setJsnDirectly(jsnMrg(getCrLnkJsn(`${crName}_${mode}`, val), Data.getJsn()));
  },

  /* get Max Priority Container || Text Shadow Containers || Gradient Containers || '1' */
  getAltCrMaxPriority(crName: string, filter: string) {
    const crJsn = this.getCrsJSN(crName);
    const max = Object
      .entries(crJsn)
      .filter(([cr]) => cr.substring(0, filter.length) === filter)
      .reduce((maxPriority: number, [,entry]): number => {
        const {cs: {priority}} = entry as {cs: {priority: string}};
        if (Number(priority) > maxPriority) {
          maxPriority = Number(priority);
        }
        return maxPriority;
      }, 0);
    return (max + 1).toString();
  },

  /* get Max Container || Text Shadow Containers Priority or '1' */
  getCrOrItemMaxPriority(crName: string) {
    const crJsn = this.getCrsJSN(crName);
    const max = Object
      .entries(crJsn)
      .filter(([cr]) => cr !== 'cs' && (cr.substring(0, 1) === 'c' || cr.substring(0, 1) === 'i'))
      .reduce((maxPriority: number, [,entry]): number => {
        const {cs: {priority}} = entry as {cs: {priority: string}};
        if (Number(priority) > maxPriority) {
          maxPriority = Number(priority);
        }
        return maxPriority;
      }, 0);
    return (max + 1).toString();
  },

  /* Make Text Shadow Container */
  makeBsTsCr(crName: string, type = 'tsc') {
    const newName: string = <string>this.getNewCrNameS(crName, type);
    const priority = this.getAltCrMaxPriority(crName, type);
    const cr = { [newName]: { cs: { priority } } };
    Data.setJsnDirectly(jsnMrg(getCrLnkJsn(`${crName}`, cr), Data.getJsn()));
    return newName;
  },

  /* Make Gradient Container */
  mkCrGrt(crName: string) {
    const newCrName = this.getNewCrNameS(crName, 'grd');
    if (!newCrName) {
      return;
    }
    const priority = this.getAltCrMaxPriority(crName, 'grd');
    const val = { cs: { priority } };
    Data.setJsnDirectly(jsnMrg(getCrLnkJsn(`${crName}_${newCrName}`, val), Data.getJsn()));
    return newCrName;
  },

  mkCrHvr(jsn = {}, crName = 'c0', mode = 'hvr5000k0') {
    const val = { cs: { t: 'hvr' } };
    return jsnMrg(getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  },

  /** Rem, Validates and Gets back validated JSON construction
  * @return {JSON} 'jsn' - without the value.
  */
  remDefItemAndItsVal(jsn = {}, crName = 'c0', valType = 'type', mode = '') {
    return valType === 'grdLinePos' ? jsn : getValidJsn(this.setCrVal(jsn, crName, valType, '', mode));
  },

  /** Get Containers Value; valType - for example backgroundImage */
  getCrVal(jsn = {}, crName = 'c0', valType = 'type', rwdMode = '') {
    let mode = rwdMode !== '' ? `_rwd${rwdMode}` : '';
    const pre = this.getLastCrNameInDest(crName).substring(0, 3);
    // pre: 'akf'| 'grt'| 'grd'| 'bsc' | 'tsc'
    mode = ((pre in validCrNameStart)) ? '' : mode;
    if (valType === 'priority') {
      mode = '';
    }
    const jsnCrLnk = getCrLnkJsn(`${crName + mode}_cs`);
    return jsn && crName && valType ? getCrValProc(jsn, jsnCrLnk, valType) : '';
  },

  /** Remove cr | item | bsc | tsc */
  remCr(incomeArgCrName: string): void {
    const crName = `${incomeArgCrName}_cs`;
    const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
    const depth = cmnPropArr.length - 1;
    Data.setJsnDirectly(getJsonWithRemovedCr(Data.getJsn(), crName, cmnPropArr, depth));
  },

  /**  Make Container as JSON construction: {cN:{cs:{priority}}} N - num of the container
  * Type ( 'cntnr' | 'mainSlug' | ... )
  */
  mkCr(containerName: string, newCrName: string, crType: string): void {
    const crOrItemMaxPriority = this.getCrOrItemMaxPriority(containerName);
    const crName = `${containerName}_cs`;
    const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
    const depth = cmnPropArr.length - 1;
    const jsn = getJsnWithMadeCr(Data.getJsn(), crName, newCrName, crType, cmnPropArr, depth, crOrItemMaxPriority);
    Data.setJsnDirectly(jsn);
  },

  getFirstCrName() {
    const arr = getArrSortedByPriority(Data.getJsn());
    return arr.length ? arr[0][0] : '';
  },

  getNewCrName(containerName: string, crType = 'c'): string {
    if (crType in validCrNames) {
      const crName = `${containerName}_cs`;
      const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
      const depth = cmnPropArr.length - 1;

      return getNewCrNameProc(Data.getJsn(), crName, crType, cmnPropArr, depth);
    }
    return '';
  },

  getNewCrNameS(crName: string, crPref = 'c') {
    if (crPref in validCrNames) {
      const kDivided = {
        akf: true, grd: true, grt: true, hvr: true,
      };
      const crJSN = this.getCrsJSN(crName);
      const s = crPref + (crPref in kDivided ? `${Model.ob().getRWDMode()}k` : '');
      let fn = 0;

      while (crJSN[s + fn]) {
        fn += 1;
      }
      return s + fn;
    }
    return false;
  },

  /** Retrieve Container's JSON Obj */
  getCrsJSN(crName = 'hdr', json = '') {
    const jsn = json || Data.getJsn();
    const cmnPropArr = this.getCrDestArrWithoutLastEl(`${crName}_cs`);
    return this.getCrJSN(jsn, cmnPropArr, cmnPropArr.length - 1);
  },

  /** Retrieve Container type as String: 'subSlug' */
  getCrType(crName: string, json: any = null) {
    if (! crName) {
      // console.warn('There is no crName');
      return '';
    }
    if (isCrTypeHasValidName(crName)) {
      return crName;
    }
    // const crName = 'c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1-c5-c10-c30-c1'
    //  console.time('getCrType join');
    // const cName = crName.split('-').join('_');
    // console.timeEnd('getCrType join');
    // console.time('getCrType');
    // const ccName = crName.replace(/-/g, '_');
    // console.timeEnd('getCrType');
    const jsn = json || Data.getJsn(); // : json;
    const cmnPropArr = this.getCrDestArrWithoutLastEl(`${crName.replace(/-/g, '_')}_cs`); // pre=='akf'  ||  pre=='grt' || pre=='grd'  || pre=='tsc' ||  pre == 'bsc'
    const pre = (cmnPropArr[cmnPropArr.length - 1]).substring(0, 3);
    let depth = ((pre in validCrNameStart) ? cmnPropArr.length - 2 : cmnPropArr.length - 1);
    if (pre === 'grt' && (cmnPropArr[cmnPropArr.length - 2]).substring(0, 3) === 'grd') {
      depth = cmnPropArr.length - 3;
    }
    const crType = (this.getCrJSN(jsn, cmnPropArr, depth)).cs.type;
    return isCrTypeHasValidName(crType) ? crType : '';
  },

  getCrJSN(json: any = {}, cmnPropArr: any, depth: number, it = 0): any {
    let jsn = json;
    if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
      if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) {
        return jsn[cmnPropArr[it]];
      }
      if (isJsnObj(jsn[cmnPropArr[it]])) {
        jsn = this.getCrJSN(jsn[cmnPropArr[it]], cmnPropArr, depth, Number(it) + 1);
      }
    }
    return jsn;
  },

  getCrNameWithoutNum: (crName: string): string => validateCrName(crName),

  getCrLength: (jsnObj: JSON): number => Object.keys(jsnObj).length,

  /** Retrieve the last/dest Containers name */
  getLastCrNameInDest(crName: string): string {
    const c = crName.split('_');
    return c[c.length - 1];
  },

  /** Retrieve Containers flat array without last el */
  getCrDestArrWithoutLastEl(crName: string): Array<string> {
    return (crName.substring(0, crName.length - this.getLastCrNameInDest(crName).length - 1)).split('_');  // return this.getCrDestWithoutLastEl(crName).split('_');
  },

}

export default Container;
