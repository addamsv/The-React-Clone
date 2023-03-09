/**
 * useEffect the 6 of March, 2023 feature
 */
export const useEffect = (fn: () => any, varsArr: any[]) => {
  return undefined;
};

useEffect.callsCounter = 0;

useEffect.setCallsCounter = () => {
  useEffect.callsCounter++;
};
