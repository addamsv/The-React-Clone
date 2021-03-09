/* eslint-disable class-methods-use-this */
import ControllerInterface from './controllerInterface';
import Theme from './theme.js';
import Model from './model.js';

class Controller implements ControllerInterface {
  private theme: Theme;

  private model: Model;

  constructor() {
    this.model = new Model();
    this.theme = new Theme(this.model);
    this.setEventsListeners();
  }

  private setEventsListeners() {
    window.onresize = this.scrSize.bind(this);
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    document.onmousedown = this.mainController.bind(this);
    document.addEventListener('input', (event) => {
      const ob: HTMLInputElement = <HTMLInputElement> event.target;
      if (ob.classList.contains('input__range')) {
        const nextInputRange: HTMLInputElement = <HTMLInputElement> ob.nextSibling;
        nextInputRange.value = ob.value;
        nextInputRange.click();
      }
    });
    document.onchange = this.mainControllerClick.bind(this);
    document.onkeyup = this.mainControllerClick.bind(this);
    document.onclick = this.mainControllerClick.bind(this);
    document.ontouchend = this.mainControllerClick.bind(this);
  }

  private scrSize() {
    let out = '';
    const cw = document.getElementById('asvthemes__header_slide_builder-sort-cstmz-blocks').clientWidth;
    // const w = window.innerWidth
    // || document.documentElement.clientWidth
    // || document.body.clientWidth;
    // const h = window.innerHeight
    // || document.documentElement.clientHeight
    // || document.body.clientHeight;
    const element = document.getElementById('last_setings_el_for_toggle_after');
    const arr = this.theme.getSortedDfltrwdModeArrayByWidth();

    if (cw < arr[0].width) {
      out = '<320';
    }
    for (let i = 1, l = arr.length; i < l; i += 1) {
      if (arr[i - 1].width < cw && cw < arr[i].width) {
        out = `${arr[i - 1].width}-${arr[i].width}`;
      }
    }
    if (this.model.scrWidth.widthD === '') {
      console.log(`scrWidth: ${out}`);
      this.model.scrWidth.widthD = out;
    }
    if (this.model.scrWidth.widthD !== out) {
      console.log(`scrWidth: ${out}`);
      this.model.scrWidth.widthD = out;
    }

    if ((cw - element.offsetLeft - 50) < 0) {
      element.style.left = `${cw - 50}px`;
    }
  }

  // click keyup change touchend
  mainControllerClick(e: any) {
    this.theme.arrasEl('context__menu');
    let state;
    let target: any;
    for (let i = 0, l = e.target.attributes.length; i < l; i += 1) {
      // console.log(e.target, e.target.attributes[i].nodeValue);
      switch (e.target.attributes[i].localName) {
        case 'data-input':
          this.theme.dataInput(e.target, JSON.parse(e.target.attributes[i].nodeValue), e);
          return;
        case 'data-toggle-link':
          e.preventDefault();
          this.theme.dataTgLink(document.getElementById(e.target.attributes[i].nodeValue));
          return;
        case 'data-tgl-attrs':
          this.theme.tglAttrs(e.target, JSON.parse(e.target.attributes[i].nodeValue));
          return;
        case 'data-edit-mode':
          this.theme.editMode(e.target, JSON.parse(e.target.attributes[i].nodeValue));
          return;
        case 'data-pst-attrs':
          this.theme.dataPstAttrs(e.target, JSON.parse(e.target.attributes[i].nodeValue));
          return;
        case 'data-pst-attrs-rem':
          this.theme.pstAttrsRem(JSON.parse(e.target.attributes[i].nodeValue));
          return;
        case 'data-sets-deflts':
          this.theme.setsDeflts(JSON.parse(e.target.attributes[i].nodeValue));
          return;
        case 'data-img-upload':
          target = JSON.parse(e.target.attributes[i].nodeValue);
          e.preventDefault();
          this.model.wpMedia.dataImageUpload(target);
          return;
        case 'data-img-rem':
          target = JSON.parse(e.target.attributes[i].nodeValue);
          e.preventDefault();
          this.model.wpMedia.imageRemove(target);
          return;
        case 'data-play':
          e.preventDefault();
          e.stopImmediatePropagation();
          state = e.target.attributes[i].nodeValue;
          this.theme.setPausePlayState(e.target.id, state);
          return;
        default: break;
      }
    }
  }

