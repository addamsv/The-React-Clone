/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import ModelInterface from './modelInterface';
import ControllerInterface from '../controllers/controllerInterface';
import SortableModel from './sortableModel';
import ColorPickerModel from './colorPickerModel';
import DataModel from './dataModel';
import ScrWidthModel from './scrWidthModel';

class Model implements ModelInterface {
  private controller: ControllerInterface;

  private sortable: SortableModel;

  private clrpckr: ColorPickerModel;

  private scrWidth: ScrWidthModel;

  private di: DataModel;

  private set: any;

  private jData: any;

  private pID: string;

  rwdArray: Array<string>;

  dfltArray: [];

  exceptRemCrValByDef: any;

  validCrName: Array<string>;

  validCrNameStart: any;

  validCrNames: any;

  styleSheet: string;

  cstmStyleSheet: string;

  intervalmSec = 0;

  animationPlayState: string;

  arrayOfAnimationOriginalDelay: any;

  timerID: string;

  int_timerResult = 0;

  id = 0;

  destID: string;

  jsn: any;

  prvt_str_jsnDeflt: string;

  rwdDflt: string;

  constructor() {
    /* Dependencies */
    this.sortable = new SortableModel();
    this.clrpckr = new ColorPickerModel();
    this.scrWidth = new ScrWidthModel();
    this.di = new DataModel();

    this.set = null;
    this.jData = null;
    this.pID = '';

    /* rwdArray[destID]="5000" */
    this.rwdArray = [];

    this.dfltArray = [];
    /** Varn: the oreder is matter */
    this.exceptRemCrValByDef = { grdLinePos: true };
    this.validCrName = ['cs', 'i', 'c'];
    this.validCrNameStart = {
      akf: true,
      grt: true,
      grd: true,
      tsc: true,
      bsc: true,
      hvr: true,
    };
    this.validCrNames = {
      cs: false,
      hdr: false,
      i: true,
      c: true,
      rwd: true,
      akf: true,
      grt: true,
      grd: true,
      tsc: true,
      bsc: true,
      hvr: true,
    };

    this.styleSheet = '';
    this.cstmStyleSheet = '';

    this.intervalmSec = 0;
    this.animationPlayState = 'stopped';
    this.arrayOfAnimationOriginalDelay = {};
    this.timerID = '';
    this.int_timerResult = 0;

    /* Dinamic ID */
    this.id = 0;
    /* input ID */
    this.destID = '';
    this.jsn = {};
    this.prvt_str_jsnDeflt = '{"hdr":{"cs":{"type":"hdr","ptID":"","postType":"","name":"-","description":"-"}}}';

    this.setModel();

    this.rwdDflt = this.set.rwdDflt;

    console.clear();
    /*
    this.getStyleSheet();
    this.getCstmStyleSheet();
    */
    console.log(`${this.set.names.version}: ${this.set.ATHM_VER} status: ok`);
  }

  private setModel(): void {
    // var jset = document.getElementById(id);//'asvthm-cmzer-sets'
    const destEl = document.querySelectorAll<HTMLInputElement>('.athm');
    let t;

    for (let i = 0, lngth = destEl.length; i < lngth; i += 1) {
      this.set = JSON.parse(destEl[i].getAttribute('data-sets'));
      // destEl[i].removeAttribute('data-sets');
      this.jData = JSON.parse(destEl[i].getAttribute('data-jdata'));
      // destEl[i].removeAttribute('data-jdata');
      t = destEl[i].getAttribute('data-presets');
      if (t) {
        this.jsn = JSON.parse(destEl[i].getAttribute('data-presets'));
        destEl[i].removeAttribute('data-presets');
      }
      destEl[i].value = '';

      this.setDestID(destEl[i].id);

      console.log('checking...');
      if (this.jsn.hdr) {
        this.setPtID();
      } else {
        t = confirm('Not Found Any Elements. Do you want to create?');
        if (t === true) {
          console.log('making elmnts...');
        }
      }
      // this.setJsnFromInputField();
    }
    // destEl[i].remove();

    this.setStyleDirectly('adminmenumain');
    this.setStyleDirectly('wpadminbar');
    this.setStyleDirectly('wpfooter');
    this.setStyleDirectly('wpcontent', 'marginLeft', '0');
    this.setStyleDirectly('wpcontent', 'paddingLeft', '0');
    this.setStyleDirectly('wpbody', 'paddingTop', '0');
    this.setStyleDirectly(document.getElementsByTagName('html')[0], 'paddingTop', '0');
  }

  setStyleDirectly(obj: any, prop = 'display', val = 'none') {
    let ob = obj;
    ob = ((typeof (ob) === 'object') ? ob : document.getElementById(ob));
    if (ob) {
      ob.style[prop] = val;
    }
  }

  // /* Animation Original Delay */
  // getAnimationOriginalDelay(str_cssClassName) {
  //   return this.arrayOfAnimationOriginalDelay[str_cssClassName];
  // }

  // isAnimationOriginalDelayExist(str_cssClassName) {
  //   return (!!this.arrayOfAnimationOriginalDelay[str_cssClassName]);
  // }

  // addAnimationOriginalDelay(str_cssClassName, float_delay) {
  //   this.arrayOfAnimationOriginalDelay[str_cssClassName] = float_delay;
  // }

