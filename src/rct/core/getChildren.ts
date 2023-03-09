import { isEntriesValid } from "./validation/validation";

export const getChildren = (child: any) => {
  /**
   *  Child Can be Any of types:
   * string,
   * number,
   * Array,
   * boolean,
   * null,
   * undefined,
   * NaN,
   * Function,
   * React.ReactNode
   */
  const validChild = child.filter((container: any) => {
    if (
      container &&
      typeof container !== "string" &&
      typeof container !== "number"
    ) {
      /* if Object or Array */
      Object.entries(container).forEach(([key, value]: [string, any]) => {
        if (!isEntriesValid(key, value)) {
          delete container[key];
        }
      });

      if (Object.getOwnPropertyNames(container).length === 0) {
        return false;
      }
    }

    if (typeof container === "number") {
      return container.toString();
    }
    return container || false;
  });

  if (validChild.length === 1) {
    const [child] = validChild;

    if (typeof child === "string") {
      return child;
    }

    if (typeof child === "number") {
      return child.toString();
    }

    /* see instantiate */
    // if (isFunction(child)) {
    //   return child;
    // }
  }
  /* see instantiate */
  return validChild;
};
