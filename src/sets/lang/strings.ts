import lang from './lang';

const Strings = (() => {
  let currlang = 'en';

  const langListArr: Array<string> = []; // ['en', 'ru']...

  const names: any = {};

  const setLangListArr = () => {
    Object.values(names).some((el) => {
      Object.keys(el as object).some((langName) => {
        if (!langListArr.includes(langName)) {
          langListArr.push(langName);
        }
        return false;
      });
      return false;
    });
  }

  const setLang = (lang: string) => {
    if (langListArr.includes(lang)) {
      currlang = lang;
    }
    else {
      currlang = 'en';
    }
  }

  const init = () => {
    Object.assign(names, lang);
    setLangListArr();
  }

  init();

  return {
    id: (str: string) => (!names[str]) ? '' : names[str][currlang] || names[str].en,
    getCurrentLang: () => currlang,
    getLangList: () => langListArr,
    setCurrentLang: (lang: string) => setLang(lang),
  };
})();
  
export default Strings;
