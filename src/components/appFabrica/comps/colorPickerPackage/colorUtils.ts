import { CSS } from "../../../../utils/css";
import { debounce } from "../../../../utils/debounce";

const isNumbersRGBValid = (numbers: Array<number>): boolean => {
  return !numbers.some((number) => !(Number.isInteger(number) && number >= 0 && number <= 255));
}

const hexChr = '0123456789abcdef';

/**
 * Convert a 32-bit number to a hex
 */
const rHex = (num: number): string => {
  return hexChr.charAt((num >> 4) & 0x0F) + hexChr.charAt((num >> 0) & 0x0F);
}

const rgbToHex = (red = 0, green = 0, blue = 0): string => {
  if (!isNumbersRGBValid([red, green, blue])) {
    throw new Error('rgbToHex: Incorrect Passed Num');
  }
  return `#${rHex(red)}${rHex(green)}${rHex(blue)}`;
}

const hexToRgb = (hex: string): string => parseInt(hex, 16).toString();

const validateHex = (hex: string): string => {
  hex = hex.replace(/[^0-9abcdefABCDEF]/g, '').toLowerCase();
  return hex.length > 6 ? hex.substring(0, 6) : hex;
}

/**
 * getRgbFromHexString(str)
 */
const hexToRgbJSN = (hex: string): { red: string, grn: string, blu: string } => {
  hex =  validateHex(hex);
  if (hex.length === 6) {
    return {
      red: hexToRgb(hex.slice(0, 2)),
      grn: hexToRgb(hex.slice(2, 4)),
      blu: hexToRgb(hex.slice(4, 6)),
    };
  }
  throw new Error('Incorrect RGB format');
}


const hexToRgbRed = (hex: string): string => {
  hex = validateHex(hex);
  if (hex.length === 6) {
    return hexToRgb(hex.slice(0, 2));
  }
  throw new Error('Incorrect RGB (Red) format');
}

const hexToRgbGreen = (hex: string): string => {
  hex = validateHex(hex);
  if (hex.length === 6) {
    return hexToRgb(hex.slice(2, 4));
  }
  throw new Error('Incorrect RGB (Green) format');
}

const hexToRgbBlue = (hex: string): string => {
  hex = validateHex(hex);
  if (hex.length === 6) {
    return hexToRgb(hex.slice(4, 6));
  }
  throw new Error('Incorrect RGB (Blue) format');
}

const getContrastBackgroundGrd = (hex: string, cntInp?: string): string => {
  const cnt = Number(getContrast(hex, cntInp));
  const cntHalf = 128 + cnt / 2;
  return `rgb(255, ${cnt}, ${cnt}), rgb(255, ${cntHalf}, ${cnt}), rgb(255, 255, ${cnt}), rgb(${cntHalf}, 255, ${cnt}), rgb(${cnt}, 255, ${cnt}), rgb(${cnt}, 255, ${cntHalf}), rgb(${cnt}, 255, 255), rgb(${cnt}, ${cntHalf}, 255), rgb(${cnt}, ${cnt}, 255), rgb(${cntHalf}, ${cnt}, 255), rgb(255, ${cnt}, 255), rgb(255, ${cnt}, ${cntHalf}), rgb(255, ${cnt}, ${cnt})`;
}

const getContrast = (hex: string, cntInp = ''): number => {
  let cnt;

  if (!hex) {
    throw new Error('hex is not defined');
  }

  const red = hexToRgbRed(hex);
  const grn = hexToRgbGreen(hex);
  const blu = hexToRgbBlue(hex);
  const max = rgbMax([red, grn, blu]);
  const min = rgbMin([red, grn, blu]);

  const h = 255 - max;
  
  /* all equals -> contrast eq 255 */
  if (min === max) {
    cnt = 255;
  }

  /* Min val eq 0 -> contrast eq 0 */
  if (min !== max && min === 0) {
    cnt = 0;
  }

  // if (min === max && h === 255) {
  //   // can be everything
  // }

  if (min !== max && h !== 0) {
    // 'interested in position (but:  min / ((255 - h) / 255);
    // ((obOffsetL - prcEnt * i) * (obOffsetT - tmp)) / prcEnt;
  }

  if (min !== max && min !== 0 && h === 0) {
    cnt = min;
  }

  if (!cnt) {
    cnt = cntInp ? Number(cntInp) : undefined;
  }

  if(h === 255) {
    return 0;
  }

  return cnt ? Number(cnt) : Math.round(min / ((255 - h) / 255));
}

