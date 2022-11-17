import Container from "../../../../../../models/dataPackage/containerModel";
import Model from "../../../../../../models/model";

const RootContainerSortModel = {
  getRootJsnAscByPriority: (jsn: any): any => procOrder(jsn)
}

/**
* REALIZATION INTERFACE Get JSON ACS by Priority
*/
const isPriorityCrExist = (container: any): boolean => {
  return container && container.cs && container.cs.priority;
}

const getCrCsPriorityValue = (cr: any) => {
  return isPriorityCrExist(cr) ? cr.cs.priority : null;
}

const getCrWithoutPriority = (data: any, crName: string, stack: any, maxPriority: number): any => {
  const cr = getCrCsPriorityValue(data);
  const stackWithoutPriority = stack;
  if (
    crName === 'cs'
    || !cr
    || cr === ''
    || cr <= 0
    || cr > maxPriority
  ) {
    stackWithoutPriority[crName] = data;
  }
  return stackWithoutPriority;
}

const getProperStack = (data: any, stack: any, curPriority: number): any => {
  let cr = '';
  const propStack = stack;
  Object.keys(data).some((iCmp) => {
    cr = getCrCsPriorityValue(data[iCmp]);
    if (cr && Number(cr) === curPriority) {
      propStack[iCmp] = data[iCmp];
    }
    return false;
  });
  return propStack;
}

/**
 * The Lost Priority's developing here
 */
/*
const getStackAscByPriority = (jsn, curPriority = 1, outJsn = {}, cr = '') => {
  for (const lCr in jsn) {
    cr = getCrCsPriorityValue(jsn[lCr]);
    if (cr && cr <= curPriority) {
      outJsn[lCr] = jsn[lCr];
    } else {
      curPriority = cr;
    }
  }
  return outJsn;
}
*/

const addAnotherStackEl = (stack: any, stackWithoutPriority: any): any => {
  const newStack = stack;
  Object.keys(stackWithoutPriority).some((s) => {
    newStack[s] = stackWithoutPriority[s]; /** needs to asc by been lost priority */
    return false;
  });
  return newStack;
}

const getOrderedArr = (data: any, maxPriority = 200) => {
  let stack: any = {};
  let stackWithoutPriority: any = {};
  let curPriority = 1;

  Object.keys(data).some((container) => {
    stackWithoutPriority = getCrWithoutPriority(
      data[container],
      container,
      stackWithoutPriority,
      maxPriority,
    );
    stack = getProperStack(data, stack, curPriority);
    curPriority += 1;
    return false;
  });

  return addAnotherStackEl(stack, stackWithoutPriority);
}

const getCrLength = (jsnObj: any): number => {
  return Object.keys(jsnObj).length;
}

const isJsnObj = (obj: any): boolean => {
  return typeof obj === 'object' && obj.constructor === Object;
}

const getOrderedJsn = (json: any, rootOnlyFlag = true): any => {
  const jsn = json;
  Object.keys(jsn).some((prop) => {
    if (Container.getCrNameWithoutNum(prop) === 'c') {
      jsn[prop] = getOrderedArr(jsn[prop], getCrLength(jsn[prop]));
      if (isJsnObj(jsn[prop]) && !rootOnlyFlag) {
        jsn[prop] = getOrderedJsn(jsn[prop]);
      }
    }
    return false;
  });
  return jsn;
}

const getObjWithRoot = (jsn: any): { c0: any } => {
  return { c0: jsn || {} };
}

const getObjWithoutRoot = (jsn: any): any => {
  return jsn ? jsn.c0 : {};
}

const procOrder = (jsn: any, rootOnlyFlag = true): any => {
  return getObjWithoutRoot(getOrderedJsn(getObjWithRoot(jsn), rootOnlyFlag));
}

export default RootContainerSortModel;
