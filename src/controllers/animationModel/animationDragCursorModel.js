/* eslint-disable class-methods-use-this */
class AnimationDragCursorModel {
  constructor(mdl) {
    this.mdl = mdl;
    this.elmnt = document.getElementById('time-line-cursor');
    this.ob = document.getElementsByClassName('metka');
    this.e = window.event;
    this.pos1 = 0;
    this.rep = '';
    this.tPos = 0;
    this.cPos = 0;
    this.pEl = elmnt.parentElement;
    this.pos3 = 0;
    this.obResult;
    this.intervalmSec;
    this.cssClassName;
    this.state;
    this.computed;
    this.elLeft;
    this.pElWidth;
    this.duration;
    this.cssObjB;
    this.cssObjA = this.mdl.getCstmClassRule('.time-line-cursor.animated');
    this.cssObj = this.mdl.getCstmClassRule('.time-line-cursor');
  }

  dragAnimationCursorModel() {
    if (intervalmSec) {
      this.mdl.intervalmSec = intervalmSec;// 1000
    }

    const elmnt = document.getElementById('time-line-cursor');
    const e = window.event;
    let pos1 = 0;
    const rep = '';
    let tPos = 0;
    let cPos = 0;
    const pEl = elmnt.parentElement;
    this.pos3 = 0;
    let obResult;
    var intervalmSec;
    let cssClassName;
    const ob = document.getElementsByClassName('metka');
    let state;
    let computed;
    let elLeft;
    let pElWidth;
    let duration;
    let cssObjB;
    const cssObjA = this.mdl.getCstmClassRule('.time-line-cursor.animated');
    const cssObj = this.mdl.getCstmClassRule('.time-line-cursor');

    e.preventDefault();
    elmnt.onmousedown = this.dragMouseDown.bind(this);
  }

  dragMouseDown(e) {
    // e = e || window.event;
    e.preventDefault();
    e.stopImmediatePropagation();
    this.pos3 = e.clientX;
    if (this.cssObjA.style.left !== '100%') {
      this.cssObjA.style.left = '100%';
    }
    if (this.mdl.animationPlayState === 'paused') {
      this.mdl.changeCSSClasses('animated', 'animate');
      this.cursorOn(e);
    }
    document.onmouseup = this.closeDragElement.bind(this);
    document.onmousemove = this.elementDrag.bind(this);
  }

  elementDrag(e) {
    // e = e || window.event;
    e.preventDefault();
    this.cursorOn.bind(this);
    this.mdl.stop();
  }

  cursorOn(e) {
    // calculate the new cursor position:

    if (this.mdl.animationPlayState === 'paused') {
      computed = pEl.getBoundingClientRect();
      cPos = e.clientX - computed.left;
    } else {
      pos1 = this.pos3 - e.clientX;
      this.pos3 = e.clientX;
      cPos = parseInt(elmnt.offsetLeft - pos1, 10);
    }

    if (cPos >= 0) {
      tPos = (cPos * 100) / parseInt(pEl.clientWidth, 10);
      tPos = parseInt(tPos * 1000, 10) / 1000;
    }
    if (cPos >= parseInt(pEl.clientWidth, 10)) {
      tPos = 100;
    }

    intervalmSec = this.mdl.intervalmSec;
    state = this.mdl.animationPlayState;
    obResult = parseInt((tPos * intervalmSec) / 100, 10);
    this.mdl.setTimerResult(obResult);
    obResult /= 1000;

    document.getElementById('time').value = obResult;

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssClassName = ob[i].id;
      cssObjB = this.mdl.getClassRule(`.${cssClassName}.animated`);
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

    this.cssObjA.style.animationPlayState = 'paused';
    this.cssObjA.style.animationDelay = `-${obResult}s`;
    this.changeCSSClasses('animate', 'animated');
  }

  closeDragElement() {
    /* stop moving when mouse button is released: */
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export default AnimationDragCursorModel;