  // remAllAnimationOriginalDelay() {
  //   this.arrayOfAnimationOriginalDelay = {};
  // }

  // getAnimationPlayState() {
  //   return this.animationPlayState;
  // }

  // pause() {
  //   this.animationPlayState = 'paused';
  // }

  // running() {
  //   this.animationPlayState = 'running';
  // }

  // stop(selector = 'time-line-cursor') {
  //   this.animationPlayState = 'stopped';
  // }

  // /* cstmCssRules ID */
  // getCstmStyleSheet() {
  //   if (this.cstmStyleSheet !== '') {
  //     return this.cstmStyleSheet;
  //   }

  //   const ss = document.styleSheets;
  //   for (let i = 0, ssLngth = ss.length; i < ssLngth; i += 1) {
  //     for (let j = 0, rulesLngth = ss[i].cssRules.length; j < rulesLngth; j += 1) {
  //       if (ss[i].cssRules[j].selectorText === '.sign-of-exst-cstm') { // ss[i].cssRules[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
  //         this.cstmStyleSheet = ss[i];
  //         console.log('cssRules Num was found! sign-of-exst-cstm');
  //         return this.cstmStyleSheet;
  //       }
  //     }
  //   }

  //   return false;
  // }

  // getCstmClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated') {
  //   const
  //     ss = this.getCstmStyleSheet();
  //   if (ss) {
  //     for (let j = 0, rulesLngth = ss.cssRules.length; j < rulesLngth; j += 1) {
  //       if (ss.cssRules[j].selectorText === cssClassName) {
  //         return ss.cssRules[j];
  //       }
  //     }
  //     // ss.addRule( cssClassName ,  str_getDefltCSS(crName) , ss.cssRules.length  );
  //     // return model.getClassRule(cssClassName);
  //   }
  //   return null;
  // }

  // setCstmClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated', rules = '{background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;}') {
  //   const
  //     ss = this.getCstmStyleSheet();
  //   if (ss) {
  //     ss.addRule(cssClassName, rules, ss.cssRules.length);
  //   }
  //   return false;
  // }

  // /* cssRules ID */
  // getStyleSheet() {
  //   if (this.styleSheet !== '') {
  //     return this.styleSheet;
  //   }

  //   const ss = document.styleSheets;
  //   for (let i = 0, ssLngth = ss.length; i < ssLngth; i += 1) {
  //     for (let j = 0, rulesLngth = ss[i].cssRules.length; j < rulesLngth; j += 1) {
  //       if (ss[i].cssRules[j].selectorText === '.sign-of-exst-stl') { // ss[i].cssRules[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
  //         this.styleSheet = ss[i];
  //         console.log('cssRules Num was found! sign-of-exst-stl');
  //         return this.styleSheet;
  //       }
  //     }
  //   }

  //   return false;
  // }

  // getClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated') {
  //   const
  //     ss = this.getStyleSheet();

  //   if (!ss) {
  //     return null;
  //   }
  //   if (this.getRWDMode() === 5000) {
  //     for (let j = 0, rulesLngth = ss.cssRules.length; j < rulesLngth; j += 1) {
  //       if (ss.cssRules[j].selectorText === cssClassName) {
  //         return ss.cssRules[j];
  //       }
  //     }
  //     // ss.addRule( cssClassName ,  str_getDefltCSS(crName) , ss.cssRules.length  );
  //     // return model.getClassRule(cssClassName);
  //   }

  //   return this.getMediaRule(ss, cssClassName);

  //   // return null;
  // }

  // getMediaRule(ss, rule = '.h6-c0-i0-mainSlug') {
  //   for (let j = 0; j < ss.cssRules.length; j += 1) {
  //     if (
  //       ss.cssRules[j].type === window.CSSRule.MEDIA_RULE
  //           && ss.cssRules[j].media.mediaText === `only screen and (max-width: ${this.getRWDMode()}px)`
  //           && ss.cssRules[j].cssRules[0].selectorText === rule) {
  //       // console.log( ss.cssRules[j].cssRules[0] );
  //       return ss.cssRules[j].cssRules[0];
  //     }
  //   }

  //   return null;
  // }

  // getKeyframesRule(rule = 'h684-c1-i0-mainSlug__keyframes') {
  //   const
  //     ss = this.getStyleSheet();

  //   if (!ss) {
  //     return null;
  //   }

  //   for (let j = 0; j < ss.cssRules.length; j += 1) {
  //     if (ss.cssRules[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE
  //       && ss.cssRules[j].name === rule) {
  //       return ss.cssRules[j];
  //     }
  //   }

  //   return null;
  // }

  // void_setClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated', rules = '{background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;}') {
  //   const ss = this.getStyleSheet();

  //   if (!ss) {
  //     return false;
  //   }

  //   if (this.getRWDMode() === 5000) {
  //     ss.addRule(cssClassName, rules, ss.cssRules.length);
  //   } else {
  //     this.array_setMediaRule(ss, cssClassName, rules);
  //   }
  //   return true;
  // }

