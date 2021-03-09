/* eslint-disable class-methods-use-this */
class Utils {
  public static mkEl(
    obName: string,
    id: string,
    className: string,
    data: string,
    dataName: string,
    innerText: string,
    hid: string,
  ) {
    const el = obName === '' || !obName ? 'div' : obName;
    const newNode = document.createElement(el);

    if (id) {
      newNode.id = id;
    }

    if (className) {
      newNode.className = className;
    }
    if (dataName && data) {
      newNode.setAttribute(`data-${dataName}`, data);
      if (hid && dataName === 'input') {
        // this.mdl.di.setNewDataInput(hid, data);
        newNode.setAttribute('data-di', hid);
      }
    }
    if (innerText) {
      newNode.innerText = innerText;
    }
    return newNode;
  }

  public static element(el: any) {
    return (typeof (el) === 'object') ? el : document.getElementById(el);
  }

  public static inEl(el: any, elNode: Node): void {
    let elIn = el;
    elIn = Utils.element(elIn);

    if (typeof (elIn) !== 'object') {
      return;
    }

    if (typeof (elNode) === 'object') {
      elIn.appendChild(elNode);
    } else {
      elIn.innerHTML += elNode;
    }
  }

  public static beforeEl(el: any, elNode: Node): void {
    let elIn = el;
    elIn = Utils.element(elIn);
    elIn.parentNode.insertBefore(elNode, elIn);
  }

  public static afterEl(el: any, elNode: Node): void {
    let elIn = el;
    elIn = Utils.element(elIn);
    elIn.parentNode.insertBefore(elNode, elIn.nextSibling);
  }

  public static remEl(el: any): void {
    let elIn = el;
    elIn = Utils.element(elIn);
    if (elIn) {
      elIn.remove();
    }
  }

  public static eraseParentEl(el: any): void {
    let elIn = el;
    elIn = Utils.element(elIn);
    elIn = elIn.parentElement;
    if (elIn) {
      elIn.innerHTML = '';
    }
  }

  public static remParentEl(el: any): void {
    let elIn = el;
    elIn = Utils.element(elIn);
    elIn = elIn.parentElement;
    if (elIn) {
      elIn.remove();
    }
  }

  public static eraseEl(el: any): void {
    let elIn = el;
    elIn = Utils.element(elIn);
    if (elIn) {
      elIn.innerHTML = '';
    }
  }

  public static confirm(string: string): boolean {
    return window.confirm(string);
  }

  public static alert(string: string): void {
    return console.log(string);
  }
}

export default Utils;
