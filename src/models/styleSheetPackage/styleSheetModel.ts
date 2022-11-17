import Container from "../dataPackage/containerModel";
import Data from "../dataPackage/dataModel";
import Model from "../model";

/**
*  ╭───────────────────────────────────────────────────────────────╮
*  │                                                               │
*  │                                                               │
*  │                   P R I V A T E   V A R S                     │
*  │                                                               │
*  │                                                               │
*  ╰───────────────────────────────────────────────────────────────╯
*/

let styleSheet: any = null;

let customStyleSheet: any = null;

/**
*  ╭───────────────────────────────────────────────────────────────╮
*  │                                                               │
*  │                                                               │
*  │                       F U N C T I O N S                       │
*  │                                                               │
*  │                                                               │
*  ╰───────────────────────────────────────────────────────────────╯
*/

const remAllRulesInCr = (crName: string) => {
  /* hasElItems */
  const crJsn = Container.getCrsJSN(crName);
  let elName;
  Object
    .keys(crJsn)
    .some((el) => {
      elName = Container.getCrNameWithoutNum(el);
      if (elName === 'c') {
        remRule(`${crName}_${el}`);
        remAllRulesInCr(`${crName}_${el}`);
      }
      if (elName === 'i') {
        remRule(`${crName}_${el}`);
        remAllRulesInCr(`${crName}_${el}`);
      }
      if (elName === 'akf') {
        remKeyframeAndAnimatedClass(`${crName}_${el}`);
      }
      return false;
    });
  remRule(crName);
}

const remKeyframeRule = (crName: string): void => {
  const prc = Number(Data.getDataShort(crName, 'akfTimelinePos'));
  const prcPrv = getTheClosestKeyframePos(crName, prc);
  const shiftPrc = prcPrv - prc;
  const els = crName.split('_');
  const lastCrName = els[els.length - 1];
  const parentCrName = crName.substring(0, crName.length - lastCrName.length - 1);
  let animationDurationNew;

  /* shift the animation duration val */
  const animationDuration = parseFloat(Data.getDataShort(parentCrName, 'animationDuration'));
  animationDurationNew = animationDuration - ((shiftPrc * animationDuration) / 100);
  animationDurationNew = Math.round(animationDurationNew * 1000) / 1000;
  shiftAllKeyframeRulesOn(crName, prcPrv, prc, animationDuration, animationDurationNew);
  remCertainKeyframeRule(crName, prc.toString());
}

