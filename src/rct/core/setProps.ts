import { isDeepEqual, isEventListener } from "./validation/validation";
import { Element } from "./Interfaces";

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

export const setProps = (root: any, element: any, compareElement?: Element) => {
  const props = element.props;
  if (!(props && root)) {
    return "PROPS ARE NOT SETTED";
  }

  Object.entries(props).forEach(([prop, value]: [string, any]) => {
    if (!isPropNameValid(prop)) {
      return;
    }

    if (isEventListener(prop)) {
      if (compareElement) {
        if (compareElement.props[prop] !== prop) {
          root.removeEventListener(
            prop.toLowerCase().substring(2),
            compareElement.props[prop]
          );
        }
      }
      root.addEventListener(prop.toLowerCase().substring(2), value);
      return;
    }

    if (prop === "internaldata") {
      Object.defineProperty(root, "aDataRootCompnnt", {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {
          dom: root,
          element,
          elementRenderFunction: value,
          elementRenderFunctionArgs: element.props.internaldataargs,
        },
      });

      value.internalInstance = {
        dom: root,
        element,
        elementRenderFunction: value,
        elementRenderFunctionArgs: element.props.internaldataargs,
      };

      element.props.internaldatadom = root;

      return;
    }

    // if (prop === "data-ev") {
    //   Object.defineProperty(root, "aDataEv", {
    //     enumerable: false,
    //     configurable: false,
    //     writable: true,
    //     value: value,
    //   });
    //   return;
    // }

    if (compareElement) {
      if (element.props[prop] !== compareElement.props[prop]) {
        root.setAttribute(prop, value);
      }
      return;
    }

    root.setAttribute(prop, value);
  });

  if (props.className) {
    if (compareElement) {
      if (element.props.className !== compareElement.props.className) {
        root.className = element.props.className;
      }
    } else {
      root.className = props.className;
    }
  }

  if (props.selected !== "undefined") {
    if (props.selected === true && root.getAttribute("selected") === null) {
      root.setAttribute("selected", "true");
    }

    if (
      compareElement &&
      root.getAttribute("selected") !== null &&
      props.selected === false
    ) {
      root.removeAttribute("selected");
    }
  }

  if (props.style) {
    if (compareElement) {
      if (compareElement.props.style) {
        /* isStyles equal */
        if (!isDeepEqual(compareElement.props.style, props.style)) {
          root.removeAttribute("style");
          Object.assign(root.style, props.style);
        }
      }
    } else {
      Object.assign(root.style, props.style);
    }
  }

  if (!props.style && compareElement && compareElement.props.style) {
    root.removeAttribute("style");
  }

  return "PROPS ARE SETTED";
};
