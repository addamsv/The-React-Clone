export const debounce = (callback: any, delay: any) => {
  let timeoutId: any;

  return function (...args: any) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  }
}

export const throttle = (callback: any, delay: any) => {
  let isWaiting = false;
  let savedArgs: any = null;
  let savedThis: any = null;

  return function wrapper(...args: any) {
    if (isWaiting) {
      savedArgs = args;
      // savedThis = this;
      return;
    }

    callback.apply(null, args);

    isWaiting = true;

    setTimeout(() => {
      isWaiting = false;
      if (savedThis) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, delay);
  }
}

// const f = throttle(console.log, 1);

// f(1);
// f(2);
// f(3);
// f(4);
// f(6);
// f(7);
// f(8);
// f(9);
// f(10);
// f(10);
// f(11);
// f(12);
// f(13);
// f(14);
// f(15);
// f(16);
// setTimeout(() => f(5), 1);
// setTimeout(() => f(6), 500);
// setTimeout(() => f(7), 1);

// export default debounce;