const remCertainKeyframeRule = (crName: string, prc: string): void => {
  const keyframes = getKeyframesRule(`${getCssClassName(crName, false)}__keyframes`) as any;
  let rule: any;
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

const shiftAllKeyframeRulesOn = (
  crName: string,
  shift: number,
  fromPos = 0,
  animationDuration: number,
  animationDurationNew: number,
) => {
  const keyframes = getKeyframesRule(`${getCssClassName(crName, false)}__keyframes`) as any;
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

const getTheClosestKeyframePos = (crName: string, pos: number): number => {
  const keyframes = getKeyframesRule(`${getCssClassName(crName, false)}__keyframes`) as any;
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

const remKeyframeAndAnimatedClass = (crName: string): void => {
  remKeyframe(crName);
  remRule('', `.${getCssClassName(crName, false)}.animated`);
}

const addKeyframe = (crName: string): number => {
  const keyframes = getKeyframesRule(`${getCssClassName(crName, false)}__keyframes`) as any;
  let pos = 0;
  if (keyframes) {
    /* past inside the one... */
    if (keyframes.cssRules.length) {
      /* past inside the one... */
      pos = parseFloat(keyframes[keyframes.cssRules.length - 1].keyText.replace('%', ''));
      pos = 100 - (100 - pos) / 2;
    }
    keyframes.appendRule(`${pos}% {}`);

    return pos;
  }

  /* make new... */
  const ss = getStyleSheet() as CSSStyleSheet;

  const keyframeCss = `${pos}% {}`;
  ss.addRule(`@keyframes ${getCssClassName(crName, false)}__keyframes`, keyframeCss, ss.cssRules.length);

  const css = `animation-name: ${getCssClassName(crName, false)}__keyframes; animation-duration: ${Data.getDataShort(crName, 'animationDuration')}s;`;
  ss.addRule(`.${getCssClassName(crName, false)}.animated`, css, ss.cssRules.length);

  // console.log(getClassRule(`.${getCssClassName(crName, false)}.animated`));

  return pos;
}

const remKeyframe = (crName: string, ruleSelector = ''): boolean => {
  const ss = getStyleSheet() as CSSStyleSheet;
  const rule = ruleSelector === '' ? `${getCssClassName(crName, false)}__keyframes` : ruleSelector;

  /* Remove Keyframes Rules */
  if (ss) {
    for (let j = 0; j < ss.cssRules.length; j += 1) {
      // ss.cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE
      if ((<CSSKeyframesRule>ss.cssRules[j]).name === rule) {
        ss.removeRule(j); // -> ss.deleteRule(j);
        return true;
      }
    }
  }
  return false;
}

const addCSSRule = (rulesSelector: string, type: string, css: string): void => {
  const cssObj = getClassRule(rulesSelector) as CSSStyleRule;

  if (cssObj) {
    cssObj.style[Model.ob().set.cssNames[type]] = css;
  } else {
    const ss = getStyleSheet() as CSSStyleSheet;
    ss.addRule(rulesSelector, `${Model.ob().set.cssNames[type]}: ${css}`, ss.cssRules.length);
  }
}

const remRule = (crName: string, ruleSelector = ''): boolean => {
  const selector = ruleSelector === '' ? getCssClassName(crName) : ruleSelector;
  const ss = getStyleSheet() as CSSStyleSheet;
  /* Remove CSS Rule */
  if (ss) {
    for (let j = 0, rulesLength = ss.cssRules.length; j < rulesLength; j += 1) {
      if ((<CSSStyleRule>ss.cssRules[j]).selectorText === selector) {
        ss.removeRule(j); // -> ss.deleteRule(j);
        return true;
      }
    }
  }
  return false;
}

const getCssClassName = (crName: string, isSelector = true): string => {
  const cmnPropArr = Container.getCrDestArrWithoutLastEl(`${crName}_cs`);
  const pre = (cmnPropArr[cmnPropArr.length - 1]).substring(0, 3);
  let depth = (pre === 'akf' || pre === 'grt' || pre === 'grd' || pre === 'tsc' || pre === 'bsc' || pre === 'hvr') ? cmnPropArr.length - 2 : cmnPropArr.length - 1;
  // console.log(crName);
  
  const crAr = crName.split('_');
  let strCr = '';

  if ((cmnPropArr[cmnPropArr.length - 1]).substring(0, 3) === 'grt' && (cmnPropArr[cmnPropArr.length - 2]).substring(0, 3) === 'grd') {
    depth = cmnPropArr.length - 3;
  }

  for (let i = 0; i <= depth; i += 1) {
    strCr += `-${crAr[i]}`;
  }

  strCr = `h${Model.ob().getHID()}${strCr}-${Container.getCrType(crName)}`;// Data.getJsn()

  return ((isSelector ? '.' : '') + strCr);
}

/* StyleSheet */
const getStyleSheet = (): CSSStyleSheet | null => {
  if (styleSheet) {
    return styleSheet;
  }
  const ss = document.styleSheets;
  for (let i = 0, ssLen = ss.length; i < ssLen; i += 1) {
    for (let j = 0, rulesLen = ss[i].cssRules.length; j < rulesLen; j += 1) {
      if ((<CSSStyleRule>ss[i].cssRules[j]).selectorText === '.sign-of-exst-stl') { // ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
        styleSheet = ss[i];
        return styleSheet;
      }
    }
  }
  styleSheet = getCustomStyleSheet();
  return getCustomStyleSheet();
}

const getClassRule = (cssClassName = '.header-c0-cr0-mainSlug.animated') => {
  const ss = getStyleSheet() as CSSStyleSheet;
  if (!ss) {
    return null;
  }
  if (Model.ob().getRWDMode() === '5000') {
    for (let j = 0, rulesLen = ss.cssRules.length; j < rulesLen; j += 1) {
      if ((<CSSStyleRule>ss.cssRules[j]).selectorText === cssClassName) {
        return ss.cssRules[j];
      }
    }
  }

  return getMediaRule(ss, cssClassName);
}

/* cssClassName = '.header-c0-cr0-mainSlug.animated'  'background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;'*/
const setClassRule = (
  cssClassName = '.header-c0-cr0-mainSlug.animated',
  rules = 'background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;'
) =>
{
  const ss = getStyleSheet() as CSSStyleSheet;
  if (!ss) {
    return false;
  }
  if (Model.ob().getRWDMode() === '5000') {
    ss.addRule(cssClassName, rules, ss.cssRules.length);
  } else {
    setMediaRule(ss, cssClassName, rules);
  }
  return true;
}

const getCustomStyleSheet = (): CSSStyleSheet | null =>{
  if (customStyleSheet) {
    return customStyleSheet;
  }
  const ss = document.styleSheets;
  for (let i = 0, ssLen = ss.length; i < ssLen; i += 1) {
    for (let j = 0, rulesLen = ss[i].cssRules.length; j < rulesLen; j += 1) {
      if ((<CSSStyleRule>ss[i].cssRules[j]).selectorText === '.sign-of-exst-cstm') { // window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
        customStyleSheet = ss[i];
        return customStyleSheet;
      }
    }
  }
  return null;
}

const getCustomClassRule = (cssClassName = '.header-c0-cr0-mainSlug.animated') =>{
  const ss = getCustomStyleSheet() as CSSStyleSheet;
  if (ss) {
    for (let j = 0, rulesLen = ss.cssRules.length; j < rulesLen; j += 1) {
      if ((<CSSStyleRule>ss.cssRules[j]).selectorText === cssClassName) {
        return ss.cssRules[j];
      }
    }
  }
  return null;
}

const setCustomClassRule = (cssClassName = '.header-c0-cr0-mainSlug.animated', rules = '{background-color:rgba( 78, 78, 78, 0 );width:100%;height:100%;}') =>{
  const ss = getCustomStyleSheet() as CSSStyleSheet;
  if (ss) {
    ss.addRule(cssClassName, rules, ss.cssRules.length);
  }
}

const getMediaRule = (ss: CSSStyleSheet, rule = '.h6-c0-i0-mainSlug') => {
  for (let j = 0; j < ss.cssRules.length; j += 1) {
    if (
      ss.cssRules[j].type === window.CSSRule.MEDIA_RULE
      && (<CSSMediaRule>ss.cssRules[j]).media.mediaText === `only screen and (max-width: ${Model.ob().getRWDMode()}px)`
      && (<CSSStyleRule>(<CSSMediaRule>ss.cssRules[j]).cssRules[0]).selectorText === rule
    ) {
      // console.log(ss.cssRules[j].cssRules[0]);
      return (<CSSMediaRule>ss.cssRules[j]).cssRules[0];
    }
  }

  return null;
}

const setMediaRule = (ss: CSSStyleSheet, rule = '.h6-c0-i0-mainSlug', rules = '{}') =>{
  for (let j = 0; j < ss.cssRules.length; j += 1) {
    // ss.cssRules[j].type == window.CSSRule.MEDIA_RULE
    if (
      (<CSSMediaRule>ss.cssRules[j]).media.mediaText === `only screen and (max-width: ${Model.ob().getRWDMode()}px)`
      && (<CSSStyleRule>(<CSSMediaRule>ss.cssRules[j]).cssRules[0]).selectorText === rule
    ) {
      (<CSSStyleSheet><unknown>(<CSSMediaRule>ss.cssRules[j]).cssRules[0]).addRule(
        rule, rules, (<CSSMediaRule>(<CSSMediaRule>ss.cssRules[j]).cssRules[0]).cssRules.length,
      );
      // console.log(ss.cssRules[j].cssRules[0]);
    }
  }
}

const getKeyframesRule = (rule = 'h684-c1-i0-mainSlug__keyframes') =>{
  const ss = getStyleSheet() as CSSStyleSheet;
  if (!ss) {
    return null;
  }
  for (let j = 0; j < ss.cssRules.length; j += 1) {
    // ss.cssRules[j].type === window.CSSRule.KEYFRAMES_RULE
    if ((<CSSKeyframesRule>ss.cssRules[j]).name === rule) {
      return ss.cssRules[j];
    }
  }
  return null;
}

export { getStyleSheet, getCustomStyleSheet, getClassRule, getCustomClassRule, getKeyframesRule,
  setClassRule,
  remAllRulesInCr, remKeyframeRule, addKeyframe, addCSSRule };
