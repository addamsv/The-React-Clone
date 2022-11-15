const WindowManager = (() => {
  type tfn = {
    mainmenu: (() => void) | undefined;
  };

  const fn: tfn = {
    mainmenu: undefined,
  };

  return {
    MainMenu: {
      update: () => {
        if (fn.mainmenu) {
          fn.mainmenu();
        }
      },
      setFn: (func: () => void) => fn.mainmenu = func}, // console.log('MainMenu updating')
  };
})();

export default WindowManager;
