let url = '';

const setUrl = (_url: string) => { url = _url } // this.mdl.set.ajaxURL

const isHeaderElementExist = (jsn: any, el: string) => jsn.hdr && jsn.hdr.cs && jsn.hdr.cs[el];

const saveAllHeaderObj = (jsn: any, action = 'save') => {
  const xmlHttp = new XMLHttpRequest();
  const postID = isHeaderElementExist(jsn, 'ptID') ? jsn.hdr.cs.ptID : '';
  const name = isHeaderElementExist(jsn, 'ptID') ? jsn.hdr.cs.name : '';
  const data = JSON.stringify(jsn);
  const description = isHeaderElementExist(jsn, 'jsn.hdr.cs.description') ? jsn.hdr.cs.jsn.hdr.cs.description : '';

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
  xmlHttp.open('POST', url, true);
  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlHttp.send(`id=${postID}&title=${name}&descr=${description}&jsn=${data}&a=${action}&action=asvtheme_save_user_header_footer_form`);
}

const wpConnect = ({
  id = '', // jsn.hdr.cs.ptID
  title = 'title', // jsn.hdr.cs.name
  describe = 'describe',
  jsn = {},
  a = 'guest',
  action = 'asvtheme_save_user_header_footer_form',
} = {}): void => {
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
  xmlHttp.open('POST', url, true);
  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlHttp.send(`id=${id}&title=${title}&descr=${describe}&jsn=${jsn}&a=${a}&action=${action}`);
}

export {setUrl, saveAllHeaderObj};
