/* eslint-disable class-methods-use-this */
import Utils from '../utils/utils';

/**
 * Customizer
 *
 *
 * @copyright (c) 2017-2019 S.Adamovich - <https://.com/>
 * @license GPL 3.0 http://www.gnu.org/licenses/gpl.html
 * @Version: 1.0.0
 *
 * Build: 480 (4-SEP-2019)
 * Examples and documentation at: http://
 */
class Theme {
  constructor(model) {
    // this.setEventsListeners();

    this.mdl = model; // new Model();
    // this.mdl.defaultArray = [];
    // this.wp = wp;
    this.getMainCstmzFrame();
    this.cstmzBlockPriority = this.mdl.sortable;
    this.rep = '';
    // eslint-disable-next-line quotes
    this.br = "\n";
  }

  /**
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │                           M O D E L                           │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  setsDeflts(attr) {
    let ob;
    // let name;
    let value;
    let nameL;
    Object.keys(attr).some((name) => {
      value = attr[name];
      if (name.lastIndexOf('_number_range') !== -1) {
        nameL = name.slice(0, name.lastIndexOf('_number_range'));
        ob = document.getElementById(`${nameL}_number`);
        ob.value = value;
        ob.click();
        ob = document.getElementById(`${nameL}_range`);
        ob.value = value;
        ob.click();
      } else {
        ob = document.getElementById(name);
        ob.value = value;
        ob.click();
      }
      return false;
    });
  }

  dataTgLink(obj) {
    const ob = obj;
    if (ob.style.display === '' || ob.style.display === 'none') {
      ob.style.display = 'block';
    } else {
      ob.style.display = 'none';
    }
  }

  /* remove Scene */
  removeScene() {
    this.remEl(`${this.mdl.getDestID()}-sort-cstmz-blocks`);
  }

  /* rewrite Scene */
  remakeScene() {
    this.removeScene();
    this.makeScene();
  }

  /* make new Scene */
  makeScene() {
    /* Slides */
    const jsn = this.mdl.getRootJsnAscByPriority(this.mdl.getJsn());
    const destID = this.mdl.getDestID();
    const divScene = this.mkEl('', `${destID}-sort-cstmz-blocks`);
    Object.keys(jsn).some((crName) => {
      if (crName !== 'hdr') {
        divScene.appendChild(this.getSlideForm(crName));
        return true;
      }
      return false;
    });
    /* pastBefore */
    this.beforEl(destID, divScene);
    this.mdl.draggableElementInit();
    this.dragElement('animationPannel');
  }

  /* remake Scene Frame */
  remakeSceneFrame(crName) {
    this.arrasEl(`${this.mdl.getDestID()}-sort-cstmz-blocks`);
    this.inEl(`${this.mdl.getDestID()}-sort-cstmz-blocks`, this.getSlideForm(crName));
    const a = document.querySelectorAll('.cstm-nav-balls.active');
    if (a && a[0]) {
      a[0].className = a[0].className.replace(' active', '');
    }
    this.addCssClass(`${crName}__cstm-nav-balls`, 'active');
    this.mdl.draggableElementInit();
    this.dragElement('animationPannel');
  }

  mkEl(obName, id = '', className = '', data = {}, dataName = '', innerText = '', hid = '') {
    return Utils.mkEl(obName, id, className, data, dataName, innerText, hid);
  }

  elmnt(el) {
    return (typeof (el) === 'object') ? el : document.getElementById(el);
  }

  inEl(el, elNode) {
    Utils.inEl(el, elNode);
  }

  beforEl(el, elNode) {
    Utils.beforeEl(el, elNode);
  }

  afterEl(el, elNode) {
    Utils.afterEl(el, elNode);
  }

  remEl(el) {
    Utils.remEl(el);
  }

  arraseParEl(el) {
    Utils.eraseParentEl(el);
  }

  remParEl(el) {
    Utils.remParentEl(el);
  }

  arrasEl(el) {
    Utils.eraseEl(el);
  }

  remKeyframeRule(crName) {
    const prc = this.getDataShrt(crName, 'akfTimelinePos');
    const prcPrv = this.getTheClosestKeyframePos(crName, prc);
    const shiftPrc = prcPrv - prc;
    const els = crName.split('_');
    const lastCrName = els[els.length - 1];
    const parentCrName = crName.substr(0, crName.length - lastCrName.length - 1);
    /* shift of the animation duration val */
    const animationDuration = parseFloat(this.getDataShrt(parentCrName, 'animationDuration'));
    let animationDurationNew = animationDuration - ((shiftPrc * animationDuration) / 100);
    animationDurationNew = Math.round(animationDurationNew * 1000) / 1000;
    this.shiftAllKeyframeRulesOn(crName, prcPrv, prc, animationDuration, animationDurationNew);
    this.remCertainKeyframeRule(crName, prc);
  }

  remCertainKeyframeRule(crName, prc) {
    const keyframes = this.mdl.getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
    let rule;
    let flag = false;
    for (let i = 0, j = keyframes.cssRules.length; i < j; i += 1) {
      rule = keyframes[i].keyText;
      if (rule.replace('%', '') === prc) {
        flag = true;
        break;
      }
    }
    if (flag) {
      keyframes.deleteRule(rule);
    }
  }

  shiftAllKeyframeRulesOn(crName, shift, fromPos = 0, animationDuration, animationDurationNew) {
    const keyframes = this.mdl.getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
    let tLinePosPrc;
    let tLinePosSec;
    let tLinePosPrcNew;

    for (let i = 0, j = keyframes.cssRules.length; i < j; i += 1) {
      tLinePosPrc = keyframes[i].keyText;
      tLinePosPrc = parseFloat(tLinePosPrc.replace('%', ''));
      if (tLinePosPrc !== fromPos) {
        if (tLinePosPrc > fromPos) {
          tLinePosPrc -= (shift - fromPos);
        }

        tLinePosSec = (animationDuration * tLinePosPrc) / 100;
        tLinePosPrcNew = (tLinePosSec * 100) / animationDurationNew;
        tLinePosPrcNew = Math.round(tLinePosPrcNew * 1000) / 1000;

        keyframes[i].keyText = `${tLinePosPrcNew}%`;
      }
    }
  }

  getTheClosestKeyframePos(crName, pos) {
    const keyframes = this.mdl.getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
    let prc;
    let prcPrv = 100;
    for (let i = 0, j = keyframes.cssRules.length; i < j; i += 1) {
      prc = keyframes[i].keyText;
      prc = parseFloat(prc.replace('%', ''));
      if (prc < prcPrv && prc > pos) {
        prcPrv = prc;
      }
    }

    return prcPrv;
  }

  remKeyframeAndAnimatedClass(crName) {
    this.remKeyframe(crName);
    this.remRule('', `.${this.getCssClassName(crName, false)}.animated`);
  }

  addKeyframe(crName) {
    let keyframes = this.mdl.getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
    let pos = '0';

    if (keyframes) {
      pos = keyframes.cssRules.length;
      if (pos !== 0) {
        pos = keyframes[keyframes.cssRules.length - 1].keyText;
        pos = parseFloat(pos.replace('%', ''));
        pos = 100 - (100 - pos) / 2;
      }
      keyframes.appendRule(`${pos}% {}`);

      return pos;
    }

    /* make new... */

    keyframes = this.mdl.getStyleSheet();
    keyframes.addRule(`@keyframes ${this.getCssClassName(crName, false)}__keyframes`, `${pos}% {}`, keyframes.cssRules.length);
    const css = `animation-name: ${this.getCssClassName(crName, false)}__keyframes; animation-duration: ${this.getDataShrt(crName, 'animationDuration')}s;`;
    keyframes.addRule(`.${this.getCssClassName(crName, false)}.animated`, css, keyframes.cssRules.length);

    keyframes = this.mdl.getClassRule(`.${this.getCssClassName(crName, false)}.animated`);

    return pos;
  }

  addCSSRule(rulesSelector, type, css) {
    const cssObj = this.mdl.getClassRule(rulesSelector);

    if (cssObj) {
      cssObj.style[this.mdl.set.cssNames[type]] = css;
    } else {
      const ss = this.mdl.getStyleSheet();
      ss.addRule(rulesSelector, `${this.mdl.set.cssNames[type]}: ${css}`, ss.cssRules.length);
    }
  }

  remKeyframe(crName, ruleSelector = '') {
    const ss = this.mdl.getStyleSheet();
    const rule = ruleSelector === '' ? `${this.getCssClassName(crName, false)}__keyframes` : ruleSelector;
    /* Remove Keyframe Rule */
    if (ss) {
      for (let j = 0; j < ss.cssRules.length; j += 1) {
        // ss.cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE
        if (ss.cssRules[j].name === rule) {
          ss.removeRule(j);
          return true;
        }
      }
    }
    return false;
  }

  remRule(crName, ruleSelector = '') {
    const selector = ruleSelector === '' ? this.getCssClassName(crName) : ruleSelector;
    const ss = this.mdl.getStyleSheet();
    /* Remove CSS Rule */
    if (ss) {
      for (let j = 0, rulesLength = ss.cssRules.length; j < rulesLength; j += 1) {
        if (ss.cssRules[j].selectorText === selector) {
          ss.removeRule(j);
          return true;
        }
      }
    }
    return false;
  }

  remAllRulesInCr(crName) {
    /* hasElItems */
    const crJsn = this.mdl.getCrsJSN(crName);
    let elName;
    Object.keys(crJsn).some((el) => {
      elName = this.mdl.getCrNameWithoutNum(el);
      if (elName === 'c') {
        this.remRule(`${crName}_${el}`);
        this.remAllRulesInCr(`${crName}_${el}`);
      }
      if (elName === 'i') {
        this.remRule(`${crName}_${el}`);
        this.remAllRulesInCr(`${crName}_${el}`);
      }
      if (elName === 'akf') {
        this.remKeyframeAndAnimatedClass(`${crName}_${el}`);
      }
      return false;
    });
    this.remRule(crName);
  }

  remAllDashedFrame() {
    this.remAllCSSClass('edit-mode-active');
  }

  addCssClass(obj, cssClass = 'animated') {
    let ob = obj;
    ob = this.elmnt(ob);
    const arrClassName = ob.className.split(' ');
    if (arrClassName.indexOf(cssClass) === -1) {
      ob.className += ` ${cssClass}`;
    }
  }

  remCssClass(obj, cssClass = 'animated') {
    let ob = obj;
    ob = this.elmnt(ob);
    ob.className = ob.className.replace(` ${cssClass}`, '');
  }

  changeCClass(obj, className, classNameOn = '') {
    let ob = obj;
    ob = this.elmnt(ob);
    if (ob) {
      ob.classList.remove(className);
      ob.classList.add(classNameOn);
    }
  }

  changeCSSClass(jqObj, className) {
    this.changeCSSClasses(className);
    jqObj.addClass(className);
  }

  changeCSSClasses(className, classNameOn = '') {
    const elArr = document.querySelectorAll(`.${className}`);
    for (let i = 0, lngth = elArr.length; i < lngth; i += 1) {
      elArr[i].classList.remove(className);
      if (classNameOn !== '') {
        elArr[i].classList.add(classNameOn);
      }
    }
  }

  remAllStyleAttrCSSClasses(className) {
    const elArr = document.querySelectorAll(`.${className}`);
    for (let i = 0, lngth = elArr.length; i < lngth; i += 1) {
      elArr[i].removeAttribute('style');
    }
  }

  remAllCSSClass(className) {
    this.changeCSSClasses(className);
  }

  getRootCrName(crName) {
    return (crName.split('_'))[0];
  }

  convertCrNameToCssCrName(crName, divTypeToSplit = '_', divTypeToConvert = '-') {
    return divTypeToSplit === '_' ? crName.replace(/_/g, divTypeToConvert) : crName.replace(/-/g, divTypeToConvert);
  }

  pushDflt(dfltID, container, cr, prop, val = '') {
    const defaultID = container === 'input_range' ? `${dfltID}_number_range` : dfltID;
    this.mdl.defaultArray[defaultID] = val || this.getDfltData(cr, prop);
  }

  getDfltJSNData(cr) {
    if (this.mdl.set) {
      return ((this.mdl.set[cr]) ? this.mdl.set[cr] : this.mdl.set[this.mdl.set[cr].dflt]);
    }
    return false;
  }

  getDfltData(crType, prop) {
    if (this.mdl.set && this.mdl.set[crType] && this.mdl.set[crType][prop]) {
      return this.mdl.set[crType][prop];
    }
    const defltType = this.mdl.set[crType].dflt;
    return this.mdl.set[defltType][prop];
  }

  /**
   *  get value from a container
   *
   * @param JSON/Array jsn is all cntnr settings
   * @param Array crName is a cntnr like c0_c1 ...
   * @param String crProp is a property of the cntnr and also its key
   * @param String crType is the cntnr type (mainSlug, cntnr... or getIMG)
   * @param String destID is the id for input field (asvthemes__header_slide_builder)
   *
   * @return String setd prop or Dafault val
   */
  getDataShrt(crName = '', crProp = '') {
    return this.getData('', crName, crProp);
  }

  // getData(json = '', crName = '', crProp = '', containerType = '', destID = '') {
  getData(json = '', crName = '', crProp = '', containerType = '') {
    const jsn = json === '' ? this.mdl.getJsn() : json;
    const crType = containerType === '' ? this.mdl.getCrType(crName) : containerType;

    const validValType = {
      description: false,
      ptID: false,
      timeout: true,
      name: true,
      postType: true,
      type: true,
      priority: true,
      heightPercent: true,
      speed: true,
      pause: true,
      autostop: true,
      fastOnEvent: true,
      mainPage: true,
      pauseOnPagerHover: true,
    };
    let mode = this.mdl.getRWDMode();
    let retVal;
    if (crName === 'hdr' && (crProp in validValType)) {
      mode = '';
      retVal = this.mdl.getCrVal(jsn, crName, crProp, mode);
      if (retVal) {
        return retVal;
      }
      return crType === 'getIMG' ? this.mdl.set.dfltImg : this.getDfltData(crType, crProp);
    }
    retVal = this.getCascadeVal(jsn, crName, crProp, mode);

    if (retVal) {
      return retVal;
    }

    return crType === 'getIMG' ? this.mdl.set.dfltImg : this.getDfltData(crType, crProp);
  }

  /** Cascading RWD Cr Vals */
  getCascadeVal(jsn, crName, crProp, mode) {
    let retVal = '';
    let inheritRWDMode = '';
    if (mode === this.mdl.set.rwdDflt) {
      retVal = this.mdl.getCrVal(jsn, crName, crProp, mode);
      return retVal;
    }
    if (retVal === '') {
      retVal = this.mdl.getCrVal(jsn, crName, crProp, mode);
      if (retVal === '') {
        inheritRWDMode = this.getInheritRWDMode(mode);
      }
      if (retVal === '') {
        retVal = this.mdl.getCrVal(jsn, crName, crProp, inheritRWDMode);
      }
      if (retVal === '') {
        retVal = this.getCascadeVal(jsn, crName, crProp, inheritRWDMode);
      }
    }
    return retVal;
  }

