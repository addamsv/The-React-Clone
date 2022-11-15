const DataManager = (() => {
  const data = {
    firstCr: {} as any, // {[hid]: 'crName'}
    onSlideChangeFn: null as any,
    onSectionChangeFn: null as any,
    destID: '',
    rwdDflt: '',
    alertMenu: { onCloseFn: null, onShowFn: null, content: null } as {isOpen: boolean, onCloseFn: any, onShowFn: any, content: any},
    contextMenu: { onCloseFn: null, onShowFn: null, content: null } as {isOpen: boolean, onCloseFn: any, onShowFn: any, content: any},
    anmationMenu: { onCloseFn: null, onShowFn: null, content: null } as {isOpen: boolean, onCloseFn: any, onShowFn: any, content: any},
    layersMenu: { onCloseFn: null, onShowFn: null, content: null } as {isOpen: boolean, onCloseFn: any, onShowFn: any, content: any},
    commonMenu: { onCloseFn: null, onShowFn: null, content: null } as {isOpen: boolean, onCloseFn: any, onShowFn: any, content: any},
  };

  return {
    setSlideFirstCr: (hid: string, crName: string) => { data.firstCr[hid] = crName },
    getSlideFirstCr: (hid: string): string | undefined => {
      return data.firstCr[hid] ? data.firstCr[hid] : undefined;
    },

    setOnSlidePickFn: (f: () => void) => data.onSlideChangeFn = f,
    onSlidePickFn: () => data.onSlideChangeFn,

    setOnSectionChangeFn: (f: () => void) => data.onSectionChangeFn = f,
    getOnSectionChangeFn: () => data.onSectionChangeFn,

    setRwdDflt: (rwd: string) => data.rwdDflt = rwd,
    getRwdDflt: () => data.rwdDflt,

    ob: () => data,
  }
})();

export default DataManager;
