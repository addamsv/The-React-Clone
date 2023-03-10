import { reconcileInstance } from "../reconcile";

const useSatePublicDom = {
  dom: null as any,
};

export const useState = (initialState?: any) => {
  const getStateValueObj = (setFn: any) => {
    let rootPublicDom: any = null;

    return {
      setRootPublicDom: (el: any) => (rootPublicDom = el),

      getRootPublicDom: () => rootPublicDom,

      state: (initialState: any) => {
        // const e = window.event;
        // const domEl: any = e?.target;
        // console.log(useSatePublicDom.dom);

        const root: any = useSatePublicDom.dom;

        if (!root) {
          return initialState;
        }

        // const root = getRootDomElement(domEl, setFn);

        // console.log(root === useSatePublicDom.dom);

        if (root.aStateData !== "undefined") {
          return root.aStateData;
        }

        return initialState;
      },
    };
  };

  const getSetStateObj = () => {
    const innerObj = {
      rootPublicDom: null as any,
      setStateFn: null as any,
    };

    const setTateObj = {
      setRootPublicDom: (el: any) => (innerObj.rootPublicDom = el),

      getRootPublicDom: () => innerObj.rootPublicDom,

      setState: (newState?: any): any => {
        const root: any = innerObj.rootPublicDom;

        if (!root) {
          return;
        }

        const prevState = root.aStateData?.toString();

        useSatePublicDom.dom = root;

        /* Set New State Data */
        if (root.aStateData === undefined) {
          Object.defineProperty(root, "aStateData", {
            enumerable: false,
            configurable: false,
            writable: true,
            value: newState,
          });
        }

        if (
          typeof root.aStateData === "object" &&
          typeof newState === "object" &&
          !Array.isArray(root.aStateData)
        ) {
          if (typeof newState === "function") {
            root.aStateData = Object.assign(
              {},
              root.aStateData,
              newState(root.aStateData)
            );
          } else {
            root.aStateData = Object.assign({}, root.aStateData, newState);
          }
        }

        if (
          typeof root.aStateData === "string" ||
          typeof root.aStateData === "number" ||
          Array.isArray(root.aStateData)
        ) {
          root.aStateData = newState;
        }

        /* Start Reconciliation Algorithm */
        if (prevState !== newState.toString()) {
          reconcileInstance(
            root.aDataRootCompnnt.elementRenderFunction(
              root.aDataRootCompnnt.elementRenderFunctionArgs
            ),
            root.aDataRootCompnnt.dom,
            root.aDataRootCompnnt.element
          );

          useState.setRootPublicDom(root);
        }
      },
    };

    innerObj.setStateFn = setTateObj.setState;

    return setTateObj;
  };

  const setStateObj = getSetStateObj();

  useState.setRootPublicDom = setStateObj.setRootPublicDom;
  useState.getRootPublicDom = setStateObj.getRootPublicDom;
  useState.ownerIndefication++;
  const valueObj = getStateValueObj(setStateObj.setState);
  return [valueObj.state(initialState), setStateObj.setState];
};

useState.setRootPublicDom = null as any;
useState.setRootPublicDomFofVal = null as any;
useState.getRootPublicDom = null as any;
useState.ownerIndefication = 0;

const getRootDomElement = (currDomEl: any, stateFn?: any): any => {
  if (!currDomEl) {
    return false;
  }

  if (!currDomEl.aDataRootCompnnt) {
    return getRootDomElement(currDomEl.parentNode);
  }

  return currDomEl;
};