const rgbMax = (rgbArr: Array<string>): number => {
  let max = rgbArr[0];
  for (let i = 0, l = rgbArr.length; i < l; i += 1) {
    max = ((Number(max) > Number(rgbArr[i])) ? max : rgbArr[i]);
  }
  return Number(max);
}

const rgbMin = (rgbArr: Array<string>): number => {
  let min = rgbArr[0];
  for (let i = 0, l = rgbArr.length; i < l; i += 1) {
    min = ((Number(min) < Number(rgbArr[i])) ? min : rgbArr[i]);
  }
  return Number(min);
}


  /**
  *
  *  ╭───────────────────────────────────────────────────────────────────╮
  *  │                                                                   │
  *  │                                                                   │
  *  │                        M A I N  T A B L E                         │
  *  │                                                                   │
  *  │ rgb(255,   0,   0)      rgb(255, 128, 128)      rgb(255, 255, 255)│
  *  │ rgb(255, 128,   0)      rgb(255, 191, 128)      rgb(255, 255, 255)│
  *  │ rgb(255, 255,   0)      rgb(255, 255, 128)      rgb(255, 255, 255)│
  *  │ rgb(128, 255,   0)      rgb(191, 255, 128)      rgb(255, 255, 255)│
  *  │ rgb(  0, 255,   0)      rgb(128, 255, 128)      rgb(255, 255, 255)│
  *  │ rgb(  0, 255, 128)      rgb(128, 255, 191)      rgb(255, 255, 255)│
  *  │ rgb(  0, 255, 255)      rgb(128, 255, 255)      rgb(255, 255, 255)│
  *  │ rgb(  0, 128, 255)      rgb(128, 191, 255)      rgb(255, 255, 255)│
  *  │ rgb(  0,   0, 255)      rgb(128, 128, 255)      rgb(255, 255, 255)│
  *  │ rgb(128,   0, 255)      rgb(191, 128, 255)      rgb(255, 255, 255)│
  *  │ rgb(255,   0, 255)      rgb(255, 128, 255)      rgb(255, 255, 255)│
  *  │ rgb(255,   0, 128)      rgb(255, 128, 191)      rgb(255, 255, 255)│
  *  │ rgb(255,   0,   0)      rgb(255, 128, 128)      rgb(255, 255, 255)│
  *  │                                                                   │
  *  ╰───────────────────────────────────────────────────────────────────╯
  */
const getRGBByLeftTopContrast = (left: number, top: number, cntValue: number): {red: string, grn: string, blu: string, hex: string} => {

  /**
  *   10 - are Top/Left Shifts of Diameter of the circle
  *   255 - is Pad Width/Height
  *   left 0..100
  *   top 0..255
  *   Color Area 0..6
  */
  top = 245 - top;  // 245 = 255 - 10 = (padWidth - circleDiameter)
  left = (100 * (Number(left) + 10)) / 255; // 100 - leftMax; 10 - circleDiameter; 255 - padWidth 

  const colorArea = 100 / 6;
  const contrast = cntValue * top / 255;

  let red = 0;
  let green = 0;
  let blue = 0;


  /* Red 0 */
  let i = 0;
  if (colorArea * i <= left && left <= colorArea * (i + 1)) {
    red = top;
    green = contrast + ((left - colorArea * i) * (top - contrast)) / colorArea;
    blue = contrast;
  }

  /* Yellow 1 */
  i += 1;
  if (colorArea * i <= left && left <= colorArea * (i + 1)) {
    red = contrast + ((colorArea * (i + 1) - left) * (top - contrast)) / colorArea;
    green = top;
    blue = contrast;
  }

  /* Green 2 */
  i += 1;
  if (colorArea * i <= left && left <= colorArea * (i + 1)) {
    red = contrast;
    green = top;
    blue = contrast + ((left - colorArea * i) * (top - contrast)) / colorArea;
  }

  /* light-Blue 3 */
  i += 1;
  if (colorArea * i <= left && left <= colorArea * (i + 1)) {
    red = contrast;
    green = contrast + ((colorArea * (i + 1) - left) * (top - contrast)) / colorArea;
    blue = top;
  }

  /* Blue 4 */
  i += 1;
  if (colorArea * i <= left && left <= colorArea * (i + 1)) {
    red = contrast + ((left - colorArea * i) * (top - contrast)) / colorArea;
    green = contrast;
    blue = top;
  }

  /* Violet 5 */
  i += 1;
  if (colorArea * i <= left && left <= colorArea * (i + 1)) {
    red = top;
    green = contrast;
    blue = contrast + ((colorArea * (i + 1) - left) * (top - contrast)) / colorArea;
  }
  const hex = `#${rHex(red)}${rHex(green)}${rHex(blue)}`;

  return { red: String(Math.round(red)), grn: String(Math.round(green)), blu: String(Math.round(blue)), hex };
}

