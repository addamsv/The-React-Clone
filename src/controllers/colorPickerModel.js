class ColorpickerModel {
  constructor() {
    this.colorArray = new Array();
    this.hexChr = "0123456789abcdef";
  }

  /*
   * Convert a 32-bit number to a hex
   */
  rhex( num ) {
    return this.hexChr.charAt((num >> 4) & 0x0F) + this.hexChr.charAt((num >> 0) & 0x0F);
  }

  rgbToHex( red, green, blue ) {
    return '#' + this.rhex(red) + this.rhex(green) + this.rhex(blue);
  }

  hexToRgb(hex) {
    return parseInt(hex, 16).toString();
  }

  hexToRgbJSN( hex ) {
    if ( hex.substr(0,1) == '#'  && hex.length == 7 ) {
      return {
        red: this.hexToRgb(hex.slice( 1, 3 )), 
        green: this.hexToRgb(hex.slice( 3, 5 )), 
        blue: this.hexToRgb(hex.slice( 5, 7 ))
      };
    }
    if ( hex.length == 6 ) {
      return {
        red: this.hexToRgb(hex.slice( 0, 2 )), 
        green: this.hexToRgb(hex.slice( 2, 4 )), 
        blue: this.hexToRgb(hex.slice( 4, 6 ))
      };
    }
    return;
  }

  hexToRgbRed( hex ) {
    if ( hex.substr(0,1) == '#'  && hex.length == 7 ) {
      return this.hexToRgb(hex.slice( 1, 3 ));
    }
    if ( hex.length == 6 ) {
      return this.hexToRgb(hex.slice( 0, 2 ));
    }
    return;
  }

  hexToRgbGreen( hex ) {
    if ( hex.substr(0,1) == '#'  && hex.length == 7 ) {
      return this.hexToRgb(hex.slice( 3, 5 ));
    }
    if ( hex.length == 6 ) {
      return this.hexToRgb(hex.slice( 2, 4 ));
    }
    return;
  }

  hexToRgbBlue( hex ) {
    if ( hex.substr(0,1) == '#'  && hex.length == 7 ) {
      return this.hexToRgb(hex.slice( 5, 7 ));
    }
    if ( hex.length == 6 ) {
      return this.hexToRgb(hex.slice( 4, 6 ));
    }
    return;
  }




  setColorArrayID (id) {
    this.colorArray.push(id);
  }


  getContrastBackgroundGrd(hex,cntInp) {
    var
     cnt = this.getContrast(hex,cntInp),
     cntHalf = 128+cnt/2;
    return "rgb(255, "+cnt+", "+cnt+"), rgb(255, "+cntHalf+", "+cnt+"), rgb(255, 255, "+cnt+"), rgb("+cntHalf+", 255, "+cnt+"), rgb("+cnt+", 255, "+cnt+"), rgb("+cnt+", 255, "+cntHalf+"), rgb("+cnt+", 255, 255), rgb("+cnt+", "+cntHalf+", 255), rgb("+cnt+", "+cnt+", 255), rgb("+cntHalf+", "+cnt+", 255), rgb(255, "+cnt+", 255), rgb(255, "+cnt+", "+cntHalf+"), rgb(255, "+cnt+", "+cnt+")";

  }



  getPckrH(hex) {
    if (!hex) {
      return false;
    }
    return 255-this.rgbMax([this.hexToRgbRed(hex),this.hexToRgbGreen(hex),this.hexToRgbBlue(hex)]);
  }

  getPckrL(hex) {
    var
     max,
     min,
     cnt,
     red,
     grn,
     blu,
     h,
     i,
     cntrst=this.getContrast(hex);

    // const
    //  prcEnt = 100/6;
    if (!hex) {
      return false;
    }

    red = parseInt(this.hexToRgbRed(hex));
    grn = parseInt(this.hexToRgbGreen(hex));
    blu = parseInt(this.hexToRgbBlue(hex));
    h = 255-(this.rgbMax([red,grn,blu]));
    min = this.rgbMin([red,grn,blu]);
    

    if (red==grn && grn==blu) {
      return 128;//px');
    }
    if (red>min && grn==min && blu==min) {
      return 0;//px (pure red),grn: '+grn*42.5/255+', h: '+h+' '+(h*100/255));
    }
    if ( red>min && red==grn && blu==min) {
      return 42.5;//px (pure yellow)');
    }
    if (red>grn && blu==min) {
      return grn*42.5/255;// + 'px (red),grn: '+grn*42.5/255+', h: '+h+' '+(h*100/255));
    }
    if (grn>min && blu==min && red==min) {
      return 42.5*2;//) +'px (pure grn)');
    }
    if (grn>red && blu==min) {
      return 42.5 + (255-red)* 42.5/255;// + 'px (grn)');
    }
    if (grn>blu && red==min) {
      return 42.5*2 + blu* 42.5/255;// + 'px (grn to light-blu)');
    }
    if (blu>grn && red==min) {
      return 42.5*3 + (255-grn)* 42.5/255;//+ 'px (light-blu to blu)');
    }
    if (blu>red && grn==min) {
      return 42.5*4 + red*42.5/255;// + 'px (blu to violet)');
    }
    if (red>blu && grn==min) {
      return 42.5*5 + (255-blu)* 42.5/255;// + 'px (violet to red)');
    }
  }

  getContrast(hex, cntInp) {
    var
    max,
    min,
    cnt,
    red,
    grn,
    blu,
    h;

    if (!hex) {
      return false;
    }

    red = this.hexToRgbRed(hex);
    grn = this.hexToRgbGreen(hex);
    blu = this.hexToRgbBlue(hex);
    max = this.rgbMax([red, grn, blu]);
    min = this.rgbMin([red, grn, blu]);

    // console.log(hex+' '+red+' '+grn+' '+blu);
    /* all equals -> contrast eq 255 */
    h = 255-max;
    if (min==max && h!=255) {
      cnt=255;
    }
    /* Min val eq 0 -> contrast eq 0 */
    if (min!=max && min==0) {
      cnt=0;
    }

    if (min==max && h==255) {
      // can be everything
    }

    if (min!=max && h!=0) {
      console.log('intrested in pos (but: '+(min/((255-h)/255))+')');
      //+parseInt((obOfsetL-prcEnt*i)*(obOfsetT-tmp)/prcEnt);
    }

    if (min!=max && min!=0 && h==0) {
      cnt=min;
    }

    //console.log(min+' - '+max+', h: '+h+', cnt: '+cntInp+'/'+cnt);
    if (!cnt) {
      cnt=cntInp;
    }
    if (cnt) {
      return cnt;
    }else{
      return Math.round((min/((255-h)/255)));
    }
  }

  rgbMax(rgbArr) {
    var max=rgbArr[0];
    for(var i=0, l=rgbArr.length; i<l; i++) {
      max = ((parseInt(max)>parseInt(rgbArr[i])) ? max : rgbArr[i]);
    }
    return max;
  }

  rgbMin(rgbArr) {
    var min=rgbArr[0];
    for(var i=0, l=rgbArr.length; i<l; i++) {
      min = ((parseInt(min)<parseInt(rgbArr[i])) ? min : rgbArr[i]);
    }
    return min;
  }

  setPckrs() {
    var that = this;
    while (that.colorArray.length) {
      that.clrPckrInit(that.colorArray.splice(0,1));
    }
  }

  clrPckrInit(idPrefix='') {
    var ob = document.getElementById(idPrefix+'drag_el');
    if (ob == null) {
      console.log(ob);
      return;
    }
    var
      it = this,
      // obPntr   = document.getElementById("drag_el__pntr"),
      obPckrField   = document.getElementById(idPrefix+"pckrField"),
      obCntrst     = document.getElementById(idPrefix+'cntrstCrsr'),
      obOpcty     = document.getElementById(idPrefix+'opctyCrsr'),
      tx = 0,
      ty = 0,
      ofsetX = 0,
      ofsetY = 0,
        pEl = ob.parentElement,
        pElW = parseInt(pEl.clientWidth),
        pElOpc = obOpcty.parentElement,
        pElCntrst = obCntrst.parentElement,
        prcEnt = 100/6,
        i,
        tmp,
        rgb,
        red,
        grn,
        blu,
      redInp = document.getElementById(idPrefix+'red'),
      grnInp = document.getElementById(idPrefix+'grn'),
      bluInp = document.getElementById(idPrefix+'blu'),
      opcInp = document.getElementById(idPrefix+'opc'),
      cntInp = document.getElementById(idPrefix+'cnt'),
      hexInp = document.getElementById(idPrefix+'hex'),
      cntInpVal,
      opc,
      cnt,
      cntHalf,
        prcW,
        prcH,
        pElH = parseInt(pEl.clientHeight),
        pElOpcH = parseInt(pElOpc.clientHeight)-5,
        pElCntrstH = parseInt(pElCntrst.clientHeight)-5,
        obOfsetL,
        obOfsetT,
        chek = document.getElementById(idPrefix+'check'),
        checkSolid = document.getElementById(idPrefix+'checkSolid'),
        // checkMenu = document.getElementById(idPrefix+'checkMenu'),
        cntrst = document.getElementById(idPrefix+'cntrst'),
        opcty = document.getElementById(idPrefix+'opcty');
        //mainInp = document.getElementById(idPrefix+'mainInp');

    ob.onmousedown = drag_MouseDown;
    ob.ontouchstart = drag_tstart;

    obCntrst.onmousedown = drag_MouseDownCntrst;
    //obCntrst.ontouchstart = drag_tstart;

    obOpcty.onmousedown = drag_MouseDownOpcty;
    //obOpcty.ontouchstart = drag_tstart;
    
    hexInp.onmouseup = hexChangedByUsr;




    /* field's changed by usr */

    function hexChangedByUsr() {
      cnt = it.getContrast(hexInp.value,cntInp.value);
      if (cnt) {
        console.log('contrast: '+cnt);
        cntInp.value = cnt;
        obCntrst.style.top = cnt + "px";
      }
    }


    function drag_MouseDown(e) {
        e = e || window.event;
      // e.preventDefault();
        ofsetX = e.clientX;
        ofsetY = e.clientY;
        cntInpVal=parseInt(cntInp.value);
        opc = opcInp.value;
      document.onmouseup = closeDrag_Element;
      document.onmousemove = element_Drag;
    }
    function drag_tstart(e) {
        e = e || window.event;
      // e.preventDefault();
      ofsetX = e.targetTouches[0].pageX;//- ob.offsetLeft
      ofsetY = e.targetTouches[0].pageY;// - ob.offsetTop
        cntInpVal=parseInt(cntInp.value);
        opc = opcInp.value;
      document.ontouchend = closeDrag_Element;
      document.ontouchmove = element_tDrag;
    }

    function element_Drag(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopImmediatePropagation();
      tx = ofsetX - e.clientX;
      ty = ofsetY - e.clientY;
      ofsetX = e.clientX;
      ofsetY = e.clientY;
      clrPrcss(tx,ty);
    }
    function element_tDrag(e) {
        e = e || window.event;
      tx = ofsetX - e.targetTouches[0].pageX;
      ty = ofsetY - e.targetTouches[0].pageY;
      ofsetX = e.targetTouches[0].pageX;
      ofsetY = e.targetTouches[0].pageY;
      clrPrcss(tx,ty);
    }

    function clrPrcss(tx,ty,m='notSkip') {
      pElW = 255;//temprry
      pElH = 255;//temprry
      if ( m=='notSkip' ) {
        obOfsetL = ob.offsetLeft - tx;
          if ( pElW-10 <= obOfsetL ) {
          obOfsetL = pElW-10;
          }
          if ( obOfsetL <= -10 ) {
            obOfsetL = -10;
          }
        ob.style.left = obOfsetL + "px";


        obOfsetT = ob.offsetTop - ty;
          if ( pElH-10 <= obOfsetT ) {
          obOfsetT = pElH-10;
          }
          if ( obOfsetT <= -10 ) {
            obOfsetT = -10;
          }
        ob.style.top = obOfsetT + "px";
      }
      else{
        obOfsetL = ob.offsetLeft;
        obOfsetT = ob.offsetTop;
      }
      obOfsetL   += 10;
      obOfsetT   += 10;
      //console.log(obOfsetL + "px  ->  "+ it.getPckrL('#'+it.rhex(red)+it.rhex(grn)+it.rhex(blu)));
      // console.log(obOfsetL + "px  ->  "+ it.getPckrL('#'+it.rhex(red)+it.rhex(grn)+it.rhex(blu)));
      // console.log('x:'+obOfsetL+'; y:'+obOfsetT)
      /* Offsets in certain parts of the picker */
      obOfsetL   = (100*obOfsetL/pElW);
      obOfsetT   = (255-255*obOfsetT/pElH);
      tmp     = cntInp.value*obOfsetT/255;

      /* Red */
      i=0;
      if (prcEnt*i<=obOfsetL && obOfsetL<=prcEnt*(i+1)) {
        red=parseInt(obOfsetT);
        grn=parseInt(  tmp  +  ( (obOfsetL-prcEnt*i)*(obOfsetT-tmp)/prcEnt )   );
        blu=parseInt(tmp);
      }

      /* Yellow */
      i++;
      if (prcEnt*i<=obOfsetL && obOfsetL<=prcEnt*(i+1)) {
        red=parseInt(  tmp  +  (prcEnt*(i+1)-obOfsetL)*(obOfsetT-tmp)/prcEnt  );
        grn=parseInt(obOfsetT);
        blu=parseInt(tmp);
      }

      /* Green */
      i++;
      if (prcEnt*i<=obOfsetL && obOfsetL<=prcEnt*(i+1)) {
        red=parseInt(tmp);
        grn=parseInt(obOfsetT);
        blu=parseInt(  tmp  +  (obOfsetL-prcEnt*i)*(obOfsetT-tmp)/prcEnt  );
      }

      /* light-Blue */
      i++;
      if (prcEnt*i<=obOfsetL && obOfsetL<=prcEnt*(i+1)) {
        red=parseInt(tmp);
        grn=parseInt(  tmp  +  (prcEnt*(i+1)-obOfsetL)*(obOfsetT-tmp)/prcEnt  );
        blu=parseInt(obOfsetT);
      }

      /* Blue */
      i++;
      if (prcEnt*i<=obOfsetL && obOfsetL<=prcEnt*(i+1)) {
        red=parseInt(  tmp  +  (obOfsetL-prcEnt*i)*(obOfsetT-tmp)/prcEnt  );
        grn=parseInt(tmp);
        blu=parseInt(obOfsetT);
      }

      /* Violet */
      i++;
      if (prcEnt * i <= obOfsetL && obOfsetL <= prcEnt * (i + 1)) {
        red=parseInt(obOfsetT);
        grn=parseInt(tmp);
        blu = parseInt(tmp + (prcEnt * (i + 1) - obOfsetL) * (obOfsetT - tmp) / prcEnt);
      }
      rgb = red+', '+grn+', '+blu;
      
      chek.style.background = 'rgba('+rgb+', '+opc+')';
      checkSolid.style.background = 'rgb('+rgb+')';
      // checkMenu.style.background = 'rgb('+rgb+')';
      cntrst.style.backgroundImage = '-webkit-linear-gradient(top, rgb('+rgb+'), rgb('+parseInt(obOfsetT)+', '+parseInt(obOfsetT)+', '+parseInt(obOfsetT)+'))';
      opcty.style.backgroundImage = 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba('+rgb+', 1) 100%)';
      //mainInp.value = 'rgba('+rgb+', '+opc+')';

      redInp.value = red;
      grnInp.value = grn;
      bluInp.value = blu;

      hexInp.value = '#'+it.rhex(red)+it.rhex(grn)+it.rhex(blu);
      hexInp.click();
    }

    function drag_MouseDownOpcty(e) {
        e = e || window.event;
      // e.preventDefault();
        ofsetY = e.clientY;
      document.onmouseup = closeDrag_Element;
      document.onmousemove = element_DragOpcty;
    }

    function drag_MouseDownCntrst(e) {
        e = e || window.event;
      // e.preventDefault();
        ofsetY = e.clientY;
      document.onmouseup = closeDrag_Element;
      document.onmousemove = element_DragCntrst;
    }

    function element_DragOpcty(e) {
      e = e || window.event;
      e.preventDefault();
      e.stopImmediatePropagation();
      ty = ofsetY - e.clientY;
      ofsetY = e.clientY;
      obOfsetT = parseInt(obOpcty.offsetTop - ty);
      if ( pElOpcH < obOfsetT ) {
        obOfsetT = pElOpcH;
      }
      if ( obOfsetT < -5 ) {
        obOfsetT = -5;
      }

      obOpcty.style.top = obOfsetT + "px";
      opc = ((obOfsetT+5)*100/pElOpcH)/100;
      if (opc>1) {
        opc=1;
      }

      rgb = redInp.value+', '+grnInp.value+', '+bluInp.value;
      chek.style.background = 'rgba('+rgb+', '+opc+')';
      opcInp.value = opc;
      opcInp.click();

    }

    function element_DragCntrst(e) {
      e = e || window.event;
      e.preventDefault();
      e.stopImmediatePropagation();
      ty = ofsetY - e.clientY;
      ofsetY = e.clientY;
      obOfsetT = parseInt(obCntrst.offsetTop - ty);
      if ( pElCntrstH <= obOfsetT ) {
        obOfsetT = pElCntrstH;
      }
      if ( obOfsetT < -5 ) {
        obOfsetT = -5;
      }

      obCntrst.style.top = obOfsetT + "px";
      cnt = 255*(obOfsetT+5)/pElCntrstH;
      if (cnt<0) {
        cnt=0;
      }
      if (cnt>255) {
        cnt=255;
      }
      // rgb(255,   0,   0)      rgb(255, 128, 128)      rgb(255, 255, 255)
      // rgb(255, 128,   0)      rgb(255, 191, 128)      rgb(255, 255, 255)
      // rgb(255, 255,   0)      rgb(255, 255, 128)      rgb(255, 255, 255)
      // rgb(128, 255,   0)      rgb(191, 255, 128)      rgb(255, 255, 255)
      // rgb(  0, 255,   0)      rgb(128, 255, 128)      rgb(255, 255, 255)
      // rgb(  0, 255, 128)      rgb(128, 255, 191)      rgb(255, 255, 255)
      // rgb(  0, 255, 255)      rgb(128, 255, 255)      rgb(255, 255, 255)
      // rgb(  0, 128, 255)      rgb(128, 191, 255)      rgb(255, 255, 255) 
      // rgb(  0,   0, 255)      rgb(128, 128, 255)      rgb(255, 255, 255)
      // rgb(128,   0, 255)      rgb(191, 128, 255)      rgb(255, 255, 255) 
      // rgb(255,   0, 255)      rgb(255, 128, 255)       rgb(255, 255, 255)
      // rgb(255,   0, 128)      rgb(255, 128, 191)      rgb(255, 255, 255) 
      // rgb(255,   0,   0)      rgb(255, 128, 128)      rgb(255, 255, 255)
      cntHalf = 128+cnt/2;
      obPckrField.style="background-image: -webkit-linear-gradient(left, rgb(255, "+cnt+", "+cnt+"), rgb(255, "+cntHalf+", "+cnt+"), rgb(255, 255, "+cnt+"), rgb("+cntHalf+", 255, "+cnt+"), rgb("+cnt+", 255, "+cnt+"), rgb("+cnt+", 255, "+cntHalf+"), rgb("+cnt+", 255, 255), rgb("+cnt+", "+cntHalf+", 255), rgb("+cnt+", "+cnt+", 255), rgb("+cntHalf+", "+cnt+", 255), rgb(255, "+cnt+", 255), rgb(255, "+cnt+", "+cntHalf+"), rgb(255, "+cnt+", "+cnt+"));width: 100%; height: 100%;";
      cntInp.value = parseInt(cnt);
      clrPrcss('','',parseInt(cnt));
    }

    function closeDrag_Element() {
      console.log('drag is ended');
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }
  }
}

export default ColorpickerModel;
