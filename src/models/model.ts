/**
*  ╭───────────────────────────────────────────────────────────────╮
*  │        M A I N  M O D E L                                     │
*  │                                                               │
*  │  Copyright (c) 2017-2022 S.Adamovich                          │
*  │  Version: 0.0.0 (10-JUL-2018/22)                              │
*  ╰───────────────────────────────────────────────────────────────╯
*/

// import ApiService, { IApiService } from '../services/apiService';
// const apiService: IApiService = new ApiService();
// apiService.getCustomFromServer()
//   .then((customFromServer: Array<ISection> | undefined) => {
//     console.log('custom from server side:');
//     console.log(customFromServer);
//   })
//   .catch(() => {
//     console.log('...default custom:');
//     console.log(getCustom());
//   });

/**
 * 
 * 
 * @link https://developer.mozilla.org/ru/docs/Web/API/Web_Workers_API/Using_web_workers
 * 
 */
// thread() {
//   if (typeof Worker !== 'undefined') {
//     console.log('Threads are allowed');
//     const w = new Worker(`./scriptW.js`);
//     w.addEventListener(
//       'message',
//       (e) => console.log(e.data),
//       false
//     );
//     w.postMessage({ cmd: "average", data: [1, 2, 3, 4] });
//   }
// }

// https://www.youtube.com/watch?v=xz5VXLlM9VY
// https://www.youtube.com/watch?v=7kNLXE0hixM
// https://www.youtube.com/watch?v=ddVm53j80vc
// import jData from '../app-sets/jData.json';
// import sets from '../app-sets/sets.json';
// import custom from '../app-sets/custom.json';
import Data from './dataPackage/dataModel';
import DbModel, { IDbModel } from './dbModel';
import StyleSheetModel from './styleSheetPackage/styleSheetModel';

import CssFile from './styleSheetPackage/cssFile/CssFile';
import getJData, { getSets, getCustom } from '../iChunk';
import getWpMedia from '../components/appFabrica/comps/menuImage/wpMedia';
import setWPStyle from '../components/appFabrica/comps/menuImage/wordPress';

class Model {
  db: IDbModel = new DbModel();
  styleSheetMdl: any = new StyleSheetModel();
  set: any = null;
  jData: any = null;
  pID = '';
  rwdArray: any = [];
  destID = 'asvthemes__header_slide_builder';
  rwdDflt = '5000';
  isWordPressEnable = getWpMedia() ? true : false;

  private static thisObject: Model;

  public static ob() {
    if (!this.thisObject) {
      this.thisObject = new Model();
      this.thisObject.init();
    }
    return this.thisObject;
  }

  init() {
    if (this.isWordPressEnable) {
      setWPStyle();
    }
    this.setModel();
    this.rwdDflt = this.set.rwdDflt;
    this.db.setUrl(this.set.ajaxURL);
    this.styleSheetMdl.getStyleSheet();
    this.styleSheetMdl.getCustomStyleSheet();

    console.log(`${this.set.ATHM_VER} status: ok`);
    console.log(`Word Press Media ${this.isWordPressEnable ? 'Enable' : 'Disable'}`);
    console.log(this.set.ajaxURL);
  }

  public setJsnByHid(hid: string): void {
    this.setHID(hid);

    Data.custom?.some((jsn: any) => {
      if (jsn.hdr.cs.ptID === hid) {
        Data.setJsn(jsn);
        // Data.jsn = jsn;
        return true;
      }
      return false;
    });
  }

  public setJsnByHidToCustomData(_hid?: string): void {
    const hid = _hid || this.getHID() || '';
    Data.custom?.some((jsn: any, index: number) => {
      if (jsn.hdr.cs.ptID === hid && Data.custom) {
        Data.custom[index] = Data.getJsn();
        return true;
      }
      return false;
    });
  }

  public getDestID = (): string => this.destID;

  public setDestID = (id: string): void => { this.destID = id }

  public setHID = (hid = ''): void => { this.pID = hid ||  Data.getJsn()?.hdr.cs.ptID || '' }

  public getHID = (sectionJsn?: boolean): string => sectionJsn ? Data.getJsn().hdr.cs.ptID : this.pID;

  public getSectionsHidArr = (): Array<string> | undefined => Data.custom?.map((el: any) => el.hdr.cs.ptID);

  public setRWDMode = (modeName: string, destID: string): void => { this.rwdArray[destID] = modeName }

  public getRWDMode = (): string => this.rwdArray[this.getDestID()] ? this.rwdArray[this.getDestID()] : this.rwdDflt;


  private async setModel() {
    const destEl = document.getElementById(this.getDestID()) as HTMLInputElement;

    if (destEl) {
      const getProp = (destEl: HTMLInputElement | null, name: string): Array<ISection> | undefined => {
        if (!destEl) {
          return undefined;
        }
        const settings = destEl.getAttribute(name);
        if (settings) {
          destEl.removeAttribute(name);
          try {
            return JSON.parse(settings);
          } catch (err) {
            return undefined;
          }
        }
        return undefined;
      }

      destEl.value = '';
      this.set = getProp(destEl, 'data-sets'); // sets;
      this.jData = getProp(destEl, 'data-jdata'); // jData;
      Data.custom = getProp(destEl, 'data-presets'); // custom;
    } else {
      this.set = getSets(); // sets;
      this.jData = getJData(); // jData;
      Data.custom = getCustom(); // custom;
    }

    Data.custom?.some((jsn: any) => {
      if (jsn.hdr) {
        Data.setJsn(jsn);
        this.setHID(jsn.hdr.cs.ptID);
        CssFile.buildByHid(this.getHID());
      }

      return false;
    });
    const [cust] = <ISection[]>getCustom();
    Data.setJsn(cust); // custom;
    this.setHID();
  }
}



export default Model;
