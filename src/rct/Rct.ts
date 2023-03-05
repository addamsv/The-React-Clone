/** ⬇️⬇️⬇️⬇️⬇️ 🌼 Real React Component 🌼 ⬇️⬇️⬇️⬇️⬇️ **/

// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d
/**
 *  ╭───────────────────────────────────────────────────────────────────────╮
 *  │       R E A C T  F O R   L A N I A K E A                              │
 *  │                                                                       │
 *  │  Examples and documentation at:                                       |
 *  |   https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d  │
 *  │                                                                       │
 *  │  Copyright (c) 2017-2022 S.Adamovich                                  │
 *  │  License: GNU General Public License v2 or later                      │
 *  │  License URI: http://www.gnu.org/licenses/gpl-2.0.html                │
 *  │  Version: 0.1.0 (10-JUL-2022)                                         │
 *  ╰───────────────────────────────────────────────────────────────────────╯
 */

const REACT_ELEMENT = Symbol("react.element");
const REACT_FRAGMENT = Symbol("react.fragment");

/** ⬇️⬇️⬇️⬇️⬇️ 🌼 Real React Component 🌼 ⬇️⬇️⬇️⬇️⬇️ **/
interface Element {
  $$typeof: symbol; // ('react.element')
  key: null;
  ref: null;
  _owner: {
    flag?: number;
    index?: number;
    sibling?: string;
  };
  type: string | symbol | any | Component;
  props: any;
}

class ElementClass {
  public context: any;

  public forceUpdate: any;

  public refs: any;

  public internalInstance: any;
}

interface IComponent {
  render: () => any;

  componentDidMount?: () => any;

  componentWillUnmount?: () => any;

  componentDidCatch?: () => any;
}

class Component extends ElementClass implements IComponent {
  public state: any = {};

  public props: any;

  constructor(props?: any) {
    super();
    this.props = props || {};
  }

  render() {}

  componentDidUpdate(prevProps: any, prevState: any) {
    return { prevProps, prevState };
  }

  setState(partialState: any) {
    if (typeof partialState === "function") {
      this.state = Object.assign({}, this.state, partialState(this.state));
    } else {
      this.state = Object.assign({}, this.state, partialState);
    }
    updateInstance(
      this.render(),
      this.internalInstance.dom,
      this.internalInstance.element
    );
  }
}

const updateChild = (
  domElement: any,
  children: Array<any | string> | string,
  compareChildren?: any
) => {
  if (!domElement) {
    return;
  }

  if (
    !Array.isArray(children) &&
    (typeof children === "string" || typeof children === "number")
  ) {
    if (children !== compareChildren.props.children) {
      domElement.innerText = children as string;
    }
    return;
  }

  let shiftIndexOfRemovedElement = 0;

  children.forEach((element, indx) => {
    if (element && typeof element === "object") {
      if (typeof element.type === "function") {
        /** - - - - - - C L A S S E S  &  F U N C T T I O N S - - - - - - */
        /* cmp args */
        const a = JSON.stringify(element.props);
        const b = JSON.stringify(compareChildren.props.children[indx].props);
        if (a !== b) {
          const newElement = element.type(element.props);
          const cmpElement = compareChildren.props.children[indx].type(
            compareChildren.props.children[indx].props
          );

          if (!newElement && !cmpElement) {
            /* Skiping removed Element */
            shiftIndexOfRemovedElement++;
          } else if (newElement && !cmpElement) {
            /* Making Element */
            const newElementInstance = instantiate(newElement);
            domElement.insertBefore(
              newElementInstance.dom[0],
              domElement.childNodes[indx]
            );
            Object.defineProperty(
              newElementInstance.dom[0],
              "aDataRootCompnnt",
              {
                enumerable: false,
                configurable: false,
                writable: true,
                value: {
                  dom: newElementInstance.dom[0],
                  element,
                  elementRenderFunction: element.type,
                  elementRenderFunctionArgs: element.props,
                },
              }
            );
          } else {
            /* Update/Remove Element */
            updateInstance(
              newElement,
              domElement.children[indx - shiftIndexOfRemovedElement - 1],
              cmpElement
            );

            if (!newElement) {
              shiftIndexOfRemovedElement++;
            }
          }
        }
      } else {
        /** - - - - - - D I V  C O M P O N E N T S - - - - - - */
        /* !!!should be deepcompared!!! */
        const a = JSON.stringify(element);
        const b = JSON.stringify(compareChildren.props.children[indx]);

        if (a !== b) {
          /* cmp component */
          const status = update(
            element,
            domElement.childNodes[indx - shiftIndexOfRemovedElement],
            compareChildren.props.children[indx]
          );
        }
      }
    } else {
      /** - - - - - - S T R I N G S  or number... - - - - - - */
      if (
        element.toString() &&
        (typeof element === "string" || typeof element === "number")
      ) {
        if (element !== compareChildren.props.children[indx - 1]) {
          domElement.insertBefore(
            document.createTextNode(element as string),
            domElement.childNodes[indx]
          );
          domElement.childNodes[indx + 1].remove();
        }
      }
    }
  });
};

