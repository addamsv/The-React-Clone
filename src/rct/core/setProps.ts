import {
  isDeepEqual,
  isEventListener,
  isPropNameValid,
} from "./validation/validation";
import { Element } from "./Interfaces";

export const setProps = (
  topNode: any,
  element: any,
  props: any,
  compareElement?: Element
) => {
  if (!(props && topNode)) {
    return "PROPS ARE NOT SETTED";
  }

  Object.entries(props).forEach(([prop, value]: [string, any]) => {
    if (!isPropNameValid(prop)) {
      return;
    }

    if (isEventListener(prop)) {
      if (compareElement) {
        if (compareElement.props[prop] !== prop) {
          topNode.removeEventListener(
            prop.toLowerCase().substring(2),
            compareElement.props[prop]
          );
        }
      }
      topNode.addEventListener(prop.toLowerCase().substring(2), value);
      return;
    }

    if (prop === "internaldata") {
      Object.defineProperty(topNode, "aDataRootCompnnt", {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {
          dom: topNode,
          element,
          elementRenderFunction: value,
          elementRenderFunctionArgs: element.props.internaldataargs,
        },
      });
      value.internalInstance = {
        dom: topNode,
        element,
        elementRenderFunction: value,
        elementRenderFunctionArgs: element.props.internaldataargs,
      };
      element.props.internaldatadom = topNode;
      return;
    }

    // if (prop === "data-ev") {
    //   Object.defineProperty(topNode, "aDataEv", {
    //     enumerable: false,
    //     configurable: false,
    //     writable: true,
    //     value: value,
    //   });
    //   return;
    // }

    if (compareElement) {
      if (element.props[prop] !== compareElement.props[prop]) {
        topNode.setAttribute(prop, value);
      }
      return;
    }

    topNode.setAttribute(prop, value);
  });

  if (props.className) {
    if (compareElement) {
      if (element.props.className !== compareElement.props.className) {
        topNode.className = element.props.className;
      }
    } else {
      topNode.className = props.className;
    }
  }

  if (props.selected !== "undefined") {
    if (props.selected === true && topNode.getAttribute("selected") === null) {
      topNode.setAttribute("selected", "true");
    }

    if (
      compareElement &&
      topNode.getAttribute("selected") !== null &&
      props.selected === false
    ) {
      topNode.removeAttribute("selected");
    }
  }

  if (props.style) {
    if (compareElement) {
      if (compareElement.props.style) {
        /* isStyles equal */
        if (!isDeepEqual(compareElement.props.style, props.style)) {
          topNode.removeAttribute("style");
          Object.assign(topNode.style, props.style);
        }
      }
    } else {
      Object.assign(topNode.style, props.style);
    }
  }

  if (!props.style && compareElement && compareElement.props.style) {
    topNode.removeAttribute("style");
  }

  return "PROPS ARE SETTED";
};