  // array_setMediaRule(ss, rule = '.h6-c0-i0-mainSlug', rules = '{}') {
  //   for (let j = 0; j < ss.cssRules.length; j += 1) {
  //     if (
  //       ss.cssRules[j].type === window.CSSRule.MEDIA_RULE
  //           && ss.cssRules[j].media.mediaText === `only screen and (max-width: ${this.getRWDMode()}px)`
  //           && ss.cssRules[j].cssRules[0].selectorText === rule) {
  //       ss.cssRules[j].cssRules[0].addRule(
  //         rule, // ! was before => cssClassName,
  //         rules,
  //         ss.cssRules[j].cssRules[0].cssRules.length,
  //       );
  //       console.log(ss.cssRules[j].cssRules[0]);
  //     }
  //   }
  // }

  // /* Menu Dinamic ID */
  // getIDNum(isNew = '') {
  //   if (isNew !== '') {
  //     this.makeNewID();
  //   }
  //   return this.id;
  // }

  // makeNewID() {
  //   this.id += 1;
  // }

  // /* Timer ID */
  // getTimerID() {
  //   return this.timerID;
  // }

  // setTimerID(_timerID: string) {
  //   this.timerID = _timerID;
  // }

  // setTimerResult(int_timerResult: number) {
  //   this.int_timerResult = int_timerResult;
  // }

  // getTimerResult() {
  //   return this.int_timerResult;
  // }

  // /* Dest ID */
  // getDestID() {
  //   // this.getMediaRule();
  //   return this.destID;
  // }

  setDestID(_destID: any) {
    this.destID = _destID;
  }

  // /* piID */
  setPtID() {
    this.pID = this.jsn.hdr.cs.ptID;
    console.log(`pID was found: ${this.pID}`);
  }

  // /* pID */
  // getPID() {
  //   return this.pID;
  // }

  // /* jsn */
  // getJsn() {
  //   return this.jsn;
  // }

  // setJsnDirectly(_jsn: any) {
  //   this.jsn = _jsn;
  // }

  // setJsnFromInputField() {
  //   this.jsn = this.getJsnFromInputField();
  // }

  // /**
  //   * @private
  //   */
  // private getJsnFromInputField() {
  //   let jsn = (<HTMLInputElement>document.getElementById(this.destID)).value;
  //   if (jsn === '') {
  //     jsn = this.prvt_str_jsnDeflt;
  //   }
  //   return JSON.parse(jsn);
  // }

  // /* set RWD mode */
  // setRWDMode(modeName: string, destID: any) {
  //   /* validate modeName: isNum, isModeContainedInsideValidModeArray */
  //   this.rwdArray[destID] = modeName;// 'rwd'+
  // }

  // /* get RWD mode */
  // getRWDMode(id = '') {
  //   let destID: any = id;
  //   if (destID === '') {
  //     destID = this.getDestID();
  //   }
  //   return this.rwdArray[destID] ? this.rwdArray[destID] : this.rwdDflt;// 'rwd'++set['rwdDflt']
  // }

  // draggableElementInit(cssSelector = 'drgbl-elmnt') {
  //   let
  //     ob;
  //   let drgblElmntsArr = [];

  //   drgblElmntsArr = document.querySelectorAll(`.${cssSelector}`);

  //   for (let i = 0, lngth = drgblElmntsArr.length; i < lngth; i += 1) {
  //     ob = drgblElmntsArr[i];
  //     this.drgblElmntProc(ob);
  //   }
  // }

  // /**
  //   * @private
  //   */
  // drgblElmntProc(ob) {
  //   let
  //     tx = 0;
  //   let ty = 0;
  //   let ofsetX = 0;
  //   let ofsetY = 0;

  //   ob.onmousedown = drag_MouseDown;
  //   ob.ontouchstart = drag_tstart;

  //   function drag_MouseDown(e) {
  //     e = e || window.event;
  //     // e.preventDefault();
  //     ofsetX = e.clientX;
  //     ofsetY = e.clientY;
  //     // get the mouse cursor position at startup:
  //     document.onmouseup = closeDrag_Element;
  //     // call a function whenever the cursor moves:
  //     document.onmousemove = element_Drag;
  //   }
  //   function drag_tstart(e) {
  //     console.log('touch is started!');
  //     e = e || window.event;
  //     // e.preventDefault();
  //     ofsetX = e.targetTouches[0].pageX - ob.offsetLeft;
  //     ofsetY = e.targetTouches[0].pageY - ob.offsetTop;
  //     // get the mouse cursor position at startup:
  //     document.ontouchend = closeDrag_Element;
  //     // call a function whenever the cursor moves:
  //     document.ontouchmove = element_tDrag;
  //   }
  //   function element_Drag(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     tx = ofsetX - e.clientX;
  //     ty = ofsetY - e.clientY;
  //     ofsetX = e.clientX;
  //     ofsetY = e.clientY;
  //     ob.style.left = `${ob.offsetLeft - tx}px`;
  //     ob.style.top = `${ob.offsetTop - ty}px`;
  //   }
  //   function element_tDrag(e) {
  //     e = e || window.event;
  //     // e.preventDefault();
  //     tx = e.targetTouches[0].pageX - ofsetX;
  //     ty = e.targetTouches[0].pageY - ofsetY;
  //     ob.style.left = `${tx}px`;
  //     ob.style.top = `${ty}px`;
  //     console.log(`mdl580 touch xy(${tx},${ty})`);
  //   }

