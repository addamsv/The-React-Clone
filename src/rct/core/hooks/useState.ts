import { reconsile } from "../reconcile";

/* current */
const currentPublicDom = { dom: null as any, didUnmounted: false };

export const useState = (initialState?: any) => {
  const innerObj = { rootPublicDom: null as any };

  const setRootPublicDom = (el: any) => (innerObj.rootPublicDom = el);

  const stateValue = () => {
    const root: any = currentPublicDom.dom;

    return !root || root.aStateData === "undefined"
      ? initialState
      : root.aStateData;
  };

  const setState = (newState?: any): any => {
    const root: any = innerObj.rootPublicDom;

    if (!root) {
      return;
    }

    const prevState = root.aStateData?.toString();

    currentPublicDom.dom = root;

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

      if (currentPublicDom.didUnmounted) {
        // console.log("didUnmounted");
        // console.log(root);
      }
      if (!currentPublicDom.didUnmounted) {
        useState.setRootPublicDom(root);
      }

      currentPublicDom.didUnmounted = false;

      // console.log(root);
    }
  };
  setState.innerObj = innerObj;
  useState.setRootPublicDom = setRootPublicDom;
  useState.ownerIndefication++;

  return [stateValue(), setState];
};

useState.setRootPublicDom = null as any;

useState.didUnmounted = () => (currentPublicDom.didUnmounted = true);

useState.clearCurrentPublicDom = () => {
  useState.setRootPublicDom(null);
  useState.setRootPublicDom = null;
  currentPublicDom.dom = null;
};

useState.ownerIndefication = 0;
