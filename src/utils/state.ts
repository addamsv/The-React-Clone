import Container from "../models/dataPackage/containerModel";
import Data from "../models/dataPackage/dataModel";
import Model from "../models/model";

interface StateInterface {
  crName: string,
  valType?: string,
  value?: string,
  props?: any // { valType1: value1, valType2: value2, ... }
}

const State = {
  get: (crName: string, valType: string): string => {
    return Data.getDataShort(crName, valType);
  },

  getDefault: (type: string, valType: string): any => {
    return Data.getDefaultData(type, valType);
  },

  set: (state: StateInterface | Array<StateInterface>) => {
    if (Array.isArray(state)) {
      state.some((el: any) => {
        State.set(el);
      });
      return;
    }

    if (state.props) {
      const valTyps = Object.entries(state.props);
      valTyps
      .some((el: any) => {
        State.set({ crName: state.crName, valType: el[0], value: el[1] })
      });
      return;
    }

    const { crName, valType = '', value = '' } = state;

    const isValueDefault = (crName: string, valType: string, value: string ) => {
      const crType = Container.getCrType(crName);
      if (value === Data.getDefaultData(crType, valType) || value === '') {
        const rwdMode = Model.ob().getRWDMode();
        const jsn = Container.remDefItemAndItsVal(Data.getJsn(), crName, valType, rwdMode);
        Data.setJsnDirectly(jsn);
        return true;
      }
      return false;
    }

    const isSameValue = (crName: string, valType: string, value: string) => {
      const rwdMode = Model.ob().getRWDMode();
      return value === Container.getCrVal(Data.getJsn(), crName, valType, rwdMode)
    }

    if (isValueDefault(crName, valType, value)) {
      console.log('DEFAULT VALUE');
      return;
    }

    if (isSameValue(crName, valType, value)) {
      console.log('SAME VALUE');
      return;
    }

    const rwdMode = Model.ob().getRWDMode();
    Data.setJsnDirectly(Container.setCrVal(undefined, crName, valType, value, rwdMode));
  },

  getCr: (crName: string): any => {
    return Container.getCrsJSN(crName).cs;
  }
}

export default State;