const update = (
  element: any,
  domElement: any,
  cmpElement?: Element
): string => {
  const { type, props } = element;

  const setPropsReport = setProps(domElement, element, props, cmpElement);

  if (props && props.children && domElement) {
    updateChild(domElement, props.children, cmpElement);
  }

  if (domElement && domElement.aDataRootCompnnt) {
    Object.assign(domElement.aDataRootCompnnt.element, element);
    return "root updated";
  }
  return "updated";
};

const updateInstance = (element: any, elDom: any, cmpElement: any) => {
  if (!element && cmpElement && elDom) {
    elDom.remove();
  } else {
    if (elDom) {
      update(element, elDom, cmpElement);

      /* if component based on class component -> this.componentDidUpdate() {return {prevProps, prevState}}; */
      /* if component based on func component.useEffect(()=>{},[x]); */
    }
  }
};

const isEventListener = (attr: string): boolean => {
  return (
    attr.startsWith("on") &&
    (attr.toLowerCase() in window || attr === "onTouchStart")
  );
};

const isPropNameValid = (propName: string): boolean => {
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

const isFunctionNative = (fn: string) => {
  return /\{\s*\[native code\]\s*\}/.test("" + fn);
};

const isReactElementOutOfClass = (fn: any) => {
  return fn.prototype && fn.prototype.render;
};

const isEntriesValid = (key: string, value: any) => {
  return (
    ["type", "props", "ref", "key"].some(
      (currKey: string) => currKey === key
    ) && value
  );
};

const React = {
  Component,

  createElement: (
    type?: any,
    properties?: any,
    ...child: any
  ): Element | null => {
    if (isFunctionNative(type)) {
      return null;
    }

    const _owner = {
      flag: 112233,
      index: 0,
      sibling: "FiberNode",
    };

    const { key = null, ref = null, ...props } = properties || {};

    if (child.length) {
      props.children =
        child.length === 1 &&
        (typeof child[0] === "string" || typeof child[0] === "number")
          ? child[0].toString()
          : child.filter((container: any) => {
              /* Child Can be Any of types: string, number, Array, boolean, null, undefined, NaN, function, React.ReactNode */
              // type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
              if (
                container &&
                typeof container !== "string" &&
                typeof container !== "number"
              ) {
                Object.entries(container).forEach(
                  ([key, value]: [string, any]) => {
                    if (!isEntriesValid(key, value)) {
                      delete container[key];
                    }
                  }
                );

                if (Object.getOwnPropertyNames(container).length === 0) {
                  return false;
                }
              }

              if (typeof container === "number") {
                return container.toString();
              }
              return container || false;
            });
    }

    type = type || REACT_FRAGMENT;

    return { $$typeof: REACT_ELEMENT, key, ref, _owner, type, props };
  },

  /* el.props.children.push(Rct.createElement('div')); */
  put: (rootReactElement: any, ...reactElements: Array<Element>) => {
    rootReactElement.props.children.push(...reactElements);
  },

  in: (rootReactElement: any, reactElements: Array<Element>) => {
    rootReactElement.props.children.push(...reactElements);
  },
};

const eraseEl = (elID: string): void => {
  const elIn = document.getElementById(elID);

  if (elIn) {
    elIn.innerHTML = "";
  }
};

const ReactDOM = {
  rootInstance: null as any,

  /* react@^18.0.0 */
  createRoot: (container: HTMLElement | null) => {
    return {
      render: (element: any) => {
        if (container && container.children.length !== 0) {
          container.innerHTML = "";
        }
        reconcile(container, null, element);
        /* if component based on class component -> componentDidMount() */
      },
      unmount: () => {
        /* if component based on class component -> componentWillUnmount() */
        return true;
      },
    };
  },

  render: (element: any, container: HTMLElement | null) => {
    // const prevInstance = ReactDOM.rootInstance;
    // const nextInstance = reconcile(container, prevInstance, element);
    if (container && container.children.length !== 0) {
      container.innerHTML = "";
    }
    reconcile(container, null, element);
    // ReactDOM.rootInstance = nextInstance;
  },

  /* temp */
  // beforeEl: (element: any, container: HTMLElement | null) => {
  //   ReactDOM.instantiate(element).forEach((node: any) => {
  //     container?.parentNode?.insertBefore(node, container);
  //   });
  // },

  // /* temp */
  // afterEl: (element: any, container: HTMLElement | null) => {
  //   ReactDOM.instantiate(element).forEach((node: any) => {
  //     container?.parentNode?.insertBefore(node, container.nextSibling);
  //   });
  // },
};

/**
 *  Create instance
 *  Remove instance
 *  Replace instance
 *  Update instance
 *  Update composite instance
 */
const reconcile = (
  parentDom: HTMLElement | null,
  instance: any,
  element: any
): any => {
  if (instance === null) {
    // Create instance
    const newInstance = instantiate(element);

    newInstance.dom.forEach((node: any) => {
      parentDom?.appendChild(node);
    });

    return newInstance; // newInstance = { dom: node, element, childInstance, publicInstance }
  }

  return ReactDOM.rootInstance;
};

const instantiate = (
  element: any,
  topNode?: any
): { dom: Array<any>; element: any } => {
  const { type, props } = element;

  /* FRAGMENT */
  if (type === REACT_FRAGMENT && props && props.children) {
    return { dom: getFragment(props.children), element };
  }

  /* DOM_ELEMENT */
  if (typeof type === "string") {
    topNode = topNode || document.createElement(type);
    setProps(topNode, element, props);

    if (props && props.children) {
      appendComponents(topNode, props.children);
    }

    return { dom: [topNode], element };
  }

  if (typeof type === "function") {
    if (isReactElementOutOfClass(type)) {
      /* CLASS */
      const classComponent = new type(props);
      const classElement = classComponent.render();
      if (!classElement) {
        console.log(classElement);
      }
      classElement.props.internaldata = classComponent;
      classElement.props.internaldataargs = props;
      const inst = instantiate(classElement, topNode);

      return inst;
    } else {
      /* FUNCTION */
      // const beforeOID = useState.ownerIndefication;
      const functionElement = type(props);
      // const afterOID = useState.ownerIndefication;
      // console.log("type", type.name, "before:", beforeOID, "after:", afterOID);

      functionElement.props.internaldata = type;
      functionElement.props.internaldataargs = props;
      const inst = instantiate(functionElement, topNode);

      inst.element._owner.flag = useState.ownerIndefication;
      inst.element._owner.sibling = type.name;

      return inst;
    }
  }

  return { dom: [topNode], element };
};

const setProps = (
  topNode: any,
  element: any,
  props: any,
  compareElement?: Element
) => {
  if (props && topNode) {
    Object.entries(props).forEach(([prop, value]: [string, any]) => {
      if (isPropNameValid(prop)) {
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
        } else {
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
          } else if (prop === "data-ev") {
            Object.defineProperty(topNode, "aDataEv", {
              enumerable: false,
              configurable: false,
              writable: true,
              value: value,
            });
          } else {
            if (compareElement) {
              if (element.props[prop] !== compareElement.props[prop]) {
                // console.log(`${prop} is changed`);
                topNode.setAttribute(prop, value);
              }
            } else {
              topNode.setAttribute(prop, value);
            }
          }
        }
      }
    });

    if (props.className) {
      if (compareElement) {
        if (element.props.className !== compareElement.props.className) {
          // console.log(`className is changed`);
          topNode.className = element.props.className;
        }
      } else {
        topNode.className = props.className;
      }
    }

    if (props.selected !== "undefined") {
      if (
        props.selected === true &&
        topNode.getAttribute("selected") === null
      ) {
        topNode.setAttribute("selected", "true");
      }

      if (
        compareElement &&
        topNode.getAttribute("selected") !== null &&
        props.selected === false
      ) {
        // console.log(`selected is changed`);
        topNode.removeAttribute("selected");
      }
    }

    if (props.style) {
      if (compareElement) {
        if (compareElement.props.style) {
          /* isStyles equal */
          if (
            JSON.stringify(compareElement.props.style) !==
            JSON.stringify(props.style)
          ) {
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
  } else {
    return "PROPS ARE NOT SETTED";
  }
};

const getFragment = (children: any) => {
  const fragmentArray: any = [];

  if (!Array.isArray(children)) {
    fragmentArray.push(document.createTextNode(children as string));
    return fragmentArray;
  }

  children.forEach((element: any) => {
    if (element && typeof element === "object") {
      fragmentArray.push(...instantiate(element).dom);
    } else {
      fragmentArray.push(document.createTextNode(element as string));
    }
  });

  return fragmentArray;
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

const getRootDomElement = (currDomEl: any, hookID?: string): any => {
  if (!currDomEl) {
    return false;
  }
  if (!currDomEl.aDataRootCompnnt) {
    return getRootDomElement(currDomEl.parentNode);
  }
  return currDomEl;
};

const useState = (initialState?: any) => {
  useState.setownerIndefication();

  const state = (initialState: any) => {
    const e = window.event;
    const domEl: any = e?.target;

    if (!domEl) {
      return initialState;
    }

    const root = getRootDomElement(domEl);

    if (root && root.aDataRootCompnntState !== "undefined") {
      return root.aDataRootCompnntState;
    }
    return initialState;
  };

  const setState = () => {
    return (newState?: any) => {
      const e = window.event;
      const domEl: any = e?.target;

      if (!domEl) {
        return;
      }

      const root = getRootDomElement(domEl);

      if (!root) {
        return;
      }

      const prevState = root.aDataRootCompnntState?.toString();

      if (root.aDataRootCompnntState === undefined) {
        Object.defineProperty(root, "aDataRootCompnntState", {
          enumerable: false,
          configurable: false,
          writable: true,
          value: newState,
        });
      }

      if (
        typeof root.aDataRootCompnntState === "object" &&
        typeof newState === "object" &&
        !Array.isArray(root.aDataRootCompnntState)
      ) {
        if (typeof newState === "function") {
          root.aDataRootCompnntState = Object.assign(
            {},
            root.aDataRootCompnntState,
            newState(root.aDataRootCompnntState)
          );
        } else {
          root.aDataRootCompnntState = Object.assign(
            {},
            root.aDataRootCompnntState,
            newState
          );
        }
      }

      if (
        typeof root.aDataRootCompnntState === "string" ||
        typeof root.aDataRootCompnntState === "number" ||
        Array.isArray(root.aDataRootCompnntState)
      ) {
        root.aDataRootCompnntState = newState;
      }

      if (prevState !== newState.toString()) {
        // console.time('setState updateInstance');
        // console.timeLog('setState updateInstance');
        // console.timeEnd('setState updateInstance');

        updateInstance(
          root.aDataRootCompnnt.elementRenderFunction(
            root.aDataRootCompnnt.elementRenderFunctionArgs
          ),
          root.aDataRootCompnnt.dom,
          root.aDataRootCompnnt.element
        );
      }
    };
  };

  return [state(initialState), setState()];
};

useState.ownerIndefication = 0;

useState.setownerIndefication = () => {
  useState.ownerIndefication++;
};

export { Component, useState, ReactDOM };
export default React;
