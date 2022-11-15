interface IDbModel {
  saveAllHeaderObj: (jsn: any, action: string) => void;

  setUrl: (url: string) => void;
}

class DbModel implements IDbModel {
  private url = '';

  public setUrl(url: string) {
    this.url = url; // this.mdl.set.ajaxURL
  }

  public saveAllHeaderObj(jsn: any, action = 'save') {
    const xmlHttp = new XMLHttpRequest();
    const postID = this.isHeaderElementExist(jsn, 'ptID') ? jsn.hdr.cs.ptID : '';
    const name = this.isHeaderElementExist(jsn, 'ptID') ? jsn.hdr.cs.name : '';
    const data = JSON.stringify(jsn);
    const description = this.isHeaderElementExist(jsn, 'jsn.hdr.cs.description') ? jsn.hdr.cs.jsn.hdr.cs.description : '';

    if (action === 'save_as') {
      // if (!Utils.prompt(`description: ${jsn.hdr.cs.description}`)) {
      //   return;
      // }
      return;
    }

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === XMLHttpRequest.DONE) {
        switch (xmlHttp.status) {
          case 200:
            // Alert(xmlHttp.responseText
            //   ? `The Message has been delivered successfully! ${xmlHttp.responseText}`
            //   : 'Unable, Please try again');
            break;
          case 400:
            // Alert('There was an error 400');
            break;
          default:
            // Alert('something else other than 200 was returned');
            break;
        }
      }
    };
    xmlHttp.open('POST', this.url, true);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(`id=${postID}&title=${name}&descr=${description}&jsn=${data}&a=${action}&action=asvtheme_save_user_header_footer_form`);
  }

  private wpConnect({
    id = '', // jsn.hdr.cs.ptID
    title = 'title', // jsn.hdr.cs.name
    describe = 'describe',
    jsn = {},
    a = 'guest',
    action = 'asvtheme_save_user_header_footer_form',
  } = {}): void {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === XMLHttpRequest.DONE) {
        switch (xmlHttp.status) {
          case 200:
            // Alert(xmlHttp.responseText
            //   ? `The Message has been delivered successfully! ${xmlHttp.responseText}`
            //   : 'Unable, Please try again');
            break;
          case 400:
            // Alert('There was an error 400');
            break;
          default:
            // Alert('something else other than 200 was returned');
            break;
        }
      }
    };
    xmlHttp.open('POST', this.url, true);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(`id=${id}&title=${title}&descr=${describe}&jsn=${jsn}&a=${a}&action=${action}`);
  }

  private isHeaderElementExist(jsn: any, el: string) {
    return jsn.hdr && jsn.hdr.cs && jsn.hdr.cs[el];
  }
}

export default DbModel;
export {IDbModel};
