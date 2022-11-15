import React from 'react';
import DataManager from '../../../../../../core/dataManager';

type ContextShadowMenuT ={
  crName: string,
  // setShadowCrNic: (c: string, value: string) => void,
  // getShadowCrNic: (c: string) => string,
  onRemoveShadow: (shadowCrName: string) => void,
  updateMenu: (crName?: string) => void,
  getNewShadCrName: () => void
}

const ContextShadowMenu = ({ crName, onRemoveShadow, updateMenu, getNewShadCrName }: ContextShadowMenuT) => {
  const onChangeTitle = () => {
    DataManager.ob().contextMenu.onCloseFn();
    updateMenu(crName);
  }

  const onAdd = () => {
    DataManager.ob().contextMenu.onCloseFn();

    getNewShadCrName();
    setTimeout(() => updateMenu());
  }

  const onRem = () => {
    DataManager.ob().contextMenu.onCloseFn();
    onRemoveShadow(`${crName.split('_').slice(-1)}`);
    updateMenu();
  }

  return (
    <>
      <div className='conttext-item' onClick={onChangeTitle}>rename</div>
      <div className='conttext-item' onClick={onAdd}>add</div>
      <div className='conttext-item' onClick={onRem}>rem</div>
    </>
  );
}

export default ContextShadowMenu;
