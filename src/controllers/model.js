/* eslint-disable class-methods-use-this */
import ColorPickerModel from './colorPickerModel.js';
// import ColorPickerModel from '../models/colorPickerModel';
import LayerSortModel from './layerSortModel.js';
import ScreenWidthModel from './screenWidthModel.js';
import DataModel from './dataModel.js';
import AnimationModel from './animationModel.js';
import WordPressMediaModel from './wordPressMediaModel.js';

/**
 * Customizer Model
 *
 * Examples and documentation at: http://
 * Copyright (c) 2017-2018 S.Adamovich
 * http://   /license.html
 *
 *
 * Version: 1.0.0 (10-JUL-2018/21)
 */
class Model {
  constructor() {
    /* Dependencies */
    this.sortable = new LayerSortModel();
    this.clrpckr = new ColorPickerModel();
    this.scrWidth = new ScreenWidthModel();
    this.di = new DataModel();
    this.animation = new AnimationModel();
    this.wpMedia = new WordPressMediaModel();

    this.set = null;
    this.jData = null;
    this.pID = '';

    /**  rwdArray[destID]="5000" */
    this.rwdArray = [];

    this.defaultArray = [];
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
    this.timerResult = 0;

    /* Dynamic ID */
    this.id = 0;
    /* input ID */
    this.destID = '';
    this.jsn = {};
    this.jsonDefault = '{"hdr":{"cs":{"type":"hdr","ptID":"","postType":"","name":"-","description":"-"}}}';

    this.setModel();

    this.rwdDflt = this.set.rwdDflt;
    // console.clear();
    this.getStyleSheet();
    this.getCstmStyleSheet();

    console.log(`${this.set.names.version}: ${this.set.ATHM_VER} status: ok`);
  }

  thread() {
    /**
    * Can I actually work with some kind of Threads?
    */
    if (typeof (Worker) !== 'undefined') {
      // console.log('Threads are allowed');
      // const w = new Worker(`${mdl.set.scriptURL}/scriptW.js`);
      // w.addEventListener(
      //   'message',
      //   (e) => console.log(e.data),
      //   false
      // );
      // w.postMessage({ cmd: "average", data: [1, 2, 3, 4] });
    }
  }

  /* Animation Original Delay */
  getAnimationOriginalDelay(cssClassName) {
    return this.arrayOfAnimationOriginalDelay[cssClassName];
  }

  isAnimationOriginalDelayExist(cssClassName) {
    if (this.arrayOfAnimationOriginalDelay[cssClassName]) {
      return true;
    }
    return false;
  }

  addAnimationOriginalDelay(cssClassName, delay) {
    this.arrayOfAnimationOriginalDelay[cssClassName] = delay;
  }

  remAllAnimationOriginalDelay() {
    this.arrayOfAnimationOriginalDelay = {};
  }

  getAnimationPlayState() {
    return this.animationPlayState;
  }

  pause() {
    this.animationPlayState = 'paused';
  }

  running() {
    this.animationPlayState = 'running';
  }

  stop() {
    // var
    //  cssObj;
    // cssObj = this.getCstmClassRule('.'+selector+'.animated');
    // cssObj.style.animationDelay = '-' + document.getElementById('time').value + 's';
    // cssObj = this.getCstmClassRule('.'+selector);
    // cssObj.style.left = perc+'%';
    this.animationPlayState = 'stopped';
  }

  /* CustomStyleSheet */
  getCstmStyleSheet() {
    if (this.cstmStyleSheet !== '') {
      return this.cstmStyleSheet;
    }
    const ss = document.styleSheets;
    for (let i = 0, ssLen = ss.length; i < ssLen; i += 1) {
      for (let j = 0, rulesLen = ss[i].cssRules.length; j < rulesLen; j += 1) {
        if (ss[i].cssRules[j].selectorText === '.sign-of-exst-cstm') { // window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
          this.cstmStyleSheet = ss[i];
          console.log('cssRules Num was found! sign-of-exst-cstm');
          return this.cstmStyleSheet;
        }
      }
    }
    console.log('cssRules Num was NOT found! sign-of-exst-cstm');
    return false;
  }

  getCstmClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated') {
    const ss = this.getCstmStyleSheet();
    if (ss) {
      for (let j = 0, rulesLen = ss.cssRules.length; j < rulesLen; j += 1) {
        if (ss.cssRules[j].selectorText === cssClassName) {
          return ss.cssRules[j];
        }
      }
    }
    return null;
  }

  setCstmClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated', rules = '{background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;}') {
    const ss = this.getCstmStyleSheet();
    if (ss) {
      ss.addRule(cssClassName, rules, ss.cssRules.length);
    }
    return false;
  }

  /* StyleSheet */
  getStyleSheet() {
    if (this.styleSheet !== '') {
      return this.styleSheet;
    }
    const ss = document.styleSheets;
    for (let i = 0, ssLen = ss.length; i < ssLen; i += 1) {
      for (let j = 0, rulesLen = ss[i].cssRules.length; j < rulesLen; j += 1) {
        if (ss[i].cssRules[j].selectorText === '.sign-of-exst-stl') { // ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
          this.styleSheet = ss[i];
          console.log('cssRules Num was found! sign-of-exst-stl');
          return this.styleSheet;
        }
      }
    }
    console.log('cssRules Num was NOT found! sign-of-exst-stl');
    this.styleSheet = this.getCstmStyleSheet();
    return this.getCstmStyleSheet();
  }

  getClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated') {
    const ss = this.getStyleSheet();
    if (!ss) {
      return null;
    }
    if (this.getRWDMode() === '5000') {
      for (let j = 0, rulesLen = ss.cssRules.length; j < rulesLen; j += 1) {
        if (ss.cssRules[j].selectorText === cssClassName) {
          return ss.cssRules[j];
        }
      }
    }

    return this.getMediaRule(ss, cssClassName);

    // return null;
  }

  getMediaRule(ss, rule = '.h6-c0-i0-mainSlug') {
    for (let j = 0; j < ss.cssRules.length; j += 1) {
      if (
        ss.cssRules[j].type === window.CSSRule.MEDIA_RULE
        && ss.cssRules[j].media.mediaText === `only screen and (max-width: ${this.getRWDMode()}px)`
        && ss.cssRules[j].cssRules[0].selectorText === rule
      ) {
        // console.log( ss.cssRules[j].cssRules[0] );
        return ss.cssRules[j].cssRules[0];
      }
    }

    return null;
  }

  getKeyframesRule(rule = 'h684-c1-i0-mainSlug__keyframes') {
    const ss = this.getStyleSheet();
    if (!ss) {
      return null;
    }
    for (let j = 0; j < ss.cssRules.length; j += 1) {
      // ss.cssRules[j].type === window.CSSRule.KEYFRAMES_RULE
      if (ss.cssRules[j].name === rule) {
        return ss.cssRules[j];
      }
    }
    return null;
  }

  setClassRule(cssClassName = '.header-c0-cr0-mainSlug.animated', rules = '{background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;}') {
    const ss = this.getStyleSheet();
    if (!ss) {
      return false;
    }
    if (this.getRWDMode() === '5000') {
      ss.addRule(cssClassName, rules, ss.cssRules.length);
    } else {
      this.setMediaRule(ss, cssClassName, rules);
    }
    return true;
  }

  setMediaRule(ss, rule = '.h6-c0-i0-mainSlug', rules = '{}') {
    for (let j = 0; j < ss.cssRules.length; j += 1) {
      // ss.cssRules[j].type == window.CSSRule.MEDIA_RULE
      if (
        ss.cssRules[j].media.mediaText === `only screen and (max-width: ${this.getRWDMode()}px)`
        && ss.cssRules[j].cssRules[0].selectorText === rule
      ) {
        ss.cssRules[j]
          .cssRules[0]
          .addRule(rule, rules, ss.cssRules[j].cssRules[0].cssRules.length);
        // console.log(ss.cssRules[j].cssRules[0]);
      }
    }
  }

  /* Menu Dynamic ID */
  getIDNum(isNew = '') {
    if (isNew !== '') {
      this.makeNewID();
    }
    return this.id;
  }

  makeNewID() {
    this.id += 1;
  }

  /* Timer ID */
  getTimerID() {
    return this.timerID;
  }

  /**
  * @param {int} id
  */
  setTimerID(id) {
    this.timerID = id;
  }

  /**
  * @param {number} timerResult
  * @returns {void}
  */
  setTimerResult(timerResult) {
    this.timerResult = timerResult;
  }

  /**
  * @returns {number}
  */
  getTimerResult() {
    return this.timerResult;
  }

  /**
  *  Dest ID
  * @returns {string}
  */
  getDestID() {
    return this.destID;
  }

  /**
  * @param {string}
  */
  setDestID(id) {
    this.destID = id;
  }

  /* piID */
  setPtID() {
    this.pID = this.jsn.hdr.cs.ptID;
    console.log(this.pID ? `pID was found: ${this.pID}` : 'pID was NOT found');
  }

  /* pID */
  getPID() {
    return this.pID;
  }

  /* jsn */
  getJsn() {
    return this.jsn;
  }

  /**
  * @param {JSON} json
  */
  setJsnDirectly(json) {
    this.jsn = json;
  }

  setJsnFromInputField() {
    this.jsn = this.getJsnFromInputField();
  }

  /**
  * @private
  */
  getJsnFromInputField() {
    const { value } = document.getElementById(this.destID);
    const jsn = value || this.jsonDefault;
    return JSON.parse(jsn);
  }

  /**
  * @private
  *
  * @returns void
  */
  setModel() {
    const destEl = document.querySelectorAll('.athm');
    let t;

    for (let i = 0, len = destEl.length; i < len; i += 1) {
      this.set = JSON.parse(destEl[i].getAttribute('data-sets'));
      destEl[i].removeAttribute('data-sets');
      this.jData = JSON.parse(destEl[i].getAttribute('data-jdata'));
      destEl[i].removeAttribute('data-jdata');
      t = destEl[i].getAttribute('data-presets');
      if (t) {
        this.jsn = JSON.parse(destEl[i].getAttribute('data-presets'));
        destEl[i].removeAttribute('data-presets');
      }
      destEl[i].value = '';

      this.setDestID(destEl[i].id);

      if (this.jsn.hdr) {
        this.setPtID();
      } else if (window.confirm('Not Found Any Elements. Do you want to create?')) {
        console.log('making elements...');
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

  setStyleDirectly(obj, prop = 'display', val = 'none') {
    const ob = typeof (obj) === 'object' ? obj : document.getElementById(obj);
    if (ob) {
      ob.style[prop] = val;
    }
  }

  /* set RWD mode */
  setRWDMode(modeName, destID) {
    /* validate modeName: isNum, isModeContainedInsideValidModeArray */
    this.rwdArray[destID] = modeName;
  }

  /**
  * get RWD mode
  * @param {string} destinationID
  * @returns {string} RWD mode
  */
  getRWDMode(destinationID = '') {
    const destID = destinationID || this.getDestID();
    // let destID = destinationID;
    // if (destID === '') {
    //   destID = this.getDestID();
    // }
    return this.rwdArray[destID] ? this.rwdArray[destID] : this.rwdDflt;
  }

  draggableElementInit(cssSelector = 'drgbl-elmnt') {
    let ob;
    const objArr = document.querySelectorAll(`.${cssSelector}`);

    for (let i = 0, len = objArr.length; i < len; i += 1) {
      ob = objArr[i];
      this.draggableElementProc(ob);
    }
  }

  /**
  * @private
 */
  draggableElementProc(object) {
    const ob = object;
    let tx = 0;
    let ty = 0;
    let offsetX = 0;
    let offsetY = 0;

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }

    function elementTouchDrag(ev) {
      const e = ev || window.event;
      // e.preventDefault();
      tx = e.targetTouches[0].pageX - offsetX;
      ty = e.targetTouches[0].pageY - offsetY;
      ob.style.left = `${tx}px`;
      ob.style.top = `${ty}px`;
      // console.log(`mdl580 touch xy(${tx},${ty})`);
    }

    function dragTouchStart(ev) {
      // console.log('touch is started!');
      const e = ev || window.event;
      // e.preventDefault();
      offsetX = e.targetTouches[0].pageX - ob.offsetLeft;
      offsetY = e.targetTouches[0].pageY - ob.offsetTop;
      // get the mouse cursor position at startup:
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.ontouchmove = elementTouchDrag;
    }

    function elementDrag(ev) {
      const e = ev || window.event;
      e.preventDefault();
      tx = offsetX - e.clientX;
      ty = offsetY - e.clientY;
      offsetX = e.clientX;
      offsetY = e.clientY;
      ob.style.left = `${ob.offsetLeft - tx}px`;
      ob.style.top = `${ob.offsetTop - ty}px`;
    }

    function dragMouseDown(ev) {
      const e = ev || window.event;
      // e.preventDefault();
      offsetX = e.clientX;
      offsetY = e.clientY;
      // get the mouse cursor position at startup:
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    ob.onmousedown = dragMouseDown;
    ob.ontouchstart = dragTouchStart;
    // ob.addEventListener("click", function(e){
    // });

    // ob.addEventListener("mousedown", function(e){
    //   e = e || window.event;
    //   e.stopImmediatePropagation();
    //     this.flag = true;
    //     this.offsetX = e.clientX;
    //     this.offsetY = e.clientY;
    // });

    // ob.addEventListener("mouseup", function(e){
    //   this.flag = false;
    //   this.offsetX = 0;
    //   this.offsetY = 0;
    // });
    // ob.addEventListener("mousemove", function(e){
    //   if(this.flag){
    //       e = e || window.event;
    //       e.stopImmediatePropagation();
    //     this.tx = this.offsetX - e.clientX;
    //     this.ty = this.offsetY - e.clientY;
    //     this.offsetX = e.clientX;
    //     this.offsetY = e.clientY;
    //     this.style.left = (this.offsetLeft - this.tx) + "px";
    //     this.style.top = (this.offsetTop - this.ty) + "px";
    //   }
    // });
    // ob.addEventListener("mouseleave", function(e){
    // });

    // ob.addEventListener("touchstart", function(e){
    //   e = e || window.event;
    //   e.stopImmediatePropagation();
    //     this.flag = true;
    //     this.clickFlag = true;
    //   this.offsetX = e.targetTouches[0].pageX - this.offsetLeft;
    //   this.offsetY = e.targetTouches[0].pageY - this.offsetTop;
    // });
    // ob.addEventListener("touchend", function(e){
    //     e = e || window.event;
    //     e.stopImmediatePropagation();
    //   this.flag = false;
    //   this.offsetX = 0;
    //   this.offsetY = 0;
    //   //this.clickFlag=((this.clickFlag==true)?false:true);
    //   if(this.clickFlag==true){
    //     //console.log('was clicking by fingertips on '+this.tagName);
    //     this.clickFlag=false;
    //     //this.change();
    //   }
    // });
    // ob.addEventListener("touchmove", function(e){
    //     e = e || window.event;
    //     e.stopImmediatePropagation();
    //   this.tx = e.targetTouches[0].pageX - this.offsetX;
    //   this.ty = e.targetTouches[0].pageY - this.offsetY;
    //   this.style.left = this.tx + 'px';
    //   this.style.top = this.ty + 'px';
    //   this.clickFlag=false;
    // });
  }

  /**
  * @public
  */
  draggableFlat(cssSelector = 'color-stop') {
    const objArr = document.querySelectorAll(`.${cssSelector}`);
    for (let i = 0, len = objArr.length; i < len; i += 1) {
      this.dragElementFlt(objArr[i]);
    }
  }

  /**
  * @private
  */
  dragElementFlt(el) {
    const element = el;
    const e = window.event;
    e.preventDefault();
    let tx = 0;
    let position = 0;
    let obOffsetL = 0;
    const pEl = element.parentElement;
    let offsetX = 0;

    function elementDrag(ev) {
      const dragEv = ev || window.event;
      dragEv.preventDefault();
      dragEv.stopImmediatePropagation();
      tx = offsetX - dragEv.clientX;
      offsetX = dragEv.clientX;
      obOffsetL = parseInt(element.offsetLeft - tx, 10);
      if (obOffsetL >= 0) {
        position = (obOffsetL * 100) / parseInt(pEl.clientWidth, 10);
      }

      if (obOffsetL >= parseInt(pEl.clientWidth, 10)) {
        position = '100'; // pEl.clientWidth+
      }
      element.style.left = `${position}%`;

      const jsnDataSet = JSON.parse(element.getAttribute('data-gradient-synch'));
      const synchInpEl = document.getElementById(jsnDataSet.synchGrtID);

      synchInpEl.value = position;
      synchInpEl.click();
    }

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function dragMouseDown(ev) {
      const mouseEvent = ev || window.event;
      mouseEvent.preventDefault();
      // get the mouse cursor position at startup:
      offsetX = mouseEvent.clientX;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    element.onmousedown = dragMouseDown;
  }

  // void_draggableCursorFlat(intervalMSec=''){
  //     arr = document.querySelectorAll("."+cssSelector);cssSelector="time-line-cursor"
  //   for (var i = 0, len = arr.length; i < len; i++) {
  //     this.dragCursorFlt(arr[i]);
  //   }
  // }
  // dragCursorFlt(el) {
  //   if(intervalMSec){
  //     this.intervalMSec = intervalMSec ;// 1000
  //   }
  //   var
  //    el = document.getElementById('time-line-cursor'),
  //     e = window.event,
  //     pos1 = 0,
  //     rep='',
  //     tPos=0,
  //     cPos=0,
  //     pEl = el.parentElement,
  //     ops3 = 0,
  //     intervalMSec = this.intervalMSec,
  //     obResult,
  //     state = this.animationPlayState,
  //     cssObjA = this.getCstmClassRule('.time-line-cursor.animated'),
  //     cssObj = this.getCstmClassRule('.time-line-cursor');

  //   console.log(state);

  //   e.preventDefault();
  //   el.onmousedown = dragMouseDown;

  //   function dragMouseDown(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     // get the mouse cursor position at startup:
  //     pos3 = e.clientX;
  //     document.onmouseup = closeDragElement;
  //     // call a function whenever the cursor moves:
  //     document.onmousemove = elementDrag;
  //   }

  //   function elementDrag(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     // calculate the new cursor position:
  //     pos1 = pos3 - e.clientX;
  //     //pos2 = pos4 - e.clientY;
  //     pos3 = e.clientX;
  //     cPos = parseInt(el.offsetLeft - pos1);
  //     if(cPos>=0){
  //       tPos = cPos*100/parseInt(pEl.clientWidth);//pEl.x + pEl.x +
  //     }
  //     if(cPos>=parseInt(pEl.clientWidth)){
  //       tPos = "100";
  //     }

  //   obResult = tPos * intervalMSec/(100*1000);
  //   document.getElementById('time').value = obResult;

  //   console.log(state);

  //   if(state != 'paused'){
  //     cssObjA.style.animationDelay = '-' + obResult + 's';//document.getElementById('time').value
  //     cssObj.style.left = tPos+'%';//el.style.left = tPos + "%";
  //     this.timerResult = parseInt(obResult * 1000);
  //   }
  //   else{
  //     console.log(this.getTimerResult() + ' ' + tPos + ' -' + obResult + 's');
  //     cssObjA.style.animationDelay = '-' + obResult + 's';
  //     var o = document.getElementById('time');
  //     o.valueCssObj = mdl.getCstmClassRule('.time-line-cursor.animated');
  //     cssObjA.style.left = tPos+'%';//cssObj = mdl.getCstmClassRule('.time-line-cursor');
  //     this.timerResult = parseInt(obResult * 1000);
  //   }

  //   //console.log(cssObjA);
  //   // var
  //   //   jsnDataSet  = JSON.parse( el.getAttribute('data-gradient-synch') ),
  //   //   synchInpEl   = document.getElementById(jsnDataSet.synchGrtID);
  //   //   synchInpEl.value = tPos;
  //   //   synchInpEl.click();
  //   //console.log(rep);
  //   }

  //   function closeDragElement() {
  //     /* stop moving when mouse button is released:*/
  //     document.onmouseup = null;
  //     document.onmousemove = null;
  //   }
  // }

  /**
  *   @INTERFACE Set Get Rem Containers Values
  *
  *  @public {JSON}   function setCrVal(jsn, dest, valType, val)
  *  @public {JSON}   function remCrVal(jsn, dest, valType)
  *  @public {String} function getCrVal( jsn, dest, valType )
  *  @public {JSON}   function remCr( jsn, dest )
  *  @public {JSON}   function mkCr( jsn, crName, newCrName, crType )
  *  @public {String} function getNewCrName( jsn, crName, crType )
  *  @public {JSON}   function getCrsJSN(jsn, crName)
  */

  /**
  * @public  Sets, and Gets back the JSON construction
  *
  * @param  {JSON} jsn - JSON that's contained string
  * @param  {String} crName - required param and means the param link
  * @param  {String} valType - required param last Containers link
  * @param  {String} val - the value.
  * @param  {String} rwdMode - the rwdMode.
  *
  * @return {JSON} jsn - with the required prop and the value.
  */
  setCrVal(json = null, crName = 'c0', valType = 'type', val, rwdMode = '') {
    const jsn = json || this.getJsn();
    // const jsn = json === '' ? this.getJsn() : json;
    const pre = this.getLastCrNameInDest(crName).substr(0, 3);
    let mode = rwdMode !== '' ? `_rwd${rwdMode}` : rwdMode;
    // pre == 'akf'  ||  pre == 'grt'  ||  pre == 'grd'  ||  pre == 'bsc'   ||  pre == 'tsc'
    mode = ((pre in this.validCrNameStart)) ? '' : mode;
    return this.jsnMrg(this.getCrLnkJsn(`${crName}${mode}_cs_${valType}`, val), jsn);
  }

  /**
  * @public  Sets, and Gets back the JSON construction
  *
  * @param  {JSON} jsn - JSON that's contained string
  * @param  {String} crName - required param and means the param link
  * @param  {String} mode - required param last Containers link
  * @param  {String|Number} pos - the value.
  *
  * @return {JSON} jsn Model- with the required prop and the value.
  */
  mkCrAkf(jsn = {}, crName = 'c0', mode = 'akf5000k0', pos = '0') { // valType='type', val='Containers', _akf5000k0
    // var s = 'akf'+mode+'k';
    // var fn = 0;
    // var crJSN = this.getCrsJSN(jsn, crName);
    // while(crJSN[s+fn]){
    //  fn++;
    // }
    // mode = '_'+s+fn;
    // keyframe timeline point/position (%)
    const val = JSON.parse(`{"cs":{"akfTimelinePos":"${pos}"}}`);
    return this.jsnMrg(this.getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  }

  mkCrGrt(jsn = {}, crName = 'c0', mode = 'akf5000k0') {
    const val = JSON.parse('{"cs":{"grdLinePos":"0"}}');
    return this.jsnMrg(this.getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  }

  mkCrHvr(jsn = {}, crName = 'c0', mode = 'hvr5000k0') {
    const val = JSON.parse('{"cs":{"t":"hvr"}}');
    return this.jsnMrg(this.getCrLnkJsn(`${crName}_${mode}`, val), jsn);
  }

  /**
  * @public  Rem, Validates and Gets back validated JSON construction
  *
  * @param  {JSON} jsn - JSON that's contained string
  * @param  {String} crName - required param and means the param link
  * @param  {String} valType - required param last Containers link
  *
  * @return {JSON} 'jsn' - without the value.
  */
  remDefItemAndItsVal(jsn = {}, crName = 'c0', valType = 'type', mode = '') {
    return (valType in this.exceptRemCrValByDef) ? jsn : this.getValidJsn(this.setCrVal(jsn, crName, valType, '', mode));
  }

  /**
  * @public  Get Containers Value
  *
  * @param  {JSON} jsn - JSON that's contained the string
  * @param  {String} crName - required param and means the param link c0_c0_cr1 type
  * @param  {String} valType - for example backgroundImage
  *
  * @return {String} cr.val is value of the cr OR empty string if it don't exist.
  */
  getCrVal(jsn = {}, crName = 'c0', valType = 'type', rwdMode = '') {
    let mode = rwdMode !== '' ? `_rwd${rwdMode}` : '';
    const pre = this.getLastCrNameInDest(crName).substr(0, 3);
    // pre == 'akf'  ||  pre == 'grt'  ||  pre == 'grd'  ||  pre == 'bsc'   ||  pre == 'tsc'
    mode = ((pre in this.validCrNameStart)) ? '' : mode;
    const jsnCrLnk = this.getCrLnkJsn(`${crName + mode}_cs`);
    return jsn && crName && valType ? this.getCrValProc(jsn, jsnCrLnk, valType) : '';
  }

  /**
  * @public  Remove JSON construction, construction etc
  *
  * @param  {JSON} jsn - JSON that's contained string
  * @param  {String} crName - required param and means the param link
  * @return {JSON} jsn - without the prop and the value.
  */
  remCr(jsn = {}, incomeArgCrName = 'c0') {
    const crName = `${incomeArgCrName}_cs`;
    const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
    const depth = cmnPropArr.length - 1;
    return this.getJsonWithRemovedCr(jsn, crName, cmnPropArr, depth);
  }

  /**
  * @public  Make Containers as JSON construction: {crN:{cs:{}}} N - num of the container
  *
  * @param  {JSON} jsn - JSON
  * @param  {String} crName is where the crN must be created
  * @param  {String} newCrName - Cr's Name Where New Cr Will Be Created
  * @param  {String} crType - Container's Type
  * @return {JSON} new jsn.
  */
  mkCr(jsn = {}, containerName = 'c0', newCrName, crType) {
    const crName = `${containerName}_cs`;
    const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
    const depth = cmnPropArr.length - 1;
    return this.getJsnWithMadeCr(jsn, crName, newCrName, crType, cmnPropArr, depth);
  }

  getNewCrName(jsn = {}, containerName = 'c0', crType = 'c') {
    if (crType in this.validCrNames) {
      const crName = `${containerName}_cs`;
      const cmnPropArr = this.getCrDestArrWithoutLastEl(crName);
      const depth = cmnPropArr.length - 1;

      return this.getNewCrNameProc(jsn, crName, crType, cmnPropArr, depth);
    }
    return false;
  }

  getNewCrNameS(crName = 'c0', crPref = 'c') {
    if (crPref in this.validCrNames) {
      const kDivided = {
        akf: true, grd: true, grt: true, hvr: true,
      };
      const crJSN = this.getCrsJSN(crName);
      const s = crPref + (crPref in kDivided ? `${this.getRWDMode()}k` : '');
      let fn = 0;

      while (crJSN[s + fn]) {
        fn += 1;
      }
      return s + fn;
    }
    return false;
  }

  /**
  * @public  Retrieve Container's JSON Obj
  *
  * @param  {String} crName - Container's Name
  * @param  {JSON|String} jsn - Model
  * @return {JSON} Retrieve Container's JSON Obj
  */
  getCrsJSN(crName = 'hdr', json = '') {
    // const jsn = (json === '') ? this.getJsn() : json;
    const jsn = json || this.getJsn();
    const cmnPropArr = this.getCrDestArrWithoutLastEl(`${crName}_cs`);
    return this.getCrJSN(jsn, cmnPropArr, cmnPropArr.length - 1);
  }

  /**
  * @public  Retrieve Container type as String: 'subSlug'
  *
  * @param  {JSON} jsn - Model
  * @param  {String} crName - is where the crN's type
  * @return {String} - type.
  */
  getCrType(crName, json = null) {
    const jsn = json || this.getJsn(); // : json;
    const cmnPropArr = this.getCrDestArrWithoutLastEl(`${crName}_cs`);
    // pre=='akf'  ||  pre=='grt' || pre=='grd'  || pre=='tsc' ||  pre == 'bsc'
    const pre = (cmnPropArr[cmnPropArr.length - 1]).substr(0, 3);
    let depth = ((pre in this.validCrNameStart) ? cmnPropArr.length - 2 : cmnPropArr.length - 1);
    if (pre === 'grt' && (cmnPropArr[cmnPropArr.length - 2]).substr(0, 3) === 'grd') {
      depth = cmnPropArr.length - 3;
    }
    return (this.getCrJSN(jsn, cmnPropArr, depth)).cs.type;
  }

  /**
  *   REALIZATION INTERFACE Set Get Rem Containers Values
  *
  *
  */

  /**
  * @private  get  cr Obj JSON
  *
  * @param  {JSON} jsn - Model
  * @param  {Array} cmnPropArr - Common Property Array
  * @param  {Number} depth - Path's Depth
  * @return  {JSON} obj.
  */
  getCrJSN(json = {}, cmnPropArr, depth, it = 0) {
    let jsn = json;
    // jsn.hasOwnProperty(cmnPropArr[it])
    if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
      if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) {
        return jsn[cmnPropArr[it]];
      }
      if (this.isJsnObj(jsn[cmnPropArr[it]])) {
        jsn = this.getCrJSN(jsn[cmnPropArr[it]], cmnPropArr, depth, parseInt(it, 10) + 1);
      }
    }
    return jsn;
  }

  /**
  * @private
  *
  * @param  {JSON} jsn - Model
  * @param  {String} crName - Container Name
  * @param  {Array} cmnPropArr - Common Property Array
  * @param  {Number} depth - Path's Depth
  * @param  {Number} it - iteration counter
  * @return  {JSON} obj.
  */
  getJsonWithRemovedCr(json = {}, crName = 'c0', cmnPropArr, depth, it = 0) {
    const jsn = json;
    // jsn.hasOwnProperty(cmnPropArr[it])
    if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
      if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) {
        delete jsn[cmnPropArr[it]];
        return jsn;
      }
      if (this.isJsnObj(jsn[cmnPropArr[it]])) {
        jsn[cmnPropArr[it]] = this.getJsonWithRemovedCr(
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

  /** @private
  *
  * @param  {JSON} jsn - Model
  * @param  {String} crName - Container Name
  * @param  {String} newCrName - New Container Name
  * @param  {String} crType - Container Type
  * @param  {Array} cmnPropArr - Common Property Array
  * @param  {Number} depth - Path's Depth
  * @param  {Number} it - iteration counter
  * @return  {JSON} obj.
  */
  getJsnWithMadeCr(json = {}, crName = 'c0', newCrName, crType, cmnPropArr, depth, it = 0) {
    const jsn = json;
    // jsn.hasOwnProperty(cmnPropArr[it])
    if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
      if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it]) === 'c') {
        jsn[cmnPropArr[it]][newCrName] = { cs: { type: crType, priority: '0' } };
        return jsn;
      }
      if (this.isJsnObj(jsn[cmnPropArr[it]])) {
        jsn[cmnPropArr[it]] = this.getJsnWithMadeCr(
          jsn[cmnPropArr[it]],
          crName,
          newCrName,
          crType,
          cmnPropArr,
          depth,
          Number(it) + 1,
        );
      }
    }
    return jsn;
  }

  /**
  * @private  Get a New cr's Name
  *
  * @param  {JSON} jsn - Model
  * @param  {String} crName - The Path
  * @param  {String} crType - The Type of The Value
  * @param  {Array} cmnPropArr - Common Property Array
  * @param  {Number} depth - Depth of the Path
  * @param  {Number} it - iteration counter
  * @return {String|Boolean} New cr's Name.
  */
  getNewCrNameProc(jsn = {}, crName = 'c0', crType, cmnPropArr, depth, it = 0) {
    // if (depth >= it && jsn.hasOwnProperty(cmnPropArr[it])) {
    if (depth >= it && Object.prototype.hasOwnProperty.call(jsn, cmnPropArr[it])) {
      // this.getCrNameWithoutNum( cmnPropArr[it] ) == 'c'
      if ((depth === it) && jsn[cmnPropArr[it]] && this.getCrNameWithoutNum(cmnPropArr[it])) {
        let fn = 0;
        while (jsn[cmnPropArr[it]][crType + fn]) {
          fn += 1;
        }
        return crType + fn;
      }
      if (this.isJsnObj(jsn[cmnPropArr[it]])) {
        return this.getNewCrNameProc(
          jsn[cmnPropArr[it]],
          crName,
          crType,
          cmnPropArr,
          depth,
          parseInt(it, 10) + 1,
        );
      }
    }
    return false;
  }

  /**
  * @private  Get a cr's value
  *
  * @param  {JSON} jsn - model
  * @param  {JSON} jsnCrLnk - obj of a path
  * @param  {String} valType type of the value
  * @param  {Boolean} val - value
  * @return {String} cr's value.
  */
  getCrValProc(jsn = {}, jsnCrLnk = {}, valType = 'type', value = false) {
    let val = value;
    if (!val) {
      Object.keys(jsnCrLnk).some((cmnProp) => {
        // if (jsn.hasOwnProperty(cmnProp)) {
        if (Object.prototype.hasOwnProperty.call(jsn, cmnProp)) {
          if (cmnProp === 'cs' && jsn[cmnProp][valType]) {
            val = jsn[cmnProp][valType];
          } else if (this.isJsnObj(jsnCrLnk[cmnProp]) && this.isJsnObj(jsn[cmnProp])) {
            val = this.getCrValProc(jsn[cmnProp], jsnCrLnk[cmnProp], valType, val);
          }
        }
        return false;
      });
    // for(var cmnProp in jsnCrLnk) {
    //   if (jsn.hasOwnProperty(cmnProp)) {
    //     if(cmnProp=='cs' && jsn[cmnProp][valType]) {
    //     val =  jsn[cmnProp][valType];
    //     } else if ( this.isJsnObj(jsnCrLnk[cmnProp]) && this.isJsnObj(jsn[cmnProp]) ) {
    //       val = this.getCrValProc( jsn[cmnProp], jsnCrLnk[cmnProp], valType, val);
    //     }
    //   }
    // }
    }
    return val;
  }

  /**
  * @public  Retrieve is the income param contains a number type
  *
  * @param  {String} num - income param.
  * @return {Boolean} type.
  */
  isNum(num = '256') {
    return !Number.isNaN(Number(num));
  }
  // isNum(num = '256') {
  //   return parseInt(num, 10) == num;// && (typeof num === 'number')
  // }

  /**
  * @public  Retrieve cr name was defined in the proper way or FALSE
  *
  * @param  {String} crName - or 'cr' like type.
  * @return {Boolean|String} container's name or FALSE.
  */
  validateCrName(crName) {
    if (crName in this.validCrNames) {
      return crName;
    }
    let validContainer = null;
    Object.keys(this.validCrNames).some((vCr) => {
      if (crName.indexOf(vCr) === 0 && this.validCrNames[vCr]) {
        // vCr=='akf' || vCr=='grt' || vCr=='grd' || vCr=='tsc' || vCr=='bsc'
        if (vCr in this.validCrNameStart) {
          validContainer = vCr;
          return true;
        }
        if (this.isNum(crName.slice(vCr.length))) {
          validContainer = vCr;
          return true;
        }
      }
      return false;
    });
    // for (const vCr in this.validCrNames) {
    //   if (crName.indexOf(vCr) === 0 && this.validCrNames[vCr]) {
    //     // vCr=='akf' || vCr=='grt' || vCr=='grd' || vCr=='tsc' || vCr=='bsc'
    //     if (vCr in this.validCrNameStart) {
    //       return vCr;
    //     }
    //     if (this.isNum(crName.slice(vCr.length))) {
    //       return vCr;
    //     }
    //   }
    // }
    return validContainer;
  }

  /**
  * @public  Retrieve the Container's Name
  *
  * @param  {String} crName - 'cr0' type.
  * @return {String} Validated crName
  */
  getCrNameWithoutNum(crName) {
    return this.validateCrName(crName);
  }

  /**
  * @public  Retrieve the Container's Size
  *
  * @param  {JSON} jsnObj - '{c0:{}}' type.
  * @return {Number | String} Containers Size.
  */
  getCrLength(jsnObj) {
    return Object.keys(jsnObj).length;
  }

  /**
  * @public  Retrieve the last/dest Containers name
  *
  * @param  {String} dest 'c0_cr0_ct' type.
  *   c - rootContainer; 0 - its num (c0);
  *   cr -Container; tp - type;
  *   ct -Content;  0 - its num
  *   cs - ContainerSettings
  *   c0_c0 - Container 0, that contains the same Container c0
  *
  * @return {String}  last Container. For example: 'ct'.
  */
  getLastCrNameInDest(dest = 'c0') {
    const c = dest.split('_');
    return c[c.length - 1];
  }

  /**
  * @private  Retrieve the Dest without last el
  *
  * @param  String path dest like type path ('c0_c0_cr2').
  * @return String dest without last el ('c0_c0').
  */
  getCrDestWithoutLastEl(dest = 'c0') {
    return dest.substr(0, dest.length - this.getLastCrNameInDest(dest).length - 1);
  }

  /**
  * @private  Retrieve Containers array
  *
  * @param  {String} path dest like type path ('c0_c0_cr2').
  * @return {Array} dest without last el.
  */
  getCrDestArrWithoutLastEl(dest = 'c0') {
    return this.getCrDestWithoutLastEl(dest).split('_');
  }

  /**
  * @public  Converts (String) crLink into JSON Obj
  *
  * @param  {string} dest - link
  * @param  {string} val - the value.
  * @return  {JSON} 'crLink' - with the required prop and the value.
  */
  getCrLnkJsn(dest = 'c0_cs', val = '') {
    const cmnPropArr = this.getCrDestArrWithoutLastEl(`${dest}_lastEl`);
    const depth = cmnPropArr.length - 1;
    return this.getCrsJSNk(cmnPropArr, depth, val);
  }

  /**
  * @private  Converts String crLink into JSON Obj
  *
  * @param  {Array} cmnPropArr - Link
  * @param  {Number} depth - The Depth of the Link.
  * @param  {String|Number} val - The Value.
  * @param  {Number} it - Iterations of the Recursion.
  *
  * @return  {JSON} crLink
  */
  getCrsJSNk(cmnPropArr, depth, val = '', it = 0) {
    const jsn = {};
    jsn[cmnPropArr[it]] = depth === it
      ? val
      : this.getCrsJSNk(cmnPropArr, depth, val, Number(it) + 1);
    return jsn;
  }

  // getCrLnkJsnOLD(dest = 'c0_cs', val = '') {
  //   let jsn = '';
  //   let lastBrackets = '';
  //   const crs = this.private_array_getCrDestArrWithoutLastEl(dest);
  //   // private_str_getCrDestWithoutLastEl( dest ).split('_');
  //   let pre = this.getLastCrNameInDest(dest).substr(0, 3);

  //   if (this.getLastCrNameInDest(dest).substr(0, 4) === 'grdL') {
  //     pre = 'grdL';
  //   }

  //   Object.keys(crs).some((i) => {
  //     // jsn += crs.length-1 == i
  //     // ? '"'+crs[i]+'":{'+'"'+this.getLastCrNameInDest(dest)+'":"'+val+'"'
  //     // : '"'+crs[i]+'":{';
  //     jsn = `${jsn}"${crs[i]}":{`;
  //     /* is the last el? */
  //     if (crs.length - 1 == i) {
  //       // pre=='akf' || pre=='grt' || pre=='grd' || pre=='tsc' || pre=='bsc'
  //       if ((pre in this.validCrNameStart)) {
  //         jsn = `${jsn}"${this.getLastCrNameInDest(dest)}":${val}`;
  //       } else {
  //         /* is the Val to assign exist if( val != '' ) */
  //         jsn = `${jsn}"${this.getLastCrNameInDest(dest)}":"${val}"`;
  //       }
  //     }
  //     lastBrackets = `${lastBrackets}}`;
  //     return false;
  //   });

  //   if (val) {
  //     console.log(val);
  //     console.log(this.private_jsn_getCrsJSNk(cmnPropArr, depth, val));
  //     console.log(JSON.parse('{' + jsn + lastBrackets + '}'));
  //   }
  //   return JSON.parse(`{${jsn}${lastBrackets}}`);
  // }

  isJsnObj(obj) {
    return typeof obj === 'object' && obj.constructor === Object;
  }

  /**
  * @private  Validate JSON obj
  *
  * @param  {JSON} jsn
  * @return {JSON}  validated JSON obj.
  */
  getValidJsn(json) {
    const jsn = json;
    Object.keys(jsn).some((prop) => {
      // if (jsn.hasOwnProperty(prop)) {
      if (Object.prototype.hasOwnProperty.call(jsn, prop)) {
        if (jsn[prop] === '') {
          delete jsn[prop];
        } else if (this.isJsnObj(jsn[prop])) {
          jsn[prop] = this.getValidJsn(jsn[prop]);
        }
      }
      return false;
    });
    return jsn;
  }

  /**
  * @private Merge two incoming JSON
  *
  * @param  {JSON} jsn
  * @param  {JSON} jsnIn
  * @returns {JSON} merged JSON obj.
  */
  jsnMrg(json, jsnIn) {
    const jsn = json;
    Object.keys(jsnIn).some((cmnProp) => {
      // if (jsnIn.hasOwnProperty(cmnProp)) {
      if (Object.prototype.hasOwnProperty.call(jsnIn, cmnProp)) {
        // if (!jsn.hasOwnProperty(cmnProp)) {
        if (!Object.prototype.hasOwnProperty.call(jsn, cmnProp)) {
          jsn[cmnProp] = jsnIn[cmnProp];
        } else if (this.isJsnObj(jsn[cmnProp]) && this.isJsnObj(jsnIn[cmnProp])) {
          jsn[cmnProp] = this.jsnMrg(jsn[cmnProp], jsnIn[cmnProp]);
        }
      }
      return false;
    });
    // for (const cmnProp in jsnIn) {
    //   // if (jsnIn.hasOwnProperty(cmnProp)) {
    //   if (Object.prototype.hasOwnProperty.call(jsnIn, cmnProp)) {
    //     // if (!jsn.hasOwnProperty(cmnProp)) {
    //     if (!Object.prototype.hasOwnProperty.call(jsn, cmnProp)) {
    //       jsn[cmnProp] = jsnIn[cmnProp];
    //     } else if (this.isJsnObj(jsn[cmnProp]) && this.isJsnObj(jsnIn[cmnProp])) {
    //       jsn[cmnProp] = this.jsnMrg(jsn[cmnProp], jsnIn[cmnProp]);
    //     }
    //   }
    // }
    return jsn;
  }

  /**
  *   INTERFACE Get JSON ACS by Priority
  *
  *  public function getRootJsnAscByPriority(jsn)
  *
  *
  */
  getRootJsnAscByPriority(jsn) {
    return this.procOrder(jsn);
  }

  /**
  * @private REALIZATION INTERFACE Get JSON ACS by Priority
  */
  isPriorityCrExist(container) {
    return container && container.cs && container.cs.priority;
  }

  /**
  * @private
  */
  getCrCsPriorityValue(cr) {
    return this.isPriorityCrExist(cr) ? cr.cs.priority : false;
  }

  getCrWithoutPriority(data, crName, stack, maxPriority) {
    const cr = this.getCrCsPriorityValue(data);
    const stackWithoutPriority = stack;
    if (crName === 'cs' || !cr || cr === '' || cr <= 0 || cr > maxPriority) {
      stackWithoutPriority[crName] = data;
    }
    return stackWithoutPriority;
  }

  /**
   * @private
  */
  getProperStack(data, stack, curPriority) {
    let cr = '';
    const propStack = stack;
    Object.keys(data).some((iCmp) => {
      cr = this.getCrCsPriorityValue(data[iCmp]);
      if (cr && Number(cr) === curPriority) {
        propStack[iCmp] = data[iCmp];
      }
      return false;
    });
    return propStack;
  }

  /**
   * @private The Lost Priority's developing here
   */
  /* getStackAscByPriority(jsn, curPriority = 1, outJsn = {}, cr = '') {
    for (const lCr in jsn) {
      cr = this.getCrCsPriorityValue(jsn[lCr]);
      if (cr && cr <= curPriority) {
        outJsn[lCr] = jsn[lCr];
      } else {
        curPriority = cr;
      }
    }
    return outJsn;
  } */

  /**
   * @private
  */
  addAnotherStackEl(stack, stackWithoutPriority) {
    const newStack = stack;
    Object.keys(stackWithoutPriority).some((s) => {
      newStack[s] = stackWithoutPriority[s]; /** needs to asc by been lost priority */
      return false;
    });
    // for (const s in stackWithoutPriority) {
    //   newStack[s] = stackWithoutPriority[s]; /** needs to asc by been lost priority */
    // }
    return newStack;
  }

  /**
   * @private
  */
  getOrderedArr(data, maxPriority = 200) {
    let stack = {};
    let stackWithoutPriority = {};
    let curPriority = 1;
    Object.keys(data).some((container) => {
      stackWithoutPriority = this.getCrWithoutPriority(
        data[container],
        container,
        stackWithoutPriority,
        maxPriority,
      );
      stack = this.getProperStack(data, stack, curPriority);
      curPriority += 1;
      return false;
    });

    return this.addAnotherStackEl(stack, stackWithoutPriority);
  }

  /**
   * @private
  */
  getOrderedJsn(json, rootOnlyFlag = true) {
    const jsn = json;
    Object.keys(jsn).some((prop) => {
      if (this.getCrNameWithoutNum(prop) === 'c') {
        jsn[prop] = this.getOrderedArr(jsn[prop], this.getCrLength(jsn[prop]));
        if (this.isJsnObj(jsn[prop]) && !rootOnlyFlag) {
          jsn[prop] = this.getOrderedJsn(jsn[prop]);
        }
      }
      return false;
    });
    return jsn;
  }

  /**
   * @private
  */
  addJsnRootEl(jsn) {
    const j = {};
    // j.c0 = jsn ? jsn : {};
    j.c0 = jsn || {};
    return j;
  }

  /**
   * @private
  */
  remJsnRootEl(jsn) {
    // return jsn ? jsn['c0'] : {};
    return jsn ? jsn.c0 : {};
  }

  procOrder(jsn, rootOnlyFlag = true) {
    return this.remJsnRootEl(this.getOrderedJsn(this.addJsnRootEl(jsn), rootOnlyFlag));
  }
}

export default Model;
