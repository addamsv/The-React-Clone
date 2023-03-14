import { useRef, useState } from "../rct";
import { REACT_COMPONENT, REACT_ELEMENT } from "./definitions";
import { makeInstance } from "./instantiate/instantiate";
import { Element } from "./Interfaces";
import { setProps } from "./setProps";
import { isDeepEqual } from "./validation/validation";

/**
 *  ╭───────────────────────────────────────────────────────────────────────╮
 *  │      R E C O N C I L I A T I O N  A L G O R I T H M  F O R            │
 *  │                      R E A C T  C L O N E                             │
 *  │      (Laniakia is Animation/Preseentation/Site Contetnt builder)      │
 *  │                                                                       │
 *  │  Copyright (c) S.Adamovich 2017-2023                                  │
 *  │  License: GNU General Public License v2 or later                      │
 *  │  License URI: http://www.gnu.org/licenses/gpl-2.0.html                │
 *  │  Version: 0.0.0 (10-JUL-2022 - 2023)                                  │
 *  ╰───────────────────────────────────────────────────────────────────────╯
 *
 *  Create instance
 *  Remove instance
 *  Replace instance
 *  Update instance
 *  Update composite instance
 */
const isStringOrNumber = (el: any) =>
  typeof el === "string" || typeof el === "number";

const reconcileChild = (
  children: Array<any | string> | string,
  root: any,
  prevChildren?: any
) => {
  if (!root) {
    return;
  }

  if (isStringOrNumber(children) || !children.length) {
    if (children !== prevChildren) {
      root.innerText = children;
    }
    return;
  }

  if (typeof children === "string") {
    return;
  }

  let shiftIndexOfRemovedElement = 0;

  children.some((childrenReactElement: any, indx: number) => {
    /**
     *
     *
     * - - - - - - S T R I N G S or number inside (down of tree) - - - - - -
     *
     *
     *
     */
    if (typeof childrenReactElement !== "object") {
      if (!isStringOrNumber(childrenReactElement)) {
        return;
      }

      if (childrenReactElement !== prevChildren[indx - 1]) {
        root.insertBefore(
          document.createTextNode(childrenReactElement as string),
          root.childNodes[indx]
        );
        root.childNodes[indx + 1].remove();
      }

      return;
    }

    /**
     *
     *
     *
     *  - - - - - - C L A S S E S  &  F U N C T T I O N S - - - - - -
     *
     *
     *
     */
    // if (typeof childrenReactElement.type === "function") {
    if (childrenReactElement.$$typeof === REACT_COMPONENT) {
      // console.log(
      //   "REACT_COMPONENT"
      //   // childrenReactElement
      //   // prevChildren[indx].type.name
      // );

      if (childrenReactElement.type !== prevChildren[indx].type) {
        // console.log("------ Change Component ---------");

        useState.clearCurrentPublicDom();

        const { dom: domNodes, element: newReactElement } =
          makeInstance(childrenReactElement);

        const [rootNode] = domNodes;

        /* set useRef */
        const isContainsUseRef = Boolean(newReactElement.ref?.id);
        if (isContainsUseRef) {
          useRef.setRootPublicDom(rootNode);
        }

        root.children[0].remove();

        root.appendChild(rootNode);

        Object.defineProperty(rootNode, "aDataRootCompnnt", {
          enumerable: false,
          configurable: false,
          writable: true,
          value: {
            dom: rootNode,
            childrenReactElement,
            elementRenderFunction: childrenReactElement.type,
            elementRenderFunctionArgs: childrenReactElement.props,
          },
        });

        useState.didUnmounted();
        return;
      }

      const isPropsEqual = isDeepEqual(
        childrenReactElement.props,
        prevChildren[indx].props
      );

      if (isPropsEqual) {
        return;
      }

      const newElement = childrenReactElement.type(childrenReactElement.props);

      const prevElement = prevChildren[indx].type(prevChildren[indx].props);

      if (!newElement && !prevElement) {
        /* Skiping removed Element */

        // console.log("------Skiping removed Element------");

        shiftIndexOfRemovedElement++;
      } else if (newElement && !prevElement) {
        // console.log("------Making Element-------");

        /* Making Element */
        const { dom: domNodes, element: newReactElement } =
          makeInstance(newElement);
        const [rootNode] = domNodes;

        /* set useRef */
        const isContainsUseRef = Boolean(newReactElement.ref?.id);
        if (isContainsUseRef) {
          useRef.setRootPublicDom(rootNode);
        }

        root.insertBefore(rootNode, root.childNodes[indx]);

        Object.defineProperty(rootNode, "aDataRootCompnnt", {
          enumerable: false,
          configurable: false,
          writable: true,
          value: {
            dom: rootNode,
            childrenReactElement,
            elementRenderFunction: childrenReactElement.type,
            elementRenderFunctionArgs: childrenReactElement.props,
          },
        });
      } else {
        /** - - - - - - Remove/Reconcile the Components Element - - - - - */

        // console.log(
        // ("-------Remove/Reconcile the Components Element:");
        // root.children[indx - shiftIndexOfRemovedElement - 1],
        // newElement,
        // prevElement
        // );

        reconcileInstance(
          newElement,
          root.children[indx - shiftIndexOfRemovedElement - 1],
          prevElement
        );

        if (!newElement) {
          shiftIndexOfRemovedElement++;
        }
      }

      return;
    }

    /**
     *
     *
     *
     * - - - - - - D I V | I M G . . . (I N S T A N C E) - - - - - -
     *
     *
     *
     */
    if (childrenReactElement.$$typeof === REACT_ELEMENT) {
      // console.log("RECONCILE REACT_ELEMENT");

      /* set useRef */
      const isContainsUseRef = Boolean(childrenReactElement.ref?.id);
      if (isContainsUseRef) {
        useRef.setRootPublicDom(root.childNodes[indx]);
      }

      const isPropsEqual = isDeepEqual(
        childrenReactElement.props,
        prevChildren[indx].props
      );

      if (!isPropsEqual) {
        reconcileInstance(
          childrenReactElement,
          root.childNodes[indx - shiftIndexOfRemovedElement],
          prevChildren[indx]
        );
      }
    }
  });
};

export const reconcileInstance = (
  newReactElement: any,
  root: any,
  prevReactElement: any
) => {
  if (!newReactElement && prevReactElement && root) {
    root.remove();
    return;
  }

  if (root) {
    /* set useRef */
    const isContainsUseRef = Boolean(newReactElement.ref?.id);
    if (isContainsUseRef) {
      useRef.setRootPublicDom(root);
    }

    setProps(root, newReactElement, prevReactElement);

    if (newReactElement.props && newReactElement.props.children && root) {
      reconcileChild(
        newReactElement.props.children,
        root,
        prevReactElement.props.children
      );
    }

    /* for instance && composite instance */
    if (root && root.aDataRootCompnnt && root.aDataRootCompnnt.element) {
      Object.assign(root.aDataRootCompnnt.element, newReactElement);
    }
  }
};

export const reconsile = (element: any) => {
  const {
    elementRenderFunction: render,
    elementRenderFunctionArgs: args = undefined,
    dom: root,
    element: prevReactElement,
  } = element;

  const newReactElement = render(args);

  reconcileInstance(newReactElement, root, prevReactElement);
};