  //   function closeDrag_Element() {
  //     console.log('touch is ended!');
  //     document.onmouseup = null;
  //     document.onmousemove = null;
  //     document.ontouchend = null;
  //     document.ontouchmove = null;
  //   }
  // }

  // /**
  //   * @public
  //   */
  // draggableFlat(cssSelector = 'color-stop') {
  //   const drgblElmntsArr = document.querySelectorAll(`.${cssSelector}`);
  //   for (let i = 0, lngth = drgblElmntsArr.length; i < lngth; i += 1) {
  //     this.prvt_void_dragElementFlt(drgblElmntsArr[i]);
  //   }
  // }

  // /**
  //   * @private
  //   */
  // prvt_void_dragElementFlt(elmnt) {
  //   const e = window.event;
  //   e.preventDefault();
  //   let
  //     tx = 0;
  //   const rep = '';
  //   let position = 0;
  //   let obOffsetL = 0;
  //   const pEl = elmnt.parentElement;
  //   let offsetX = 0;

  //   elmnt.onmousedown = dragMouseDown;

  //   function dragMouseDown(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     // get the mouse cursor position at startup:
  //     offsetX = e.clientX;
  //     document.onmouseup = closeDragElement;
  //     // call a function whenever the cursor moves:
  //     document.onmousemove = elementDrag;
  //   }

  //   function elementDrag(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     e.stopImmediatePropagation();
  //     tx = offsetX - e.clientX;
  //     offsetX = e.clientX;
  //     obOffsetL = parseInt(elmnt.offsetLeft - tx);
  //     if (obOffsetL >= 0) {
  //       position = (obOffsetL) * 100 / parseInt(pEl.clientWidth);
  //     }

  //     if (obOffsetL >= parseInt(pEl.clientWidth)) {
  //       position = '100';// pEl.clientWidth+
  //     }
  //     elmnt.style.left = `${position}%`;

  //     const
  //       jsnDataSet = JSON.parse(elmnt.getAttribute('data-gradient-synch'));
  //     const cynchInpEl = document.getElementById(jsnDataSet.synchGrtID);
  //     cynchInpEl.value = position;
  //     cynchInpEl.click();
  //   }

  //   function closeDragElement() {
  //     /* stop moving when mouse button is released: */
  //     document.onmouseup = null;
  //     document.onmousemove = null;
  //   }
  // }

  // /**
  //   * @INTERFACE Set Get Rem Cntnrs Values
  //   *
  //   * @public {JSON} function setCrVal(jsn, dest, valType, val)
  //   * @public {JSON} function remCrVal(jsn, dest, valType)
  //   * @public {String} function getCrVal( jsn, dest, valType )
  //   * @public {JSON} function remCr( jsn, dest )
  //   * @public {JSON} function mkCr( jsn, crName, newCrName, crType )
  //   * @public {String} function getNewCrName( jsn, crName, crType )
  //   * @public {JSON} function getCrsJSN(jsn, crName)
  //   */

  // /**
  //   * @public Sets, and Gets back the JSON construction
  //   *
  //   * @param  {JSON} jsn - JSON that's contained string
  //   * @param  {String} crName - required param and means the param link
  //   * @param  {String} valType - required param last cntnrs link
  //   * @param  {String} val - the value.
  //   *
  //   * @return {JSON} jsn - with the required prop and the value.
  //   */
  // setCrVal(jsn = '', crName = 'c0', valType = 'type', val, mode = '') {
  //   if (jsn === '') {
  //     jsn = this.getJsn();
  //   }
  //   mode = (mode !== '' ? `_rwd${mode}` : mode);
  //   valType = `_cs_${valType}`;
  //   const pre = this.getLastCrNameInDest(crName).substr(0, 3);
  //   // pre === 'akf'  ||  pre === 'grt'  ||  pre === 'grd'  ||  pre === 'bsc'   ||  pre === 'tsc'
  //   if ((pre in this.validCrNameStart)) {
  //     mode = '';
  //   }
  //   return this.prvt_jsnMrg(this.getCrLnkJsn(crName + mode + valType, val), jsn);
  // }

  // /**
  //   * @public Sets, and Gets back the JSON construction
  //   *
  //   * @param  {JSON} jsn - JSON that's contained string
  //   * @param  {String} crName - required param and means the param link
  //   * @param  {String} mode - required param last cntnrs link
  //   * @param  {String|Number} pos - the value.
  //   *
  //   * @return {JSON} jsn Model- with the required prop and the value.
  //   */
  // mkCrAkf(jsn = {}, crName = 'c0', mode = 'akf5000k0', pos = '0') {
  //   const val = `{"cs":{"akfTimelinePos":"${pos}"}}`;// keyframe timeline point/position (%)
  //   return this.prvt_jsnMrg(this.getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  // }

  // mkCrGrt(jsn = {}, crName = 'c0', mode = 'akf5000k0') {
  //   const val = '{"cs":{"grdLinePos":"0"}}';
  //   return this.prvt_jsnMrg(this.getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  // }

