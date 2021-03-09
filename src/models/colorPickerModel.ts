/* eslint-disable class-methods-use-this */
class ColorPickerModel {
  colorArray: Array<string>;

  hexChr: string;

  constructor() {
    this.colorArray = [];
    this.hexChr = '0123456789abcdef';
  }

  /*
   * Convert a 32-bit number to a hex
   */
  rhex(num: string) {
    const strToNum = Number(num);
    // eslint-disable-next-line no-bitwise
    return this.hexChr.charAt((strToNum >> 4) & 0x0F) + this.hexChr.charAt((strToNum >> 0) & 0x0F);
  }

  rgbToHex(red: string, green: string, blue: string) {
    return `#${this.rhex(red)}${this.rhex(green)}${this.rhex(blue)}`;
  }

  hexToRgb(hex: string) {
    return parseInt(hex, 16).toString();
  }

  hexToRgbJSN(hex: string) {
    if (hex.substr(0, 1) === '#' && hex.length === 7) {
      return {
        red: this.hexToRgb(hex.slice(1, 3)),
        green: this.hexToRgb(hex.slice(3, 5)),
        blue: this.hexToRgb(hex.slice(5, 7)),
      };
    }
    if (hex.length === 6) {
      return {
        red: this.hexToRgb(hex.slice(0, 2)),
        green: this.hexToRgb(hex.slice(2, 4)),
        blue: this.hexToRgb(hex.slice(4, 6)),
      };
    }
    return {};
  }

  hexToRgbRed(hex: string) {
    if (hex.substr(0, 1) === '#' && hex.length === 7) {
      return this.hexToRgb(hex.slice(1, 3));
    }
    if (hex.length === 6) {
      return this.hexToRgb(hex.slice(0, 2));
    }
    return {};
  }

  hexToRgbGreen(hex: string) {
    if (hex.substr(0, 1) === '#' && hex.length === 7) {
      return this.hexToRgb(hex.slice(3, 5));
    }
    if (hex.length === 6) {
      return this.hexToRgb(hex.slice(2, 4));
    }
    return {};
  }

  hexToRgbBlue(hex: string) {
    if (hex.substr(0, 1) === '#' && hex.length === 7) {
      return this.hexToRgb(hex.slice(5, 7));
    }
    if (hex.length === 6) {
      return this.hexToRgb(hex.slice(4, 6));
    }
    return {};
  }

  setColorArrayID(id: string) {
    this.colorArray.push(id);
  }

  getContrastBackgroundGrd(hex: string, cntInp: string) {
    const cnt = this.getContrast(hex, cntInp);
    const cntHalf = 128 + cnt / 2;
    return `rgb(255, ${cnt}, ${cnt}), rgb(255, ${cntHalf}, ${cnt}), rgb(255, 255, ${cnt}), rgb(${cntHalf}, 255, ${cnt}), rgb(${cnt}, 255, ${cnt}), rgb(${cnt}, 255, ${cntHalf}), rgb(${cnt}, 255, 255), rgb(${cnt}, ${cntHalf}, 255), rgb(${cnt}, ${cnt}, 255), rgb(${cntHalf}, ${cnt}, 255), rgb(255, ${cnt}, 255), rgb(255, ${cnt}, ${cntHalf}), rgb(255, ${cnt}, ${cnt})`;
  }

  getPckrH(hex: string) {
    if (!hex) {
      return false;
    }
    return 255 - this.rgbMax([
      this.hexToRgbRed(hex),
      this.hexToRgbGreen(hex),
      this.hexToRgbBlue(hex),
    ]);
  }