// const getPickerCursorTopLeft = (baseID: string): { top: number, left: number } => {
//   const cursor = document.getElementById(`${baseID}padDragCursor`);
//   if (cursor) {
//     return { top: Number(cursor.style.top.slice(0, -2)) + 10, left: Number(cursor.style.left.slice(0, -2)) }
//   }
//   return { top: 0, left: 0 }
// }

const getPickerH = (hex: string): number => {
  if (!hex) {
    throw new Error('There is no any RGB hex value');
  }

  return 255 - rgbMax([
    hexToRgbRed(hex), hexToRgbGreen(hex), hexToRgbBlue(hex),
  ]);
}

const getPickerL = (hex: string): number => {
  /**
   * 127.5 = 42.5 * 3 (pure lightblue)
   * 42.5 = 255 / 6
   * colorArea: 0..6
   */

  if (!hex) {
    throw new Error('There is no any RGB hex value');
  }
  const minRGB = rgbMin([
    hexToRgbRed(hex), hexToRgbGreen(hex), hexToRgbBlue(hex),
  ]);

  const red = Number(hexToRgbRed(hex));
  const grn = Number(hexToRgbGreen(hex));
  const blu = Number(hexToRgbBlue(hex));

  /* gray */
  if (red === grn && grn === blu) {
    // console.log('gray');
    return 127.5;
  }

  /* red */
  if (red > minRGB && grn === minRGB && blu === minRGB) {
    // console.log('1 red');
    return 0; // or 255
  }

  /* orange */
  if (red > grn && blu === minRGB) {
    // console.log('2 orange');
    return (grn * 42.5) / 255;
  }

  /* yellow */
  if (red > minRGB && red === grn && blu === minRGB) {
    // console.log('3 yellow');
    return 42.5;
  }

  /* yellow to grn */
  if (grn > red && blu === minRGB) {
    // console.log('yellow to grn');
    return 42.5 + ((255 - red) * 42.5) / 255;
  }

  /* grn */
  if (grn > minRGB && blu === minRGB && red === minRGB) {
    // console.log('4 grn');
    return 42.5 * 2;
  }

  /* grn to blu (0-255-255) */
  if (grn > blu && red === minRGB) {
    // console.log('grn to blue');
    return 42.5 * 2 + (blu * 42.5) / 255;
  }

  /* blu (0-255-255) */
  if (grn === blu && red === minRGB) {
    // console.log('5 blue');
    return 127.5;
  }

  /* blu to indigo */
  if (blu > grn && red === minRGB) {
    // console.log('blu to indigo');
    return 42.5 * 3 + ((255 - grn) * 42.5) / 255;
  }

  /* indigo to violet (255-0-255) */
  if (blu > red && grn === minRGB) {
    // console.log('indigo to violet (255-0-255)');
    return 42.5 * 4 + (red * 42.5) / 255;
  }

  /* violet (255-0-255) */
  if (blu === red && grn === minRGB) {
    // console.log('7 violet (255-0-255)');
    return 42.5 * 5;
  }

  /* violet to red */
  if (red > blu && grn === minRGB) {
    // console.log('violet to red');
    return 42.5 * 5 + ((255 - blu) * 42.5) / 255;
  }

  throw new Error(`getPickerL: Wrong value rgb(${red}, ${grn}, ${blu}); minRGB: ${minRGB} `);
}

/**
 * 
 * 
 * Element Manager
 * 
 * 
 * 
 * 
 * 
 */