  // mkCrHvr(jsn = {}, crName = 'c0', mode = 'hvr5000k0') {
  //   const val = '{"cs":{"t":"hvr"}}';
  //   return this.prvt_jsnMrg(this.getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  // }

  // /**
  //   * @public Rem, Validates and Gets back validated JSON construction
  //   *
  //   * @param  {JSON} jsn - JSON that's contained string
  //   * @param  {String} crName - required param and means the param link
  //   * @param  {String} valType - required param last cntnrs link
  //   *
  //   * @return {JSON} 'jsn' - without the value.
  //   */
  // remDfltItemAndItsVal(jsn = {}, crName = 'c0', valType = 'type', mode = '') {
  //   if (valType in this.exceptRemCrValByDef) {
  //     return jsn;
  //   }
  //   return this.prvt_jsnVldt(this.setCrVal(jsn, crName, valType, '', mode));
  // }

  // /**
  //   * @public Get Cntnrs Value
  //   *
  //   * @param  {JSON} jsn - JSON that's contained the string
  //   * @param  {String} crName - required param and means the param link c0_c0_cr1 type
  //   * @param  {String} valType - forexample backgroundImage
  //   *
  //   * @return {String} cr.val is value of the cr OR empty string if it don't exist.
  //   */
  // getCrVal(jsn = {}, crName = 'c0', valType = 'type', mode = '') {
  //   mode = (mode !== '' ? `_rwd${mode}` : '');
  //   const pre = this.getLastCrNameInDest(crName).substr(0, 3);
  //   // pre === 'akf'  ||  pre === 'grt'  ||  pre === 'grd'  ||  pre === 'bsc'   ||  pre === 'tsc'
  //   if ((pre in this.validCrNameStart)) {
  //     mode = '';
  //   }
  //   const jsnCrLnk = this.getCrLnkJsn(`${crName + mode}_cs`);
  //   return (jsn && crName && valType) ? this.prvt_str_getVal(jsn, jsnCrLnk, valType) : '';
  // }

  // /**
  //   * @public Remove JSON construction, construction etc
  //   *
  //   * @param  {JSON} jsn - JSON that's contained string
  //   * @param  {String} crName - required param and means the param link
  //   * @return {JSON} jsn - without the prop and the value.
  //   */
  // remCr(jsn = {}, crName = 'c0') {
  //   var crName = `${crName}_cs`;
  //   const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
  //   const depth = cmnPropArr.length - 1;
  //   return this.prvt_jsn_remCr(jsn, crName, cmnPropArr, depth);
  // }

  // /**
  //   * @public Make cntnr as JSON construction: {crN:{cs:{}}} N - num of the container
  //   *
  //   * @param  {JSON} jsn - JSON
  //   * @param  {String} crName is where the crN must be created
  //   * @param  {String} newCrName - Cr's Name Where New Cr Will Be Created
  //   * @param  {String} crType - Cntnr's Type
  //   * @return {JSON} new jsn.
  //   */
  // mkCr(jsn = {}, crName = 'c0', newCrName, crType) {
  //   var crName = `${crName}_cs`;
  //   const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
  //   const depth = cmnPropArr.length - 1;
  //   return this.prvt_jsn_mkCr(jsn, crName, newCrName, crType, cmnPropArr, depth);
  // }

  // getNewCrName(jsn = {}, crName = 'c0', crType = 'c') {
  //   if (crType in this.validCrNames) {
  //     var crName = `${crName}_cs`;
  //     const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
  //     const depth = cmnPropArr.length - 1;

  //     return this.prvt_str_getNewCrName(jsn, crName, crType, cmnPropArr, depth);
  //   }
  //   return false;
  // }

  // getNewCrNameS(crName = 'c0', crPref = 'c') {
  //   if (crPref in this.validCrNames) {
  //     const
  //       kDivided = {
  //         akf: true, grd: true, grt: true, hvr: true,
  //       };
  //     const crJSN = this.getCrsJSN(crName);
  //     const s = crPref + (crPref in kDivided ? `${this.getRWDMode()}k` : '');
  //     let fn = 0;

  //     while (crJSN[s + fn]) {
  //       fn += 1;
  //     }
  //     return s + fn;
  //   }
  //   return false;
  // }

  // /**
  //   * @public Retrieve cntnr's JSON Obj
  //   *
  //   * @param  {String} crName - Cntnr's Name
  //   * @param  {JSON|String} jsn - Model
  //   * @return {JSON} Retrieve cntnr's JSON Obj
  //   */
  // getCrsJSN(crName = 'hdr', jsn = '') {
  //   if (jsn === '') {
  //     jsn = this.getJsn();
  //   }
  //   const cmnPropArr = this.getCrDestArrWithoutLastEl(`${crName}_cs`);
  //   return this.prvt_jsn_getCrsJSN(jsn, cmnPropArr, cmnPropArr.length - 1);
  // }

