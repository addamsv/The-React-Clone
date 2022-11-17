import { getClassRule, getStyleSheet } from '../models/styleSheetPackage/styleSheetModel';
import DOM from './dom';

const changeCSSClasses = (className: string, classNameOn: string = ''): void => {
  const elArr = document.querySelectorAll(`.${className}`);
  for (let i = 0, len = elArr.length; i < len; i += 1) {
    elArr[i].classList.remove(className);
    if (classNameOn !== '') {
      elArr[i].classList.add(classNameOn);
    }
  }
}

const changeCSSClassesInObject = (obId: string, className: string, classNameOn: string = ''): void => {
  const ob = DOM.element(obId);
  if (ob) {
    const elArr = ob.querySelectorAll(`.${className}`);
    for (let i = 0, len = elArr.length; i < len; i += 1) {
      elArr[i].classList.remove(className);
      if (classNameOn !== '') {
        elArr[i].classList.add(classNameOn);
      }
    }
  }
}

const remAllDashedFrame = (): void => {
  remAllCSSClass('edit-mode-active');
}

const addCssClass = (obj: any, cssClass: string = 'animated') => {
  const ob = DOM.element(obj);
  if (ob) {
    const arrClassName = ob.className.split(' ');
    if (arrClassName.indexOf(cssClass) === -1) {
      ob.className += ` ${cssClass}`;
    }
  }
}

const changeCSSClass = (obj: any, className: string, classNameOn: string = '') => {
  const ob = DOM.element(obj);
  if (ob) {
    ob.classList.remove(className);
    ob.classList.add(classNameOn);
  }
}

const remAllCSSClass = (className: string) => {
  changeCSSClasses(className);
}

const CSS = {
  get: (cssClassName: string) => {
    let cssObj = getClassRule(cssClassName);

    if (!cssObj) {
      const ss = getStyleSheet();
      ss?.addRule(cssClassName, '', ss.cssRules.length);
      cssObj = getClassRule(cssClassName);
    }
    return cssObj;
  },
  make: (cssClassName: string, props: any) => {
    let cssObj = getClassRule(cssClassName);

    if (!cssObj) {
      const ss = getStyleSheet();
      ss?.addRule(cssClassName, '', ss.cssRules.length);
      cssObj = getClassRule(cssClassName);
    }
    if (cssObj) {
      Object.assign((<any>cssObj).style, props);
    }
  }
}

export { changeCSSClasses, changeCSSClassesInObject, remAllDashedFrame, addCssClass, changeCSSClass, remAllCSSClass, CSS };
