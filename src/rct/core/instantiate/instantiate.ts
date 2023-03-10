import { isFunction, isReactElementOutOfClass } from "../validation/validation";
import { setProps } from "../setProps";
import { useState } from "../hooks/useState";

type makeInstanceT = { dom: Array<any>; element: any };

type innerElement = {
  type: string | any;
  props: any;
};

export const instantiate = (element: innerElement, container?: HTMLElement) => {
  // Nodes Append into Public DOM
  const { dom } = makeInstance(element, container);

  dom.forEach((node: any) => {
    container?.appendChild(node);
  });
};

export const makeInstance = (
  element: innerElement,
  topNode?: HTMLElement,
  isContainsHook?: boolean
): makeInstanceT => {
  const { type, props } = element;
  const stackArr = [];

  /* FRAGMENT */
  if (type === "") {
    if (props && props.children) {
      const fragmentArray: any = [];

      if (!Array.isArray(props.children)) {
        fragmentArray.push(document.createTextNode(props.children as string));
      } else {
        props.children.forEach((element: any) => {
          if (typeof element === "object") {
            fragmentArray.push(...makeInstance(element).dom);

            return;
          }

          fragmentArray.push(document.createTextNode(element as string));
        });
      }

      return { dom: fragmentArray, element };
    }
  }

  /* <div> */
  if (typeof type === "string") {
    topNode = topNode || document.createElement(type);

    setProps(topNode, element, props);

    if (isContainsHook) {
      useState.setRootPublicDom(element.props.internaldatadom);
    }

    if (props && props.children) {
      if (!Array.isArray(props.children)) {
        /* only one item */
        topNode.appendChild(document.createTextNode(props.children.toString()));
      } else {
        props.children.forEach((element: any) => {
          /* Components */
          if (element && typeof element === "object") {
            const inst = makeInstance(element);

            inst.dom.forEach((elementToAppend: any) => {
              topNode?.appendChild(elementToAppend);
            });

            return;
          }

          /* string | number */
          topNode?.appendChild(document.createTextNode(element as string));
        });
      }
    }

    return { dom: [topNode], element };
  }

  /* class */
  if (isReactElementOutOfClass(type)) {
    if (props.children && props.children.length === 1) {
      props.children = props.children[0];
    }

    const classComponent = new type(props);
    const element = classComponent.render();

    element.props.internaldata = classComponent;
    element.props.internaldataargs = props;
    const inst = makeInstance(element, topNode);

    return inst;
  }

  /* () => {} */
  if (isFunction(type)) {
    if (props.children && props.children.length === 1) {
      props.children = props.children[0];
    }

    const beforeOID = useState.ownerIndefication;
    const element = type(props);
    const afterOID = useState.ownerIndefication;

    const isUseSateTrigered = beforeOID !== afterOID;

    element.props.internaldata = type;
    element.props.internaldataargs = props;

    const inst = makeInstance(element, undefined, isUseSateTrigered);

    return inst;
  }

  return { dom: [topNode], element };
};
