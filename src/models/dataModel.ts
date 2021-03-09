/* eslint-disable class-methods-use-this */
class DataModel {
  dataInput: Array<any>;

  constructor() {
    this.dataInput = [];
  }

  public setNewDataInput(hid: any, data: any) {
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

  public getDataInput(hid: any) {
    return this.dataInput[hid];
  }

  private isJsnObj(obj: any) {
    return ((typeof obj === 'object') && (obj.constructor === Object));
  }
}

export default DataModel;
