/* current */
const useRefPublicDom = {
  dom: null as any,
};

export const useRef = (initValue: any = null) => {
  const innerObj = {
    id: 0,
    current: initValue as any,
  };

  const setRootPublicDom = (el: any) => (innerObj.current = el);

  useRef.setRootPublicDom = setRootPublicDom;
  useRef.ownerIndefication++;
  innerObj.id = useRef.ownerIndefication;

  return innerObj;
};

useRef.setRootPublicDom = null as any;
useRef.ownerIndefication = 0;