  // /**
  //   * @public Retrieve cntnr type as Strying: 'subSlug'
  //   *
  //   * @param  {JSON} jsn - Model
  //   * @param  {String} crName - is where the crN's type
  //   * @return {String} - type.
  //   */
  // getCrType(jsn = '', crName) {
  //   if (jsn === '') {
  //     jsn = this.getJsn();
  //   }
  //   const cmnPropArr = this.getCrDestArrWithoutLastEl(`${crName}_cs`);
  //   // pre=='akf'  ||  pre=='grt' || pre=='grd'  || pre=='tsc' ||  pre === 'bsc'
  //   const pre = (cmnPropArr[cmnPropArr.length - 1]).substr(0, 3);
  //   let depth = ((pre in this.validCrNameStart) ? cmnPropArr.length - 2 : cmnPropArr.length - 1);
  //   if (pre === 'grt' && (cmnPropArr[cmnPropArr.length - 2]).substr(0, 3) === 'grd') {
  //     depth = cmnPropArr.length - 3;
  //   }
  //   return (this.prvt_jsn_getCrsJSN(jsn, cmnPropArr, depth)).cs.type;
  // }

  // /**
  //   * REALISATION INTERFACE Set Get Rem Cntnrs Values
  //   *
  //   *
  //   */

  // /**
  //   * @private get JSON Obj prtic that cr
  //   *
  //   * @param  {JSON} jsn - Model
  //   * @param  {Array} cmnPropArr - Common Property Array
  //   * @param  {Number} depth - Path's Depth
  //   * @return  {JSON} obj.
  //   */
  // prvt_jsn_getCrsJSN(jsn = {}, cmnPropArr, depth, it = 0) {
  //   if (depth >= it && jsn.hasOwnProperty(cmnPropArr[it])) {
  //     if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) {
  //       return jsn[cmnPropArr[it]];
  //     }
  //     if (this.prvt_isJsnObj(jsn[cmnPropArr[it]])) {
  //       jsn = this.prvt_jsn_getCrsJSN(jsn[cmnPropArr[it]], cmnPropArr, depth, parseInt(it) + 1);
  //     }
  //   }
  //   return jsn;
  // }

  // prvt_jsn_remCr(jsn = {}, crName = 'c0', cmnPropArr, depth, it = 0) {
  //   if (depth >= it && jsn.hasOwnProperty(cmnPropArr[it])) {
  //     if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) {
  //       delete jsn[cmnPropArr[it]];
  //       return jsn;
  //     }
  //     if (this.prvt_isJsnObj(jsn[cmnPropArr[it]])) {
  //       jsn[cmnPropArr[it]] = this.prvt_jsn_remCr(jsn[cmnPropArr[it]], crName, cmnPropArr, depth, parseInt(it) + 1);
  //     }
  //   }
  //   return jsn;
  // }

  // prvt_jsn_mkCr(jsn = {}, crName = 'c0', newCrName, crType, cmnPropArr, depth, it = 0) {
  //   if (depth >= it && jsn.hasOwnProperty(cmnPropArr[it])) {
  //     if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it]) === 'c') {
  //       jsn[cmnPropArr[it]][newCrName] = { cs: { type: crType, priority: '0' } };
  //       return jsn;
  //     }
  //     if (this.prvt_isJsnObj(jsn[cmnPropArr[it]])) {
  //       jsn[cmnPropArr[it]] = this.prvt_jsn_mkCr(jsn[cmnPropArr[it]], crName, newCrName, crType, cmnPropArr, depth, parseInt(it) + 1);
  //     }
  //   }
  //   return jsn;
  // }

  // /**
  //   * @private Get a New cr's Name
  //   *
  //   * @param  {JSON} jsn - Model
  //   * @param  {String} crName - The Path
  //   * @param  {String} crType - The Type of The Value
  //   * @param  {Array} cmnPropArr - Common Property Array
  //   * @param  {Number} depth - Depth of the Path
  //   * @param  {Number} it - iteration counter
  //   * @return {String|Boolean} New cr's Name.
  //   */
  // prvt_str_getNewCrName(jsn = {}, crName = 'c0', crType, cmnPropArr, depth, it = 0) {
  //   if (depth >= it && jsn.hasOwnProperty(cmnPropArr[it])) {
  //     if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) { // this.getCrNameWithoutNum( cmnPropArr[it] ) === 'c'
  //       let fn = 0;
  //       while (jsn[cmnPropArr[it]][crType + fn]) {
  //         fn += 1;
  //       }
  //       return crType + fn;
  //     }
  //     if (this.prvt_isJsnObj(jsn[cmnPropArr[it]])) {
  //       return this.prvt_str_getNewCrName(jsn[cmnPropArr[it]], crName, crType, cmnPropArr, depth, parseInt(it) + 1);
  //     }
  //   }
  //   return false;
  // }

  // /**
  //   * @private Get a cr's value
  //   *
  //   * @param  {JSON} jsn - model
  //   * @param  {JSON} jsnCrLnk - obj of a path
  //   * @param  {String} valType type of the value
  //   * @param  {Boolean} val - value
  //   * @return {String} cr's value.
  //   */
  // prvt_str_getVal(jsn = {}, jsnCrLnk = {}, valType = 'type', val = false) {
  //   if (!val) {
  //     for (const cmnProp in jsnCrLnk) {
  //       // console.log( '->:  '+valType +' '+ cmnProp + ' '+((!jsn.hasOwnProperty(cmnProp))? JSON.stringify(jsn)+'\n\n'+JSON.stringify(jsnCrLnk)+'\n\n' : 'true') ) ;//JSON.stringify(jsnCrLnk)
  //       if (jsn.hasOwnProperty(cmnProp)) {
  //         if (cmnProp === 'cs' && jsn[cmnProp][valType]) {
  //           val = jsn[cmnProp][valType];
  //         } else if (this.prvt_isJsnObj(jsnCrLnk[cmnProp]) && this.prvt_isJsnObj(jsn[cmnProp])) {
  //           val = this.prvt_str_getVal(jsn[cmnProp], jsnCrLnk[cmnProp], valType, val);
  //         }
  //       }
  //     }
  //   }
  //   return val;
  // }