  private mainController(e: any) {
    /* Context Menu */
    if (e.button === 2) {
      let jsn;
      let crName;
      let el;
      let arrasElBtn;
      let main;
      for (let i = 0, l = e.target.attributes.length; i < l; i += 1) {
        switch (e.target.attributes[i].localName) {
          case 'data-edit-mode':
            jsn = e.target.attributes[i].nodeValue;
            jsn = JSON.parse(jsn);
            crName = this.theme.convertCrNameToCssCrName(jsn.cssCrName, '-', '_');
            // var rootCrName = this.theme.getRootCrName(crName);
            el = this.theme.mkEl('', 'last_setings_el_for_toggle_after-header', 'menu-absolute-pos-header');
            arrasElBtn = this.theme.mkEl('', '', 'clr-menu', '{"tglID":"context__menu"}', 'pst-attrs-rem', 'x');
            main = this.theme.mkEl('', '', 'main-cstmz-block');
            /* Btn Layers */
            this.theme.inEl(main, el);
            document.getElementById('context__menu').setAttribute('style', `top:${e.pageY - 15}px;left:${e.pageX - 0}px;`);
            this.theme.jCrNd(main, 'mainMenuContext', crName, this.theme.mdl.getJsn());
            this.theme.arrasEl('context__menu');
            this.theme.inEl('context__menu', el);
            this.theme.inEl('context__menu', arrasElBtn);
            this.theme.inEl('context__menu', main);
            this.theme.dragElement();
            break;
          case 'data-pst-attrs':
            jsn = e.target.attributes[i].nodeValue;
            jsn = JSON.parse(jsn);
            crName = jsn.slide;
            // // var rootCrName = this.theme.getRootCrName(crName);
            el = this.theme.mkEl('', 'last_setings_el_for_toggle_after-header', 'menu-absolute-pos-header');
            arrasElBtn = this.theme.mkEl('', '', 'clr-menu', '{"tglID":"context__menu"}', 'pst-attrs-rem', 'x');
            main = this.theme.mkEl('', '', 'main-cstmz-block');
            /* Btn Layers */
            this.theme.inEl(main, el);
            document.getElementById('context__menu').setAttribute('style', `top:${e.pageY - 15}px;left:${e.pageX - 0}px;`);
            this.theme.getCrNd(main, 'menuAnimationCntxt', crName, '', '', '', { id: e.target.id });
            this.theme.arrasEl('context__menu');
            this.theme.inEl('context__menu', el);
            this.theme.inEl('context__menu', arrasElBtn);
            this.theme.inEl('context__menu', main);
            this.theme.dragElement();
            break;
          case 'data-input':
            jsn = e.target.attributes[i].nodeValue;
            jsn = JSON.parse(jsn);
            crName = jsn.slide;
            // var rootCrName = this.theme.getRootCrName(crName);
            el = this.theme.mkEl('', 'last_setings_el_for_toggle_after-header', 'menu-absolute-pos-header');
            arrasElBtn = this.theme.mkEl('', '', 'clr-menu', '{"tglID":"context__menu"}', 'pst-attrs-rem', 'x');
            main = this.theme.mkEl('', '', 'main-cstmz-block');
            /* Btn Layers */
            this.theme.inEl(main, el);
            document.getElementById('context__menu').setAttribute('style', `top:${e.pageY - 15}px;left:${e.pageX - 0}px;`);
            this.theme.jCrNd(main, 'mainMenuContext', crName, this.theme.mdl.getJsn());
            this.theme.arrasEl('context__menu');
            this.theme.inEl('context__menu', el);
            this.theme.inEl('context__menu', arrasElBtn);
            this.theme.inEl('context__menu', main);
            this.theme.dragElement();
            break;
          default: break;
        }
      }
    }
  }
}

export default Controller;