const defineEnumerable = (o: any) => {
  Object.defineProperty(o, 'get', {
    enumerable: false,
    configurable: false,
    writable: false,
  });
}

const contrastBg = {
  backgroundImage: '',
  get: (r?: string, g?: string, b?: string, top?: string | number) => {
    contrastBg.backgroundImage = r && g && b && top ? `-webkit-linear-gradient(top, rgb(${r}, ${g}, ${b}), rgb(${top}, ${top}, ${top}))` : '';
    return contrastBg;
  }
};

const checkSolidBg = {
  background: '',
  get: (r: string, g: string, b: string) => {
    checkSolidBg.background = r && g && b ? `rgb(${r}, ${g}, ${b})` : '';
    return checkSolidBg;
  }
};

const checkBg = {
  background: '',
  get: (r: string, g: string, b: string, a: string) => {
    checkBg.background = r && g && b && a ? `rgba(${r}, ${g}, ${b}, ${a})` : '';
    return checkBg;
  }
};

const opacityBg = {
  backgroundImage: '',
  get: (r: string, g: string, b: string) => {
    opacityBg.backgroundImage = r && g && b ? `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)` : '';
    return opacityBg;
  }
};

const pickerFieldBg = { 
  backgroundImage: '',
  get: (contrast = 0) => {
    const halfContrast = 128 + contrast / 2;
    pickerFieldBg.backgroundImage = `-webkit-linear-gradient(left, rgb(255, ${contrast}, ${contrast}), rgb(255, ${halfContrast}, ${contrast}), rgb(255, 255, ${contrast}), rgb(${halfContrast}, 255, ${contrast}), rgb(${contrast}, 255, ${contrast}), rgb(${contrast}, 255, ${halfContrast}), rgb(${contrast}, 255, 255), rgb(${contrast}, ${halfContrast}, 255), rgb(${contrast}, ${contrast}, 255), rgb(${halfContrast}, ${contrast}, 255), rgb(255, ${contrast}, 255), rgb(255, ${contrast}, ${halfContrast}), rgb(255, ${contrast}, ${contrast}))`;
    return pickerFieldBg;
  }
};

const padCursorPos =  {
  left: '',
  top: '',
  get: (left: number, top: number) => {
    padCursorPos.left = `${left}px`
    padCursorPos.top = `${top}px`;
    return padCursorPos;
  }
};

const sets = {
  red: '',
  grn: '',
  blu: '',
  hex: '',
  contrastCursor: '',
  opc: '',
  opacityCursor: '',

  padDragCursor: padCursorPos,
  check: checkBg,
  checkSolid: checkSolidBg,
  contrast: contrastBg,
  opacity: opacityBg,
  pickerField: pickerFieldBg,

  get: (hex: string, opacity: string, c?: number) => {
    const { red, grn, blu } = hexToRgbJSN(hex);
    const top = getPickerH(hex) - 10;
    const contrast = c || getContrast(hex);

    // const cssObj = El.getCSSObject('padDragCursor');
    // const obOffsetT =  cssObj.style.top.replace('px', '');
    // const obOffsetL = cssObj.style.left.replace('px', '');
    // const { red, grn, blu, hex } = getRGBByLeftTopContrast(obOffsetL, obOffsetT, contrast);
    // const top = obOffsetT - 10;

    sets.red = red;
    sets.grn = grn;
    sets.blu = blu;
    sets.hex = `#${hex}`;
    sets.opc = opacity;
    sets.opacityCursor = opacity;
    sets.contrastCursor = contrast.toString();

    sets.padDragCursor.get(getPickerL(hex) - 10, top);
    sets.check.get(red, grn, blu, opacity);
    sets.checkSolid.get(red, grn, blu);
    sets.contrast.get(red, grn, blu, top);
    sets.opacity.get(red, grn, blu);
    sets.pickerField.get(contrast);
    
    return sets;
  }
};

defineEnumerable(contrastBg);
defineEnumerable(checkSolidBg);
defineEnumerable(checkBg);
defineEnumerable(opacityBg);
defineEnumerable(pickerFieldBg);
defineEnumerable(padCursorPos);
defineEnumerable(sets);

