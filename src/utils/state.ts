import Model from "../models/model";

interface StateInterface {
  crName: string,
  valType?: string,
  value?: string,
  props?: any // { valType1: value1, valType2: value2, ... }
}

const State = {
  get: (crName: string, valType: string): string => {
    return Model.ob().data.getDataShort(crName, valType);
  },

  getDefault: (type: string, valType: string): any => {
    return Model.ob().data.getDefaultData(type, valType);
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
      const crType = Model.ob().container.getCrType(crName);
      if (value === Model.ob().data.getDefaultData(crType, valType) || value === '') {
        const rwdMode = Model.ob().getRWDMode();
        const jsn = Model.ob().container.remDefItemAndItsVal(Model.ob().data.getJsn(), crName, valType, rwdMode);
        Model.ob().data.setJsnDirectly(jsn);
        return true;
      }
      return false;
    }

    const isSameValue = (crName: string, valType: string, value: string) => {
      const rwdMode = Model.ob().getRWDMode();
      return value === Model.ob().container.getCrVal(Model.ob().data.getJsn(), crName, valType, rwdMode)
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
    Model.ob().data.setJsnDirectly(Model.ob().container.setCrVal(undefined, crName, valType, value, rwdMode));
  },

  getCr: (crName: string): any => {
    return Model.ob().container.getCrsJSN(crName).cs;
  }
}

export default State;
