export const useRef = (initValue: any) => {
  const getUseRefValueObj = () => {
    const innerObj = {
      current: null as any,
    };

    return {
      setRootPublicDom: (el: any) => (innerObj.current = el),

      ref: (initValue: any) => {
        return innerObj;
      },
    };
  };

  const useRefValueObj = getUseRefValueObj();

  useRef.setRootPublicDom = useRefValueObj.setRootPublicDom;
  useRef.ownerIndefication++;

  return useRefValueObj.ref(initValue);
};

useRef.setRootPublicDom = null as any;
useRef.ownerIndefication = 0;