  getPckrL(hex: string) {
    // let max;
    // let min;
    // let cnt;
    // let red;
    // let grn;
    // let blu;
    // let h;
    // let i;
    // const cntrst = this.getContrast(hex);

    if (!hex) {
      return false;
    }

    const red = parseInt(this.hexToRgbRed(hex).toString(), 10);
    const grn = parseInt(this.hexToRgbGreen(hex).toString(), 10);
    const blu = parseInt(this.hexToRgbBlue(hex).toString(), 10);
    // const h = 255 - (this.rgbMax([red, grn, blu]));
    const min = this.rgbMin([red, grn, blu]);

    if (red === grn && grn === blu) {
      return 128;// px');
    }
    if (red > min && grn === min && blu === min) {
      return 0;// px (pure red),grn: '+grn*42.5/255+', h: '+h+' '+(h*100/255));
    }
    if (red > min && red === grn && blu === min) {
      return 42.5;// px (pure yellow)');
    }
    if (red > grn && blu === min) {
      return (grn * 42.5) / 255;// + 'px (red),grn: '+grn*42.5/255+', h: '+h+' '+(h*100/255));
    }
    if (grn > min && blu === min && red === min) {
      return 42.5 * 2; // ) +'px (pure grn)');
    }
    if (grn > red && blu === min) {
      return 42.5 + ((255 - red) * 42.5) / 255; // + 'px (grn)');
    }
    if (grn > blu && red === min) {
      return 42.5 * 2 + (blu * 42.5) / 255; // + 'px (grn to light-blu)');
    }
    if (blu > grn && red === min) {
      return 42.5 * 3 + ((255 - grn) * 42.5) / 255; // + 'px (light-blu to blu)');
    }
    if (blu > red && grn === min) {
      return 42.5 * 4 + (red * 42.5) / 255; // + 'px (blu to violet)');
    }
    if (red > blu && grn === min) {
      return 42.5 * 5 + ((255 - blu) * 42.5) / 255; // + 'px (violet to red)');
    }
    return 0;
  }

  getContrast(hex: string, cntInp: string) {
    let cnt;

    if (!hex) {
      return false;
    }

    const red = this.hexToRgbRed(hex);
    const grn = this.hexToRgbGreen(hex);
    const blu = this.hexToRgbBlue(hex);
    const max = this.rgbMax([red, grn, blu]);
    const min = this.rgbMin([red, grn, blu]);
    const h = 255 - max;

    // console.log(hex+' '+red+' '+grn+' '+blu);
    /* all equals -> contrast eq 255 */
    if (min === max && h !== 255) {
      cnt = 255;
    }
    /* Min val eq 0 -> contrast eq 0 */
    if (min !== max && min === 0) {
      cnt = 0;
    }

    if (min === max && h === 255) {
      // can be everything
    }

    if (min !== max && h !== 0) {
      // console.log(`intrested in pos (but: ${min / ((255 - h) / 255)})`);
      // +parseInt((obOfsetL-prcEnt*i)*(obOfsetT-tmp)/prcEnt);
    }

    if (min !== max && min !== 0 && h === 0) {
      cnt = min;
    }

    if (!cnt) {
      cnt = cntInp;
    }
    if (cnt) {
      return cnt;
    }
    return Math.round((min / ((255 - h) / 255)));
  }

  rgbMax(rgbArr: any) {
    let max = rgbArr[0];
    for (let i = 0, l = rgbArr.length; i < l; i += 1) {
      max = ((parseInt(max, 10) > parseInt(rgbArr[i], 10)) ? max : rgbArr[i]);
    }
    return max;
  }

  rgbMin(rgbArr: any) {
    let min = rgbArr[0];
    for (let i = 0, l = rgbArr.length; i < l; i += 1) {
      min = ((parseInt(min, 10) < parseInt(rgbArr[i], 10)) ? min : rgbArr[i]);
    }
    return min;
  }

  setPckrs() {
    const that = this;
    let color = '';
    while (that.colorArray.length) {
      color = that.colorArray.splice(0, 1).toString();
      that.clrPckrInit(color);
    }
  }

