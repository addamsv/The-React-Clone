/* eslint-disable class-methods-use-this */
class DataModel {
  constructor() {
    this.dataInput = [];
  }

  setNewDataInput(hid, data) {
    if (!hid) {
      console.log('Internal Error MDL#60');
      return false;
    }
    if (this.isJsnObj(data)) {
      this.dataInput[hid] = data;
    } else {
      this.dataInput[hid] = JSON.parse(data);
    }
    return true;
  }

  getDataInput(hid) {
    return this.dataInput[hid];
  }

  isJsnObj(obj) {
    return (typeof obj === 'object') && (obj.constructor === Object);
  }
}

export default DataModel;
