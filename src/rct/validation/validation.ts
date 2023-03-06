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