interface ElementManager {
  hex?: string,
  opc?: string,
  red?: string,
  grn?: string,
  blu?: string,
  opacity?: any, // Object
  contrast?: any, // Object
  check?: any, // Object
  checkSolid?: any, // Object
  opacityCursor?: any, // Object
  contrastCursor?: any, // Object
  padDragCursor?: any, // Object
  pickerField?: any, // Object
  touchPad?: any, // Object
}

const elementManager = (uID: string) => {
  const Ob: any = {};

  const El = {
    getCurrHex: () => {
      const [r,g,b] = El.getRGBArr();
      return `${rHex(r)}${rHex(g)}${rHex(b)}`;
    },
    /*  */
    getRGBArr: () => {
      const retArr = [];
      retArr[0] = validateAndGetRGBValue((El.getPublicDOM('red')).value);
      retArr[1] = validateAndGetRGBValue((El.getPublicDOM('grn')).value);
      retArr[2] = validateAndGetRGBValue((El.getPublicDOM('blu')).value);
      return retArr;
    },
    /* gets Public DOM Object */
    getPublicDOM: (name: string) => {
      if (!Ob[`${name}publicDOM`]) {
        Ob[`${name}publicDOM`] = document.getElementById(`${uID}${name}`);
      }
      return Ob[`${name}publicDOM`];
    },
    get: (name: string) => {
      if (!Ob['name']) {
        Ob['name'] = document.getElementById(`${uID}${name}`);
      }
      return Ob['name'];
    },
    /* gets CSS File Object */
    getCSSObject: (name: string) => {
      if (!Ob[name]) {
        Ob[name] = CSS.get(`.${uID}${name}`)
      }
      return Ob[name];
    },
    set: (el: ElementManager) => {
      Object.entries(el).some((entr: any) => {
        const [name, prop] = entr;

        if (typeof prop === 'object') {
          const cssObj = El.getCSSObject(name);
          Object.assign(cssObj.style, prop);
          return false;
        }

        if (prop.toString()) {
          El.getPublicDOM(name).value = prop;
        }
        return false;
      });
    },
    setValue: (name: string, value: any) => {
      El.getPublicDOM(name).value = value;
    },
    setInlineStyle: (name: string, props: any) => {
      Object.assign(El.get(name).style, props);
    }
  }

  return El;
}

const validateAndGetRGBValue = (val: string) => {
  const value =  Number(val.replace(/[^0-9]/g, ''));

  if (value > 255) {
    return 255;
  }

  if (value < 0) {
    return 0;
  }

  return value || 0;
}

/**
 * 
 * 
 * @returns <Array>: [hex: string, val: string, isInvalidHex: string]
 * [0] - 'hex' (6 numbers without #)
 * [1] - 'val' validated hex;  if hex.length 0..6 numbers
 * [2] - 'isInvalidHex' bool: undefined - if hex.length === 3 || 6
 */
const validateAndGetHexValue = (value: string): Array<string> => {
  const retArr = ['', ''];
  retArr[1] = value;
  retArr[1] = retArr[1].replace(/[^0-9abcdefABCDEF]/g, '').toLowerCase();
  
  const lngth = (retArr[1]).length;

  if (lngth === 6) {
    retArr[0] = retArr[1];
    return retArr;
  }

  if (lngth > 6) {
    retArr[0] = (retArr[1]).substring(0, 6);
    retArr[1] = retArr[0];
    retArr[2] = 'HEX>6';
    return retArr;
  }

  if (lngth === 0) {
    retArr[0] = '000000';
    retArr[2] = 'HEX===0';
    return retArr;
  }

  if (lngth < 3) {
    /** 
     * if #0 -> #000000
     * if #d -> #dddddd
     * if #ed -> #eddddd
    */
    const newArr = [ ...retArr[1].split(''), ...Array(6 - retArr[1].length).fill(retArr[1].split('')[retArr[1].length - 1]) ];
    retArr[0] = newArr.join('');
    
    retArr[2] = 'HEX<3';
    return retArr;
  }

  if (lngth === 3) {
    retArr[0] = (retArr[1])
      .split('')
      .map((color: string) => `${color}${color}`)
      .join('');
    retArr[2] = 'HEX===3';
    return retArr;
  }

  if (lngth === 4) {
    const part1 = (retArr[1]).substring(0, 2);

    const part2 = (retArr[1]).substring(2, 3); // ffad -> ffaadd;

    const part3 = (retArr[1]).substring(3, 4);
    retArr[0] = `${part1}${part2}${part2}${part3}${part3}`;

    retArr[2] = 'HEX===4';
    return retArr;
  }

  if (lngth === 5) {
    const part1 = (retArr[1]).substring(0, 4);

    const part2 = (retArr[1]).substring(4, 5); // ffacd -> ffacdd
    retArr[0] = `${part1}${part2}${part2}`;

    retArr[2] = 'HEX===5';
    return retArr;
  }

  retArr[0] = retArr[1];
  return retArr;
}



