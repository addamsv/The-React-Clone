/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * @link https://api.jqueryui.com/sortable/#option-cancel
 * 
 * 
 * 
 * 
 * 
*/

import { debounce } from "../../../../../../utils/debounce";

const onSortStart = (event: any, pid: string, ulID: string, onRemoveShadow: (shadowCrName: string) => void, onPriorityChange: (shadowCrNameArr: Array<string>) => void, eventType: string): void => {
  const getCoords = () => {
    const box = event.target.getBoundingClientRect();
    return box.top + window.pageYOffset;
  }

  const getAvatarEntity = () => {
    const top = getCoords();

    const avatar = document.createElement('div');

    avatar.style.position = 'absolute';
    avatar.style.borderRadius = '2px';
    avatar.style.zIndex = '9999';
    avatar.style.paddingLeft = '3px';
    avatar.style.paddingBottom = '2px';
    avatar.style.fontSize = '10px';
    avatar.style.width = '40px';
    avatar.style.height = '14px';
    avatar.style.top = `${top}px`;
    avatar.style.left = '14px';
    avatar.style.cursor = 'row-resize';
    avatar.style.backgroundColor = 'rgba(255,255,255,.3)';
    avatar.id = `${pid}__avatar`;
    avatar.textContent = event.target.textContent;
    document.body.appendChild(avatar);
    return avatar;
  }

  const avatar = { ent: null as any, isRemEvenet: false };

  const ulDOMPublic = document.getElementById(ulID);
  let startX = 0;
  let startY = 0;
  let shiftX = 0;
  let shiftY = 0;
  let savedClientX = 0;
  let savedClientY = 200;
  let left = 0;
  let top = 0;

  const getRootDomElement = (currDomEl: any, term: string, maxNesting = 0): any => {
    if (!currDomEl) {
      return false;
    }

    if (!currDomEl.classList.contains(term) && maxNesting >= 0) {
      return getRootDomElement(currDomEl.parentNode, term, maxNesting - 1);
    }

    if (maxNesting < 0) {
      return false;
    }

    return currDomEl;
  }

  const updateProcess = (e: any) => {
    // получить самый вложенный элемент под курсором мыши
    avatar.ent.hidden = true;
    const elem = document.elementFromPoint(e.clientX, e.clientY);    
    avatar.ent.hidden = false;

    if (!elem) {
      return;
    }

    const el = document.getElementById(pid);
    if (!el) {
      return;
    }

    const rootUlElement = getRootDomElement(elem, 'priority-cr', 3);

    if (!rootUlElement) {
      // is Alt key is pressed then REMOVE
      if (e.altKey) {
        avatar.isRemEvenet = true;
        avatar.ent.style.backgroundColor = '#f00';
        el.style.backgroundColor = '#f00';
        return;
      }

      avatar.isRemEvenet = false;
      avatar.ent.style.backgroundColor = 'rgba(255,255,255,.3)';
      el.removeAttribute('style');
      return;
    }

    if (avatar.isRemEvenet) {
      avatar.ent.style.backgroundColor = 'rgba(255,255,255,.3)';
      el.removeAttribute('style');
      avatar.isRemEvenet = false;
    }

    const dropElem = getRootDomElement(elem, 'priority-el', 2);

    if (!dropElem) {
      return;
    }

    const dropElemCoords = dropElem.getBoundingClientRect();
    const yCoord = e.clientY - dropElemCoords.top;

    // console.log(elem, el, rootUlElement, dropElem);
    // is same element?
    if (dropElem.dataset.priority === el.dataset.priority) {
      // console.log('same element');
      return;
    }

    if ((dropElemCoords.height - yCoord) > (dropElemCoords.height / 2)) {
      // is element already before?
      if (String(dropElem.dataset.priority) === String(Number(el.dataset.priority) + 1)) {
        // console.log('element already before');
        // append after
        dropElem.insertAdjacentElement('afterend', el);
        el.classList.add('bold-title');
      } else {
        // append before
        dropElem.insertAdjacentElement('beforebegin', el);
        el.classList.add('bold-title');
      }
    } else {
      // is element already after?
      if (String(dropElem.dataset.priority) === String(Number(el.dataset.priority) - 1)) {
        // console.log('element already after');
        // append before
        dropElem.insertAdjacentElement('beforebegin', el);
        el.classList.add('bold-title');
      } else {
        // append after
        dropElem.insertAdjacentElement('afterend', el);
        el.classList.add('bold-title');
      }
    }

    const listItems = rootUlElement ? rootUlElement.querySelectorAll('li') : [];

    // const state: any = [];
    const shadowCrNamec: any = [];
    let priorityCounter = 0;
    listItems.forEach((li: any) => {
      if (li.classList.contains('priority-el')) {
        li.dataset.priority = priorityCounter;
        // state.push({ crName: `${li.dataset.cr}`, props: { priority: priorityCounter } });
        const crNameLastPart = li.dataset.cr.split('_').slice(-1)[0];
        const crNameType = crNameLastPart.substring(0,3);
        shadowCrNamec.push(crNameType === 'bsc' || crNameType === 'tsc' ? crNameLastPart: li.dataset.cr);
 
        priorityCounter += 1;
      }
    });

    /* Update State */
    // State.set(state);

    /* View UpdateProcess */
    // Model.ob().cssMaker.makeCSSRules(listItems[0].dataset.cr, 'priority');
    
    onPriorityChange(shadowCrNamec);
  }

  const process = debounce(updateProcess, 10);

  const closeDragElement = (): void => {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;

    // if just menu have been clicked
    if (avatar.ent) {
      avatar.ent.remove();
      avatar.ent = null;
    }

    if (avatar.isRemEvenet) {


      // let array = [2, 4, 6, 8, 10, 12, 14, 16];


      // console.time('array length property');
      // let lastElem = array[array.length - 1];
      // console.log(lastElem);
      // console.timeEnd('array length property');
      
      
      // console.time('array slice method');
      // let lastElem1 = array.slice(-1);
      // console.log(lastElem1);
      // console.timeEnd('array slice method');
      
      // console.time('array pop method');
      // let lastElem2 = array.pop();
      // console.log(lastElem2);
      // console.timeEnd('array pop method');
      
      
      //Вывод:
      
      //16
      //array length property: 7 ms
      //[ 16 ]
      //array slice method: 5 ms
      //16
      //array pop method: 2 ms



      // const crArr = pid.split('_');
      // console.log(pid.split('_').slice(-1));
      const shadowCrName = pid.split('_').slice(-1)[0];
      onRemoveShadow(shadowCrName);
      return;
    }
    const el = document.getElementById(pid);
    if (!el) {
      return;
    }
    el.classList.add('blink')
    setTimeout(() => el.classList.remove('bold-title', 'blink'), 400);
  }

  const getObOffset = (obOffset: any, callback: () => number) => {
    // if (245 <= obOffset) {
    //   callback();
    //   return 245;
    // }
    // if (obOffset <= -10) {
    //   callback();
    //   return -10;
    // }
    return obOffset;
  }

  const elementDrag = (e: any) => {

    const x = eventType === 'onMouseDown' ? e.clientX : e.targetTouches[0].pageX;
    const y = eventType === 'onMouseDown' ? e.clientY : e.targetTouches[0].pageY;
    // если мышь передвинулась в нажатом состоянии недостаточно далеко
    if (Math.abs(startX - x) < 2 && Math.abs(startY - y) < 2) {
      return;
    }

    if (!avatar.ent) {
      avatar.ent = getAvatarEntity();
    }

    shiftX = savedClientX - x;
    shiftY = savedClientY - y;
    savedClientX = x;
    savedClientY = y;

    if (avatar.ent) {
      left = getObOffset(avatar.ent.offsetLeft - shiftX, () => savedClientX += shiftX);
      top = getObOffset(avatar.ent.offsetTop - shiftY, () => savedClientY += shiftY);
    }

    avatar.ent.style.left = `${left}px`;
    avatar.ent.style.top = `${top}px`;
 
    process(e);
  }

  const dragMouseDown = (e: any): void => {
    const x = eventType === 'onMouseDown' ? e.clientX : e.targetTouches[0].pageX;
    const y = eventType === 'onMouseDown' ? e.clientY : e.targetTouches[0].pageY;

    startX = x;
    startY = y;
    savedClientX = x;
    savedClientY = y;

    if (eventType === 'onMouseDown') {
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    if (eventType === 'onTouchStart') {
      document.ontouchend = closeDragElement;
      document.ontouchmove = elementDrag;
    }
  }

  /**
   *  Touch & Mouse Ev
   * 
   */

  // event.stopImmediatePropagation();
  dragMouseDown(event);

  // if (eventType === 'onMouseDown') {
  // }


  // const dragTouchStart = (e: TouchEvent) => {
  //   startX = e.targetTouches[0].pageX;
  //   startY = e.targetTouches[0].pageY;
  //   savedClientX = e.targetTouches[0].pageX;
  //   savedClientY = e.targetTouches[0].pageY;
  //   document.ontouchend = closeDragElement;
  //   document.ontouchmove = elementTouchDrag;
  // }
  // if (eventType === 'onTouchStart') {
  //   dragTouchStart(event);
  // }
}

export default onSortStart;
