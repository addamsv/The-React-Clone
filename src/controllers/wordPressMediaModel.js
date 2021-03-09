import getWpMedia from './wordPressMedia.js';
/* eslint-disable class-methods-use-this */
class WordPressMediaModel {
  constructor() {
    this.ob = null;
    this.attachment = null;
    this.mediaUploader = null;
    this.attachment = null;
    this.answer = false;
  }

  /**
  * ------  Load a Picture by the MediaUploader  -------
  */
  dataImageUpload(target) {
    this.mediaUploader = getWpMedia();
    this.mediaUploader.on('select', () => {
      this.attachment = this.mediaUploader.state().get('selection').first().toJSON();
      this.ob = document.getElementById(target.field);
      this.ob.value = this.attachment.url;
      this.ob.click();
      // it can be a class instead of the id
      Object.keys(target.srcs).some((src) => {
        this.ob = document.getElementById(target.srcs[src]);
        if (this.ob) {
          this.ob.src = this.attachment.url;
        }
        return false;
      });
    });
    this.mediaUploader.open();
  }

  /* Remove the Picture by the MediaUploader */
  imageRemove(target) {
    this.answer = confirm('Are you sure you want to remove your picture?');
    if (this.answer === true) {
      this.ob = document.getElementById(target.field);
      this.ob.value = '';
      this.ob.click();
      // it can be a class instead of the id
      Object.keys(target.srcs).some((src) => {
        this.ob = document.getElementById(target.srcs[src]);
        if (this.ob) {
          this.ob.src = target.dfltImg;
        }
        return false;
      });
    }
  }
}

export default WordPressMediaModel;