  clrPckrInit(idPrefix = '') {
    const ob = document.getElementById(`${idPrefix}drag_el`);
    if (ob === null) {
      // console.log(ob);
      return;
    }
    const it = this;
    // obPntr = document.getElementById("drag_el__pntr"),
    const obPckrField = document.getElementById(`${idPrefix}pckrField`) as HTMLElement;
    const obCntrst = document.getElementById(`${idPrefix}cntrstCrsr`) as HTMLElement;
    const obOpcty = document.getElementById(`${idPrefix}opctyCrsr`) as HTMLElement;
    let tx = 0;
    let ty = 0;
    let ofsetX = 0;
    let ofsetY = 0;
    const pEl = ob.parentElement;
    let pElW = Number(pEl.clientWidth);
    const pElOpc = obOpcty.parentElement;
    const pElCntrst = obCntrst.parentElement;
    const prcEnt = 100 / 6;
    let i;
    let tmp;
    let rgb;
    let red: string;
    let grn: string;
    let blu: string;
    const redInp = document.getElementById(`${idPrefix}red`) as HTMLInputElement;
    const grnInp = document.getElementById(`${idPrefix}grn`) as HTMLInputElement;
    const bluInp = document.getElementById(`${idPrefix}blu`) as HTMLInputElement;
    const opcInp = document.getElementById(`${idPrefix}opc`) as HTMLInputElement;
    const cntInp = document.getElementById(`${idPrefix}cnt`) as HTMLInputElement;
    const hexInp = document.getElementById(`${idPrefix}hex`) as HTMLInputElement;
    // let cntInpVal;
    let opc: string;
    let cnt;
    let cntHalf;
    // let prcW;
    // let prcH;
    let pElH = Number(pEl.clientHeight);
    const pElOpcH = Number(pElOpc.clientHeight) - 5;
    const pElCntrstH = Number(pElCntrst.clientHeight) - 5;
    let obOfsetL;
    let obOfsetT;
    const chek = document.getElementById(`${idPrefix}check`) as HTMLElement;
    const checkSolid = document.getElementById(`${idPrefix}checkSolid`) as HTMLElement;
    // checkMenu = document.getElementById(idPrefix+'checkMenu'),
    const cntrst = document.getElementById(`${idPrefix}cntrst`) as HTMLElement;
    const opcty = document.getElementById(`${idPrefix}opcty`) as HTMLElement;
    // mainInp = document.getElementById(idPrefix+'mainInp');

    /* field's changed by usr */

    function hexChangedByUsr() {
      cnt = it.getContrast(hexInp.value, cntInp.value);
      if (cnt) {
        // console.log(`contrast: ${cnt}`);
        cntInp.value = cnt;
        obCntrst.style.top = `${cnt}px`;
      }
    }

    function closeDragElement() {
      // console.log('drag is ended');
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }

    function clrPrcss(x: number, y: number, m = 'notSkip') {
      pElW = 255;
      pElH = 255;
      if (m === 'notSkip') {
        obOfsetL = ob.offsetLeft - tx;
        if (pElW - 10 <= obOfsetL) {
          obOfsetL = pElW - 10;
        }
        if (obOfsetL <= -10) {
          obOfsetL = -10;
        }
        ob.style.left = `${obOfsetL}px`;

        obOfsetT = ob.offsetTop - ty;
        if (pElH - 10 <= obOfsetT) {
          obOfsetT = pElH - 10;
        }
        if (obOfsetT <= -10) {
          obOfsetT = -10;
        }
        ob.style.top = `${obOfsetT}px`;
      } else {
        obOfsetL = ob.offsetLeft;
        obOfsetT = ob.offsetTop;
      }
      obOfsetL += 10;
      obOfsetT += 10;
      /* Offsets in certain parts of the picker */
      obOfsetL = (100 * obOfsetL) / pElW;
      obOfsetT = (255 - 255 * obOfsetT) / pElH;
      tmp = (Number(cntInp.value) * obOfsetT) / 255;

      /* Red */
      i = 0;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        red = parseInt(obOfsetT.toString(), 10).toString();
        const a = (tmp + (((obOfsetL - prcEnt * i) * (obOfsetT - tmp)) / prcEnt)).toString();
        grn = parseInt(a, 10).toString();
        blu = parseInt(tmp.toString(), 10).toString();
      }

      /* Yellow */
      i += 1;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        const b = (tmp + ((prcEnt * (i + 1) - obOfsetL) * (obOfsetT - tmp)) / prcEnt).toString();
        red = parseInt(b, 10).toString();
        grn = parseInt(obOfsetT.toString(), 10).toString();
        blu = parseInt(tmp.toString(), 10).toString();
      }

