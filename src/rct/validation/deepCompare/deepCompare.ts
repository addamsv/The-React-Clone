import { isArray, isObject, isSameType } from "../helpers";

export const isDeepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (
    (!isObject(obj1) && !isArray(obj1)) ||
    (!isObject(obj2) && !isArray(obj2))
  ) {
    return false;
  }

  if (
    !isSameType(obj1, obj2) ||
    Object.keys(obj1).length !== Object.keys(obj2).length
  ) {
    return false;
  }

  for (const key of Object.keys(obj1)) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (!isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
