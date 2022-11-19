const DOM = {
  render: (elNode: any, el: HTMLElement | null): void => {
    if (Array.isArray(elNode)) {
      throw new Error("Array!!!!");
    }

    if (typeof el !== 'object') {
      console.log("not an object!!!!");
      el = document.getElementById(el);
    }

    if (elNode && el) {
      el.innerHTML = ''; // - so important
      el.appendChild(elNode);
    }
  },

  renderA: (elNode: any, el: HTMLElement | null): void => {
    if (Array.isArray(elNode)) {
      throw new Error("Array!!!!");
    }

    if (typeof el !== 'object') {
      console.log("not an object!!!!");
      el = document.getElementById(el);
    }

    if (elNode && el) {
      el.appendChild(elNode);
    }
  },

  in: (el: Element, nodeArr: Array<any | null>): Element => {
    nodeArr.forEach((element) => el?.appendChild(element));
    return el;
  },

  beforeEl: (elID: string, elNode: any): void => {
    const el = document.getElementById(elID);

    el?.parentNode?.insertBefore(elNode, el);
  },

  afterEl: (elID: string, elNode: any): void => {
    const el = document.getElementById(elID);

    el?.parentNode?.insertBefore(elNode, el.nextSibling);
  },

  element: (el: string | Element) => (typeof el === 'object') ? el : document.getElementById(el),

  focus: (elID: string) => (document.getElementById(elID))?.focus(),

  remEl: (el: string | Element): void => {
    const elIn = typeof el === 'object' ? el : document.getElementById(el);

    elIn?.remove();
  },

  remParentEl: (el: string): void => document.getElementById(el)?.parentElement?.remove(),

  eraseEl: (elID: string): void => {
    const elIn = document.getElementById(elID);

    if (elIn) {
      elIn.innerHTML = '';
    }
  }
};

export default DOM;