      /* Green */
      i += 1;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        red = parseInt(tmp.toString(), 10).toString();
        grn = parseInt(obOfsetT.toString(), 10).toString();
        const c = (tmp + ((obOfsetL - prcEnt * i) * (obOfsetT - tmp)) / prcEnt).toString();
        blu = parseInt(c, 10).toString();
      }

      /* light-Blue */
      i += 1;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        red = parseInt(tmp.toString(), 10).toString();
        const d = (tmp + ((prcEnt * (i + 1) - obOfsetL) * (obOfsetT - tmp)) / prcEnt).toString();
        grn = parseInt(d, 10).toString();
        blu = parseInt(obOfsetT.toString(), 10).toString();
      }

      /* Blue */
      i += 1;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        const e = (tmp + ((obOfsetL - prcEnt * i) * (obOfsetT - tmp)) / prcEnt).toString();
        red = parseInt(e, 10).toString();
        grn = parseInt(tmp.toString(), 10).toString();
        blu = parseInt(obOfsetT.toString(), 10).toString();
      }

      /* Violet */
      i += 1;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        red = parseInt(obOfsetT.toString(), 10).toString();
        grn = parseInt(tmp.toString(), 10).toString();
        const f = (tmp + ((prcEnt * (i + 1) - obOfsetL) * (obOfsetT - tmp)) / prcEnt).toString();
        blu = parseInt(f, 10).toString();
      }
      rgb = `${red}, ${grn}, ${blu}`;

      chek.style.background = `rgba(${rgb}, ${opc})`;
      checkSolid.style.background = `rgb(${rgb})`;
      // checkMenu.style.background = 'rgb('+rgb+')';
      cntrst.style.backgroundImage = `-webkit-linear-gradient(top, rgb(${rgb}), rgb(${parseInt(obOfsetT.toString(), 10)}, ${parseInt(obOfsetT.toString(), 10)}, ${parseInt(obOfsetT.toString(), 10)}))`;
      opcty.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(${rgb}, 1) 100%)`;
      // mainInp.value = 'rgba('+rgb+', '+opc+')';

      redInp.value = red;
      grnInp.value = grn;
      bluInp.value = blu;

      hexInp.value = `#${it.rhex(red)}${it.rhex(grn)}${it.rhex(blu)}`;
      hexInp.click();
    }

    function elementDragOpcty(e: MouseEvent) {
      // e = e || window.event;
      e.preventDefault();
      e.stopImmediatePropagation();
      ty = ofsetY - e.clientY;
      ofsetY = e.clientY;
      obOfsetT = parseInt((obOpcty.offsetTop - ty).toString(), 10);
      if (pElOpcH < obOfsetT) {
        obOfsetT = pElOpcH;
      }
      if (obOfsetT < -5) {
        obOfsetT = -5;
      }

      obOpcty.style.top = `${obOfsetT}px`;
      opc = ((((obOfsetT + 5) * 100) / pElOpcH) / 100).toString();
      if (Number(opc) > 1) {
        opc = '1';
      }

      rgb = `${redInp.value}, ${grnInp.value}, ${bluInp.value}`;
      chek.style.background = `rgba(${rgb}, ${opc})`;
      opcInp.value = opc.toString();
      opcInp.click();
    }

    function elementDragCntrst(e: MouseEvent) {
      // e = e || window.event;
      e.preventDefault();
      e.stopImmediatePropagation();
      ty = ofsetY - e.clientY;
      ofsetY = e.clientY;
      obOfsetT = parseInt((obCntrst.offsetTop - ty).toString(), 10);
      if (pElCntrstH <= obOfsetT) {
        obOfsetT = pElCntrstH;
      }
      if (obOfsetT < -5) {
        obOfsetT = -5;
      }

      obCntrst.style.top = `${obOfsetT}px`;
      cnt = (255 * (obOfsetT + 5)) / pElCntrstH;
      if (cnt < 0) {
        cnt = 0;
      }
      if (cnt > 255) {
        cnt = 255;
      }
      // rgb(255,   0,   0) rgb(255, 128, 128) rgb(255, 255, 255)
      // rgb(255, 128,   0) rgb(255, 191, 128) rgb(255, 255, 255)
      // rgb(255, 255,   0) rgb(255, 255, 128) rgb(255, 255, 255)
      // rgb(128, 255,   0) rgb(191, 255, 128) rgb(255, 255, 255)
      // rgb(  0, 255,   0) rgb(128, 255, 128) rgb(255, 255, 255)
      // rgb(  0, 255, 128) rgb(128, 255, 191) rgb(255, 255, 255)
      // rgb(  0, 255, 255) rgb(128, 255, 255) rgb(255, 255, 255)
      // rgb(  0, 128, 255) rgb(128, 191, 255) rgb(255, 255, 255)
      // rgb(  0,   0, 255) rgb(128, 128, 255) rgb(255, 255, 255)
      // rgb(128,   0, 255) rgb(191, 128, 255) rgb(255, 255, 255)
      // rgb(255,   0, 255) rgb(255, 128, 255)  rgb(255, 255, 255)
      // rgb(255,   0, 128) rgb(255, 128, 191) rgb(255, 255, 255)
      // rgb(255,   0,   0) rgb(255, 128, 128) rgb(255, 255, 255)
      cntHalf = 128 + cnt / 2;
      obPckrField.setAttribute('style', `background-image: -webkit-linear-gradient(left, rgb(255, ${cnt}, ${cnt}), rgb(255, ${cntHalf}, ${cnt}), rgb(255, 255, ${cnt}), rgb(${cntHalf}, 255, ${cnt}), rgb(${cnt}, 255, ${cnt}), rgb(${cnt}, 255, ${cntHalf}), rgb(${cnt}, 255, 255), rgb(${cnt}, ${cntHalf}, 255), rgb(${cnt}, ${cnt}, 255), rgb(${cntHalf}, ${cnt}, 255), rgb(255, ${cnt}, 255), rgb(255, ${cnt}, ${cntHalf}), rgb(255, ${cnt}, ${cnt}));width: 100%; height: 100%;`);
      cntInp.value = parseInt(cnt.toString(), 10).toString();
      clrPrcss(0, 0, parseInt(cnt.toString(), 10).toString());
    }

    function elementTouchDrag(e: TouchEvent) {
      // e = e || window.event;
      tx = ofsetX - e.targetTouches[0].pageX;
      ty = ofsetY - e.targetTouches[0].pageY;
      ofsetX = e.targetTouches[0].pageX;
      ofsetY = e.targetTouches[0].pageY;
      clrPrcss(tx, ty);
    }

    function elementDrag(e: MouseEvent) {
      // e = e || window.event;
      e.preventDefault();
      e.stopImmediatePropagation();
      tx = ofsetX - e.clientX;
      ty = ofsetY - e.clientY;
      ofsetX = e.clientX;
      ofsetY = e.clientY;
      clrPrcss(tx, ty);
    }

    function dragMouseDown(e: MouseEvent) {
      // e = e || window.event;
      // e.preventDefault();
      ofsetX = e.clientX;
      ofsetY = e.clientY;
      // cntInpVal = parseInt(cntInp.value, 10);
      opc = opcInp.value;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function dragTouchStart(e: TouchEvent) {
      // e = e || window.event;
      // e.preventDefault();
      ofsetX = e.targetTouches[0].pageX;// - ob.offsetLeft
      ofsetY = e.targetTouches[0].pageY;// - ob.offsetTop
      // cntInpVal = parseInt(cntInp.value, 10);
      opc = opcInp.value;
      document.ontouchend = closeDragElement;
      document.ontouchmove = elementTouchDrag;
    }

    function dragMouseDownOpcty(e: MouseEvent) {
      // e = e || window.event;
      // e.preventDefault();
      ofsetY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDragOpcty;
    }

    function dragMouseDownCntrst(e: MouseEvent) {
      // e = e || window.event;
      // e.preventDefault();
      ofsetY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDragCntrst;
    }

    ob.onmousedown = dragMouseDown;
    ob.ontouchstart = dragTouchStart;

    obCntrst.onmousedown = dragMouseDownCntrst;
    // obCntrst.ontouchstart = dragTouchStart;

    obOpcty.onmousedown = dragMouseDownOpcty;
    // obOpcty.ontouchstart = dragTouchStart;

    hexInp.onmouseup = hexChangedByUsr;
  }
}

export default ColorPickerModel;