  // /**
  //   * @public Retrieve is the income param contains a number type
  //   *
  //   * @param  {String} num - income param.
  //   * @return {Boolean} type.
  //   */
  // isNum(num = '256') {
  //   return (parseInt(num) === num);// && (typeof num === 'number')
  // }

  // /**
  //   * @public Retrieve cr name was seted in the proper way or FALSE
  //   *
  //   * @param  {String} crName - or 'cr' like type.
  //   * @return {Boolean|String} container's name or FALSE.
  //   */
  // validateCrName(crName) {
  //   if (crName in this.validCrNames) {
  //     return crName;
  //   }

  //   for (const vCr in this.validCrNames) {
  //     if (crName.indexOf(vCr) === 0 && this.validCrNames[vCr] === true) {
  //       if (vCr in this.validCrNameStart) { // vCr=='akf' || vCr=='grt' || vCr=='grd' || vCr=='tsc' || vCr=='bsc'
  //         return vCr;
  //       }
  //       if (this.isNum(crName.slice(vCr.length))) {
  //         return vCr;
  //       }
  //     }
  //   }

  //   return false;
  // }

  // /**
  //   * @public Retrieve the Cntnr's Name
  //   *
  //   * @param  {String} crName - 'cr0' type.
  //   * @return {String} Validated crName
  //   */
  // getCrNameWithoutNum(crName) {
  //   return this.validateCrName(crName);
  // }

  // /**
  //   * @public Retrieve the Cntnr's Size
  //   *
  //   * @param  {JSON} jsnObj - '{c0:{}}' type.
  //   * @return {Number | String} cntnrSize.
  //   */
  // getCrLength(jsnObj) {
  //   return Object.keys(jsnObj).length;
  // }

  // /**
  //   * @public Retrieve the last/dest cntnr name
  //   *
  //   * @param  {String} dest 'c0_cr0_ct' type.
  //   *  c - rootCntnr; 0 - its num (c0);
  //   *  cr -cntnr; tp - type;
  //   *  ct -cntnt;  0 - its num
  //   *  cs - cntrSettings
  //   *  c0_c0 - cntnr 0, that contains the same cntnr c0
  //   *
  //   * @return {String}  last cntnr. For example: 'ct'.
  //   */
  // getLastCrNameInDest(dest = 'c0') {
  //   const c = dest.split('_');
  //   return c[c.length - 1];// gets lastArrayEl and returns its
  // }

  // /**
  //   * @private Retrieve the Dest without last el
  //   *
  //   * @param  String path dest like type path ('c0_c0_cr2').
  //   * @return String dest without last el ('c0_c0').
  //   */
  // getCrDestWithoutLastEl(dest = 'c0') {
  //   return dest.substr(0, dest.length - this.getLastCrNameInDest(dest).length - 1);
  // }

  // /**
  //   * @private Retrieve cntnrs array
  //   *
  //   * @param  {String} path dest like type path ('c0_c0_cr2').
  //   * @return {Array} dest without last el.
  //   */
  // getCrDestArrWithoutLastEl(dest = 'c0') {
  //   return this.getCrDestWithoutLastEl(dest).split('_');
  // }

  // /**
  //   * @public Converts (String) crLink into JSON Obj
  //   *
  //   * @param  {string} dest - link
  //   * @param  {string} val - the value.
  //   * @return  {JSON} 'crLink' - with the required prop and the value.
  //   */
  // getCrLnkJsn(dest = 'c0_cs', val = '') {
  //   const
  //     cmnPropArr = this.getCrDestArrWithoutLastEl(`${dest}_lastEl`);
  //   const depth = cmnPropArr.length - 1;
  //   return this.prvt_jsn_getCrsJSNk(cmnPropArr, depth, val);
  // }

  // /**
  //   * @private Converts String crLink into JSON Obj
  //   *
  //   * @param  {Array} cmnPropArr - Link
  //   * @param  {Number} depth - The Depth of the Link.
  //   * @param  {String|Number} val - The Value.
  //   * @param  {Number} it - Iterations of the Recursion.
  //   * @param  {JSON} jsn - Ret Object.
  //   * @return  {JSON} crLink
  //   */
  // prvt_jsn_getCrsJSNk(cmnPropArr, depth, val = '', it = 0, jsn = {}) {
  //   jsn[cmnPropArr[it]] = depth === it
  //     ? val
  //     : this.prvt_jsn_getCrsJSNk(cmnPropArr, depth, val, parseInt(it, 10) + 1);
  //   return jsn;
  // }

  // prvt_isJsnObj(obj) {
  //   return typeof obj === 'object' && obj.constructor === Object;
  // }

