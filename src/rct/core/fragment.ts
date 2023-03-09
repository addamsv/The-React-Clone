import { instantiate } from "./instantiate";

export const getFragment = (children: any) => {
  const fragmentArray: any = [];

  if (!Array.isArray(children)) {
    fragmentArray.push(document.createTextNode(children as string));
    return fragmentArray;
  }

  children.forEach((element: any) => {
    if (typeof element === "object") {
      fragmentArray.push(...instantiate(element).dom);

      return;
    }
    fragmentArray.push(document.createTextNode(element as string));
  });

  return fragmentArray;
};