  /**
  * !!!Important is that this.mdl.set.rwd must to be
  * arranged ascending by with up to this.mdl.set.rwdDflt mode!!!
  */
  getInheritRWDMode(mode) {
    let nextModeFlag = false;
    let retVal = '';
    const a = this.getSortedDfltrwdModeArrayByWidth();
    Object.keys(a).some((rwdMode) => {
      if (mode === this.mdl.set.rwdDflt) {
        retVal = mode;
      }
      if (retVal === '' && a[rwdMode].width === this.mdl.set.rwdDflt) {
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

  getSortedDfltrwdModeArrayByWidth(setRvd = this.mdl.set.rwd) {
    // let out;
    const a = [];
    let ai = 0;
    let hold = [];

    Object.keys(setRvd).some((rwdMode) => {
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

  getSortedCrByGrdLinePos(jsnCr) {
    const a = [];
    let ai = 0;
    let hold = [];

    Object.keys(jsnCr).some((c) => {
      if (c.substr(0, 3) === 'grt') {
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
  }

  getSortedCrByTimelinePos(jsnCr, crNamePrefix = 'akf', sortBy = 'akfTimelinePos') {
    const a = [];
    let ai = 0;
    let hold = [];

    /* sort by grd-priority and add crName */

    Object.keys(jsnCr).some((c) => {
      if (this.mdl.getCrNameWithoutNum(this.mdl.getLastCrNameInDest(c)) === crNamePrefix) {
        a[ai] = jsnCr[c];
        console.log(jsnCr[c]);
        a[ai].crName = c;
        ai += 1;
      }
      return false;
    });

    for (let pass = 1; pass < ai; pass += 1) {
      for (let i = 0; i < ai - 1; i += 1) {
        if (Number(a[i].cs[sortBy]) > Number(a[i + 1].cs[sortBy])) {
          hold = a[i];
          a[i] = a[i + 1];
          a[i + 1] = hold;
        }
      }
    }
    return a;
  }

  getSortedCrByPriority(jsnCr, crNamePrefix = 'grd') {
    const a = [];
    let ai = 0;
    let hold = [];

    /* sort by grd-priority and add crName */

    Object.keys(jsnCr).some((c) => {
      if (this.mdl.getCrNameWithoutNum(this.mdl.getLastCrNameInDest(c)) === crNamePrefix) {
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
  }

  isElExist(jsn, el) {
    return jsn.hdr && jsn.hdr.cs && jsn.hdr.cs[el];
  }

  // pxToEm(px, crName = '', valType = '') {
  //   let occ = 1;
  //   let crFontSize;

  //   if (crName !== '') {
  //     crFontSize = this.getDataShrt(crName, 'fontSize');
  //     occ = parseFloat(crFontSize) / 16;
  //     occ = (occ === 0 ? 1 : occ);
  //     occ = (valType === 'fontSize' ? 1 : occ);
  //   }
  //   return parseInt(px, 10) / (16 * occ);
  // }

  pxToEm(px, crName = '', valType = '') {
    if (valType === 'fontSize' || !crName) {
      return Number(px) / 16;
    }
    const crFontSize = this.getDataShrt(crName, 'fontSize');
    const occ = Number(crFontSize) / 16 || 1;
    return Number(px) / (16 * occ);
  }

  dragElement(itElID = 'last_setings_el_for_toggle_after-header') {
    let tx = 0;
    let ty = 0;
    let offsetX = 0;
    let offsetY = 0;
    const header = document.getElementById(itElID);

    if (!header) {
      return;
    }

    const ob = header.parentElement;

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }

    function elementTDrag(e) {
      const event = e || window.event;
      tx = event.targetTouches[0].pageX - offsetX;
      ty = event.targetTouches[0].pageY - offsetY;
      ob.style.left = `${tx}px`;
      ob.style.top = `${ty}px`;
    }

    function elementDrag(e) {
      const event = e || window.event;
      tx = offsetX - event.clientX;
      ty = offsetY - event.clientY;
      offsetX = event.clientX;
      offsetY = event.clientY;
      ob.style.top = `${ob.offsetTop - ty}px`;
      ob.style.left = `${ob.offsetLeft - tx}px`;
    }

    function dragTstart(e) {
      const event = e || window.event;
      offsetX = event.targetTouches[0].pageX - ob.offsetLeft;
      offsetY = event.targetTouches[0].pageY - ob.offsetTop;
      document.ontouchend = closeDragElement;
      document.ontouchmove = elementTDrag;
    }

    function dragMouseDown(e) {
      const event = e || window.event;
      offsetX = event.clientX;
      offsetY = event.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    if (header) {
      header.onmousedown = dragMouseDown;
      header.ontouchstart = dragTstart;
    }
  }

  /**
   * AJAX query
   */
  saveAllHeaderObjs(jsn, action = 'save') {
    const xmlhttp = new XMLHttpRequest();
    const postID = this.isElExist(jsn, 'ptID') ? jsn.hdr.cs.ptID : '';
    const name = this.isElExist(jsn, 'ptID') ? jsn.hdr.cs.name : '';
    const data = JSON.stringify(jsn);
    let descr = this.isElExist(jsn, 'jsn.hdr.cs.description') ? jsn.hdr.cs.jsn.hdr.cs.description : '';

    if (action === 'save_as') {
      descr = prompt('description:', jsn.hdr.cs.description);
      if (descr === '' || descr === null) {
        return;
      }
    }

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        switch (xmlhttp.status) {
          case 200:
            Utils.alert(xmlhttp.responseText
              ? `The Message has been delivered successfully! ${xmlhttp.responseText}`
              : 'Unable to get, Please try again');
            break;
          case 400:
            Utils.alert('There was an error 400');
            break;
          default:
            Utils.alert('something else other than 200 was returned');
            break;
        }
      }
    };
    xmlhttp.open('POST', this.mdl.set.ajaxURL, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(`id=${postID}&title=${name}&descr=${descr}&jsn=${data}&a=${action}&action=asvtheme_save_user_header_footer_form`);
  }

  /**
  *   END MODEL
  */

  /**
  *
  *
  *
  *
  *
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │                           V I E W                             │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  getMainUpperMenu() {
    let li;
    let el;
    const destID = this.mdl.getDestID();
    const jsn = this.mdl.getRootJsnAscByPriority(this.mdl.getJsn());
    let liActive = ' active';
    /* Main */
    const main = this.mkEl('', 'cstmzblocks-upper-menu', `cstmzblocks-upper-menu${this.mdl.set.customizeMode ? ' cstmzblocks-upper-menu__fixwidth' : ''}`);

    /* DragHeader */
    el = this.mkEl('', 'upperMenuDragHeader');
    el.style = 'display:block;position:absolute;width:100%;height:100%;';
    this.inEl(main, el);
    //

    /* MenuFile */
    el = this.mkEl('', '', 'dark-stl dstl-inline', `{"tglID":"last_setings_el_for_toggle_after", "contentID":"mainMenuFile", "destID":"${destID}", "slide":"hdr"}`, 'pst-attrs', this.mdl.set.names.File);
    this.inEl(main, el);
    //

    /* MenuSettings */
    el = this.getSlideForm('hdr');
    this.inEl(main, el);
    //

    /* Btn Save */
    el = this.mkEl('', '', 'save-btn', `{"id":"save_slide_btn","dest":"${destID}"}`, 'input', this.mdl.set.names.save);
    this.inEl(main, el);
    //

    /*  Slides Menu */
    const sMenu = this.mkEl('', 'menuSlides', 'athm-menu-scrns');
    /* BTN sortable Switch */
    // el = this.mkEl(
    // '',
    // 'sortable-flag-enable__btn',
    // 'sortable-flag-enable dark-stl dstl-inline no-sort',
    // 'enable',
    // 'sortable-flag-enable',
    // 'ON'
    // );
    // el.title = 'sortable SWITCH';
    // this.inEl(sMenu, el);

    /* Menu Cr (Layers,Item,Sets,RWD,File) */
    el = this.mkEl('', 'last_setings_el_for_toggle_after', 'menu-absolute-pos');
    this.inEl(sMenu, el);

    /* Menu Context ( Right Button Click ) */
    el = this.mkEl('', 'context__menu', 'menu-absolute-pos');
    this.inEl(sMenu, el);

    /* BTNs Scene */
    const ul = this.mkEl('ul', `${destID}-sort-cstmz-block`, 'athm-cstmz-scene-menu-ul cstmzblocks-ul-flat ui-sortable cstmzLst', '{"axis":"x","placeholder":"sortable-placeholder-flat","cstmzblock":"cstmzblocks-ul-flat"}', 'sort-attrs');
    ul.setAttribute('data-sortable-on', '{"priority":"priority","cstmzblock":"cstmzblock","blockposition":"blockposition"}');

    Object.keys(jsn).some((crName) => {
      if (crName !== 'hdr') {
        li = this.mkEl('li', `id_${this.mdl.getIDNum('new')}`, 'cstmzblock blockposition ui-sortable-handle athm-cstmz-touch-action__initial draggable droppable');
        el = this.mkEl('', `${crName}__cstm-nav-balls`, `cstm-nav-balls slidesenqueu${liActive}`, `{"id":"change_screen_ev","dest":"${destID}","slide":"${crName}","postfixblock":"main-cstmz-block"}`, 'input');
        this.inEl(li, el);
        el = this.mkEl('input', `id_${this.mdl.getIDNum('new')}`, 'priority', `{"id":"id_${this.mdl.getIDNum()}", "dest":"${destID}", "slide":"${crName}","subcntnr":"priority","type":"cs"}`, 'input');
        this.inEl(li, el);
        this.inEl(ul, li);
        liActive = '';
      }
      return false;
    });

    this.inEl(sMenu, ul);

    /* BTN '+' */
    el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'add-slide-btn dstl-inline', `{"id":"add_slide_btn","dest":"${destID}","insertID":"${destID}-sort-cstmz-block"}`, 'input', '+');
    this.inEl(sMenu, el);

    this.inEl(main, sMenu);
    return main;
    // Main
  }

  getMainCstmzFrame() {
    const destID = this.mdl.getDestID();
    const elArr = document.querySelectorAll('[data-adnl-val]');

    for (let i = 0, lngth = elArr.length; i < lngth; i += 1) {
      /*  Upper Menu */
      this.beforEl(destID, this.getMainUpperMenu());

      /**
      * Slides
      */
      this.makeScene();

      this.mdl.draggableElementInit();
      this.dragElement('animationPannel');
      this.dragElement('upperMenuDragHeader');
    }
  }

  /**
   *  gets TEMPLATE from a jData bounds
   * former jContent()
   *  --!! The Most Complecated Ever !!--
   *
   * @param JSON Array j is all jData bounds.
   * 'j' Can BE : 'mainSlug_mainSlug_content_containerSlug'
   * OR something like: 'mainSlug_menuMainSlug_content'
   * @param String id/dest_id is a destination input field
   * @param String crName is a cntnr like c0_c1 ...
   * @param JSON/Array jsn/slide_set is all data was stored in a destination input field
   * @param String type is a values type
   * (menu, image, collectionPosition... or )
   * see preloader.php->asvthemes_get_jData() -> "type"
   * @param String prevC is a direction on jData certain ui obj
   *
   * @return Node UI
   */
  jCrNd(root, route, crName, jsn, type = '', previoseContainer = '') {
    let val;
    const destID = this.mdl.getDestID();
    let attrs;
    let keyframes;
    const jName = route;

    const prevC = (previoseContainer || route);

    // j = j.split('_');j = jsn_getjCrsJSN( this.mdl.jData, j, j.length-1, 0 );
    const j = this.mdl.getCrsJSN(route, this.mdl.jData);

    Object.keys(j).some((c) => {
      val = j[c.content ? c.content : c];

      /* Menu With an Image or a Title  */
      if (val.type === 'menu') {
        keyframes = (val.keyframes ? val.keyframes : false);

        attrs = {
          destID, crName, jDataDest: `${prevC}_${c}_content`, dynamic: true, keyframes,
        };

        if (val.subType === 'imgType') {
          /* make and add bgImg attr */
          attrs.bgImg = this.getData(jsn, crName, val.subcntnr, 'getIMG');
        }
        if (val.subType === 'clrMenu') {
          /* make and add bgImg attr */
          attrs.clrClss = `${crName}-${val.subTypesubcntnr}__clrpckr__menu`;
          attrs.subTypesubcntnr = val.subTypesubcntnr;
        }
        if (val.cssClass) {
          /* make and add bgImg attr */
          attrs.cssClass = val.cssClass;
        }
        // title
        if (this.isCrRoot(crName) && jName === 'cntnr') {
          this.inEl(root, this.tglMenu(this.mdl.set.names.SceneSets, attrs));
        } else {
          this.inEl(root, this.tglMenu(val.title, attrs));
        }
      } else if (val.type) {
        /* Content */
        if (jName === 'collectionGradients' && val.subcntnr === 'gradientAngl' && this.getDataShrt(crName, 'gradientType') === 'linear') {
          this.getCrNd(
            root,
            val.type,
            crName,
            val.subcntnr,
            jsn,
            val.hint,
            {
              type: type || val.cntnr,
              subType: val.subType ? val.subType : false,
              m: val.m ? val.m : false,
            },
          );
          if (val.getDfltbtn) {
            this.getCrNd(root, 'defaultButton');
          }
          return true;
        }
        // if (
        //   jName === 'collectionGradients'
        //   && val.subcntnr === 'gradientAngl'
        //   && this.getDataShrt(crName, 'gradientType') === 'radial'
        // ) {
        //   continue;
        // }

        // if (
        //   val.subcntnr === 'akfTimelinePos'
        //   && this.getDataShrt(crName, 'akfTimelinePos') === '0'
        // ) {
        //   continue;
        // }
        if (!this.isGradientAnglRadialAndAkfStart(jName, crName, val.subcntnr)) {
          this.getCrNd(
            root,
            val.type,
            crName,
            val.subcntnr,
            jsn,
            val.hint,
            {
              type: type || val.cntnr,
              subType: val.subType ? val.subType : false,
              m: val.m ? val.m : false,
            },
          );
          if (val.getDfltbtn) {
            this.getCrNd(root, 'defaultButton');
          }
        }
      }
      return false;
    });
    return root;
  }

  isGradientAnglRadialAndAkfStart(jName, crName, subcntnr) {
    return (
      jName === 'collectionGradients'
      && subcntnr === 'gradientAngl'
      && this.getDataShrt(crName, 'gradientType') === 'radial'
    )
    || (
      subcntnr === 'akfTimelinePos'
      && this.getDataShrt(crName, 'akfTimelinePos') === '0'
    );
  }

  /**
   *  Retrieve Menu UI Collectionformer getContainer()
   *
   * @access pblc
   * @param (String) container is a name of UI Form's container
   * @param (String) dest_id is an ID of an input field that saves all data in JSON
   * @param (String) crName/slide is a cntnr like c0_c1 ...
   * @param (JSON) jsn/slide_set is all properties in JSON format
   * @param (String) title is a title of an UI menu like "Image"...
   * @param (JSON) data contains type or other additional info
   *
   * @return (String) Menu UI in HTML format
   */
  getCrNd(root, container, crName = '', subcntnr = '', json = '', title = '', data = null) {
    let jsn = json;

    if (jsn === '') {
      jsn = this.mdl.getJsn();
    }

    let type = '';
    if (data && data.type) {
      type = data.type;
    } else if (crName !== '') {
      type = this.mdl.getCrType(crName);
    }
    // const type = (data.type ? data.type : (crName !== '' ? this.mdl.getCrType(crName) : ''));
    const destID = this.mdl.getDestID();
    let crType;
    let value;
    let dfltID;
    let main;
    let ul;
    let el;
    let elC;
    let elCC;
    let elCCC;
    let elSrt;
    let cr;
    let hash;
    let idForInsert;
    let prtyPrf;
    let oldPrtyPrf;
    let jsnCr;
    let jsnASC;
    let jsnAscCr;
    let opacity;
    let ecx;
    let crTypeName;

    switch (container) {
      case 'select':
        dfltID = `id_${this.mdl.getIDNum('new')}`;
        this.pushDflt(dfltID, container, type, subcntnr);
        // var main;
        // var el;
        // var elC;

        main = this.mkEl('', '', 'select-container');

        // (label)
        el = this.mkEl('', '', 'lebel no-sort', '', '', title);
        this.inEl(main, el);
        //

        // (select)
        el = this.mkEl('select', dfltID, 'dark-stl-input', `{"id":"${dfltID}","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}"}`, 'input');

        Object.keys(this.getDfltData(type, `${subcntnr}Select`)).some((key) => {
          elC = this.mkEl('option', '', '', '', '', this.getDfltData(type, `${subcntnr}Select`)[key]);
          elC.value = key;
          if (this.getDataShrt(crName, subcntnr) === key) {
            elC.setAttribute('selected', 'selected');
          }
          this.inEl(el, elC);
          return false;
        });
        this.inEl(main, el);
        //

        this.inEl(root, main);
        return root;
        // break;

      case 'rgbPart':

        // var el;
        // var elC;

        // Main
        el = this.mkEl('', '', 'input-range');

        // Label
        elC = this.mkEl('label', '', 'input-range-label', '', '', title);
        this.inEl(el, elC);
        //

        // Type Range
        elC = this.mkEl('input', `${data.id + data.name}_range`, 'input__range input__range__wrp');
        elC.min = '0';
        elC.max = data.max;
        elC.step = data.step;
        elC.value = data.clr;
        elC.type = 'range';
        elC.setAttribute('data-synch-attr', `${data.id + data.name}_number`);
        this.inEl(el, elC);
        //

        // Type Num
        elC = this.mkEl('input', `${data.id + data.name}_number`, 'dark-stl-input rem-brdr', (data.j ? data.j : ''), (data.jn ? data.jn : ''));
        elC.min = '0';
        elC.max = data.max;
        elC.step = data.step;
        elC.type = 'number';
        elC.value = data.clr;
        elC.setAttribute('data-synch-attr', `${data.id + data.name}_range`);
        elC.setAttribute('data-clr-synch', data.id);
        this.inEl(el, elC);
        //

        this.inEl(root, el);
        return root;
        // break;

      case 'color': {
        let hexVal;
        let red;
        let green;
        let blue;
        // let opacity;
        const clrPckrSelector = `${crName}-${subcntnr}__clrpckr`;
        const idPrefix = `${crName}-${subcntnr}__`;

        if (subcntnr !== 'borderColor' && (subcntnr).indexOf('border') === 0 && (subcntnr).lastIndexOf('Color') !== -1) {
          hexVal = (this.getDataShrt(crName, subcntnr) === this.getDfltData(this.mdl.getCrType(crName), subcntnr)) ? this.getDataShrt(crName, 'borderColor') : this.getDataShrt(crName, subcntnr);
          red = this.mdl.clrpckr.hexToRgb(hexVal.slice(1, 3));
          green = this.mdl.clrpckr.hexToRgb(hexVal.slice(3, 5));
          blue = this.mdl.clrpckr.hexToRgb(hexVal.slice(5, 7));
          opacity = (this.getDataShrt(crName, `${subcntnr}Opacity`) === this.getDfltData(this.mdl.getCrType(crName), `${subcntnr}Opacity`)) ? this.getDataShrt(crName, 'borderColorOpacity') : this.getDataShrt(crName, `${subcntnr}Opacity`);
        } else {
          hexVal = this.getDataShrt(crName, subcntnr);
          red = this.mdl.clrpckr.hexToRgb(hexVal.slice(1, 3));
          green = this.mdl.clrpckr.hexToRgb(hexVal.slice(3, 5));
          blue = this.mdl.clrpckr.hexToRgb(hexVal.slice(5, 7));
          opacity = this.getDataShrt(crName, `${subcntnr}Opacity`);
        }

        this.mdl.clrpckr.setColorArrayID(idPrefix);

        this.addCSSRule(`.${clrPckrSelector}`, 'backgroundColor', `rgba(${red},${green},${blue},${opacity})`);
        this.addCSSRule(`.${clrPckrSelector}__menu`, 'backgroundColor', `rgba(${red},${green},${blue},${opacity})`);

        this.remEl('colorPckerCntnr');

        // var main;
        // var el;
        // var elC;
        // var elCC;
        // var elCCC;
        // <div>
        main = this.mkEl('', 'colorPckerCntnr');
        main.style = 'display: block;position:absolute;top:-100px;left:40px;';

        el = this.mkEl();
        el.style = 'display: block; position: relative; vertical-align: bottom; height: 25px;width: 250px;margin:0;border-radius: 5px;';
        elC = this.mkEl();
        elC.style = 'display:inline-block;font-family: Arial;font-size: 12px;';
        // <input id='red' style="margin-left: 6px; width: 50px" type="number" name="" value="255">
        elCC = this.mkEl('input', `${idPrefix}red`);
        elCC.style = 'margin-left: 0px; width: 28px;height:18px;background-color:#191919;color:#aaa;font-size:10px;border:none;text-align:center;padding:0;';
        elCC.type = 'number';
        elCC.value = red;// '255'
        this.inEl(elC, elCC);
        elCC = this.mkEl();
        elCC.style = 'display: inline-block;width: 7px;height: 5px;vertical-align: top; border-radius: 2px;/* box-shadow: 1px 1px 5px #000*/; background-color: red;margin-left:-6px;';
        // </div>
        this.inEl(elC, elCC);
        // </div>
        this.inEl(el, elC);
        //    <div style="font-family: Arial;font-size: 12px;">
        elC = this.mkEl();
        elC.style = 'display:inline-block;font-family: Arial;font-size: 12px;';
        elCC = this.mkEl('input', `${idPrefix}grn`);
        elCC.style = 'margin-left: 0px; width: 28px;height:18px;background-color:#191919;color:#aaa;font-size:10px;border:none;text-align:center;padding:0;';
        elCC.type = 'number';
        elCC.value = green;// '0'
        this.inEl(elC, elCC);
        elCC = this.mkEl();
        elCC.style = 'display: inline-block;width: 7px;height: 5px;vertical-align: top; border-radius: 2px;/* box-shadow: 1px 1px 5px #000;*/ background-color: green;margin-left:-6px;';
        // </div>
        this.inEl(elC, elCC);
        // </div>
        this.inEl(el, elC);
        //    <div style="font-family: Arial;font-size: 12px;">
        elC = this.mkEl();
        elC.style = 'display:inline-block;font-family: Arial;font-size: 12px;';
        elCC = this.mkEl('input', `${idPrefix}blu`);
        elCC.style = 'margin-left:0px;width:28px;height:18px;background-color:#191919;color:#aaa;font-size:10px;border:none;text-align:center;padding:0;';
        elCC.type = 'number';
        elCC.value = blue;// '0';
        this.inEl(elC, elCC);
        elCC = this.mkEl();
        elCC.style = 'display: inline-block;width: 7px;height: 5px;vertical-align: top; border-radius: 2px; /*box-shadow: 1px 1px 5px #000;*/ background-color: blue;margin-left:-6px;';
        // </div>
        this.inEl(elC, elCC);
        // </div>
        this.inEl(el, elC);

        elC = this.mkEl();
        elC.style = 'display:inline-block;position:relative;margin-left: 9px;vertical-align:bottom;';
        // input 'hex'
        elCC = this.mkEl('input', `${idPrefix}hex`, '', `{"id":"hex","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}"}`, 'input');
        elCC.style = 'padding:0;height16px;margin-left: 0px; width: 54px;height:18px; font-size:10px;color:#aaa;background:#191919;border:none;text-align:center;padding:0;';
        elCC.type = 'text';
        elCC.value = hexVal;// '#ff0000'
        this.inEl(elC, elCC);
        //
        // OPACITY INPUT-cr
        elCC = this.mkEl('input', `${idPrefix}opc`, '', `{"id":"opc","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}Opacity"}`, 'input');
        elCC.style = 'margin-left: 0; width: 33px;height:18px;background-color:#191919;color:#aaa;font-size:10px;border:none;text-align:center;padding:0;';
        elCC.type = 'number';
        elCC.value = opacity;// 0.9;
        this.inEl(elC, elCC);
        //
        this.inEl(el, elC);
        //
        //    <div style="font-family: Arial;font-size: 12px;">
        elC = this.mkEl('', '', '', '', '', 'cntrst');
        elC.style = 'display: none; font-family: Arial;font-size: 12px;';
        elCC = this.mkEl('input', `${idPrefix}cnt`);
        elCC.style = 'margin-left: 6px; width: 40px;height:18px;background-color:#191919;color:#aaa;font-size:10px;border:none;text-align:right;';
        elCC.type = 'number';
        elCC.value = this.mdl.clrpckr.getContrast(hexVal);
        this.inEl(elC, elCC);
        // </div>
        this.inEl(el, elC);
        //  </div>
        this.inEl(main, el);

        // clrpckr_cntrst-pckr_opcty-pckr__main-cntnr
        el = this.mkEl();
        el.style = 'display:block;position:relative;width: 300px; height: 265px;background:rgba(200,200,200,.4);border-radius:3px;box-shadow: 1px 1px 5px #000;';
        // clrpckr-gradient__main-cntnr
        elC = this.mkEl();
        elC.style = 'width: 255px; height: 255px;display:inline-block;position: relative;vertical-align: top;';
        // clrpckr-gradient-color__overlay
        elCC = this.mkEl('', `${idPrefix}pckrField`);
        elCC.style = `background-image: -webkit-linear-gradient(left, ${this.mdl.clrpckr.getContrastBackgroundGrd(hexVal)});width: 100%; height: 100%;`;
        //
        this.inEl(elC, elCC);
        // clrpckr-gradient-black__overlay
        elCC = this.mkEl();
        elCC.style = 'background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgb(0, 0, 0));position: absolute;left: 0;right: 0;top: 0;bottom: 0;';
        //
        this.inEl(elC, elCC);
        // drag_el__cursor
        elCC = this.mkEl('', `${idPrefix}drag_el`);
        // console.log(this.mdl.clrpckr.getPckrL(hexVal));
        elCC.style = `position: absolute;left: ${this.mdl.clrpckr.getPckrL(hexVal) - 10}px;top: ${this.mdl.clrpckr.getPckrH(hexVal) - 10}px;background: none;width: 20px;height: 20px;cursor: pointer;box-shadow: 1px 1px 5px #000;border:1px solid white;border-radius:50%;`;
        //
        this.inEl(elC, elCC);
        //
        this.inEl(el, elC);
        // contrast-gradient__cntnr
        elC = this.mkEl('', `${idPrefix}cntrst`);
        elC.style = `display: inline-block;height: 255px; width: 15px;border-radius: 5px; background-image: -webkit-linear-gradient(top, rgb(${red},${green},${blue}), rgb(255, 255, 255));margin-left:6px;`;
        // contrast__cursor
        elCC = this.mkEl('', `${idPrefix}cntrstCrsr`);
        elCC.style = `display: block;position: absolute;top:${this.mdl.clrpckr.getContrast(hexVal) - 5}px; height: 0px; width: 17px;border-right: 8px solid #333;border-top: 5px solid rgba(0,0,0,0);border-bottom: 5px solid rgba(0,0,0,0);margin-left: 0px;cursor: pointer;`;
        this.inEl(elC, elCC);
        //
        this.inEl(el, elC);
        // opacity-bground__overlay-cntnr
        elC = this.mkEl('', '', 'background-sasachki');
        elC.style = 'display: inline-block;height:255px; width: 15px;margin-left: 5px;border-radius: 5px;';
        // opcty-gradient__overlay-cntnr
        elCC = this.mkEl('', `${idPrefix}opcty`);
        elCC.style = `display: block;height: 100%; width: 15px;border-radius: 5px;background-image: linear-gradient(180deg,  rgba(0, 0, 0, 0) 0%, rgba(${red},${green},${blue}, 1) 100%);`;
        // opcty__cursor
        elCCC = this.mkEl('', `${idPrefix}opctyCrsr`);
        elCCC.style = `display: block;position: absolute;top:${opacity * 255 - 5}px; height: 0px; width: 17px;border-right: 8px solid #333;border-top: 5px solid rgba(0,0,0,0);border-bottom: 5px solid rgba(0,0,0,0);margin-left: 0px;cursor: pointer;`;
        this.inEl(elCC, elCCC);
        //
        this.inEl(elC, elCC);
        //
        this.inEl(el, elC);
        //
        this.inEl(main, el);
        //
        this.inEl(root, main);
        return root;
        // break;
      }

      case 'title':
        this.inEl(root, this.mkEl('', '', 'title-h2', '', '', title));
        return root;
        // break;

      case 'input':
        dfltID = `id_${this.mdl.getIDNum('new')}`;
        el = this.mkEl('', '', 'input-text');
        // var elC;

        if (title !== '') {
          elC = this.mkEl('', '', 'lebel no-sort', '', '', title);
          this.inEl(el, elC);
        }

        if (subcntnr === 'content' || subcntnr === 'description' || subcntnr === 'url') {
          elC = this.mkEl('textarea', dfltID, 'dark-stl-input  no-sort', `{"id":"${dfltID}","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}"}`, 'input', this.getDataShrt(crName, subcntnr));
          this.inEl(el, elC);
        } else {
          elC = this.mkEl('input', dfltID, 'dark-stl-input  no-sort', `{"id":"${dfltID}","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}"}`, 'input', title);
          elC.type = 'text';
          elC.value = this.getDataShrt(crName, subcntnr);
          this.inEl(el, elC);
        }

        this.inEl(root, el);
        return root;
        // break;

      case 'input_range':
        value = this.getDataShrt(crName, subcntnr);
        // var main;
        // var el;
        // var elC;

        main = this.mkEl('', '', 'input-range-main');

        // label
        el = this.mkEl('label', '', 'input-range-label', '', '', title);
        this.inEl(main, el);
        //
        el = this.mkEl('', '', 'input-range');

        dfltID = `id_${this.mdl.getIDNum('new')}`;
        this.pushDflt(dfltID, container, type, subcntnr);

        // Type Range
        elC = this.mkEl('input', `${dfltID}_range`, 'input__range input__range__wrp');
        elC.min = this.getDfltData(type, `${subcntnr}Min`);
        elC.max = this.getDfltData(type, `${subcntnr}Max`);
        elC.step = this.getDfltData(type, `${subcntnr}Step`);
        elC.value = value;
        elC.type = 'range';
        // elC.setAttribute('data-synch-attr',dfltID+'_number');
        this.inEl(el, elC);
        //

        // Type Num
        elC = this.mkEl('input', `${dfltID}_number`, 'dark-stl-input rem-brdr', `{"id":"${dfltID}_number","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}"}`, 'input');
        elC.min = this.getDfltData(type, `${subcntnr}Min`);
        elC.max = this.getDfltData(type, `${subcntnr}Max`);
        elC.step = this.getDfltData(type, `${subcntnr}Step`);
        elC.type = 'number';
        elC.value = value;
        elC.setAttribute('data-synch-attr', `${dfltID}_range`);
        this.inEl(el, elC);
        //

        if (data.m) {
          // label
          elC = this.mkEl('label', '', 'input-range-label-m', '', '', data.m);
          this.inEl(el, elC);
          //
        }
        elC = this.mkEl('', '', 'back-def__btn');
        this.inEl(el, elC);

        this.inEl(main, el);
        this.inEl(root, main);
        return root;
        // break;

      case 'image': {
        if (title !== '') {
          this.inEl(root, this.mkEl('', '', 'lebel no-sort', '', '', title));
        }
        const id1 = `id_${this.mdl.getIDNum('new')}`;
        const id2 = `id_${this.mdl.getIDNum('new')}`;
        let src = '';
        if (data.subType) {
          switch (data.subType) {
            case 'type1':
              src = `,"src2":"${destID}_${crName}_description_icon","src3":"${destID}_${crName}_subcontaner_description_icon"`;
              break;
            case 'type2':
              src = `,"src3":"${destID}_${crName}_subcontaner_description_icon"`;
              break;
            default: break;
          }
        }
        // var el;
        // var elC;

        el = this.mkEl('', '', 'no-sort');
        // btn rem picture
        elC = this.mkEl('a', '', 'rem-picture-style-btn', `{"dfltImg":"${this.mdl.set.dfltImg}","field":"${id1}","srcs":{"src1":"${id2}"${src}}}`, 'img-rem', 'x');
        this.inEl(el, elC);
        //

        // img cr
        elC = this.mkEl('img', id2, `${id2} ui-upload-image`, `{"field":"${id1}","srcs":{"src1":"${id2}"${src}}}`, 'img-upload');
        elC.setAttribute('src', this.getData(jsn, crName, `${subcntnr}Image`, 'getIMG'));
        this.inEl(el, elC);
        //

        // input hdn saver
        elC = this.mkEl('input', id1, `${id1} hidden`, `{"id":"${id1}","dest":"${destID}","slide":"${crName}","subcntnr":"${subcntnr}Image"}`, 'input');
        elC.value = this.getData(jsn, crName, subcntnr, 'getIMG');
        this.inEl(el, elC);
        //
        this.inEl(root, el);
        this.jCrNd(root, 'collectionImgSETS', crName, jsn, type);

        return root;
        // break;
      }

      case 'sprder':
        this.inEl(root, this.mkEl('', '', 'sprder'));
        return root;
        // break;

      case 'radiuses':
        cr = `
        <div id="${this.mdl.getIDNum('new')}" class='' style="display: block; position: relative;height:35px;">
          <!-- top-left -->
          <div class="r-top-lft"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionRadiuses_m2_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- top-right -->
          <div class="r-top-rgt" data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionRadiuses_m3_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- all -->
          <div class="brdr-all"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionRadiuses_m1_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- bottom-right -->
          <div class="r-bottom-rgt"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionRadiuses_m4_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- bottom-left -->
          <div class="r-bottom-lft"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionRadiuses_m5_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>
        </div>
        `;
        this.inEl(root, cr);
        return root;
        // return this.jCrNd(root, 'collectionRadiuses', crName, jsn, type);
        // break;

      case 'boxBorders':
        return this.jCrNd(root, 'collectionBoxBorders', crName, jsn, type);
        // break;

      case 'boxBordersCr':
        cr = `
        <div id="${this.mdl.getIDNum('new')}" class='' style="display: block; position: relative;height:35px;">
          <!-- border-left -->
          <div class="brdr-lft"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionBoxBorders_m4_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- border-top -->
          <div class="brdr-top" data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionBoxBorders_m1_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- all -->
          <div class="brdr-all"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionBoxBorders_m0_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- border-right -->
          <div class="brdr-rht"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionBoxBorders_m2_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- border-bottom -->
          <div class="brdr-btm"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionBoxBorders_m3_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>
        </div>
        `;
        this.inEl(root, cr);

        return root;
        // break;

      case 'transform':
        return this.jCrNd(root, 'collectionTransform', crName, jsn, type);
        // break;

      case 'filters':
        return this.jCrNd(root, 'collectionFilters', crName, jsn, type);
        // break;

      case 'paddings':
        cr = `
        <div id="${this.mdl.getIDNum('new')}" class='' style="display: block; position: relative;height:35px;">
          <!-- padding-left -->
          <div class="pdg-lft"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionPaddings_m4_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- padding-top -->
          <div class="pdg-top" data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionPaddings_m1_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- all -->
          <div class="pdg-all"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionPaddings_m0_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- padding-right -->
          <div class="pdg-rht"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionPaddings_m2_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- padding-bottom -->
          <div class="pdg-btm"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionPaddings_m3_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>
        </div>
        `;
        this.inEl(root, cr);
        return root;
        // return this.jCrNd(root, 'collectionPaddings', crName, jsn, type);
        // break;

      case 'margins':
        cr = `
        <div id="${this.mdl.getIDNum('new')}" class='' style="display: block; position: relative;height:35px;">
          <!-- margin-left -->
          <div class="mrgn-lft"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionMargins_m4_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- margin-top -->
          <div class="mrgn-top" data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionMargins_m1_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- all -->
          <div class="mrgn-all"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionMargins_m0_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- margin-right -->
          <div class="mrgn-rht"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionMargins_m2_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>

          <!-- margin-bottom -->
          <div class="mrgn-btm"  data-tgl-attrs='{"tglID":"${this.mdl.getIDNum()}", "jDataDest": "collectionMargins_m3_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}"}'>
          </div>
        </div>
        `;
        this.inEl(root, cr);
        return root;
        // return this.jCrNd(root, 'collectionMargins', crName, jsn, type);
        // break;

      case 'addLayerButton': {
        const idinsertBefore = subcntnr;
        // var el;
        // var elC;

        el = this.mkEl('a', `id_${this.mdl.getIDNum('new')}`, 'dark-stl', `tgl-menu-${this.mdl.getIDNum('new')}`, 'toggle-link', '+');
        el.title = this.mdl.set.names.addLayer;
        this.inEl(root, el);

        el = this.mkEl('', `tgl-menu-${this.mdl.getIDNum()}`, 'collections-toggle');

        Object.keys(this.mdl.set.addedLayerTypes).some((menuKey) => {
          elC = this.mkEl('', '', 'dark-stl', `{"id":"${this.mdl.set.addedLayerTypes[menuKey].triggerID}","dest":"${destID}","slide":"${crName}","insertID":"${idinsertBefore}","cntnrType":"${this.mdl.set.addedLayerTypes[menuKey].cType}"}`, 'input', this.mdl.set.addedLayerTypes[menuKey].hint);
          this.inEl(el, elC);
          return false;
        });
        this.inEl(root, el);
        return root;
        // break;
      }

      case 'dellButton':
        this.inEl(root, this.mkEl('', '', 'dell-slide-btn button button-primary', `{"id":"dell_slide_btn","dest":"${destID}","offset":"${crName}","subcntnr":"${subcntnr}","block":"sub-cstmz-block_ID_"}`, 'input', title));
        return root;
        // break;

      case 'addcrNameButton':
        this.inEl(root, this.mkEl('', `${destID}add-slide-btn`, 'add-slide-btn button button-primary', `{"id":"add_slide_btn","dest":"${destID}","insertID":"${subcntnr}"}`, 'input', this.mdl.set.names.add));
        return root;
        // break;

      case 'menuContext':
        Object.keys(this.mdl.set.menuContext).some((menuContext) => {
          el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'dark-stl dstl-blck', `{"id":"${menuContext}","dest":"${destID}","offset":"${crName}"}`, 'input', this.mdl.set.menuContext[menuContext]);
          this.inEl(root, el);
          return false;
        });
        return root;
        // break;

      case 'menuAnimationCntxt': {
        // var el;
        const offset = this.mdl.getCrDestWithoutLastEl(crName);
        // var block = `${crName}-time-line__keyframe__`;
        Object.keys(this.mdl.set.menuAnimationCntxt).some((menuAnimationContext) => {
          el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'dark-stl dstl-blck', `{"id":"${menuAnimationContext}","dest":"${destID}","offset":"${offset}","slide":"${crName}","block":"${data.id}"}`, 'input', this.mdl.set.menuAnimationCntxt[menuAnimationContext]);
          this.inEl(root, el);
          return false;
        });
        return root;
        // break;
      }

      case 'menuFile':
        Object.keys(this.mdl.set.menuFile).some((menuFile) => {
          el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'dark-stl dstl-blck', `{"id":"${menuFile}","dest":"${destID}"}`, 'input', this.mdl.set.menuFile[menuFile]);
          this.inEl(root, el);
          return false;
        });
        return root;
        // break;

      case 'menuMode': {
        // var el;
        hash = this.mdl.set.rwd;
        let a = [];
        // value;
        let hints;
        const altRWDArray = (jsn.hdr && jsn.hdr.altRWD && jsn.hdr.altRWD.cs ? jsn.hdr.altRWD.cs : '');/* AltRWDMode Btns */

        if (altRWDArray) {
          Object.keys(altRWDArray).some((k) => {
            hash[k] = [];
            hash[k].name = altRWDArray[k];
            hash[k].width = k;
            hash[k].descr = 'custom mode';
            return false;
          });
        }

        a = this.getSortedDfltrwdModeArrayByWidth(hash);

        Object.keys(a).some((keyA) => {
          value = ((a[keyA].width === this.mdl.set.rwdDflt) ? this.mdl.set.names.Common : `>${a[keyA].width}${this.mdl.set.names.px}`);
          hints = a[keyA].name;
          el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'dark-stl dstl-blck', `{"id":"set_rwdMode_btn","dest":"${destID}","rwdMode":"${a[keyA].width}"}`, 'input', value);// +' '+hints
          el.title = hints;
          this.inEl(root, el);
          return false;
        });

        el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'dark-stl dstl-blck', `{"id":"add_rwdMode_btn","dest":"${destID}"}`, 'input', '+');
        this.inEl(root, el);
        return root;
        // break;
      }

      case 'menuScale':
        // var el;
        hash = this.mdl.set.scale;

        Object.keys(hash).some((hashKey) => {
          el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'dark-stl dstl-blck', '', '', `${hash[hashKey].perc}%`);
          this.inEl(root, el);
          return false;
        });
        return root;
        // break;

      case 'defaultButton': {
        main = this.mkEl('', '', 'deflt-btn-cr');
        // var el;
        let j = '{';
        let sep = '';
        Object.keys(this.mdl.defaultArray).some((defID) => {
          j += `${sep} "${defID}": "${this.mdl.defaultArray[defID]}"`;
          sep = ',';
          delete this.mdl.defaultArray[defID];
          return false;
        });
        j += '}';

        el = this.mkEl('', '', 'back-def__btn', j, 'sets-deflts');
        // el = this.mkEl(
        //   '',
        //   '',
        //   'btn-algn-right dark-stl dstl-blck',
        //   j,
        //   'sets-deflts',
        //   this.mdl.set.names.setDefault
        // );
        this.inEl(main, el);
        this.inEl(root, main);
        return root;
        // break;
      }

      case 'clrMenuButton':
        this.inEl(root, this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'clr-menu', `{"id":"remMenu_btn","thisID":"id_${this.mdl.getIDNum()}"}`, 'input', 'x'));
        return root;
        // break;

      case 'collectionAnimations':
        return this.jCrNd(root, 'collectionAnimations', crName, jsn, type);
        // break;

      case 'collectionTypo':
        return this.jCrNd(root, 'collectionTypo', crName, jsn, type);
        // break;

      case 'collectionPosition':
        return this.jCrNd(root, 'collectionPosition', crName, jsn, type);
        // break;

      case 'collectionElementStyle':
        return this.jCrNd(root, 'collectionElementStyle', crName, jsn, type);
        // break;

      case 'collectionTimeline': {
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        // var crType;
        const validCrN = {
          cs: false, rwd: true, akf: true, grt: true, grd: true,
        };

        if (this.isCrRoot(crName)) {
          this.inEl(root, this.getCrTimeLineBrush());
        } else {
          this.jCrNd(root, 'cntnr', crName, jsn);
        }

        this.cstmzBlockPriority.cmzBlockPriorityArray.push(idForInsert);
        jsnASC = this.mdl.getRootJsnAscByPriority(this.mdl.getCrsJSN(crName, jsn));
        Object.keys(jsnASC).some((entity) => {
          if (!(this.mdl.getCrNameWithoutNum(entity) in validCrN)) {
            crType = this.mdl.getCrType(`${crName}_${entity}`, jsn);// the slide here is like an oldPrtyPrf and sent like a subcntnr
            if (crType === 'cntnr') {
              this.getCrNd(root, 'timelineCntnrs', `${crName}_${entity}`, crName, jsn);
            } else {
              this.getCrNd(root, 'subcntnrItems', `${crName}_${entity}`, crName, jsn);
            }
          }
          return false;
        });
        return root;
        // break;
      }

      case 'subcntnrItems':
        return this.jCrNd(root, `${type}KF`, crName, jsn, type);
        // break;

      case 'timelineCntnrs':
        // var el;
        // var elC;
        // Main
        el = this.mkEl('', '', 'opt-collections-container-toggle');

        // Cr Menu
        elC = this.mkEl('', '', 'cr-menu');

        // Img Thumbnails
        elCC = this.mkEl('img', `${destID}_${crName}_description_icon`, `${destID}_${crName}_description_icon custmz-img-block-description`);
        elCC.setAttribute('src', this.getData(jsn, crName, 'backgroundImage', 'getIMG'));
        this.inEl(elC, elCC);
        //

        // Description
        elCC = this.mkEl('', '', 'timeline-cr-description', '', '', this.mdl.set.names.Layer);
        // elCC.setAttribute('style','width:44px;text-align: right;padding-right: 7px;');
        this.inEl(elC, elCC);
        //

        // Timeline
        this.inEl(elC, this.getCrTimeLine(crName));
        //

        // add btn
        // elCC = this.mkEl('','','add-akf-el','','','+');
        // this.inEl(elC,elCC);
        //
        this.inEl(el, elC);

        // (/Cr Menu)
        this.inEl(root, el);

        return root;
        // (/Main)
        // break;

      case 'collectionLayers': {
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        // var crType;
        const invalidCrN = {
          cs: false, rwd: true, akf: true, grt: true, grd: true, bsc: true, tsc: true, hvr: true,
        };
        // var ul;
        // var ulItem;
        // Scene Settings
        this.jCrNd(root, 'cntnr', crName, jsn);
        // (ul)
        ul = this.mkEl('ul', idForInsert, 'cstmzblocks-ul ui-sortable cstmzLst', `{"priority":"${prtyPrf}priority","cstmzblock":"${prtyPrf}cstmzblock","blockposition":"${prtyPrf}blockposition"}`, 'sortable-on');
        this.cstmzBlockPriority.cmzBlockPriorityArray.push(idForInsert);
        jsnASC = this.mdl.getRootJsnAscByPriority(this.mdl.getCrsJSN(crName, jsn));
        Object.keys(jsnASC).some((entt) => {
          if (!(this.mdl.getCrNameWithoutNum(entt) in invalidCrN)) {
            crType = this.mdl.getCrType(`${crName}_${entt}`, jsn);
            if (crType === 'cntnr' || crType === 'stdWrp' || crType === 'form') {
              this.getCrNd(ul, 'layerCntnrs', `${crName}_${entt}`, crName, jsn);
            } else {
              this.getCrNd(ul, 'layerItems', `${crName}_${entt}`, crName, jsn);
            }
          }
          return false;
        });
        this.inEl(root, ul);
        // (/ul)
        this.getCrNd(root, 'addLayerButton', crName, idForInsert);
        return root;

        // break;
      }

      case 'layerItems':
        oldPrtyPrf = `${subcntnr}_`;
        // var crTypeName;
        // var elSrt;
        // var el;

        elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${oldPrtyPrf}cstmzblock`, `${oldPrtyPrf}blockposition`, '', crName, `${oldPrtyPrf}priority`);
        el = this.mkEl('span', '', 'rem-layer', `{"id":"dell_layer_btn","dest":"${destID}","offset":"${crName}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(elSrt, el);
        this.jCrNd(elSrt, type, crName, jsn, type);
        this.inEl(root, elSrt);
        return root;
        // break;

      case 'layerCntnrs': {
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        oldPrtyPrf = `${subcntnr}_`;
        // var elSrt;
        // var el;
        // var elC;
        // var elCC;
        // root-sort
        elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${oldPrtyPrf}cstmzblock`, `${oldPrtyPrf}blockposition`, '', crName, `${oldPrtyPrf}priority`);
        // rem-btn
        el = this.mkEl('span', '', 'rem-layer', `{"id":"dell_layer_btn","dest":"${destID}","offset":"${crName}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(elSrt, el);

        // Title
        switch (this.mdl.getCrType(crName)) {
          case 'cntnr':
            crTypeName = this.mdl.set.names.Layer;
            break;
          case 'stdWrp':
            crTypeName = this.mdl.set.names.Section;
            break;
          case 'form':
            crTypeName = this.mdl.set.names.Form;
            break;
          case 'video':
            crTypeName = this.mdl.set.names.Video;
            break;
          default: break;
        }
        el = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, 'opt-collections-container-toggle toggle-title', `{"tglID":"", "contentID":"layers", "destID":"${destID}", "slide":"${crName}"}`, 'tgl-attrs', crTypeName);
        this.inEl(elSrt, el);
        this.inEl(elSrt, el);
        // (/tgl-menu-wrapper)
        this.inEl(root, elSrt);
        //
        return root;
        // break;
      }
      case 'animationKeyframesCntrs': {
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        let p;
        // let r = this.mdl.getRWDMode();
        el = this.mkEl('', idForInsert);
        let cEl;
        let span;
        jsnCr = this.mdl.getCrsJSN(crName, jsn);

        jsnCr = this.getSortedCrByTimelinePos(jsnCr, 'akf', 'akfTimelinePos');
        const d = parseFloat(this.getDataShrt(crName, 'animationDuration'));
        Object.keys(jsnCr).some((keyframesCntr) => {
          cEl = this.mkEl('', this.mdl.getIDNum('new'));
          p = parseFloat(jsnCr[keyframesCntr].cs.akfTimelinePos);
          p = (p * d) / 100;
          p = Math.round(p * 1000) / 1000;
          span = this.mkEl('span', '', 'info-layer', '', '', `${p}sec`);
          this.inEl(cEl, span);
          span = this.mkEl('span', '', 'rem-layer', `{"id":"rem_akfRWDkPrc_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${jsnCr[keyframesCntr].crName}", "block":"${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(cEl, span);
          this.jCrNd(cEl, 'collectionAnimation', `${crName}_${jsnCr[keyframesCntr].crName}`, jsn, type);
          this.inEl(el, cEl);
          return false;
        });

        this.inEl(root, el);

        el = this.mkEl('', '', 'deflt-btn-cr');
        cEl = this.mkEl('a', `id_${this.mdl.getIDNum('new')}`, 'btn-algn-right dark-stl', `{"id":"add_akfRWDkPrc_btn","slide":"${crName}","dest":"${destID}","type":"${type}", "insertID":"${idForInsert}"}`, 'input', '+');
        this.inEl(el, cEl);

        this.inEl(root, el);

        this.getCrNd(root, 'sprder');
        return root;
        // break;
      }

      case 'remGrt__btn':
        this.inEl(root, this.mkEl('span', `remGrt__btn_id_${this.mdl.getIDNum('new')}`, 'rem-layer', `{"id":"rem_grtRWDkPrc_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}", "parentBlock":"remGrt__btn_id_${this.mdl.getIDNum()}"}`, 'input', 'x'));
        return root;
        // break;

      case 'gradientCntrs':
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        // var title;
        // var grdType;
        jsnCr = this.mdl.getCrsJSN(crName, jsn);
        jsnAscCr = {};
        // var ul;
        // var elSrt;
        // var el;
        // var elC;

        // ul
        ul = this.mkEl('ul', idForInsert, 'cstmzblocks-ul ui-sortable cstmzLst', `{"priority":"${prtyPrf}_grd_priority","cstmzblock":"${prtyPrf}cstmzblock","blockposition":"${prtyPrf}blockposition"}`, 'sortable-on');

        this.cstmzBlockPriority.cmzBlockPriorityArray.push(idForInsert);

        Object.keys(jsnCr).some((grdContainer) => {
          if (grdContainer.substr(0, 3) === 'grd') {
            jsnAscCr[grdContainer] = jsnCr[grdContainer];
          }
          return false;
        });

        jsnAscCr = this.mdl.getRootJsnAscByPriority(jsnAscCr);

        Object.keys(jsnAscCr).some((grdC) => {
          // grdType = (jsnAscCr[grdC].cs.gradientType) ? jsnAscCr[grdC].cs.gradientType : 'linear';
          // sort
          elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${prtyPrf}cstmzblock`, `${prtyPrf}blockposition`, '', `${crName}_${grdC}`, `${prtyPrf}_grd_priority`);
          // grt-cr
          el = this.mkEl('', this.mdl.getIDNum('new'), 'gradient__cr');
          // rem-btn
          elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_grtRWDkPrc_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${grdC}", "block":"${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(el, elC);
          //
          // jCr
          this.jCrNd(el, 'collectionGradients', `${crName}_${grdC}`, jsn, type);
          //
          this.inEl(elSrt, el);
          // (/grt-cr)
          this.inEl(ul, elSrt);
          // (/sort)
          return false;
        });

        this.inEl(root, ul);
        // (/ul)

        // btn add_grdRWDkPrc_btn
        el = this.mkEl('', '', 'deflt-btn-cr');
        elC = this.mkEl('a', `id_${this.mdl.getIDNum('new')}`, 'btn-algn-right dark-stl', `{"id":"add_grdRWDkPrc_btn", "insertID":"${idForInsert}","slide":"${crName}","dest":"${destID}","type":"${type}"}`, 'input', '+');// this.mdl.set.names.addGradient
        this.inEl(el, elC);
        this.inEl(root, el);
        //

        this.getCrNd(root, 'sprder');
        return root;
        // break;

      case 'gradientPointCntrs': {
        // var headerInsertID = `id_${this.mdl.getIDNum()}`;
        const idToInsertColorMenu = `tglID_${this.mdl.getIDNum('new')}`;
        // let headerClr = '';
        const headerType = type;
        // let headerPos = '';
        const grtDivider = ', ';
        // let outDataBody = '';
        let outDataGrd = '';
        // let report = '';
        let color;
        let rgb;
        // let opacity;
        let pos;
        jsnCr = this.mdl.getCrsJSN(crName, jsn);
        const grdArr = [];
        let ai = 0;
        let hold = [];

        Object.keys(jsnCr).some((grdPointC) => {
          if (grdPointC.substr(0, 3) === 'grt') {
            grdArr[ai] = jsnCr[grdPointC];
            ai += 1;
          }
          return false;
        });

        for (let pass = 1; pass < ai; pass += 1) {
          for (let i = 0; i < ai - 1; i += 1) {
            if (parseFloat(grdArr[i].cs.grdLinePos) > parseFloat(grdArr[i + 1].cs.grdLinePos)) {
              hold = grdArr[i];
              grdArr[i] = grdArr[i + 1];
              grdArr[i + 1] = hold;
            }
          }
        }
        Object.keys(grdArr).some((grdLineC) => {
          if (grdArr[grdLineC].cs.grdLinePos) {
            pos = grdArr[grdLineC].cs.grdLinePos;
            color = (grdArr[grdLineC].cs.backgroundColor) ? grdArr[grdLineC].cs.backgroundColor : this.getDfltData(type, 'backgroundColor');
            opacity = (grdArr[grdLineC].cs.backgroundColorOpacity) ? grdArr[grdLineC].cs.backgroundColorOpacity : this.getDfltData(type, 'backgroundColorOpacity');
            rgb = this.mdl.clrpckr.hexToRgbJSN(color);
            outDataGrd += `${grtDivider}rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity}) ${pos}%`;
          }
          return false;
        });

        outDataGrd = `linear-gradient(to right${outDataGrd});`;

        // var el;
        // var elC;
        // var elCC;
        const prop = 'background-image: ';
        const finOutDataGrd = `${prop}-webkit-${outDataGrd}${prop}-moz-${outDataGrd}${prop}-ms-${outDataGrd}${prop}-o-${outDataGrd}${prop}${outDataGrd}`;

        // (gradients example panel)
        el = this.mkEl('', '', 'gradient__background');
        elC = this.mkEl('', `${crName}_gradient__dynamic`, 'gradient__dynamic', `{"id":"add_grtRWDkPrc_btn","insertID":"${idToInsertColorMenu}","idToInsertColorMenu":"${idToInsertColorMenu}","slide":"${crName}","dest":"${destID}","type":"${headerType}"}`, 'input');
        elC.setAttribute('style', finOutDataGrd);
        this.inEl(el, elC);
        this.inEl(root, el);
        // (/gradients example panel)

        // (colorstops panel)
        el = this.mkEl('', idToInsertColorMenu, 'color-stops color-stops-color noselect');
        el.title = 'Click to add a color stop';
        /* colorstop array */
        Object.keys(jsnCr).some((c) => {
          if (c.substr(0, 3) === 'grt') {
            pos = (jsnCr[c].cs.grdLinePos) ? jsnCr[c].cs.grdLinePos : this.getDfltData(type, 'grdLinePos');
            color = (jsnCr[c].cs.backgroundColor) ? jsnCr[c].cs.backgroundColor : this.getDfltData(type, 'backgroundColor');
            opacity = (jsnCr[c].cs.backgroundColorOpacity) ? jsnCr[c].cs.backgroundColorOpacity : this.getDfltData(type, 'backgroundColorOpacity');
            rgb = this.mdl.clrpckr.hexToRgbJSN(color);
            /* stopColorPicker */
            elC = this.mkEl('', `stop_color_id_${crName}_${c}`, 'color-stop color-stop-num');
            elC.title = 'Color stop';
            elC.setAttribute('data-gradient-synch', `{"synchGrtID":"synchID_${this.mdl.getIDNum('new')}"}`);
            elC.setAttribute('style', `left: ${pos}%;`);// color="" position="96" imarker="3"
            elCC = this.mkEl('', `stop_color_bg_id_${crName}_${c}`, `color stop_color_bg_id_${crName}_${c}`, `stop_color_bg_id_${crName}_${c}`, 'stp-clrbg-slctr');
            elCC.setAttribute('data-tgl-attrs', `{"tglID":"${idToInsertColorMenu}", "jDataDest": "collectionGradientPointsType2_m1_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}_${c}"}`);
            this.addCSSRule(`.stop_color_bg_id_${crName}_${c}`, 'backgroundColor', `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`);
            this.inEl(elC, elCC);
            elCC = this.mkEl('input', `synchID_${this.mdl.getIDNum()}`, '', `{"id":"","dest":"${destID}","slide":"${crName}_${c}","subcntnr":"grdLinePos"}`, 'input');
            elCC.type = 'hidden';
            elCC.value = pos;
            this.inEl(elC, elCC);
            this.inEl(el, elC);
          }
          return false;
        });
        /* colorstop array */
        this.inEl(root, el);
        // (/colorstops panel)
        return root;
        // break;
      }

      case 'collectionShadowForCntr':
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        // var title;
        // var grdType;
        jsnCr = this.mdl.getCrsJSN(crName, jsn);
        jsnAscCr = {};
        ecx = 0;
        // var ul;
        // var elSrt;
        // var el;
        // var elC;

        // ul
        ul = this.mkEl('ul', idForInsert, 'cstmzblocks-ul ui-sortable cstmzLst', `{"priority":"${prtyPrf}_grd_priority","cstmzblock":"${prtyPrf}cstmzblock","blockposition":"${prtyPrf}blockposition"}`, 'sortable-on');

        this.cstmzBlockPriority.cmzBlockPriorityArray.push(idForInsert);

        Object.keys(jsnCr).some((shadowC) => {
          if (shadowC.substr(0, 3) === 'bsc') {
            jsnAscCr[shadowC] = jsnCr[shadowC];
          }
          return false;
        });

        jsnAscCr = this.mdl.getRootJsnAscByPriority(jsnAscCr);

        Object.keys(jsnAscCr).some((c) => {
          // sort
          elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${prtyPrf}cstmzblock`, `${prtyPrf}blockposition`, '', `${crName}_${c}`, `${prtyPrf}_grd_priority`);
          // grt-cr
          el = this.mkEl('', '', 'gradient__cr');
          // rem-btn
          elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_shadow_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${c}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(el, elC);
          //
          // jCr
          this.jCrNd(el, 'collectionShadowForCntr', `${crName}_${c}`, jsn, type);
          //
          this.inEl(elSrt, el);
          // (/grt-cr)
          this.inEl(ul, elSrt);
          // (/sort)
          ecx += 1;
          return false;
        });

        if (ecx === 0) {
          // sort
          elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${prtyPrf}cstmzblock`, `${prtyPrf}blockposition`, '', `${crName}_bsc0`, `${prtyPrf}_grd_priority`);
          // grt-cr
          el = this.mkEl('', '', 'gradient__cr');
          // rem-btn
          elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_shadow_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_bsc0", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(el, elC);
          //
          // jCr
          this.jCrNd(el, 'collectionShadowForCntr', `${crName}_bsc0`, jsn, type);
          //
          this.inEl(elSrt, el);
          // (/grt-cr)
          this.inEl(ul, elSrt);
          // (/sort)
        }

        this.inEl(root, ul);
        // (/ul)

        // btn add_shadow_cr_btn
        el = this.mkEl('', '', 'deflt-btn-cr');
        elC = this.mkEl('a', `id_${this.mdl.getIDNum('new')}`, 'btn-algn-right dark-stl dstl-blck', `{"id":"add_shadow_cr_btn", "insertID":"${idForInsert}","slide":"${crName}","dest":"${destID}","type":"${type}"}`, 'input', '+');// this.mdl.set.names.addShadow
        this.inEl(el, elC);
        this.inEl(root, el);
        //

        this.getCrNd(root, 'sprder');
        return root;
        // break;

      case 'collectionShadowForText':
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        // var title;
        // var grdType;
        jsnCr = this.mdl.getCrsJSN(crName, jsn);
        jsnAscCr = {};
        ecx = 0;
        // var ul;
        // var elSrt;
        // var el;
        // var elC;
        // ul
        ul = this.mkEl('ul', idForInsert, 'cstmzblocks-ul ui-sortable cstmzLst', `{"priority":"${prtyPrf}_grd_priority","cstmzblock":"${prtyPrf}cstmzblock","blockposition":"${prtyPrf}blockposition"}`, 'sortable-on');
        this.cstmzBlockPriority.cmzBlockPriorityArray.push(idForInsert);

        Object.keys(jsnCr).some((c) => {
          if (c.substr(0, 3) === 'tsc') {
            jsnAscCr[c] = jsnCr[c];
          }
          return false;
        });

        jsnAscCr = this.mdl.getRootJsnAscByPriority(jsnAscCr);

        Object.keys(jsnAscCr).some((c) => {
          // sort
          elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${prtyPrf}cstmzblock`, `${prtyPrf}blockposition`, '', `${crName}_${c}`, `${prtyPrf}_grd_priority`);
          // grt-cr
          el = this.mkEl('', '', 'gradient__cr');
          // BTN rem-btn
          elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_shadow_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${c}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(el, elC);
          //
          // jCr
          this.jCrNd(el, 'collectionShadowForText', `${crName}_${c}`, jsn, type);
          //
          this.inEl(elSrt, el);
          // (/grt-cr)
          this.inEl(ul, elSrt);
          // (/sort)
          ecx += 1;
          return false;
        });

        if (ecx === 0) {
          // sort
          elSrt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${prtyPrf}cstmzblock`, `${prtyPrf}blockposition`, '', `${crName}_tsc0`, `${prtyPrf}_grd_priority`);
          // grt-cr
          el = this.mkEl('', '', 'gradient__cr');
          // BTN rem-btn
          elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_shadow_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_tsc0", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(el, elC);
          //
          // jCr
          this.jCrNd(el, 'collectionShadowForText', `${crName}_tsc0`, jsn, type);
          //
          this.inEl(elSrt, el);
          // (/grt-cr)
          this.inEl(ul, elSrt);
          // (/sort)
        }
        this.inEl(root, ul);
        // (/ul)

        // BTN add_text_shadow_btn
        el = this.mkEl('', '', 'deflt-btn-cr');
        elC = this.mkEl('a', `id_${this.mdl.getIDNum('new')}`, 'btn-algn-right dark-stl dstl-blck', `{"id":"add_text_shadow_btn", "insertID":"${idForInsert}","slide":"${crName}","dest":"${destID}","type":"${type}"}`, 'input', '+');// this.mdl.set.names.addShadow
        this.inEl(el, elC);
        this.inEl(root, el);
        //

        this.getCrNd(root, 'sprder');

        return root;
        // break;

      case 'collectionHover': {
        idForInsert = `id_${this.mdl.getIDNum('new')}`;
        prtyPrf = `${crName}_`;
        // var title;
        // var grdType;
        jsnCr = this.mdl.getCrsJSN(crName, jsn);
        jsnAscCr = {};
        // var ul;
        let li;
        // var el;
        // var elC;

        Object.keys(jsnCr).some((c) => {
          if (c.substr(0, 3) === 'hvr') {
            jsnAscCr[c] = jsnCr[c];
          }
          return false;
        });

        // ul
        ul = this.mkEl('ul', idForInsert);
        li = this.mkEl('li', this.mdl.getIDNum('new'), 'athm-cstmz-touch-action__initial');// li = this.sortableNode( 'sub-cstmz-block_ID_'+this.mdl.getIDNum('new'), prtyPrf+'cstmzblock', prtyPrf+'blockposition', '', crName+'_'+c, prtyPrf+'_grd_priority');
        el = this.mkEl('', '', 'gradient__cr');
        this.jCrNd(el, 'collectionClick', crName, jsn, type);// crName+'_'+c
        this.inEl(li, el);
        this.inEl(ul, li);

        Object.keys(jsnAscCr).some((c) => {
          // li
          li = this.mkEl('li', this.mdl.getIDNum('new'), 'athm-cstmz-touch-action__initial');// li = this.sortableNode( 'sub-cstmz-block_ID_'+this.mdl.getIDNum('new'), prtyPrf+'cstmzblock', prtyPrf+'blockposition', '', crName+'_'+c, prtyPrf+'_grd_priority');
          // grt-cr
          el = this.mkEl('', '', 'gradient__cr');
          // BTN rem-btn
          elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_hvr_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${c}", "block":"${this.mdl.getIDNum()}"}`, 'input', 'x');
          this.inEl(el, elC);
          //
          // jCr
          this.jCrNd(el, 'collectionHover', `${crName}_${c}`, jsn, type);
          //
          this.inEl(li, el);
          // (/grt-cr)
          this.inEl(ul, li);
          // (/li)
          return false;
        });

        this.inEl(root, ul);

        // BTN add_hvr_btn
        el = this.mkEl('', '', 'deflt-btn-cr');
        elC = this.mkEl('a', `id_${this.mdl.getIDNum('new')}`, 'btn-algn-right dark-stl dstl-blck', `{"id":"add_hover_btn", "insertID":"${idForInsert}","slide":"${crName}","dest":"${destID}","type":"${type}"}`, 'input', '+');
        this.inEl(el, elC);
        this.inEl(root, el);
        return root;
        // break;
      }

      default: {
        break;
      }
    }
    return null;
  }

  isCrRoot(crName) {
    return crName.split('_').length <= 1;
  }

  getCrTimeLineBrush() {
    const root = this.mkEl('', '', 'time-line');
    let el;
    let elC;

    // (root)
    // (tl-headeer-percents)
    el = this.mkEl('', '', 'time-line__items');
    // (tl-percents)
    elC = this.mkEl('', '', '', '', '', '0%');
    this.inEl(el, elC);
    elC = this.mkEl('', '', '', '', '', '25%');
    this.inEl(el, elC);
    elC = this.mkEl('', '', '', '', '', '50%');
    this.inEl(el, elC);
    elC = this.mkEl('', '', '', '', '', '75%');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'last', '', '', '100%');
    this.inEl(el, elC);
    //
    this.inEl(root, el);
    //
    // (tl-brush)
    el = this.mkEl('', 'time-line__brush', 'time-line__brush');
    // (tl-cursor)
    elC = this.mkEl('', 'time-line-cursor', 'metka time-line-cursor animate');
    elC.title = 'Animation Cursor';
    this.inEl(el, elC);
    elC = this.mkEl('', 'next-slide-trigger', 'next-slide-trigger');
    elC.title = 'Next Slide Trigger';
    this.inEl(el, elC);
    //
    // (tl-item)
    elC = this.mkEl('', '', 'time-line__brush-item item-0-perc');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item item-25-perc');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item item-50-perc');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item item-75-perc');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item');
    this.inEl(el, elC);
    elC = this.mkEl('', '', 'time-line__brush-item last');
    this.inEl(el, elC);
    //
    this.inEl(root, el);
    //
    return root;
    // (/root)
  }

  getCrTimeLine(crName) {
    const jsn = this.mdl.getJsn();
    const destID = this.mdl.getDestID();
    let prevPos = 0;
    const timeout = this.getInterval('sec');
    // const mode = this.mdl.getRWDMode();
    const crJSN = this.mdl.getCrsJSN(crName, jsn);
    const animationDuration = this.getDataShrt(crName, 'animationDuration');
    const root = this.mkEl('', '', 'time-line__keyframes');
    let el;
    let elC;
    let tLinePosA = [];
    let elWidthRule;
    let cssClassPost;
    let currentLocation;

    Object.keys(crJSN).some((c) => {
      if (c.substr(0, 3) === 'akf') {
        tLinePosA.push(c);
      }
      return false;
    });

    tLinePosA = this.getSortedTLinePosA(tLinePosA, crJSN);
    const l = (tLinePosA.length - 1).toString();
    Object.keys(tLinePosA).some((pos) => {
      if (pos === '0') { /* first */
        cssClassPost = l !== '0' && this.isAnimationGaps(tLinePosA, pos, crJSN) ? ' delay' : ' key';
        currentLocation = l === '0' ? 100 : parseInt(crJSN[tLinePosA[(parseInt(pos, 10) + 1)]].cs.akfTimelinePos, 10);
      }
      if (pos !== l && pos > 0) { /* current */
        cssClassPost = this.isAnimationGaps(tLinePosA, pos, crJSN) ? ' delay' : ' key';
        currentLocation = parseInt(crJSN[tLinePosA[pos]].cs.akfTimelinePos, 10) - prevPos;
      }
      if (pos === l) { /* lastone */
        cssClassPost = ' key';
        currentLocation = (100 - parseInt(crJSN[tLinePosA[pos]].cs.akfTimelinePos, 10));
      }
      elWidthRule = `${(animationDuration * currentLocation) / timeout}%`;
      this.addCSSRule(`.${crName}-time-line__keyframe__${pos}`, 'elWidth', elWidthRule);

      el = this.mkEl(
        '',
        this.mdl.getIDNum('new'),
        `${crName}-time-line__keyframe__${pos} time-line__keyframes-item${cssClassPost}`,
        `{"tglID": "last_setings_el_for_toggle_after", "contexMenu": "menuAnimationCntxt", "contentID": "collectionAnimation_menuElementStyleEntranceAnimation_content", "destID": "${destID}", "slide": "${crName}_${tLinePosA[pos]}"}`,
        'pst-attrs',
      );
      elC = this.mkEl(
        'span',
        '',
        'rem-layer',
        `{"id": "rem_akfRWDkPrc_btn", "dest": "${destID}", "offset": "${crName}", "slide": "${crName}_${tLinePosA[pos]}", "block": "${this.mdl.getIDNum()}"}`,
        'input',
        'x',
      );
      this.inEl(el, elC);
      /* contextMenu */
      // el.setAttribute('data-edit-mode','{"cssCrName":"'+crName+'","destID":"'+destID+'"}');
      this.inEl(root, el);
      prevPos = crJSN[tLinePosA[pos]].cs.akfTimelinePos;
      return false;
    });
    return root;
  }

  isAnimationGaps(tLinePos, pos, crJSN) {
    const prop = ['opacity', 'translateY', 'translateX', 'translateZ', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scaleX', 'scaleY', 'elHeight', 'elWidth'];
    let flag = true;
    let curProperty;
    let nextProperty;
    Object.keys(prop).some((c) => {
      curProperty = crJSN[tLinePos[pos]].cs[prop[c]];
      nextProperty = crJSN[tLinePos[Number(pos) + 1]].cs[prop[c]];
      flag = curProperty === nextProperty;
      if (!flag) {
        return true;
      }
      return false;
    });
    // for (const c in prop) {
    //   curProperty = crJSN[tLinePos[pos]].cs[prop[c]];
    //   nextProperty = crJSN[tLinePos[Number(pos) + 1]].cs[prop[c]];
    //   flag = curProperty === nextProperty;
    //   if (!flag) {
    //     return flag;
    //   }
    // }
    return flag;
  }

  getSortedTLinePosA(incomTLine, crJSN) {
    let hold = [];
    const tLine = incomTLine;
    let curPosition;
    let nextPosition;

    Object.keys(tLine).some(() => {
      for (let i = 0, l = tLine.length; i < l - 1; i += 1) {
        curPosition = Number(crJSN[tLine[i]].cs.akfTimelinePos);
        nextPosition = Number(crJSN[tLine[i + 1]].cs.akfTimelinePos);
        if (curPosition > nextPosition) {
          hold = tLine[i];
          tLine[i] = tLine[i + 1];
          tLine[i + 1] = hold;
        }
      }
      return false;
    });

    return tLine;
  }

  addCntnr(ob, contentID, destID, crName, obToIns = '') {
    const jsn = this.mdl.getJsn();

    switch (contentID) {
      case 'timeLine': {
        // let intervalmSec;
        // let obResult;
        let cssObj;
        const timeVal = document.getElementById('time').value;
        // let perc;
        // let rootCrName;
        // let nextSlideTriggerTime;

        const timeline = this.mkEl('', `${destID}_${crName}_main_block`, 'custmz-block');
        this.inEl(timeline, this.mkEl('', '', 'clr-menu clr-menu-timeline', `{"tglID":"${destID}_${crName}_main_block"}`, 'pst-attrs-rem', 'x'));
        this.getCrNd(timeline, 'collectionTimeline', crName, '', jsn);

        this.arrasEl(obToIns);
        this.inEl(obToIns, timeline);

        const intervalmSec = this.getInterval();
        const obResult = parseFloat(timeVal) * 1000;
        const perc = (100 * obResult) / intervalmSec;

        cssObj = this.mdl.getCstmClassRule('.time-line-cursor.animated');

        if (parseFloat(timeVal) >= (intervalmSec / 1000)) {
          cssObj.style.animationDelay = '0s';
        } else {
          cssObj.style.animationDelay = `-${timeVal}s`;
        }
        cssObj = this.mdl.getCstmClassRule('.time-line-cursor');

        if (this.mdl.animationPlayState === 'running') {
          cssObj.style.animationPlayState = 'running';
          this.changeCClass('time-line-cursor', 'animate', 'animated');
        } else {
          cssObj.style.left = `${perc}%`;
        }

        cssObj = this.mdl.getCstmClassRule('.next-slide-trigger');
        const rootCrName = this.getRootCrName(crName);
        /*
        *  100 - 100% - full animn time (%)
        * 10 - 10s  - full animn time (sec)
        */
        const nextSlideTriggerTime = (this.getDataShrt(rootCrName, 'animationDuration') * 100) / 10;
        // console.log(this.getDataShrt(rootCrName,'animationDuration'));
        cssObj.style.left = `${nextSlideTriggerTime}%`;

        this.mdl.clrpckr.setPckrs();
        this.dragAnimationCursorModel(intervalmSec);
        this.cstmzBlockPriority.setPriorities(true);

        this.dragElement(`${destID}_${crName}_main_block`);

        break;
      }

      case 'layers': {
        const leyersMenu = this.mkEl('', '', 'collections-pst');
        this.getCrNd(leyersMenu, 'collectionLayers', crName, '', jsn);
        this.afterEl(obToIns, leyersMenu);
        this.mdl.clrpckr.setPckrs();
        this.cstmzBlockPriority.setPriorities(true);
        break;
      }

      case 'crVal': {
        const tglAttrsJSN = JSON.parse(ob.getAttribute('data-tgl-attrs'));
        const itemMenu = this.mkEl('', '', 'collections-pst');
        this.jCrNd(itemMenu, tglAttrsJSN.jDataDest, crName, jsn);
        this.afterEl(obToIns, itemMenu);
        this.mdl.clrpckr.setPckrs();
        this.mdl.draggableFlat();
        this.cstmzBlockPriority.setPriorities(true);
        break;
      }

      default: break;
    }
  }

  getSceneMenuUpper(crName) {
    let el;
    const scalePerc = (this.mdl.set.customizeMode ? '25%' : '100%');
    const destID = this.mdl.getDestID();

    /* RWD */
    this.remEl('btnRWDUpperMenu');
    el = this.mkEl('', 'btnRWDUpperMenu', 'menu_rwd', `{"tglID":"last_setings_el_for_toggle_after", "contentID":"menuMode", "destID":"${destID}", "slide":"hdr"}`, 'pst-attrs');
    el.title = 'Styles Breakpoint (RWD)';
    // this.inEl('cstmzblocks-upper-menu',el);
    this.beforEl('menuSlides', el);
    //

    /* ScalePerc */
    this.remEl('btnScalePercUpperMenu');
    el = this.mkEl('', 'btnScalePercUpperMenu', 'menu_scale', `{"tglID":"last_setings_el_for_toggle_after", "contentID":"menuScale", "destID":"${destID}", "slide":"hdr"}`, 'pst-attrs', scalePerc);
    el.title = 'Scale';
    // this.inEl('cstmzblocks-upper-menu',el);
    this.beforEl('menuSlides', el);
    //

    /* Btn Layers */
    this.remEl('btnLayersUpperMenu');
    el = this.mkEl('', 'btnLayersUpperMenu', `${destID}_${crName}_tgl_block layers-btn`, `{"tglID":"last_setings_el_for_toggle_after", "getConterID":"collectionLayers", "destID":"${destID}", "slide":"${crName}"}`, 'pst-attrs');
    el.title = this.mdl.set.names.Layers;
    // this.inEl('cstmzblocks-upper-menu',el);
    this.beforEl('menuSlides', el);
    //

    /* Btn Runner */
    this.remEl('btnRunnerMenu');
    el = this.mkEl('', 'btnRunnerMenu', 'head-body-hand');
    el.title = 'Animation';
    const elC = this.mkEl('', '', 'foots');
    this.inEl(el, elC);
    this.beforEl('menuSlides', el);

    /* BTN Rem Scene */
    this.remEl('remTheScene');
    el = this.mkEl('', 'remTheScene', 'rem-slide', `{"id":"dell_slide_btn","dest":"${destID}","offset":"${crName}","block":"${destID}_${crName}_main-cstmz-block"}`, 'input', 'x');
    el.title = `remove Scene ${crName}`;
    this.inEl('menuSlides', el);
    //
  }

  getSceneMenuBottom(crName) {
    // let main;
    // let el;
    let elC;
    // let elCC;
    const id = this.mdl.getDestID();

    /* Main */
    const main = this.mkEl('', '', 'dragElement divSceneBottomMenuWrapper', `{"crName":"${crName}"}`, 'cr-name');

    /* SceneBottomMenuPlayStateNav */
    const el = this.mkEl('', 'animationPannel', 'divSceneBottomMenuPlayStateNav');

    /* Btn Timeline */
    elC = this.mkEl('', '', 'timeline_btn', `{"tglID":"lastElForPastAfterEachAnother", "contentID":"timeLine", "destID":"${id}", "slide":"${crName}"}`, 'tgl-attrs');
    elC.title = 'Timeline';
    this.inEl(el, elC);
    //

    /* Btn toTheStartOfAnimation */
    elC = this.mkEl('', 'toStrtBtn', 'toStrtBtn', 'to_strt_btn', 'play');// elC.setAttribute('data-play','to_strt_btn');
    elC.title = 'to the Animation Start';
    this.inEl(el, elC);
    //

    /* Btn Play */
    elC = this.mkEl('', 'play-slide', 'play-slide', 'play_slide_btn', 'play');// elC.setAttribute('data-play','play_slide_btn');
    elC.title = 'Play';
    this.inEl(el, elC);
    //

    /* Btn toTheEndOfAnimation */
    elC = this.mkEl('', 'toEndBtn', 'toEndBtn', 'to_end_btn', 'play');// elC.setAttribute('data-play','to_end_btn');
    elC.title = 'to the Animation End';
    this.inEl(el, elC);
    //

    /* Time */
    elC = this.mkEl('input', 'time', 'time');
    elC.type = 'number';
    elC.step = '0.001';
    elC.min = '0';
    elC.value = this.getInterval('sec');// '10.000'
    this.inEl(el, elC);
    //

    /* Time Hint 'sec' */
    elC = this.mkEl('', '', 'time-sec', '', '', this.mdl.set.names.sec);
    this.inEl(el, elC);
    //

    this.inEl(main, el);
    // SceneBottomMenuPlayStateNav

    return main;
  }

  /**
  * Retriev UI for insert
  *
  * @param String   id    is container's ID that will be extended by that UI
  * @param String   crName  (now can be anything...)
  * @param JSON   jsn   contaner's setings
  * @return String/HTML   UI
  */
  getSlideForm(crName = 'c0') {
    const destID = this.mdl.getDestID();
    let jsn = '';

    if (crName === 'hdr') {
      const divSlidesEnque = this.mkEl('', '', 'dark-stl dstl-inline', `{"tglID":"last_setings_el_for_toggle_after", "contentID":"mainMenuSliderSettings", "destID":"${destID}", "slide":"${crName}"}`, 'pst-attrs', this.mdl.set.names.Settings);
      return divSlidesEnque;
    }
    if (jsn === '') {
      jsn = this.mdl.getJsn();
    }
    // let main;
    let el;
    // let elC;
    // let elCC;

    this.getSceneMenuUpper(crName);

    const main = this.mkEl('', `${destID}_${crName}_main-cstmz-block`, 'main-cstmz-block');
    // Edit Screen
    el = this.mkEl('', `${destID}_${crName}_section`, `athm-cstmz__edit-main-screen ${this.mdl.set.customizeMode ? 'scale-25-percent' : 'scale-100-percent'}`, `{"crName":"${crName}"}`, 'cr-name');
    const elC = this.getMainFrameHtmlContent(jsn[crName], crName);
    const elCC = this.mkEl('', 'mainFramePckr', 'mainFramePckr');
    this.inEl(elC, this.getMainFramePckr(jsn[crName], crName, elCC));
    this.inEl(el, elC);
    this.inEl(main, el);
    //
    el = this.mkEl();
    el.style = 'display:block;position:relative;';
    this.inEl(el, this.getSceneMenuBottom(crName));
    this.inEl(el, this.mkEl('', 'lastElForPastAfterEachAnother', 'time-line__wrp'));
    this.inEl(main, el);
    return main;
  }

  getMainFramePckr(incomCrJsn, crName, root = '') {
    const destID = this.mdl.getDestID();
    const validCrN = {
      hdr: false,
      cs: false,
      rwd: true,
      akf: true,
      grt: true,
      grd: true,
      bsc: true,
      tsc: true,
      hvr: true,
    };
    const pID = this.mdl.getPID();
    let type;
    let n;
    let cssForStdAndForm;

    const crJsn = this.mdl.getRootJsnAscByPriority(incomCrJsn);

    Object.keys(crJsn).some((cr) => {
      if (!(this.mdl.getCrNameWithoutNum(cr) in validCrN)) {
        type = crJsn[cr].cs.type;
        cssForStdAndForm = ((type === 'stdWrp' || type === 'form') ? 'std-section__wrapper ' : '');
        if (type === 'cntnr' || type === 'stdWrp' || type === 'form' || type === 'video') {
          n = this.mkEl('', '', `${cssForStdAndForm}drgbl-elmnt ${type}h${pID}  h${pID}-${crName}-${cr}-${type} ${destID}-${crName}-${cr} notanimate edit-mode`, `{"prefix":"header","cssCrName":"${crName}-${cr}","crType":"${type}","destID":"${destID}"}`, 'edit-mode');
          this.inEl(root, this.getMainFramePckr(crJsn[cr], `${crName}-${cr}`, n));
        } else {
          this.inEl(root, this.mkEl('', '', `drgbl-elmnt ${type}h${pID}  h${pID}-${crName}-${cr}-${type} ${destID}-${crName}-${cr} notanimate edit-mode`, `{"prefix":"header","cssCrName":"${crName}-${cr}","crType":"${type}","destID":"${destID}"}`, 'edit-mode'));
        }
      }
      return false;
    });
    return root;
  }

  getMainFrameHtmlContent(incomCrJsn, crName, inComArgRoot = '') {
    const destID = this.mdl.getDestID();
    const validCrN = {
      hdr: false,
      cs: false,
      rwd: true,
      akf: true,
      grt: true,
      grd: true,
      bsc: true,
      tsc: true,
      hvr: true,
    };
    const pID = this.mdl.getPID();
    let type;
    const root = inComArgRoot === '' ? this.mkEl('', `${destID}_${crName}_section`, `metka cntnrh${pID} h${pID}-${crName}-cntnr animate`) : inComArgRoot;
    let n;
    let cssForStdAndForm;

    const crJsn = this.mdl.getRootJsnAscByPriority(incomCrJsn);

    Object.keys(crJsn).some((cr) => {
      if (!(this.mdl.getCrNameWithoutNum(cr) in validCrN)) {
        type = crJsn[cr].cs.type;
        cssForStdAndForm = ((type === 'stdWrp' || type === 'form') ? 'std-section__wrapper ' : '');
        switch (type) {
          case 'cntnr':
            n = this.mkEl('', `h${pID}-${crName}-${cr}-${type}`, `${cssForStdAndForm}metka ${type}h${pID} h${pID}-${crName}-${cr}-${type} animate`, '', '');
            this.inEl(root, this.getMainFrameHtmlContent(crJsn[cr], `${crName}-${cr}`, n));
            break;
          case 'stdWrp':
          case 'form':
            n = this.mkEl((type === 'form' ? 'form' : ''), `h${pID}-${crName}-${cr}-${type}`, `${cssForStdAndForm}metka ${type}h${pID} h${pID}-${crName}-${cr}-${type} animate`, '', '', this.getData(crJsn, cr, 'content', type));
            this.inEl(root, this.getMainFrameHtmlContent(crJsn[cr], `${crName}-${cr}`, n));
            break;
          case 'video':
            n = this.mkEl('video', `h${pID}-${crName}-${cr}-${type}`, `${cssForStdAndForm}metka ${type}h${pID} h${pID}-${crName}-${cr}-${type} animate`, '', '', this.getData(crJsn, cr, 'content', type));
            n.autoplay = true;
            n.type = 'video/mp4';
            n.controls = true;
            this.inEl(root, n);
            break;
          default:
            this.inEl(root, this.mkEl('', `h${pID}-${crName}-${cr}-${type}`, `metka ${type}h${pID} h${pID}-${crName}-${cr}-${type} animate`, '', '', this.getData(crJsn, cr, 'content', type)));
            break;
        }
      }
      return false;
    });

    return root;
  }

  getSubcntnrForm(type, crName, destID, jsn, prtyPrf = '') {
    const srt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${prtyPrf}cstmzblock`, `${prtyPrf}blockposition`, '', crName, `${prtyPrf}priority`);
    const el = this.mkEl('', '', 'rem-layer', `{"id":"dell_layer_btn","dest":"${destID}","offset":"${crName}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
    this.inEl(srt, el);
    this.jCrNd(srt, type, crName, jsn, type);
    return srt;
  }

  tglMenu(inComArgTitle, atrrs = '') {
    let title = inComArgTitle;
    // const indicatorClass = '';
    // const dynamic = '';
    const tglID = `tgl-menu-${this.mdl.getIDNum('new')}`;
    const cssClass = (atrrs.cssClass ? ` ${atrrs.cssClass}` : '');
    // let root;
    let el;
    let elC;
    let elCC;
    let elCCC;

    const root = this.mkEl('', `id_${this.mdl.getIDNum('new')}`, `opt-collections-container-toggle toggle-title${cssClass}`);

    if (atrrs.dynamic && !atrrs.clrClss) {
      root.setAttribute('data-tgl-attrs', `{"tglID":"", "jDataDest": "${atrrs.jDataDest}", "contentID":"crVal", "destID":"${atrrs.destID}", "slide":"${atrrs.crName}"}`);
    } else {
      root.setAttribute('data-toggle-link', tglID);
    }

    // IMG
    if (atrrs.bgImg) {
      // elC = this.mkEl(
      // 'img',
      //  atrrs.destID+'_'+atrrs.crName+'_subcontaner_description_icon',
      //  atrrs.destID+'_'+atrrs.crName+'_subcontaner_description_icon custmz-img-block-description'
      // );
      // elC.src = atrrs.bgImg;
      // this.inEl(el,elC);
    }
    //

    if (!atrrs.keyframes) {
      root.textContent = title;
    }
    // CLR
    if (atrrs.clrClss) {
      root.textContent = '';
      let hexColor;
      let red;
      let green;
      let blue;
      let opcty;

      if (atrrs.subTypesubcntnr !== 'borderColor' && (atrrs.subTypesubcntnr).indexOf('border') === 0 && (atrrs.subTypesubcntnr).lastIndexOf('Color') !== -1) {
        hexColor = (this.getDataShrt(atrrs.crName, atrrs.subTypesubcntnr) === this.getDfltData(this.mdl.getCrType(atrrs.crName), atrrs.subTypesubcntnr)) ? this.getDataShrt(atrrs.crName, 'borderColor') : this.getDataShrt(atrrs.crName, atrrs.subTypesubcntnr);
        red = this.mdl.clrpckr.hexToRgb(hexColor.slice(1, 3));
        green = this.mdl.clrpckr.hexToRgb(hexColor.slice(3, 5));
        blue = this.mdl.clrpckr.hexToRgb(hexColor.slice(5, 7));
        opcty = (this.getDataShrt(atrrs.crName, `${atrrs.subTypesubcntnr}Opacity`) === this.getDfltData(this.mdl.getCrType(atrrs.crName), `${atrrs.subTypesubcntnr}Opacity`)) ? this.getDataShrt(atrrs.crName, 'borderColorOpacity') : this.getDataShrt(atrrs.crName, `${atrrs.subTypesubcntnr}Opacity`);
      } else {
        hexColor = this.getDataShrt(atrrs.crName, atrrs.subTypesubcntnr);
        red = this.mdl.clrpckr.hexToRgb(hexColor.slice(1, 3));
        green = this.mdl.clrpckr.hexToRgb(hexColor.slice(3, 5));
        blue = this.mdl.clrpckr.hexToRgb(hexColor.slice(5, 7));
        opcty = this.getDataShrt(atrrs.crName, `${atrrs.subTypesubcntnr}Opacity`);
      }

      // check-bg__cntnr
      elC = this.mkEl('', '', 'background-sasachki');
      elC.style = 'position: relative; height: 30px;width: 35px;margin:0;border-radius: 5px;';
      // check-rgba__cntnr
      elCC = this.mkEl('', `${atrrs.crName}-${atrrs.subTypesubcntnr}__check`);
      elCC.style = `background-color: rgba(${red},${green},${blue},${opcty}); position: relative; height: 30px;width: 35px;margin:0;border-radius: 3px;`;
      elCC.setAttribute('data-tgl-attrs', `{"tglID":"", "jDataDest": "${atrrs.jDataDest}", "contentID":"crVal", "destID":"${atrrs.destID}", "slide":"${atrrs.crName}"}`);
      // check-solid__cntnr
      elCCC = this.mkEl('', `${atrrs.crName}-${atrrs.subTypesubcntnr}__checkSolid`);
      elCCC.style = `display: block; position: absolute;height: 10px;width: 15px;background: rgb(${red},${green},${blue});border-radius: 3px;right: 3px;top: 1px;`;
      this.inEl(elCC, elCCC);
      //
      this.inEl(elC, elCC);
      //
      this.inEl(root, elC);
      // this.inEl(el,elC);
      //
      title = '';
    }
    //

    // Timeline Style
    if (atrrs.keyframes) {
      // wrapper
      el = this.mkEl('', '', 'cr-menu');
      // Title
      elC = this.mkEl('', '', 'tline-item-title toggle-title', '', '', title);
      this.inEl(el, elC);
      //
      // TimeLine
      elC = this.getCrTimeLine(atrrs.crName);
      this.inEl(el, elC);
      this.inEl(root, el);
    }
    //
    // (/Description)
    return root;
  }

  sortableNode(id = '', cstmzblock = 'cstmzblock', blockposition = 'blockposition', cssClass = '', crName = 'c0', priorityClass = 'priority') {
    const li = this.mkEl('li', id, `${cstmzblock} ${blockposition} ${cssClass} ui-sortable-handle athm-cstmz-touch-action__initial draggable droppable`);
    const input = this.mkEl('input', `id_${this.mdl.getIDNum('new')}`, `${priorityClass} hidden`, `{"id":"id_${this.mdl.getIDNum()}","dest":"${this.mdl.getDestID()}","slide":"${crName}","subcntnr":"priority","type":"cs"}`, 'input');
    li.appendChild(input);
    return li;
  }

  /* MenuToggle  */
  tglAttrs(ob, attr) {
    if (attr.tglID !== '') {
      const pObC = document.getElementById(attr.tglID);
      const nds = pObC.parentElement.childNodes;
      for (let i = 0, l = nds.length; i < l; i += 1) {
        if (nds[i] && nds[i].classList && nds[i].classList.contains('collections-pst')) {
          this.remEl(nds[i]);
          l -= 1;
        }
      }
      this.addCntnr(ob, attr.contentID, attr.destID, attr.slide, attr.tglID);
    } else {
      const pOb = ob.parentElement;
      const nds = pOb.childNodes;
      let flg;
      for (let i = 0, l = nds.length; i < l; i += 1) {
        if (nds[i] && nds[i].classList && nds[i].classList.contains('collections-pst')) {
          this.remEl(nds[i]);
          l -= 1;
        }
        if (nds[i] && nds[i].id === ob.id && nds[i + 1] && nds[i + 1].classList && nds[i + 1].classList.contains('collections-pst')) {
          flg = true;
        }
      }
      if (!flg) {
        this.addCntnr(ob, attr.contentID, attr.destID, attr.slide, ob.getAttribute('id'));
      }
    }
  }

  /* Menu Edit */
  editMode(ob, jsn) {
    this.changeCSSClasses('edit-mode-active');
    this.addCssClass(ob, 'edit-mode-active');

    // const destID = this.mdl.getDestID();
    const jsnDest = this.mdl.getJsn();
    const crName = this.convertCrNameToCssCrName(jsn.cssCrName, '-', '_');
    // const rootCrName = this.getRootCrName(crName);
    const el = this.mkEl('', 'last_setings_el_for_toggle_after-header', 'menu-absolute-pos-header');
    const arrasElBtn = this.mkEl('', '', 'clr-menu', '{"tglID":"last_setings_el_for_toggle_after"}', 'pst-attrs-rem', 'x');
    const main = this.mkEl('', '', 'main-cstmz-block');

    this.inEl(main, el);

    this.jCrNd(main, `${jsn.crType}_${jsn.crType}Menu_content`, crName, jsnDest);

    this.arrasEl('last_setings_el_for_toggle_after');
    this.inEl('last_setings_el_for_toggle_after', el);
    this.inEl('last_setings_el_for_toggle_after', arrasElBtn);
    this.inEl('last_setings_el_for_toggle_after', main);

    this.dragElement();
  }

  /* Menu Past */
  dataPstAttrs(ob, attr) {
    this.remAllDashedFrame();

    /* add dashed frame */
    this.changeCSSClasses('edit-mode-active');
    this.addCssClass(ob, 'edit-mode-active');

    const el = this.mkEl('', 'last_setings_el_for_toggle_after-header', 'menu-absolute-pos-header');
    const elIns = this.mkEl('', '', 'clr-menu', '{"tglID":"last_setings_el_for_toggle_after"}', 'pst-attrs-rem', 'x');
    const elMainCstmzBlock = this.mkEl('', '', 'main-cstmz-block');

    // let content;
    if (attr.getConterID) {
      this.getCrNd(elMainCstmzBlock, attr.getConterID, attr.slide, '', this.mdl.getJsn());
    } else {
      this.jCrNd(elMainCstmzBlock, attr.contentID, attr.slide, this.mdl.getJsn());
    }
    this.arrasEl(attr.tglID);
    this.inEl(attr.tglID, el);
    this.inEl(attr.tglID, elIns);
    this.inEl(attr.tglID, elMainCstmzBlock);

    this.cstmzBlockPriority.setPriorities(true);

    this.dragElement();
  }

  /* Menu Past */
  pstAttrsRem(atrrs) {
    this.remAllDashedFrame();
    this.arrasEl(atrrs.tglID);
  }
  /*
  *
  *   END VIEW
  *
  */

  /**
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │                 A N I M A T I O N   M O D E L                 │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  dragAnimationCursorModel(intervalmSec = '') {
    if (intervalmSec) {
      this.mdl.intervalmSec = intervalmSec;// 1000
    }

    const elmnt = document.getElementById('time-line-cursor');
    // const e = window.event;
    let pos1 = 0;
    // const rep = '';
    let tPos = 0;
    let cPos = 0;
    const pEl = elmnt.parentElement;
    let pos3 = 0;
    let obResult;
    // var intervalmSec;
    let cssClassName;
    const ob = document.getElementsByClassName('metka');
    // let state;
    let computed;
    // let elLeft;
    // let pElWidth;
    let duration;
    let cssObjB;
    const cssObjA = this.mdl.getCstmClassRule('.time-line-cursor.animated');
    // const cssObj = this.mdl.getCstmClassRule('.time-line-cursor');

    const ths = this;

    // e.preventDefault();

    function clursorOn(e) {
      const event = e || window.event;
      // calculate the new cursor position:

      if (ths.mdl.animationPlayState === 'paused') {
        computed = pEl.getBoundingClientRect();
        cPos = event.clientX - computed.left;
      } else {
        pos1 = pos3 - event.clientX;
        pos3 = event.clientX;
        cPos = parseInt(elmnt.offsetLeft - pos1, 10);
      }

      if (cPos >= 0) {
        tPos = (cPos * 100) / parseInt(pEl.clientWidth, 10);
        tPos = parseInt(tPos * 1000, 10) / 1000;
      }
      if (cPos >= parseInt(pEl.clientWidth, 10)) {
        tPos = 100;
      }

      // intervalmSec = ths.mdl.intervalmSec;
      // state = ths.mdl.animationPlayState;
      obResult = parseInt((tPos * ths.mdl.intervalmSec) / 100, 10);
      ths.mdl.setTimerResult(obResult);
      obResult /= 1000;

      document.getElementById('time').value = obResult;

      for (let i = 0, l = ob.length; i < l; i += 1) {
        cssClassName = ob[i].id;
        cssObjB = ths.mdl.getClassRule(`.${cssClassName}.animated`);
        if (cssObjB) {
          cssObjB.style.animationPlayState = 'paused';
          duration = cssObjB.style.animationDuration;
          duration = parseFloat(duration.replace('s', ''));
          if (duration > obResult) {
            cssObjB.style.animationDelay = `-${obResult}s`;
          } else {
            cssObjB.style.animationDelay = `-${duration}s`;
          }
        }
      }

      cssObjA.style.animationPlayState = 'paused';
      cssObjA.style.animationDelay = `-${obResult}s`;
      ths.changeCSSClasses('animate', 'animated');
    }

    function elementDrag(e) {
      const event = e || window.event;
      // e = e || window.event;
      event.preventDefault();
      clursorOn(event);
      ths.mdl.stop();
    }

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function dragMouseDown(e) {
      const event = e || window.event;
      // e = e || window.event;
      event.preventDefault();
      event.stopImmediatePropagation();
      pos3 = event.clientX;
      if (cssObjA.style.left !== '100%') {
        cssObjA.style.left = '100%';
      }
      if (ths.mdl.animationPlayState === 'paused') {
        ths.changeCSSClasses('animated', 'animate');
        clursorOn(event);
      }
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    elmnt.onmousedown = dragMouseDown;
  }

  getInterval(ret = 'mSec') {
    const jsn = this.mdl.getJsn();
    const intervalSec = this.getData(jsn, 'hdr', 'timeout', 'hdr');
    switch (ret) {
      case 'mSec':
        return (intervalSec * 1000);
      default:
        return parseFloat(intervalSec);
    }
  }

  startSecTimer() {
    let total = 0;

    const shift = this.mdl.getTimerResult();
    const intervalmSec = this.getInterval();
    const start = Date.now();
    const obResult = document.getElementById('time');

    const timerID = setInterval(() => {
      total = Date.now() - start + shift;
      if (total >= intervalmSec) {
        obResult.value = total / 1000;
        this.mdl.setTimerResult(total);
        clearInterval(timerID);
        this.mdl.setTimerID('');
        this.endAnimation();
      } else {
        obResult.value = total / 1000;
      }
    }, 1);

    this.mdl.setTimerID(timerID);
  }

  apointOriginalAnimationPlayState(spot = 'metka') {
    const ob = document.getElementsByClassName(spot);
    let cssObj;
    let cssClassName;

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssClassName = ob[i].id;
      cssObj = this.mdl.getClassRule(`.${cssClassName}.animated`);
      if (cssObj) { // if the animation was applyed
        cssObj.style.animationPlayState = 'running';
        cssObj.style.animationDelay = '0s';
      }
    }
    cssObj = this.mdl.getCstmClassRule('.time-line-cursor.animated');
    cssObj.style.animationPlayState = 'running';
    cssObj.style.animationDelay = '0s';

    if (this.mdl.animationPlayState !== 'paused') {
      cssObj = this.mdl.getCstmClassRule('.time-line-cursor');
      cssObj.style.left = '100%';
    }
  }

  endAnimation() {
    // let cssObj;
    const playSlideBtn = document.getElementById('play-slide');

    playSlideBtn.setAttribute('data-play', 'play_slide_btn');
    this.changeCSSClasses('stop-slide', 'play-slide');
    this.apointOriginalAnimationPlayState('metka');
    this.mdl.setTimerResult(0);
    this.changeCSSClasses('animated', 'animate');

    this.mdl.stop();
  }

  pauseAnimation() {
    const ob = document.getElementsByClassName('metka');
    let cssObj;

    clearInterval(this.mdl.getTimerID());
    this.mdl.setTimerResult(parseFloat(document.getElementById('time').value) * 1000);

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssObj = this.mdl.getClassRule(`.${ob[i].id}.animated`);

      if (cssObj) {
        cssObj.style.animationPlayState = 'paused';
      }
    }

    cssObj = this.mdl.getCstmClassRule('.time-line-cursor.animated');
    cssObj.style.animationPlayState = 'paused';

    this.mdl.pause();
  }

  startAnimation() {
    clearInterval(this.mdl.getTimerID());
    this.startSecTimer();
    let cssObj;
    let cssClassName;
    const ob = document.getElementsByClassName('metka');

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssClassName = ob[i].id;
      cssObj = this.mdl.getClassRule(`.${cssClassName}.animated`);
      if (cssObj) {
        cssObj.style.animationPlayState = 'running';
      }
    }

    cssObj = this.mdl.getCstmClassRule('.time-line-cursor');
    cssObj.style.left = '100%';
    cssObj = this.mdl.getCstmClassRule('.time-line-cursor.animated');
    cssObj.style.animationPlayState = 'running';
    this.mdl.running();
  }

  setPausePlayState(id, state) {
    const playSlideBtn = document.getElementById(id);
    switch (state) {
      case 'play_slide_btn':
        this.changeCSSClasses('animate', 'animated');
        this.startAnimation();
        this.changeCSSClasses('play-slide', 'stop-slide');
        playSlideBtn.setAttribute('data-play', 'paused_slide_btn');
        break;
      case 'paused_slide_btn':
        this.pauseAnimation();
        this.changeCSSClasses('stop-slide', 'play-slide');
        playSlideBtn.setAttribute('data-play', 'play_slide_btn');
        break;
      default: break;
    }
  }

  prevDefAndStpEmProp() {
  }

  /**
  *
  *
  *
  *
  *
  *
  *
  *
  *
  *
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │                     C O N T R O L L E R                       │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  /* JSON */
  dataInput(ob, jsnAttr, e) {
    // const that = ob;
    let sAttr;
    let crName = (jsnAttr.slide ? jsnAttr.slide : '');
    const destID = jsnAttr.dest;
    let minorVerUpdateFlag = false;
    let cssUpdateFlag = true;
    let jsn = this.mdl.getJsn();
    let valType;
    let value = '';
    let oldVal = '';

    let el;
    let elC;

    let newCrName;
    let pID;
    let cssCrName;
    let outhtmClassName;
    let rootCrName;
    let rootCrJsn;
    let pckrElNde;
    let divClassName;

    let srt;
    let shdwCr;
    let span;
    let grdCr;

    switch (jsnAttr.id) {
      case 'save_slide_btn':
        this.saveAllHeaderObjs(jsn, 'save');
        return;
        // break;

      case 'save_as_slide_btn':
        this.prevDefAndStpEmProp(e);
        this.saveAllHeaderObjs(jsn, 'save_as');
        break;

      case 'load_slide_btn':
        this.prevDefAndStpEmProp(e);
        this.saveAllHeaderObjs(jsn, 'load');
        break;

      case 'exit_bldr':
        this.prevDefAndStpEmProp(e);
        if (!Utils.confirm('Do you want to exit?')) {
          return;
        }
        document.location.href = this.mdl.set.admURL;
        return;
        // break;

      case 'add_slide_btn': {
        const s = 'c';
        let fn = 0;
        while (jsn[s + fn]) {
          fn += 1;
        }
        newCrName = s + fn;
        jsn[newCrName] = { cs: { type: 'cntnr' }, rwd5000: { cs: { elFullWidth: 'flWdth', elFullHeight: 'flHgth' } }, akf5000k0: { cs: { akfTimelinePos: '0' } } };
        minorVerUpdateFlag = true;
        const li = this.mkEl('li', `id_${this.mdl.getIDNum('new')}`, 'cstmzblock blockposition ui-sortable-handle athm-cstmz-touch-action__initial draggable droppable');
        el = this.mkEl('', `${newCrName}__cstm-nav-balls`, 'cstm-nav-balls slidesenqueu', `{"id":"change_screen_ev","dest":"${destID}","slide":"${newCrName}","postfixblock":"main-cstmz-block"}`, 'input');
        const input = this.mkEl('input', `id_${this.mdl.getIDNum('new')}`, 'priority', `{"id":"id_${this.mdl.getIDNum()}", "dest":"${destID}","slide":"${newCrName}","subcntnr":"priority","type":"cs"}`, 'input');
        this.inEl(li, el);
        this.inEl(li, input);
        this.inEl(jsnAttr.insertID, li);
        document.getElementById(`id_${this.mdl.getIDNum()}`).click();
        break;
      }

      case 'dell_slide_btn': {
        if (!Utils.confirm(`${this.mdl.set.names.areYouSureYouWantToRemove}Block of the Elements?`)) {
          return;
        }
        this.remAllRulesInCr(jsnAttr.offset);
        delete jsn[jsnAttr.offset];
        this.remEl(jsnAttr.block);
        const rElmntsArr = document.querySelectorAll('.slidesenqueu');
        let tempJsn;
        for (let i = 0, lngth = rElmntsArr.length; i < lngth; i += 1) {
          tempJsn = rElmntsArr[i].getAttribute('data-input');
          tempJsn = JSON.parse(tempJsn);
          if (jsnAttr.offset === tempJsn.slide) {
            this.remEl(rElmntsArr[i].id);
            rElmntsArr[0].click();
          }
        }
        minorVerUpdateFlag = true;
        cssUpdateFlag = false;
        break;
      }

      /* form */
      case 'add_form_btn':
        newCrName = this.mdl.getNewCrName(jsn, crName, 'c');
        pID = this.mdl.getPID();
        // var el;
        cssCrName = crName.replace(/_/g, '-');
        divClassName = `h${pID}-${cssCrName}-${newCrName}-${jsnAttr.cntnrType}`;
        rootCrName = this.getRootCrName(crName);
        rootCrJsn = this.mdl.getCrsJSN(rootCrName);
        pckrElNde = document.getElementById('mainFramePckr');

        jsn = this.mdl.mkCr(jsn, crName, newCrName, jsnAttr.cntnrType);
        this.getCrNd(jsnAttr.insertID, 'layerCntnrs', `${crName}_${newCrName}`);
        el = this.mkEl('form', divClassName, `std-section__wrapper metka ${jsnAttr.cntnrType}h${pID} ${divClassName} animate`, '', '', this.getDataShrt(`${crName}_${newCrName}`, 'content'));
        if (crName === rootCrName) {
          this.beforEl('mainFramePckr', el);
        } else {
          this.inEl(`h${pID}-${cssCrName}-cntnr`, el);
        }
        this.arrasEl('mainFramePckr');
        this.getMainFramePckr(rootCrJsn, rootCrName, pckrElNde);
        this.mdl.draggableElementInit();
        this.cstmzBlockPriority.setPriorities();
        crName = `${crName}_${newCrName}`;
        minorVerUpdateFlag = true;
        break;

      /* stdWrp */
      case 'add_section_btn':
        newCrName = this.mdl.getNewCrName(jsn, crName, 'c');
        pID = this.mdl.getPID();
        // var el;
        cssCrName = crName.replace(/_/g, '-');
        divClassName = `h${pID}-${cssCrName}-${newCrName}-${jsnAttr.cntnrType}`;
        rootCrName = this.getRootCrName(crName);
        rootCrJsn = this.mdl.getCrsJSN(rootCrName);
        pckrElNde = document.getElementById('mainFramePckr');

        jsn = this.mdl.mkCr(jsn, crName, newCrName, jsnAttr.cntnrType);
        this.getCrNd(jsnAttr.insertID, 'layerCntnrs', `${crName}_${newCrName}`);

        el = this.mkEl('', divClassName, `std-section__wrapper metka ${jsnAttr.cntnrType}h${pID} ${divClassName} animate`, '', '', this.getDataShrt(`${crName}_${newCrName}`, 'content'));
        if (crName === rootCrName) {
          this.beforEl('mainFramePckr', el);
        } else {
          this.inEl(`h${pID}-${cssCrName}-cntnr`, el);
        }
        this.arrasEl('mainFramePckr');
        this.getMainFramePckr(rootCrJsn, rootCrName, pckrElNde);
        this.mdl.draggableElementInit();
        this.cstmzBlockPriority.setPriorities();
        crName = `${crName}_${newCrName}`;
        minorVerUpdateFlag = true;
        break;

      case 'add_cntnr_btn':
        newCrName = this.mdl.getNewCrName(jsn, crName, 'c');
        pID = this.mdl.getPID();
        // var el;
        cssCrName = crName.replace(/_/g, '-');
        divClassName = this.getCssClassName(`${crName}_${newCrName}`, false);
        rootCrName = this.getRootCrName(crName);
        rootCrJsn = this.mdl.getCrsJSN(rootCrName);
        pckrElNde = document.getElementById('mainFramePckr');

        jsn = this.mdl.mkCr(jsn, crName, newCrName, jsnAttr.cntnrType);
        this.getCrNd(jsnAttr.insertID, 'layerCntnrs', `${crName}_${newCrName}`);

        el = this.mkEl('', divClassName, `metka cntnrh${pID} ${divClassName} animate`);
        if (crName === rootCrName) {
          this.beforEl('mainFramePckr', el);
        } else {
          this.inEl(`h${pID}-${cssCrName}-cntnr`, el);
        }

        this.arrasEl('mainFramePckr');
        this.getMainFramePckr(rootCrJsn, rootCrName, pckrElNde);

        this.mdl.draggableElementInit();
        this.cstmzBlockPriority.setPriorities();
        crName = `${crName}_${newCrName}`;
        minorVerUpdateFlag = true;
        break;

      case 'add_subcntnr_btn':
        newCrName = this.mdl.getNewCrName(jsn, crName, 'i');
        pID = this.mdl.getPID();
        // var el;
        cssCrName = crName.replace(/_/g, '-');
        outhtmClassName = `h${pID}-${cssCrName}-${newCrName}-${jsnAttr.cntnrType}`;
        rootCrName = this.getRootCrName(crName);
        rootCrJsn = this.mdl.getCrsJSN(rootCrName);
        pckrElNde = document.getElementById('mainFramePckr');

        jsn = this.mdl.mkCr(jsn, crName, newCrName, jsnAttr.cntnrType);
        this.inEl(jsnAttr.insertID, this.getSubcntnrForm(jsnAttr.cntnrType, `${crName}_${newCrName}`, destID, ''));

        if (jsnAttr.cntnrType === 'video') {
          el = this.mkEl('video', outhtmClassName, `metka ${jsnAttr.cntnrType}h${pID} ${outhtmClassName} animate`, '', '', this.getDataShrt(`${crName}_${newCrName}`, 'content'));// '+this.mdl.getDestID()+'-'+cssCrName+'-'+newCrName+'
          el.autoplay = true;
          el.type = 'video/mp4';
          el.controls = true;
          el.poster = this.mdl.set.dfltImg;
        } else {
          el = this.mkEl('', outhtmClassName, `metka ${jsnAttr.cntnrType}h${pID} ${outhtmClassName} animate`, '', '', this.getDataShrt(`${crName}_${newCrName}`, 'content'));// '+this.mdl.getDestID()+'-'+cssCrName+'-'+newCrName+'
        }
        if (crName === rootCrName) {
          this.beforEl('mainFramePckr', el);
        } else {
          this.inEl(`h${pID}-${cssCrName}-cntnr`, el);
        }

        this.arrasEl('mainFramePckr');
        this.getMainFramePckr(rootCrJsn, rootCrName, pckrElNde);

        this.mdl.draggableElementInit();
        this.cstmzBlockPriority.setPriorities();
        crName = `${crName}_${newCrName}`;
        minorVerUpdateFlag = true;
        break;

      /* RWDmode Btns */
      case 'set_rwdMode_btn':
        this.mdl.setRWDMode(jsnAttr.rwdMode, destID);
        this.remakeScene();
        return;
        // break;

      case 'add_rwdMode_btn':
        return;
        // break;

      case 'change_screen_ev':
        this.remakeSceneFrame(crName);
        return;
        // break;

      /* Animation Keyframe within RWDmode Btns */
      case 'add_akfRWDkPrc_btn': {
        newCrName = this.mdl.getNewCrNameS(crName, 'akf');
        // var el;
        // var elC;
        let newPos = '0';

        if (!newCrName) {
          return;
        }
        newPos = this.addKeyframe(crName, newCrName);
        jsn = this.mdl.mkCrAkf(jsn, crName, newCrName, newPos);
        minorVerUpdateFlag = true;
        // collectionAnimation
        el = this.mkEl('', this.mdl.getIDNum('new'));
        // span
        elC = this.mkEl('span', '', 'info-layer', '', '', `${newPos}%`);
        this.inEl(el, elC);
        //
        // btn span
        elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_akfRWDkPrc_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${newCrName}", "block":"${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(el, elC);
        //
        this.jCrNd(el, 'collectionAnimation', `${crName}_${newCrName}`, jsn, jsnAttr.type);// this.inEl(keyframe,jContainer('collectionAnimation', destID, crName+'_'+newCrName, jsn, jsnAttr.type));
        //

        this.inEl(jsnAttr.insertID, el);
        break;
      }

      /* Gradient within RWDmode Btns */
      case 'add_grdRWDkPrc_btn':
        newCrName = this.mdl.getNewCrNameS(crName, 'grd');

        if (!newCrName) {
          return;
        }
        jsn = this.mdl.mkCrGrt(jsn, crName, newCrName);
        minorVerUpdateFlag = true;
        srt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${crName}_cstmzblock`, `${crName}_blockposition`, '', `${crName}_${newCrName}`, `${crName}__grd_priority`);
        grdCr = this.mkEl('', this.mdl.getIDNum('new'), 'gradient__cr');
        span = this.mkEl('span', '', 'rem-layer', `{"id":"rem_grtRWDkPrc_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${newCrName}", "block":"${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(grdCr, span);
        this.jCrNd(grdCr, 'collectionGradients', `${crName}_${newCrName}`, jsn, jsnAttr.type);// this.inEl(grdCr,jContainer('collectionGradients', destID, crName+'_'+newCrName, jsn, jsnAttr.type));

        this.inEl(srt, grdCr);
        this.inEl(jsnAttr.insertID, srt);

        break;
      case 'add_grtRWDkPrc_btn':
        newCrName = this.mdl.getNewCrNameS(crName, 'grt');

        if (!newCrName) {
          return;
        }
        jsn = this.mdl.mkCrGrt(jsn, crName, newCrName);
        minorVerUpdateFlag = true;
        // var el;
        // var elC;
        // stop-color-picker
        el = this.mkEl('', `stop_color_id_${crName}_${newCrName}`, `color-stop color-stop-num stop_color_id_${crName}_${newCrName}`);
        el.setAttribute('data-gradient-synch', `{"synchGrtID":"synchID_${this.mdl.getIDNum('new')}"}`);
        el.title = 'Color stop';
        this.addCSSRule(`.stop_color_id_${crName}_${newCrName}`, 'left', '55%');
        // stop color BG
        elC = this.mkEl('', `stop_color_bg_id_${crName}_${newCrName}`, `color stop_color_bg_id_${crName}_${newCrName}`, `stop_color_bg_id_${crName}_${newCrName}`, 'stp-clrbg-slctr');
        elC.setAttribute('data-tgl-attrs', `{"tglID":"${jsnAttr.idToInsertColorMenu}", "jDataDest": "collectionGradientPointsType2_m1_content", "contentID":"crVal", "destID":"${destID}", "slide":"${crName}_${newCrName}"}`);
        this.inEl(el, elC);
        //
        // data-input
        elC = this.mkEl('input', `synchID_${this.mdl.getIDNum()}`, 'hidden', `{"id":"","dest":"${destID}","slide":"${crName}_${newCrName}","subcntnr":"grdLinePos"}`, 'input');
        value = 55;
        this.inEl(el, elC);
        //
        this.inEl(jsnAttr.insertID, el);
        //
        this.mdl.draggableFlat();
        break;

      case 'add_text_shadow_btn':
        newCrName = this.mdl.getNewCrNameS(crName, 'tsc');

        jsn = this.mdl.mkCrGrt(jsn, crName, newCrName);
        minorVerUpdateFlag = true;
        srt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${crName}_cstmzblock`, `${crName}_blockposition`, '', `${crName}_${newCrName}`, `${crName}__grd_priority`);
        shdwCr = this.mkEl('', '');
        span = this.mkEl('span', '', 'rem-layer', `{"id":"rem_shadow_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${newCrName}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(shdwCr, span);
        this.jCrNd(shdwCr, 'collectionShadowForText', `${crName}_${newCrName}`, jsn, jsnAttr.type);// this.inEl(shdwCr,jContainer('collectionShadowForText', destID, crName+'_'+newCrName, jsn, jsnAttr.type));
        this.inEl(srt, shdwCr);
        this.inEl(jsnAttr.insertID, srt);
        break;
      case 'add_hover_btn': {
        newCrName = this.mdl.getNewCrNameS(crName, 'hvr');
        // var el;
        // var elC;
        jsn = this.mdl.mkCrHvr(jsn, crName, newCrName);
        minorVerUpdateFlag = true;
        const elSrt = this.mkEl('li', this.mdl.getIDNum('new'), 'athm-cstmz-touch-action__initial');
        el = this.mkEl('', '', 'gradient__cr');
        elC = this.mkEl('span', '', 'rem-layer', `{"id":"rem_hvr_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${newCrName}", "block":"${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(el, elC);
        this.jCrNd(el, 'collectionHover', `${crName}_${newCrName}`, jsn, jsnAttr.type);
        this.inEl(elSrt, el);
        this.inEl(jsnAttr.insertID, elSrt);
        break;
      }
      case 'add_shadow_cr_btn':
        newCrName = this.mdl.getNewCrNameS(crName, 'bsc');
        jsn = this.mdl.mkCrGrt(jsn, crName, newCrName);
        minorVerUpdateFlag = true;

        srt = this.sortableNode(`sub-cstmz-block_ID_${this.mdl.getIDNum('new')}`, `${crName}_cstmzblock`, `${crName}_blockposition`, '', `${crName}_${newCrName}`, `${crName}__grd_priority`);
        shdwCr = this.mkEl('', '');
        span = this.mkEl('span', '', 'rem-layer', `{"id":"rem_shadow_btn","dest":"${destID}","offset":"${crName}","slide":"${crName}_${newCrName}", "block":"sub-cstmz-block_ID_${this.mdl.getIDNum()}"}`, 'input', 'x');
        this.inEl(shdwCr, span);
        this.jCrNd(shdwCr, 'collectionShadowForCntr', `${crName}_${newCrName}`, jsn, jsnAttr.type);// this.inEl(shdwCr,jContainer('collectionShadowForCntr', destID, crName+'_'+newCrName, jsn, jsnAttr.type));
        this.inEl(srt, shdwCr);
        this.inEl(jsnAttr.insertID, srt);
        break;

        /* remove el */
      case 'rem_akfRWDkPrc_btn': {
        if (!Utils.confirm(`${this.mdl.set.names.areYouSureYouWantToRemove}the Animation Keyframe?`)) {
          return;
        }

        this.remKeyframeRule(crName);
        const els = crName.split('_');
        const lastCrName = els[els.length - 1];
        let parentCrName;
        let crJSN;
        let prc;
        let prcPrv = 100;
        let animationDuration;
        let animationDurationNew;
        let shiftPrc;
        // value;
        let tLinePosSec;
        // let tLinePosSecNew;
        let tLinePosPrc;
        let tLinePosPrcNew;

        if (lastCrName.substr(0, 3) === 'akf') {
          parentCrName = crName.substr(0, crName.length - lastCrName.length - 1);
          crJSN = this.mdl.getCrsJSN(parentCrName);
          prc = parseFloat(crJSN[lastCrName].cs.akfTimelinePos);

          /* get the closest val to shift */
          Object.keys(crJSN).some((c) => {
            if (c !== lastCrName && c.substr(0, 3) === 'akf') {
              if (prcPrv > crJSN[c].cs.akfTimelinePos && crJSN[c].cs.akfTimelinePos > prc) {
                // rep += 'prcPrev: '+prcPrv+', new: '+crJSN[c]['cs']['akfTimelinePos'] + br;
                prcPrv = parseFloat(crJSN[c].cs.akfTimelinePos);
              }
            }
            return false;
          });

          shiftPrc = prcPrv - prc;

          /* shift of the animation duration val */
          animationDuration = parseFloat(this.getDataShrt(parentCrName, 'animationDuration'));
          animationDurationNew = animationDuration - ((shiftPrc * animationDuration) / 100);

          // animationDurationNew = Math.round10(animationDurationNew,-2);
          animationDurationNew = Math.round(animationDurationNew * 1000) / 1000;

          jsn = this.mdl.setCrVal(jsn, parentCrName, 'animationDuration', animationDurationNew, this.mdl.rwdDflt);

          /* shift of timeline pos vals */
          Object.keys(crJSN).some((c) => {
            if (c !== lastCrName && c.substr(0, 3) === 'akf') {
              tLinePosPrc = crJSN[c].cs.akfTimelinePos;

              if (tLinePosPrc > prc) {
                tLinePosPrc -= shiftPrc;
              }

              tLinePosSec = (animationDuration * tLinePosPrc) / 100;/* get Sec */
              tLinePosPrcNew = (tLinePosSec * 100) / animationDurationNew;/* get new prc */

              // tLinePosPrcNew = Math.round10(tLinePosPrcNew,-2);
              tLinePosPrcNew = Math.round(tLinePosPrcNew * 1000) / 1000;

              jsn = this.mdl.setCrVal(jsn, `${parentCrName}_${c}`, 'akfTimelinePos', tLinePosPrcNew);
            }
            return false;
          });
        }

        jsn = this.mdl.remCr(jsn, crName);
        this.remEl(jsnAttr.block);
        minorVerUpdateFlag = true;
        valType = 'remKeyframe';

        /* animationDuration: value */
        value = animationDurationNew;

        break;
      }
      case 'rem_shadow_btn':
        if (!Utils.confirm(`${this.mdl.set.names.areYouSureYouWantToRemove}the Shadow?`)) {
          return;
        }
        jsn = this.mdl.remCr(jsn, crName);
        minorVerUpdateFlag = true;
        if (jsnAttr.parentBlock) {
          // arraseParEl(jsnAttr.parentBlock);
          document.getElementById(jsnAttr.parentBlock).parentElement.innerHTML = '';
        } else {
          this.remEl(jsnAttr.block);
        }
        break;
      case 'rem_hvr_btn':
        if (!Utils.confirm(`${this.mdl.set.names.areYouSureYouWantToRemove}the Hover Ev?`)) {
          return;
        }
        jsn = this.mdl.remCr(jsn, crName);
        minorVerUpdateFlag = true;
        this.remEl(jsnAttr.block);
        // cssUpdateFlag = false;
        break;
      case 'dell_layer_btn': {
        if (!Utils.confirm(`${this.mdl.set.names.areYouSureYouWantToRemove}the Layer?`)) {
          return;
        }
        crName = jsnAttr.offset;
        const selector = this.getCssClassName(crName);
        const ellsArr = document.querySelectorAll(selector);

        this.remAllRulesInCr(crName);// this.remRule(crName);

        for (let i = 0, l = ellsArr.length; i < l; i += 1) {
          ellsArr[i].remove();
        }
        jsn = this.mdl.remCr(jsn, crName);
        this.remEl(jsnAttr.block);
        minorVerUpdateFlag = true;
        cssUpdateFlag = false;
        break;
      }
      case 'rem_grtRWDkPrc_btn':
        if (!Utils.confirm(`${this.mdl.set.names.areYouSureYouWantToRemove}the Color Point`)) {
          return;
        }
        jsn = this.mdl.remCr(jsn, crName);
        minorVerUpdateFlag = true;
        // this.remAllRulesInCr(crName);
        if (jsnAttr.parentBlock) {
          /* remove block's inner html code but dont rem block itself */
          document.getElementById(jsnAttr.parentBlock).parentElement.innerHTML = '';
          this.remEl(`stop_color_id_${crName}`);
        } else {
          this.remEl(jsnAttr.block);
        }
        break;
      case 'remMenu_btn':
        this.remParEl(jsnAttr.thisID);
        return;
        // break;

      /* Save and some validate */
      default: {
        valType = jsnAttr.subcntnr;
        const objt = { type: '', priority: '' };
        /* for akfTimelinePos */
        const crType = this.mdl.getCrType(crName, jsn);
        let rwdMode = !(valType in objt) ? this.mdl.getRWDMode() : '';
        value = ob.value;
        oldVal = (valType === 'akfTimelinePos' ? this.mdl.getCrVal(jsn, crName, valType, rwdMode) : '');

        if (crType === 'hdr') {
          rwdMode = '';
        }
        // need to sanitize of cs and prioritythis.mdl.set[crType][valType]
        if (value === this.getDfltData(crType, valType) || value === '') {
          jsn = this.mdl.remDefItemAndItsVal(jsn, crName, valType, rwdMode);
        } else {
          if (value === this.mdl.getCrVal(jsn, crName, valType, rwdMode)) {
            return;
          }
          jsn = this.mdl.setCrVal(jsn, crName, valType, value, rwdMode);
        }
        minorVerUpdateFlag = true;
        break;
      }
    }/* END switch */

    /* Synchr input and range */
    // sAttr = that.data("synch-attr");
    sAttr = ob.getAttribute('data-synch-attr');
    if (sAttr) {
      document.getElementById(sAttr).value = ob.value;// that.val();//.change();
    }

    /* Opacity Color Synch */
    // sAttr = that.data("clr-synch");
    sAttr = ob.getAttribute('data-clr-synch');
    if (sAttr) {
      const hexColor = document.getElementById(`${sAttr}_input`).value;
      const red = this.mdl.clrpckr.hexToRgb(hexColor.slice(1, 3));
      const green = this.mdl.clrpckr.hexToRgb(hexColor.slice(3, 5));
      const blue = this.mdl.clrpckr.hexToRgb(hexColor.slice(5, 7));
      const opcty = document.getElementById(`${sAttr}Opacity_number`).value;
      this.addCSSRule(`.${document.getElementById(`${sAttr}_clr`).getAttribute('data-clr')}`, 'backgroundColor', `rgba(${red},${green},${blue},${opcty})`);
      this.addCSSRule(`.${document.getElementById(`${sAttr}_clr`).getAttribute('data-clr')}__menu`, 'backgroundColor', `rgba(${red},${green},${blue},${opcty})`);
    }

    /* update minorVer */
    if (minorVerUpdateFlag) {
      // jsn = this.mdl.setCrVal( jsn, crName, valType, value, rwdMode );
      if (!this.mdl.getCrVal(jsn, 'hdr', 'minorVer')) {
        jsn = this.mdl.setCrVal(jsn, 'hdr', 'minorVer', '0');
      } else {
        jsn = this.mdl.setCrVal(jsn, 'hdr', 'minorVer', parseInt(this.mdl.getCrVal(jsn, 'hdr', 'minorVer'), 10) + 1);
      }
      if (!this.mdl.getCrVal(jsn, 'hdr', 'heightPercent')) {
        jsn = this.mdl.setCrVal(jsn, 'hdr', 'heightPercent', '70');
      }
    }

    /* SaveResult */
    this.mdl.setJsnDirectly(jsn);// <- this.mdl.setJsnFromInputField();

    /* important order to go after this.mdl.setJsnFromInputField()! */
    if (cssUpdateFlag) {
      this.makeCSSRules(crName, valType, value, oldVal);

      if (valType === 'fontSize') {
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
    }
  }/* END OD this.) */

  /**
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │                       C S S   M O D E L                       │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  getCrDeepLvl(crName) {
    const crSpl = crName.split('_');
    return crSpl.length;
  }

  getDefltBoxCSS(crName) {
    const out = `${''
    + ' '}${this.widthLeftCssProp(crName)} ${this.heightTopCssProp(crName)
    } background-color: ${this.getPropColorCSSVal(crName, 'backgroundColor')};`
    + ` padding-top: ${this.pxToEm(this.getDataShrt(crName, 'paddingTop'), crName)}em;`
    + ` padding-bottom: ${this.getDataShrt(crName, 'paddingBottom')}em;`
    + ` border: ${this.getBorder(crName, 'border')};`
    + ` border-radius: ${this.getDataShrt(crName, 'borderRadius')};`
    + ` box-shadow: ${this.getPropLRTBBlCSSVal(crName, 'boxShadow')};`;
    // " box-shadow: "+this.getDataShrt(crName, 'boxShadowPosition')+" "+
    // this.pxToEm(this.getDataShrt(crName, 'boxShadowLR'),crName)+"em "+
    // this.pxToEm(this.getDataShrt(crName, 'boxShadowTB'),crName)+"em "+
    // this.pxToEm(this.getDataShrt(crName, 'boxShadowBlur'),crName)+"em "+
    // this.pxToEm(this.getDataShrt(crName, 'boxShadowSpread'),crName)+"em "+
    // this.getPropColorCSSVal(crName,'boxShadowColor')+";"+
    // this.getDataShrt(crName, 'boxShadowColor')textShadowPosition
    // '';
    return out;
  }

  isCrScene(crName) {
    return this.isCrRoot(crName);
  }

  getDefltCSS(crName) {
    const crType = this.mdl.getCrType(crName);

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
        return this.getDefltBoxCSS(crName);
        // "left: calc( 50%"+left+" );
        // width:"+this.pxToEm(width,crName)+"em;
        // height: "+this.pxToEm(height,crName)+"em;
        // top: calc( 50%"+top+");";
      case ('stdWrp'):
        return `${''
          + ' background-color: '}${this.getPropColorCSSVal(crName, 'backgroundColor')};`;
        // " height: "+this.getDataShrt( crName, 'elHeight')+"em;";

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
          + ` height: ${this.pxToEm(this.getDataShrt(crName, 'elHeight'))}em;`
          + ` width: ${this.pxToEm(this.getDataShrt(crName, 'elWidth'))}em;${
            this.getDefltBoxCSS(crName)}`;
      case ('mainSlug'):
      case ('subSlug'):
      case ('btnData'):
        return `${''
          + ' font-family: '}${this.getDataShrt(crName, 'fontFamily')};`
          + ` font-size: ${this.pxToEm(this.getDataShrt(crName, 'fontSize'))}em;`
          + ` text-shadow: ${this.getPropLRTBBlCSSVal(crName, 'textShadow')};`
          + ` text-transform: ${this.getDataShrt(crName, 'textTransform')};`
          + ` line-height: ${this.getDataShrt(crName, 'lineHeight')}em;`
          + ` word-spacing: ${this.getDataShrt(crName, 'wordSpacing')}em;`
          + ` letter-spacing: ${this.getDataShrt(crName, 'letterSpacing')}em;`
          + ` text-align: ${this.getDataShrt(crName, 'textAlign')};`
          + ` color: ${this.getPropColorCSSVal(crName, 'color')};${
            this.getDefltBoxCSS(crName)}`;
      default:
        return this.getDefltBoxCSS(crName);
    }
  }

  getHoverCssAkfObj() {
  }

  isCrHoverType(crName) {
    const c2rNameSplittedArr = crName.split('_');
    const a2ctualGrdInd = c2rNameSplittedArr.length - 1;
    const c2 = c2rNameSplittedArr[a2ctualGrdInd].substr(0, 3);
    return (c2 === 'hvr');
  }

  isCrAkfType(crName) {
    const c2rNameSplittedArr = crName.split('_');
    const a2ctualGrdInd = c2rNameSplittedArr.length - 1;
    const c2 = c2rNameSplittedArr[a2ctualGrdInd].substr(0, 3);
    return (c2 === 'akf');
  }

  getCertainPosCssAkfObj(crName) {
    let keyframes = this.mdl.getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
    let l;
    let pos;
    if (keyframes) {
      pos = `${this.getDataShrt(crName, 'akfTimelinePos')}%`;
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
  }

  rewriteAkfObj(crName) {
    const cssClassName = this.getCssClassName(crName, false);
    let duration;
    let obItself;
    let obResult;
    // let sign = '>';

    const cssObj = this.mdl.getClassRule(`.${cssClassName}.animated`);
    if (cssObj) {
      obItself = document.getElementById(cssClassName);
      this.changeCClass(obItself, 'animated', 'animate');
      this.changeCClass(obItself, 'animate', 'animated');
      obResult = parseFloat(document.getElementById('time').value);

      duration = cssObj.style.animationDuration;
      duration = parseFloat(duration.replace('s', ''));
      if (duration > obResult) {
        cssObj.style.animationDelay = `-${obResult}s`;
      } else {
        cssObj.style.animationDelay = `-${duration}s`;
        // sign = '<';
      }

      this.mdl.pause();
    }
  }

  makeCSSRules(crName, incomArgValType = '', value = '', oldVal = '') {
    let valType = incomArgValType;
    const cssClassName = this.getCssClassName(crName);
    let cssObj = this.mdl.getClassRule(cssClassName);
    // const cssVal = '';
    // const cssPairs = '';
    // const cssName = this.mdl.set.cssNames[valType];
    // let hoverFlag = false;
    let akFlag = false;

    if (this.isCrHoverType(crName)) {
      cssObj = this.getHoverCssAkfObj(crName);
      // hoverFlag = true;
      return;
    }

    if (this.isCrAkfType(crName)) {
      cssObj = this.getCertainPosCssAkfObj(crName);
      akFlag = true;
    }

    if (!cssObj) {
      const ss = this.mdl.getStyleSheet();
      ss.addRule(cssClassName, this.getDefltCSS(crName), ss.cssRules.length);
      cssObj = this.mdl.getClassRule(cssClassName);
    }

    if (valType === 'backgroundColor' || valType === 'backgroundColorOpacity') {
      const crNameSplittedArr = crName.split('_');
      const actualGrdInd = crNameSplittedArr.length - 1;
      const c = crNameSplittedArr[actualGrdInd].substr(0, 3);
      if (c === 'grt') {
        valType = `grt${valType}`;
      }
    }
    if (valType === 'priority') {
      const crNameSplittedArr = crName.split('_');
      const actualGrdInd = crNameSplittedArr.length - 1;
      const c = crNameSplittedArr[actualGrdInd].substr(0, 3);
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
        this.arrasEl(elID);
        this.inEl(elID, value);
        return;
        // break;
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
        // break;
      }
      case 'remKeyframe':
      case 'animationDuration':

        cssObj = this.mdl.getClassRule(`${cssClassName}.animated`);
        cssObj.style.animationDuration = `${value}s`;

        this.rewriteAkfObj(crName);
        return;
        // break;
      case 'iterationCount':
        cssObj = this.mdl.getClassRule(`${cssClassName}.animated`);
        cssObj.style.animationIterationCount = value;
        return;
        // break;
      case 'animationTimingFn':
        cssObj = this.mdl.getClassRule(`${cssClassName}.animated`);
        cssObj.style.animationTiming = value;
        return;
        // break;

      case 'akfTimelinePos': {
        const oldValue = `${oldVal}%`;
        const keyframes = this.mdl.getKeyframesRule(`${this.getCssClassName(crName, false)}__keyframes`);
        for (let i = 0, l = keyframes.cssRules.length; i < l; i += 1) {
          if (keyframes[i].keyText === oldValue) {
            keyframes[i].keyText = `${value}%`;
            break;
          }
        }
        return;
        // break;
      }

      case 'priority':
        /* priority for blocks */
        this.remakeSceneFrame(this.getRootCrName(crName));
        return;
        // break;

      case 'url':
        return;
        // break;

      case 'elPosXFSize':
      case 'elFullWidth':
      case 'elWidth':
      case 'elPosX':
        this.widthLeftCssProp(crName, cssObj, valType, value);
        return;
        // break;
      case 'elPosYFSize':
      case 'elFullHeight':
      case 'elHeight':
      case 'elPosY':
        this.heightTopCssProp(crName, cssObj, valType, value);
        return;
        // break;
      case 'elToFSize':
      case 'elTo':
        this.widthLeftCssProp(crName, cssObj, valType, value);
        this.heightTopCssProp(crName, cssObj, valType, value);
        return;
        // break;

      case 'perspective':
      case 'transformStyle':
      case 'perspectiveOriginX':
      case 'perspectiveOriginY':
        // perspective: 550px;
        // transform-style: preserve-3d;
        // perspective-origin: 150% 150%;
        // console.log(valType+': ' + value);
        cssObj.style.perspective = (valType === 'perspective' ? value : this.getDataShrt(crName, 'perspective')) + this.mdl.set.cssNames.perspectiveAttr;
        // console.log('perspective: ' + cssObj.style.perspective);
        cssObj.style.transformStyle = (valType === 'transformStyle' ? value : this.getDataShrt(crName, 'transformStyle'));
        // console.log('transformStyle: ' + cssObj.style.transformStyle);
        cssObj.style.perspectiveOrigin = `${(valType === 'perspectiveOriginX' ? value : this.getDataShrt(crName, 'perspectiveOriginX')) + this.mdl.set.cssNames.perspectiveOriginAttr} ${valType === 'perspectiveOriginY' ? value : this.getDataShrt(crName, 'perspectiveOriginY')}${this.mdl.set.cssNames.perspectiveOriginAttr}`;
        // console.log('perspectiveOrigin: ' + cssObj.style.perspectiveOrigin);

        cssObj.style.transform = this.getTransformCss(crName, valType, value);
        if (akFlag) {
          this.rewriteAkfObj(crName);
        }
        return;
        // break;

      // case 'rotate'://depricated
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
        // console.log('transform...'+this.getTransformCss(crName,valType,value));
        cssObj.style.transform = this.getTransformCss(crName, valType, value);
        // console.log(cssObj.style.transform);
        if (akFlag) {
          this.rewriteAkfObj(crName);
        }
        return;
        // break;

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
        // break;

      case 'heightPercent':
      case 'timeout':
      case 'pauseOnPagerHover':
      case 'autostop':
        return;
        // break;

      case 'borderWeightFSize':
      case 'borderWeight':
      case 'borderType':
      case 'borderColor':
      case 'borderColorOpacity':
        this.getBorder(crName, 'border', valType, '', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        // console.log(cssObj.style);
        return;
        // break;

      case 'borderTopWeightFSize':
      case 'borderTopWeight':
      case 'borderTopType':
      case 'borderTopColor':
      case 'borderTopColorOpacity':
        this.getBorder(crName, 'border', valType, 'Top', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;// cssObj.style.borderTop =
        // break;

      case 'borderRightWeightFSize':
      case 'borderRightWeight':
      case 'borderRightType':
      case 'borderRightColor':
      case 'borderRightColorOpacity':
        this.getBorder(crName, 'border', valType, 'Right', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;// cssObj.style.borderRight =
        // break;

      case 'borderBottomWeightFSize':
      case 'borderBottomWeight':
      case 'borderBottomType':
      case 'borderBottomColor':
      case 'borderBottomColorOpacity':
        this.getBorder(crName, 'border', valType, 'Bottom', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;// cssObj.style.borderBottom =
        // break;

      case 'borderLeftWeightFSize':
      case 'borderLeftWeight':
      case 'borderLeftType':
      case 'borderLeftColor':
      case 'borderLeftColorOpacity':
        cssObj.style.borderLeft = this.getBorder(crName, 'border', valType, 'Left', value, cssObj);// +' '+this.getPropColorCSSVal(crName,'borderColor',valType,value);
        return;
        // break;

      case 'color':
      case 'colorOpacity':
        cssObj.style.color = this.getPropColorCSSVal(crName, 'color', valType, value);
        // console.log(cssObj);
        return;
        // break;

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
        // break;

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
        // break;

      case 'backgroundColor':
      case 'backgroundColorOpacity':
        cssObj.style.backgroundColor = this.getPropColorCSSVal(crName, 'backgroundColor', valType, value);
        return;
        // break;

      case 'backgroundImage':
      case 'grdPriority':
      case 'grtbackgroundColor':
      case 'grtbackgroundColorOpacity':
      case 'grdLinePos':
      case 'gradientType':
      case 'gradientAngl':
      case 'gradientPosX':
      case 'gradientPosY':
        // var
        //   g = g;
        cssObj.style.backgroundImage = this.getBgGradientAndImage(crName, valType, value);
        // if (g!=''){}
        if (valType === 'grtbackgroundColor' || valType === 'grtbackgroundColorOpacity') {
          this.addCSSRule(`.${document.getElementById(`stop_color_bg_id_${crName}`).getAttribute('data-stp-clrbg-slctr')}`, 'backgroundColor', this.getPropColorCSSVal(crName, 'backgroundColor', (valType === 'grtbackgroundColor' ? 'backgroundColor' : 'backgroundColorOpacity'), value));
        }
        return;
        // break;

      default:
        cssObj.style[valType] = this.getPropCSSVal(value, this.mdl.set.cssNames[`${valType}Attr`], crName, valType);
        if (akFlag) {
          this.rewriteAkfObj(crName);
        }
        // return;
        // break;
    }

    // this.commitCSS('athm-ext-inline-css', `${cssClassName} {${cssPairs}}`);
  }

  getPropLRTBBlCSSVal(crName, valType, actualValType = '', value = '') {
    const lastCrNamePrefix = this.mdl.getCrNameWithoutNum(this.mdl.getLastCrNameInDest(crName));
    const crNameSplittedArr = crName.split('_');
    const actualGrdInd = crNameSplittedArr.length - 1;
    // const mainCrType = this.mdl.getCrType(crName);
    const mainCrName = this.getMainGrdCrName(crNameSplittedArr, lastCrNamePrefix);
    // const grdts = '';
    // const grd = '';
    let div = '';
    const jsnCr = this.mdl.getCrsJSN(mainCrName);
    // let el;
    let isValue;
    let tempOut = '';
    const a = this.getSortedCrByPriority(jsnCr, lastCrNamePrefix);

    Object.keys(a).some((c) => {
      isValue = (crNameSplittedArr[actualGrdInd] === a[c].crName ? value : 'none');
      tempOut += `${div + this.getCertainShadow(`${mainCrName}_${a[c].crName}`, valType, actualValType, isValue)} ${this.getPropColorCSSVal(`${mainCrName}_${a[c].crName}`, `${valType}Color`, valType, isValue)}`;
      div = ', ';
      return false;
    });
    return tempOut;
  }

  getCertainShadow(crName, valType, actualValType = '', value = '') {
    let bsp = '';
    if (valType === 'boxShadow') {
      if (`${valType}Position` === actualValType && value !== 'none') {
        bsp = `${value} `;
      } else {
        bsp = this.getDataShrt(crName, `${valType}Position`);
        bsp = (bsp !== '' ? `${bsp} ` : '');
      }
    }
    return `${bsp// (valType=='boxShadow'  ?   ( valType+'Position' == actualValType  && value!='none' ? value+' ' : this.getDataShrt( crName, valType+'Position' )+' ' )  :   '')+
        + this.pxToEm((`${valType}LR` === actualValType && value !== 'none' ? value : this.getDataShrt(crName, `${valType}LR`)), crName)}em ${
      this.pxToEm((`${valType}TB` === actualValType && value !== 'none' ? value : this.getDataShrt(crName, `${valType}TB`)), crName)}em ${
      this.pxToEm((`${valType}Blur` === actualValType && value !== 'none' ? value : this.getDataShrt(crName, `${valType}Blur`)), crName)}em${
      valType === 'boxShadow' ? ` ${this.pxToEm((`${valType}Spread` === actualValType && value !== 'none' ? value : this.getDataShrt(crName, `${valType}Spread`)), crName)}em` : ''}`;
  }

  getBgGradientAndImage(crName, valType = '', value = '') {
    const crNameSplittedArr = crName.split('_');
    const actualGrdInd = crNameSplittedArr.length - 2;
    const mainCrType = this.mdl.getCrType(crName);
    const mainCrName = this.getMainGrdCrName(crNameSplittedArr);
    let bgImg = (valType === 'backgroundImage' ? value : this.getDataShrt(mainCrName, 'backgroundImage'));
    let grdts = '';
    let grd = '';
    let div = '';
    const jsnCr = this.mdl.getCrsJSN(mainCrName);
    let el;
    const a = this.getSortedCrByPriority(jsnCr);
    // let i = 0;

    Object.keys(a).some((c) => {
      grd = this.getCertainGradient(mainCrType, `${mainCrName}_${a[c].crName}`, valType, (crNameSplittedArr[actualGrdInd] === a[c].crName ? value : 'none'));
      if (grd && crNameSplittedArr[actualGrdInd] === a[c].crName) {
        el = document.getElementById(`${mainCrName}_${crNameSplittedArr[actualGrdInd]}_gradient__dynamic`);

        el.setAttribute('style',
          `background-image: ${grd.WebkitSafariChrome10};`
          + `background-image: -webkit-${grd.forPannelType};`
          + `background-image: -moz-${grd.forPannelType};`
          + `background-image: -ms-${grd.forPannelType};`
          + `background-image: -o-${grd.forPannelType};`
          + `background-image: ${grd.forPannelType}`);// p.getAttribute('style') + '; ' +
      }
      if (grd) {
        grdts += div + grd.w3c;
        div = ', ';
        // i += 1;
      }
      return false;
    });

    bgImg = ((bgImg !== '') ? `url("${bgImg}")` : '');
    if (bgImg === '') {
      div = '';
    }
    return grdts + div + bgImg;
  }

  getMainGrdCrName(crArr, lastCrNamePrefix = 'grd') {
    let out = '';
    let d = '';
    Object.keys(crArr).some((i) => {
      if (crArr[i].substr(0, 3) === lastCrNamePrefix) {
        return true;
      }
      out += d + crArr[i];
      d = '_';
      return false;
    });
    return out;
  }

  getCertainGradient(mainCrType, grdCrName, valType = '', value = '') {
    let outDataGrd = '';
    let outDataGrdWebKit = '';
    const outData = [];
    // const report = '';
    let color;
    let rgb;
    let opacity;
    let pos;
    const jsnCr = this.mdl.getCrsJSN(grdCrName);
    const a = this.getSortedCrByGrdLinePos(jsnCr);
    const gradientType = (valType === 'gradientType' && value !== 'none' ? value : this.getDataShrt(grdCrName, 'gradientType'));
    const gradientPosX = (valType === 'gradientPosX' && value !== 'none' ? value : this.getDataShrt(grdCrName, 'gradientPosX'));
    const gradientPosY = (valType === 'gradientPosY' && value !== 'none' ? value : this.getDataShrt(grdCrName, 'gradientPosY'));
    const gradientAngl = (valType === 'gradientAngl' && value !== 'none' ? value : this.getDataShrt(grdCrName, 'gradientAngl'));
    let i = 0;

    Object.keys(a).some((c) => {
      if (a[c].cs.grdLinePos) {
        pos = a[c].cs.grdLinePos;
        color = (a[c].cs.backgroundColor) ? a[c].cs.backgroundColor : this.getDfltData(mainCrType, 'backgroundColor');
        opacity = (a[c].cs.backgroundColorOpacity) ? a[c].cs.backgroundColorOpacity : this.getDfltData(mainCrType, 'backgroundColorOpacity');
        rgb = this.mdl.clrpckr.hexToRgbJSN(color);
        outDataGrd += `${', rgba('}${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity}) ${pos}%`;
        outDataGrdWebKit += `, color-stop(${pos / 100}, rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity}))`;
        i += 1;
      }
      return false;
    });
    if (i < 2) {
      return false;
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
    outData.WebkitSafariChrome10ForPannel = `-webkit-gradient(linear, left center, right center${outDataGrdWebKit})`;
    return outData;
  }
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

  getBorder(crName, valType, actualValType = '', trbl = '', value = '', inconArgCssObj = '') {
    // this.getBorder(crName,'border',valType,'Left',value,cssObj);
    const cssObj = inconArgCssObj;
    const borderType = (actualValType === `${valType}Type` ? value : this.getDataShrt(crName, `${valType}Type`));
    const borderWeight = this.pxToEm((actualValType === `${valType + trbl}Weight` ? value : this.getDataShrt(crName, `${valType + trbl}Weight`)), crName) + this.mdl.set.cssNames[`${valType}WeightAttr`];
    const borderColor = this.getPropColorCSSVal(crName, 'borderColor', actualValType, value);
    if (cssObj !== '') {
      cssObj.style[valType + trbl] = `${borderWeight} ${borderType} ${borderColor}`;
      return null;
    }
    if (borderType === '') {
      return 'none';
    }
    return `${borderWeight} ${borderType} ${borderColor}`;
  }

  getScaleXY(crName, valType, value = '') {
    return `${valType === 'scaleX' ? value : this.getDataShrt(crName, 'scaleX')}${this.mdl.set.cssNames.scaleAttr}, ${
      valType === 'scaleY' ? value : this.getDataShrt(crName, 'scaleY')}${this.mdl.set.cssNames.scaleAttr}`;
  }

  getTransformCss(crName, valType, value = '') {
    // matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
    return `${''
    + 'rotateX('}${valType === 'rotateX' ? value : this.getDataShrt(crName, 'rotateX')}${this.mdl.set.cssNames.rotateAttr}) `
    + `rotateY(${valType === 'rotateY' ? value : this.getDataShrt(crName, 'rotateY')}${this.mdl.set.cssNames.rotateAttr}) `
    + `rotateZ(${valType === 'rotateZ' ? value : this.getDataShrt(crName, 'rotateZ')}${this.mdl.set.cssNames.rotateAttr}) `

    + `skew(${valType === 'skewX' ? value : this.getDataShrt(crName, 'skewX')}${this.mdl.set.cssNames.skewXAttr}, ${valType === 'skewY' ? value : this.getDataShrt(crName, 'skewY')}${this.mdl.set.cssNames.skewYAttr}) `

    + `scale(${this.getScaleXY(crName, valType, value)}) `

    + `translateX(${this.pxToEm((valType === 'translateX' ? value : this.getDataShrt(crName, 'translateX')), crName)}${this.mdl.set.cssNames.translateAttr}) `
    + `translateY(${this.pxToEm((valType === 'translateY' ? value : this.getDataShrt(crName, 'translateY')), crName)}${this.mdl.set.cssNames.translateAttr}) `
    + `translateZ(${this.pxToEm((valType === 'translateZ' ? value : this.getDataShrt(crName, 'translateZ')), crName)}${this.mdl.set.cssNames.translateAttr})`;
  }

  getImgFilterCss(crName, valType, value = '') {
    return `${''
    + 'blur('}${valType === 'blur' ? value : this.getDataShrt(crName, 'blur')}${this.mdl.set.cssNames.blurAttr}) `
    + `brightness(${valType === 'brightness' ? value : this.getDataShrt(crName, 'brightness')}${this.mdl.set.cssNames.brightnessAttr}) `
    + `contrast(${valType === 'contrast' ? value : this.getDataShrt(crName, 'contrast')}${this.mdl.set.cssNames.contrastAttr}) `
    + `grayscale(${valType === 'grayscale' ? value : this.getDataShrt(crName, 'grayscale')}${this.mdl.set.cssNames.grayscaleAttr}) `
    + `hue-rotate(${valType === 'hue-rotate' ? value : this.getDataShrt(crName, 'hue-rotate')}${this.mdl.set.cssNames['hue-rotateAttr']}) `
    + `invert(${valType === 'invert' ? value : this.getDataShrt(crName, 'invert')}${this.mdl.set.cssNames.invertAttr}) `
    + `saturate(${valType === 'saturate' ? value : this.getDataShrt(crName, 'saturate')}${this.mdl.set.cssNames.saturateAttr}) `
    + `sepia(${valType === 'sepia' ? value : this.getDataShrt(crName, 'sepia')}${this.mdl.set.cssNames.sepiaAttr}) `;
  }

  getCssClassName(crName, isSelector = true) {
    const cmnPropArr = this.mdl.getCrDestArrWithoutLastEl(`${crName}_cs`);
    const pre = (cmnPropArr[cmnPropArr.length - 1]).substr(0, 3);
    let depth = (pre === 'akf' || pre === 'grt' || pre === 'grd' || pre === 'tsc' || pre === 'bsc' || pre === 'hvr') ? cmnPropArr.length - 2 : cmnPropArr.length - 1;
    const crAr = crName.split('_');
    let strCr = '';

    if ((cmnPropArr[cmnPropArr.length - 1]).substr(0, 3) === 'grt' && (cmnPropArr[cmnPropArr.length - 2]).substr(0, 3) === 'grd') {
      depth = cmnPropArr.length - 3;
    }

    for (let i = 0; i <= depth; i += 1) {
      strCr += `-${crAr[i]}`;
    }

    strCr = `h${this.mdl.getPID()}${strCr}-${this.mdl.getCrType(crName)}`;// this.mdl.getJsn()

    return ((isSelector ? '.' : '') + strCr);
  }

  commitCSS(cssIn = 'athm-ext-inline-css', css) {
    const el = document.getElementById(cssIn);
    if (el && (typeof (el) === 'object')) {
      this.inEl(el, css);
    } else {
      const style = this.mkEl('style', cssIn);
      style.type = 'text/css';
      this.inEl(style, css);
      this.beforEl('athm-cstm-css', style);
    }
  }

  getPropCSSVal(val, attr, crName = '', valType = '') {
    let out = val + attr;

    switch (attr) {
      case 'px':
        out = `${this.pxToEm(val, crName, valType)}em`;
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
  }

  getPropColorCSSVal(crName, valType, actualValType = '', value = '') {
    const hexColor = (valType === actualValType && value !== 'none' ? value : this.getDataShrt(crName, valType));
    const opacity = (`${valType}Opacity` === actualValType && value !== 'none' ? value : this.getDataShrt(crName, `${valType}Opacity`));

    if (opacity === '1') {
      return hexColor;
    }

    const rgb = this.mdl.clrpckr.hexToRgbJSN(hexColor);

    return `rgba( ${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity} )`;
  }

  /**
  *       Retrieve Container with css prop like margin or paddings etc
  *
  * @param String css property
  * @param Array objJSON style collection
  * @param Array t_dflt is an array of default settings
  * @return String css_style css style
  */
  // getMarg(valType,crName){
  // }

  /**
  *       Retrieve Container width,height,top,bottom css prop
  *
  * @param Array objJSON style collection
  * @param Array t_dflt is an array of default settings
  * @return String css style
  */
  widthLeftCssProp(crName, inconArgCssObj = '', valType = '', value = '') {
    let out = '';
    const cssObj = inconArgCssObj;
    const widthType = this.getDataShrt(crName, 'elFullWidth');

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
        const width = parseInt((valType === 'elWidth' ? value : this.getDataShrt(crName, 'elWidth')), 10);
        const borderWeight = (parseInt(this.getDataShrt(crName, 'borderRightWeight'), 10) + parseInt(this.getDataShrt(crName, 'borderLeftWeight'), 10));
        const elTo = (valType === 'elTo' ? value : this.getDataShrt(crName, 'elTo'));
        const alignX = elTo.split(' ');
        let xShift;
        let elPosX;

        switch (alignX[1]) {
          case 'left':
            to = '0';
            xShift = parseInt((valType === 'elPosX' ? value : this.getDataShrt(crName, 'elPosX')), 10); // xShift = elPosX;
            left = (xShift > 0 ? ` + ${this.pxToEm(xShift, crName)}em` : ` - ${this.pxToEm(xShift / (-1), crName)}em`);
            break;
          case 'right':
            // console.log('right');
            to = '100';
            elPosX = parseInt((valType === 'elPosX' ? value : this.getDataShrt(crName, 'elPosX')), 10);
            xShift = elPosX - (width + borderWeight);// +padding_x+margin_x
            left = (xShift > 0 ? ` + ${this.pxToEm(xShift, crName)}em` : ` - ${this.pxToEm(xShift / (-1), crName)}em`);
            break;
          default:
            to = '50';
            elPosX = parseInt(valType === 'elPosX' ? value : this.getDataShrt(crName, 'elPosX'), 10);
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
  }

  heightTopCssProp(crName, inconArgCssObj = '', valType = '', value = '') {
    let out = '';
    const cssObj = inconArgCssObj;
    const heightType = this.getDataShrt(crName, 'elFullHeight');

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
        const height = parseInt((valType === 'elHeight' ? value : this.getDataShrt(crName, 'elHeight')), 10);
        const elTo = (valType === 'elTo' ? value : this.getDataShrt(crName, 'elTo'));
        const alignY = elTo.split(' ');
        let yShift;
        let top;

        switch (alignY[0]) {
          case 'top':
            to = '0';
            yShift = (parseInt((valType === 'elPosY' ? value : this.getDataShrt(crName, 'elPosY')), 10) / (-1));// this.getDataShrt(crName, 'elPosY')
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName)}em` : ` - ${this.pxToEm(yShift / (-1), crName)}em`);
            break;
          case 'bottom':
            to = '100';
            yShift = (parseInt((valType === 'elPosY' ? value : this.getDataShrt(crName, 'elPosY')), 10) / (-1)) - height;// this.getDataShrt(crName, 'elPosY')
            top = (yShift > 0 ? ` + ${this.pxToEm(yShift, crName)}em` : ` - ${this.pxToEm(yShift / (-1), crName)}em`);
            break;
          default:
            to = '50';
            yShift = (parseInt((valType === 'elPosY' ? value : this.getDataShrt(crName, 'elPosY')), 10) / (-1)) - height / 2;// this.getDataShrt(crName, 'elPosY')
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
  }
}

export default Theme;