  // /**
  //   * @private Validate JSON obj
  //   *
  //   * @param  {JSON} jsn
  //   * @return {JSON}  valdated JSON obj.
  //   */
  // prvt_jsnVldt(jsn) {
  //   for (const prop in jsn) {
  //     if (jsn.hasOwnProperty(prop)) {
  //       if (jsn[prop] === '') {
  //         delete jsn[prop];
  //       } else if (this.prvt_isJsnObj(jsn[prop])) {
  //         jsn[prop] = this.prvt_jsnVldt(jsn[prop]);
  //       }
  //     }
  //   }
  //   return jsn;
  // }

  // /**
  //   * Merge two incoming JSON
  //   *
  //   * @param  {JSON} jsn
  //   * @param  {JSON} jsnIn
  //   * @returns {JSON} merged JSON obj.
  //   */
  // prvt_jsnMrg(jsn, jsnIn) {
  //   for (const cmnProp in jsnIn) {
  //     if (jsnIn.hasOwnProperty(cmnProp)) {
  //       if (!jsn.hasOwnProperty(cmnProp)) {
  //         jsn[cmnProp] = jsnIn[cmnProp];
  //       } else if (this.prvt_isJsnObj(jsn[cmnProp]) && this.prvt_isJsnObj(jsnIn[cmnProp])) {
  //         jsn[cmnProp] = this.prvt_jsnMrg(jsn[cmnProp], jsnIn[cmnProp]);
  //       }
  //     }
  //   }
  //   return jsn;
  // }

  // /**
  //   * INTERFACE Get JSON ACS by Priority
  //   *
  //   * public function getRootJsnAscByPriority(jsn)
  //   * public function getAllJsnAscByPrty(jsn)
  //   *
  //   *
  //   */

  // public getRootJsnAscByPriority(jsn: any) {
  //   return this.procOrder(jsn);
  // }

  // /**
  //   * REALISATION INTERFACE Get JSON ACS by Priority
  //   *
  //   *
  //   */

  // private isPriorityCrExist(cntnr) {
  //   return cntnr && cntnr.cs && cntnr.cs.priority;
  // }

  // private getCrCsPriorityValue(cr) {
  //   return this.isPriorityCrExist(cr) ? cr.cs.priority : false;
  // }

  // private getCrWithoutPriority(data, crName, stackWithoutPriority, maxPriority, cr = '') {
  //   cr = this.getCrCsPriorityValue(data);
  //   if (crName === 'cs' || !cr || cr === '' || Number(cr) <= 0 || cr > maxPriority) {
  //     stackWithoutPriority[crName] = data;
  //   }
  //   return stackWithoutPriority;
  // }

  // private getProperStack(data, stack, curPriority, cr = '') {
  //   for (const iCmp in data) {
  //     cr = this.getCrCsPriorityValue(data[iCmp]);
  //     if (cr && cr === curPriority) {
  //       stack[iCmp] = data[iCmp];
  //     }
  //   }
  //   return stack;
  // }

  /** The Lost Prty's developing here */
  // private getStackAscByPrty(jsn, curPrty = 1, outJsn = {}, cr = '') {
  //   for (const lCr in jsn) {
  //     cr = this.getCrCsPriorityValue(jsn[lCr]);
  //     if (cr && cr <= curPrty) {
  //       outJsn[lCr] = jsn[lCr];
  //     } else {
  //       curPrty = cr;
  //     }
  //   }
  //   return outJsn;
  // }

  // private addAnotherStackEl(stack, stackWithoutPriority) {
  //   /* needs to asc by been lost priority */
  //   for (const s in stackWithoutPriority) {
  //     stack[s] = stackWithoutPriority[s];
  //   }
  //   return stack;
  // }

  // private getOrderedArr(data, maxPriority = 200) {
  //   let stack = {}; let stackWithoutPriority = {}; let
  //     curPriority = 1;

  //   for (const cntnr in data) {
  //     stackWithoutPriority = this.getCrWithoutPriority(data[cntnr], cntnr, stackWithoutPriority, maxPriority);
  //     stack = this.getProperStack(data, stack, curPriority);
  //     curPriority++;
  //   }

  //   return this.addAnotherStackEl(stack, stackWithoutPriority);
  // }

  // private getOrderedJsn(jsn: any, rootOnlyFlag = true) {
  //   for (const prop in jsn) {
  //     if (this.getCrNameWithoutNum(prop) === 'c') {
  //       jsn[prop] = this.getOrderedArr(jsn[prop], this.getCrLength(jsn[prop]));
  //       if (this.prvt_isJsnObj(jsn[prop]) && !rootOnlyFlag) {
  //         jsn[prop] = this.getOrderedJsn(jsn[prop]);
  //       }
  //     }
  //   }
  //   return jsn;
  // }

  // private addJsnRootEl(jsn: any) {
  //   const j: any = { c0: jsn || {} };
  //   return j;
  // }

  // private remJsnRootEl(jsn: any) {
  //   return jsn ? jsn.c0 : {};
  // }

  // private procOrder(jsn: any, rootOnlyFlag = true) {
  //   return this.remJsnRootEl(
  //     this.getOrderedJsn(this.addJsnRootEl(jsn), rootOnlyFlag),
  //   );
  // }
}

export { ModelInterface, Model };
