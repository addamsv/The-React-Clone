import React from 'react';
// import DOM from '../../../../../../utils/dom';
// import BoxShadowCr from './BoxShadowCr';


const AddBoxShadowBtn = (props: {
  insertID: string,
  setShadowCrNic: (c: string, value: string) => void,
  getShadowCrNic: (c: string) => string,
  getContextMenuComponent: (c: string) => React.ReactNode,
  getNewShadCrName: () => void,
  getPriority: (c: string) => string,
  onPriorityChange: (shadowCrNameArr: Array<string>) => void,
  onRemoveShadow: (shadowCrName: string) => void,
  updateMenu: (crName?: string) => void,
}) => {
  const { getNewShadCrName, updateMenu, ...nextProps } = props;

  const addBoxShadow = () => {
    getNewShadCrName();
    setTimeout(() => updateMenu());
    // const li = <BoxShadowCr c={newCrName} {...nextProps} />;
    // DOM.renderA(li, document.getElementById(props.insertID));
  }

  return <div title='Add Shadow' className="add-shadow-btn" onClick={addBoxShadow}>+</div>
}

export default AddBoxShadowBtn;
