import { makeInstance } from "./instantiate/instantiate";
import { Element } from "./Interfaces";
import { setProps } from "./setProps";
import { isDeepEqual } from "./validation/validation";

/**
 *  Create instance
 *  Remove instance
 *  Replace instance
 *  Update instance
 *  Update composite instance
 */
const isStringOrNumber = (el: any) =>
  typeof el === "string" || typeof el === "number";

const reconcileChild = (
  domElement: any,
  children: Array<any | string> | string,
  compareChildren?: any
) => {
  if (!domElement) {
    return;
  }

  if (isStringOrNumber(children)) {
    if (children !== compareChildren.props.children) {
      domElement.innerText = children;
    }
    return;
  }

  if (typeof children === "string") {
    return;
  }

  let shiftIndexOfRemovedElement = 0;

  children.forEach((element: any, indx: number) => {
    /** - - - - - - S T R I N G S or number inside (down of tree) - - - - - - */
    if (typeof element !== "object") {
      if (!isStringOrNumber(element)) {
        return;
      }

      if (element !== compareChildren.props.children[indx - 1]) {
        domElement.insertBefore(
          document.createTextNode(element as string),
          domElement.childNodes[indx]
        );
        domElement.childNodes[indx + 1].remove();
      }

      return;
    }

    /** - - - - - - C L A S S E S  &  F U N C T T I O N S - - - - - - */
    if (typeof element.type === "function") {
      const isPropsEqual = isDeepEqual(
        element.props,
        compareChildren.props.children[indx].props
      );

      if (isPropsEqual) {
        return;
      }

      const newElement = element.type(element.props);
      const cmpElement = compareChildren.props.children[indx].type(
        compareChildren.props.children[indx].props
      );

      if (!newElement && !cmpElement) {
        /* Skiping removed Element */
        shiftIndexOfRemovedElement++;
      } else if (newElement && !cmpElement) {
        /* Making Element */
        const newElementInstance = makeInstance(newElement);
        domElement.insertBefore(
          newElementInstance.dom[0],
          domElement.childNodes[indx]
        );
        Object.defineProperty(newElementInstance.dom[0], "aDataRootCompnnt", {
          enumerable: false,
          configurable: false,
          writable: true,
          value: {
            dom: newElementInstance.dom[0],
            element,
            elementRenderFunction: element.type,
            elementRenderFunctionArgs: element.props,
          },
        });
      } else {
        /* reconcile/Remove Element */
        reconcileInstance(
          newElement,
          domElement.children[indx - shiftIndexOfRemovedElement - 1],
          cmpElement
        );

        if (!newElement) {
          shiftIndexOfRemovedElement++;
        }
      }

      return;
    }

    /** - - - - - - E L E M E N T  I S  D I V | I M G . . . - - - - - - */
    const isPropsEqual = isDeepEqual(
      element,
      compareChildren.props.children[indx]
    );

    if (!isPropsEqual) {
      /* cmp component */
      const status = reconcile(
        element,
        domElement.childNodes[indx - shiftIndexOfRemovedElement],
        compareChildren.props.children[indx]
      );
    }
  });
};

const reconcile = (
  element: any,
  domElement: any,
  cmpElement?: Element
): string => {
  const { props } = element;

  setProps(domElement, element, props, cmpElement);

  if (props && props.children && domElement) {
    reconcileChild(domElement, props.children, cmpElement);
  }

  if (domElement && domElement.aDataRootCompnnt) {
    Object.assign(domElement.aDataRootCompnnt.element, element);
    return "root reconciled";
  }

  return "reconciled";
};

export const reconcileInstance = (
  element: any,
  elDom: any,
  cmpElement: any
) => {
  if (!element && cmpElement && elDom) {
    elDom.remove();
    return;
  }

  if (elDom) {
    reconcile(element, elDom, cmpElement);
  }
};
