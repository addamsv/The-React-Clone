const setWPStyle = () => {
  setStyleDirectly('adminmenumain');
  setStyleDirectly('wpadminbar');
  setStyleDirectly('wpfooter');
  setStyleDirectly('wpcontent', 'marginLeft', '0');
  setStyleDirectly('wpcontent', 'paddingLeft', '0');
  setStyleDirectly('wpbody', 'paddingTop', '0');
  setStyleDirectly(document.getElementsByTagName('html')[0], 'paddingTop', '0');
}

type styleProp = 'display' | 'marginLeft' | 'paddingLeft' | 'paddingTop';

const setStyleDirectly = (obj: HTMLElement | string, prop: styleProp = 'display', val = 'none'): void => {
  const ob: HTMLElement | null = typeof obj === 'object' ? obj : document.getElementById(obj);
  if (ob) {
    ob.style[prop] = val;
  }
}

export default setWPStyle;
