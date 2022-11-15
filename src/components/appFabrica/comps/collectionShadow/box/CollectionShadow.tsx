import './index.scss';
import React, { useState } from 'react';

import BoxShadowCr from './components/BoxShadowCr';
import AddBoxShadowBtn from './components/AddBoxShadowBtn';
import ID from '../../../../../core/id';
// import State from '../../../../../utils/state';

type ShadowT = {
  uID: string,
  getSortedListItems: () => Array<[string, unknown]>,
  setShadowCrNic: (c: string, value: string) => void,
  getShadowCrNic: (c: string) => string,
  getContextMenuComponent: (c: string) => React.ReactNode,
  getNewShadCrName: () => void,
  getPriority: (c: string) => string,
  onPriorityChange: (shadowCrNameArr: Array<string>) => void,
  onRemoveShadow: (shadowCrName: string) => void
}

const CollectionShadow = ({ uID, getSortedListItems, getNewShadCrName, ...nextProps }: ShadowT) => {
  const { getShadowCrNic, setShadowCrNic } = nextProps;
  const [menu, setUpdateMenu] = useState({crNic: 'none', menuUpdateTimes: 1});
  const updateMenu = (crNic? : string) => {
    if (crNic) {
      setUpdateMenu({crNic, menuUpdateTimes: menu.menuUpdateTimes + 1});
      return;
    }
    setUpdateMenu({...menu, ...{menuUpdateTimes: menu.menuUpdateTimes + 1}});
  }
  const insertID = `id_${ID.new()}`;

  const listOfComponents = getSortedListItems()
    .map(([c]) => {
      if (c === menu.crNic) {
        return <CrNicInputField key={`key_shad_${c}`}{...nextProps} {...{ c, getShadowCrNic, setShadowCrNic, updateMenu }} />
      }
      return <BoxShadowCr key={`key_shad_${c}`} insertID={insertID} c={c} {...nextProps} getNewShadCrName={getNewShadCrName} updateMenu={updateMenu} />;
    });

  const addBtn = listOfComponents.length ? null : <AddBoxShadowBtn insertID={insertID} getNewShadCrName={getNewShadCrName} {...nextProps} updateMenu={updateMenu} />;

  return (
    <ul id={insertID} className="cstmzLst priority-cr">
      {addBtn}
      {listOfComponents}
    </ul>
  );
}

const CrNicInputField = ({ setShadowCrNic, getShadowCrNic, updateMenu, c }: { c: string, getShadowCrNic: (c: string) => string, setShadowCrNic: (c: string, value: string) => void, updateMenu: (crName?: string) => void }) => {
  const [currValue, setCurrValue] = useState(getShadowCrNic(c));

  const onFocusBlur = ({target: {value}}: React.FocusEvent<HTMLInputElement>) => {
    setShadowCrNic(c, value);
    updateMenu('none');
  }

  const onKeyPress = ({key}: React.KeyboardEvent) => {
    if (key === 'Enter') {
      setShadowCrNic(c, currValue);
      updateMenu('none');
    }
  }

  const onChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    setCurrValue(value);
  }

  return (
    <input
      className='dark-stl-input no-sort'
      onChange={ onChange }
      onKeyPress={ onKeyPress }
      onBlur={ onFocusBlur }
      type='text'
      value={currValue}
      placeholder={c.split('_').pop()}
      // autoComplete="off"
      spellCheck="false"
    >
    </input>
  )
}

export default CollectionShadow;
