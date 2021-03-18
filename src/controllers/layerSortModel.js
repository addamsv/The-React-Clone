/* eslint-disable class-methods-use-this */
/**
* @link https://api.jqueryui.com/sortable/#option-cancel
*/
class LayerSortModel {
  constructor() {
    this.storeFlag = false;
    this.sortFlag = true;
    this.cmzBlockPriorityArray = [];
    this.cstmzLst = [];
    this.flag = false;
    this.clickFlag = false;

    this.dragObject = {};
  }

  onMouseDown(e) {
    if (e.which !== 1) {
      return false;
    }

    const elem = e.target.closest('.draggable');

    if (!elem) {
      return false;
    }

    this.dragObject.elem = elem;

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    this.dragObject.downX = e.pageX;
    this.dragObject.downY = e.pageY;

    return false;
  }

  onMouseMove(e) {
    if (!this.dragObject.elem) {
      return false; // элемент не зажат
    }

    if (!this.dragObject.avatar) { // если перенос не начат...
      const moveX = e.pageX - this.dragObject.downX;
      const moveY = e.pageY - this.dragObject.downY;

      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return false;
      }

      // начинаем перенос
      this.dragObject.avatar = this.createAvatar(e); // создать аватар
      if (!this.dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        this.dragObject = {};
        return false;
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      const coords = this.getCoords(this.dragObject.avatar);
      this.dragObject.shiftX = this.dragObject.downX - coords.left;
      this.dragObject.shiftY = this.dragObject.downY - coords.top;

      this.startDrag(e); // отобразить начало переноса
    }

    // отобразить перенос объекта при каждом движении мыши
    this.dragObject.avatar.style.left = `${e.pageX - this.dragObject.shiftX}px`;
    this.dragObject.avatar.style.top = `${e.pageY - this.dragObject.shiftY}px`;

    return false;
  }

  getCoords(elem) { // кроме IE8-
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  onMouseUp(e) {
    if (this.dragObject.avatar) { // если перенос идет
      this.finishDrag(e);
    }

    // перенос либо не начинался, либо завершился
    // в любом случае очистим "состояние переноса" this.dragObject
    this.dragObject = {};
  }

  finishDrag(e) {
    const dropElem = this.findDroppable(e);

    if (!dropElem) {
      this.dragObject.avatar.rollback();
    } else {
      const dropElemCoords = dropElem.getBoundingClientRect();
      // const xCoord = e.clientX - dropElemCoords.left;
      const yCoord = e.clientY - dropElemCoords.top;
      if ((dropElemCoords.height - yCoord) > (dropElemCoords.height / 2)) {
        dropElem.classList.add('computer-smile');
        setTimeout(() => {
          dropElem.classList.remove('computer-smile');
        }, 200);
        dropElem.insertAdjacentElement('beforebegin', this.dragObject.elem);
        this.dragObject.elem.removeAttribute('style');
      } else {
        dropElem.classList.add('computer-smile');
        setTimeout(() => {
          dropElem.classList.remove('computer-smile');
        }, 200);
        dropElem.insertAdjacentElement('afterend', this.dragObject.elem);
        this.dragObject.elem.removeAttribute('style');
      }

      const inputList = dropElem.parentNode.querySelectorAll('input');
      let count = 1;
      inputList.forEach((inputEl) => {
        const input = inputEl;
        if (this.isContainerInputPriority(input)) {
          input.value = count;
          count += 1;
          input.click();
        }
      });
    }
  }

  isContainerInputPriority(input) {
    return input.hasAttribute('data-input') && JSON.parse(input.getAttribute('data-input')).subcntnr === 'priority';
  }

  createAvatar() {
    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
    const avatar = this.dragObject.elem;
    const old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || '',
    };

    // функция для отмены переноса
    avatar.rollback = () => {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex;
    };

    return avatar;
  }

  startDrag() {
    // var avatar = this.dragObject.avatar;
    if (this.dragObject.avatar.parentNode !== document.body) {
      document.body.appendChild(this.dragObject.avatar); // переместить в BODY, если надо
    }
    this.dragObject.avatar.style.zIndex = 9999;
    this.dragObject.avatar.style.position = 'absolute';
  }

  findDroppable(event) {
    // спрячем переносимый элемент
    this.dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    const elem = document.elementFromPoint(event.clientX, event.clientY);

    // показать переносимый элемент обратно
    this.dragObject.avatar.hidden = false;

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    return elem.closest('.droppable');
  }

  aThmSortableInit() {
  }

  // block , isLoading = false
  setPriority() {
  }

  // block
  disableSortable() {
  }

  // block
  enableSortable() {
  }

  enableSortableAll() {
  }

  disableSortableAll() {
  }

  // isLoading = false
  setPriorities() {
    let id;
    let ul;
    while (this.cmzBlockPriorityArray.length) {
      // id = $('#'+this.cmzBlockPriorityArray.splice(0, 1));
      id = this.cmzBlockPriorityArray.splice(0, 1);
      ul = document.getElementById(id);
      this.setSortable(ul);
      // this.setPriority(ul, isLoading);
    }
  }

  // , isLoading = false
  setSortable(ul) {
    if (!ul) {
      return;
    }
    ul.querySelectorAll('li').forEach((liEl) => {
      const li = liEl;
      li.onmousemove = this.onMouseMove.bind(this);
      li.onmouseup = this.onMouseUp.bind(this);
      li.onmousedown = this.onMouseDown.bind(this);
    });
  }
}

export default LayerSortModel;
