import { reconsile } from "../reconcile";

/* current */
const useSatePublicDom = {
  dom: null as any,
};

export const useState = (initialState?: any) => {
  const getStateValueObj = () => {
    let rootPublicDom: any = null;

    return {
      setRootPublicDom: (el: any) => (rootPublicDom = el),

      getRootPublicDom: () => rootPublicDom,

      state: (initialState: any) => {
        const root: any = useSatePublicDom.dom;

        if (!root) {
          return initialState;
        }

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
        if (prevState !== newState) {
          reconsile(root.aDataRootCompnnt);

          useState.setRootPublicDom(root);
        }
      },
    };

    innerObj.setStateFn = setTateObj.setState;

    return setTateObj;
  };

  const setStateObj = getSetStateObj();

  useState.setRootPublicDom = setStateObj.setRootPublicDom;
  useState.ownerIndefication++;

  const valueObj = getStateValueObj();

  return [valueObj.state(initialState), setStateObj.setState];
};

useState.setRootPublicDom = null as any;
useState.ownerIndefication = 0;
