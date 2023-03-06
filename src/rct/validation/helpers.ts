export const isObject = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

export const isArray = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

export const isSameType = (obj1: any, obj2: any): boolean => {
  return (
    Object.prototype.toString.call(obj1) ===
    Object.prototype.toString.call(obj2)
  );
};