const addHex = (hexVal: string, addCallback: (rgb: number) => number): string => {
  const rgbHexNumArr = [
    hexVal.substring(0, 2),
    hexVal.substring(2, 4),
    hexVal.substring(4, 6)
  ]; // = hex.match(/.{1,2}/g) || [];

  const rgb = rgbHexNumArr.map((color: string) => {
      const rgb = parseInt(color, 16);
      return addCallback(rgb);
    });
  return `${rHex(rgb[0])}${rHex(rgb[1])}${rHex(rgb[2])}`;
}



/**
 * 
 *    Listeners
 * 
 * 
*/
const eventListeners = (uID: string, stateCallback: (hex: string, opacity?: string) => void) => {
  
  const El = elementManager(uID);

  const onHexInputChange = (e: any) => {
    const [ hex, val, isInvalidHex ] = validateAndGetHexValue(e.target.value);

    /* key: Up -> go Whitty */
    if (e.keyCode === 38) {
      // hex = addHex( hex, (rgb: number) => rgb >= 255 ? 255 : rgb + 1 );
      if (isInvalidHex) {
        onHexInputProcess(addHex( hex, (rgb: number) => rgb >= 255 ? 255 : rgb + 1 ));
        return;
      }
    }

    /* key: Down -> go Blacky */
    if (e.keyCode === 40) {
      // hex = addHex( hex, (rgb: number) => rgb <= 0 ? 0 : rgb - 1 );
      if (isInvalidHex) {
        onHexInputProcess(addHex( hex, (rgb: number) => rgb <= 0 ? 0 : rgb - 1 ));
        return;
      }
    }

    /* key: left -> go Reddy */
    // if (e.keyCode === 37) {}

    /* key: left -> go Blueiy */
    // if (e.keyCode === 39) {}
    
    onHexInputProcess(hex, isInvalidHex, val);
  }

  const onHexInputProcess = (hex: string, isInvalidHex = '', val = '') => {
    const opc = El.getPublicDOM('opacityCursor').value;
    const set = sets.get(hex, opc);

    if (isInvalidHex) { // === 'HEX===3'
      set.hex = `#${val}`;
    }

    console.log(hex, val, isInvalidHex);
    El.set(set);
    stateCallback(`#${hex}`);
  }

  const onOpacityInputChange = (opacity: any) => {
    const hex = `#${El.getCurrHex()}`;
  
    sets.get(hex.replace('#', ''), opacity);
    sets.opc = '';
    El.set(sets);
    stateCallback(hex, opacity);
  }

  const onRgbInputChange = () => {
    const hex = `#${El.getCurrHex()}`;
    const opc = El.getPublicDOM('opacityCursor').value;
    El.set(sets.get(hex.replace('#', ''), opc));
    stateCallback(hex);
  }

  const onCustomPaletteItemClick = (hex: string, opacity: string) => {
    El.set(sets.get(hex, opacity));
    stateCallback(`#${hex}`, opacity);
  }

  const onContrastChange = (ev: any) => {
    contrastChange(ev.target.value);
  }

  const contrastChangeProcess = (value: string) => {
    const contrast = Number(value);
    const cssObj = El.getCSSObject('padDragCursor');
    const obOffsetT =  cssObj.style.top.replace('px', '');
    const obOffsetL = cssObj.style.left.replace('px', '');
    const { hex } = getRGBByLeftTopContrast(obOffsetL, obOffsetT, contrast);
    const opacity = El.getPublicDOM('opacityCursor').value;

    El.set(sets.get(hex.replace('#', ''), opacity, contrast));
    stateCallback(hex);
  }

  const contrastChange = debounce(contrastChangeProcess, 10);

  const onOpacityChange = (ev: any) => {
    opacityChange(ev.target.value);
  }

  const opacityChangeProcess = (opc: string) => {
    const hex = `#${El.getCurrHex()}`;
    El.set(sets.get(hex.replace('#', ''), opc));
    stateCallback(hex, opc);
  }

  const opacityChange = debounce(opacityChangeProcess, 10);

  const onPadTouch = (event: any, eventType: string): void => {
    const left = event.offsetX - 10;
    const top = event.offsetY - 10;
    const { hex } = getRGBByLeftTopContrast(left, top, Number(El.getPublicDOM('contrastCursor').value));
    const opacity = El.getPublicDOM('opacityCursor').value;
    const set = sets.get(hex.replace('#', ''), opacity);
    set.padDragCursor.get(left, top);

    El.set(set);
    stateCallback(hex);
  }

  const onColorPicker = (event: any, eventType: string): void => {
    const cursor = El.getPublicDOM('padDragCursor');
    const opacity = El.getPublicDOM('opacityCursor').value;
    const contrast = Number(El.getPublicDOM('contrastCursor').value);

    let shiftX = 0;
    let shiftY = 0;
    let savedClientX = 0;
    let savedClientY = 0;
    let left = 0;
    let top = 0;

    const updateProcess = (top: string, left: string, hex: string) => {
      const set = sets.get(hex.replace('#', ''), opacity, contrast);
      set.padDragCursor.get(Number(left), Number(top));

      El.set(set);
      stateCallback(hex);
    }

    const process = debounce(updateProcess, 10);
  
    const closeDragElement = (): void => {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
      cursor.removeAttribute('style');
    }

    const getObOffset = (obOffset: any, callback: () => number) => {
      if (245 <= obOffset) {
        callback();
        return 245;
      }
      if (obOffset <= -10) {
        callback();
        return -10;
      }
      return obOffset;
    }

    const elementDrag = (e: any) => {
      e.stopImmediatePropagation();

      shiftX = savedClientX - e.clientX;
      shiftY = savedClientY - e.clientY;
      savedClientX = e.clientX;
      savedClientY = e.clientY;

      if (cursor) {
        left = getObOffset(cursor.offsetLeft - shiftX, () => savedClientX += shiftX);
        top = getObOffset(cursor.offsetTop - shiftY, () => savedClientY += shiftY);
      }

      cursor.style.left = `${left}px`;
      cursor.style.top = `${top}px`;
 
      const { hex } =  getRGBByLeftTopContrast(left, top, contrast);      
      process(top, left, hex);
    }

    const dragMouseDown = (e: any): void => {
      savedClientX = e.clientX;
      savedClientY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    if (eventType === 'onMouseDown') {
      dragMouseDown(event);
    }

    /**
     *  Touch
     * 
     */
    const elementTouchDrag = (e: TouchEvent): void => {
      shiftX = savedClientX - e.targetTouches[0].pageX;
      shiftY = savedClientY - e.targetTouches[0].pageY;
      savedClientX = e.targetTouches[0].pageX;
      savedClientY = e.targetTouches[0].pageY;
    }
    const dragTouchStart = (e: TouchEvent) => {
      savedClientX = e.targetTouches[0].pageX;
      savedClientY = e.targetTouches[0].pageY;
      document.ontouchend = closeDragElement;
      document.ontouchmove = elementTouchDrag;
    }
    if (eventType === 'onTouchStart') {
      dragTouchStart(event);
    }
  }

  return {
    onRgbInputChange,
    onHexInputChange,
    onOpacityInputChange,
    onColorPicker,
    onPadTouch,
    onContrastChange,
    onOpacityChange,
    onCustomPaletteItemClick
  };
}


export {
  rHex,
  rgbToHex,
  hexToRgb,
  hexToRgbJSN,
  hexToRgbRed,
  hexToRgbGreen,
  hexToRgbBlue,
  getContrastBackgroundGrd,
  getContrast,
  rgbMax,
  rgbMin,
  getPickerH,
  getPickerL,
  getRGBByLeftTopContrast,

  padCursorPos,
  sets,

  validateAndGetHexValue,
  validateAndGetRGBValue,
  elementManager,
  eventListeners
};
