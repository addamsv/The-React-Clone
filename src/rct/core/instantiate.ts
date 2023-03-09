import { isFunction, isReactElementOutOfClass } from "./validation/validation";
import { setProps } from "./setProps";
import { REACT_FRAGMENT } from "./definitions";
import { useState } from "./hooks/useState";
import { getFragment } from "./fragment";

type InstantiateT = { dom: Array<any>; element: any };

export const instantiate = (element: any, topNode?: any): InstantiateT => {
  const { type, props } = element;
  const stackArr = [];

  /* FRAGMENT */
  if (type === REACT_FRAGMENT && props && props.children) {
    return { dom: getFragment(props.children), element };
  }

  /* <div> */
  if (typeof type === "string") {
    topNode = topNode || document.createElement(type);

    setProps(topNode, element, props);

    if (props && props.children) {
      appendComponents(topNode, props.children);
    }

    return { dom: [topNode], element };
  }

  /* class */
  if (isReactElementOutOfClass(type)) {
    if (props.children && props.children.length === 1) {
      props.children = props.children[0];
    }

    const classComponent = new type(props);
    const classElement = classComponent.render();

    classElement.props.internaldata = classComponent;
    classElement.props.internaldataargs = props;
    const inst = instantiate(classElement, topNode);

    return inst;
  }

  /* () => {} */
  if (isFunction(type)) {
    if (props.children && props.children.length === 1) {
      props.children = props.children[0];
    }

    const beforeOID = useState.ownerIndefication;
    const functionElement = type(props);
    const afterOID = useState.ownerIndefication;

    const isUseSateTrigered = beforeOID !== afterOID;

    functionElement.props.internaldata = type;
    functionElement.props.internaldataargs = props;
    const inst = instantiate(functionElement);

    if (isUseSateTrigered) {
      console.log("-------");
      console.log("type", type.name, "using useState hook");
      console.log(functionElement);
      if (functionElement.props.internaldatadom) {
        console.log(functionElement.props.internaldatadom);

        useState.setRootPublicDom(functionElement.props.internaldatadom);
      }
    }

    // inst.element._owner.flag = useState.ownerIndefication;
    // inst.element._owner.sibling = type.name;

    return inst;
  }

  return { dom: [topNode], element };
};

const appendComponents = (topNode: any, children: any): any => {
  if (!Array.isArray(children)) {
    topNode.appendChild(document.createTextNode(children.toString()));
    return topNode;
  }

  children.forEach((element) => {
    if (element && typeof element === "object") {
      const inst = instantiate(element);

      inst.dom.forEach((elementToAppend: any) => {
        topNode.appendChild(elementToAppend);
      });
    } else {
      topNode.appendChild(document.createTextNode(element as string));
    }
  });

  return topNode;
};
