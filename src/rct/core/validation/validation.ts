export const isEventListener = (attr: string): boolean => {
  return (
    attr.startsWith("on") &&
    (attr.toLowerCase() in window || attr === "onTouchStart")
  );
};

export const isPropNameValid = (propName: string): boolean => {
  return ![
    "className",
    "selected",
    "style",
    "key",
    "ref",
    "children",
    "internaldataargs",
    "internaldatadom",
  ].some((el) => el === propName);
};

export const isFunctionNative = (fn: string) =>
  /\{\s*\[native code\]\s*\}/.test("" + fn);

export const isReactElementOutOfClass = (fn: any) =>
  fn.prototype && fn.prototype.render;

export const isEntriesValid = (key: string, value: any) => {
  return (
    ["type", "props", "ref", "key"].some(
      (currKey: string) => currKey === key
    ) && value
  );
};

export const isObject = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

export const isArray = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

export const isFunction = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object Function]";
};

export const isSameType = (obj1: any, obj2: any): boolean => {
  return (
    Object.prototype.toString.call(obj1) ===
    Object.prototype.toString.call(obj2)
  );
};

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
