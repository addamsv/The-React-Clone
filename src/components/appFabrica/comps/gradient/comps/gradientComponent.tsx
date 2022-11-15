import React, { useState } from 'react';
import DataManager from '../../../../../core/dataManager';
import Model from '../../../../../models/model';
import Strings from '../../../../../sets/lang/strings';
import DialogBox from '../../../../dialogBoxCollection/DialogBox';
import JFab from '../../../JFab';
import GradientPointContainers from './gradientPointContainers';

const GradientComponent = ({updateGradientContainer, crName, type, grdCrName, onAdd}: {onAdd: () => void, updateGradientContainer: () => void, crName: string, type: string, grdCrName: string}) => {
  const [isOpen, setOpeningJFabMenu] = useState(false);

  const onToggle = () => setOpeningJFabMenu(jFabMenu ? false : true);

  const jFabMenu = isOpen ? <JFab route='collectionGradients' crName={`${crName}_${grdCrName}`} /> : null;

  const onRem = () => {
    const message = `${Strings.id('areYouSureYouWantToRemove')}the Color Point`;

    const callback = () => {
      Model.ob().container.remCr(`${crName}_${grdCrName}`);
      Model.ob().cssMaker.makeCSSRules(`${crName}_${grdCrName}`, 'priority');
      updateGradientContainer();
    }

    DataManager.ob().alertMenu.content = <DialogBox {...{message, okBtnTitle: 'yes', callback}} />;
    DataManager.ob().alertMenu.onShowFn();
  }

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
        <ContextGradientMenu {...{ onAdd, onRem, onUpdate: updateGradientContainer, isOpen }} />
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }

  if (! isOpen) {
    return (
      <li className='priority-item' onClick={onToggle} onContextMenu={onContextMenu}>
        <GradientPointContainers isOpen={isOpen} crName={`${crName}_${grdCrName}`} type={type} />
      </li>
    );
  }

  return (
    <li className='priority-item' onContextMenu={onContextMenu}>
      <div className='' style={{ display: 'block', position: 'relative', background: '#444', borderTopRightRadius: '5px', borderTopLeftRadius: '5px', height: '9px', width: '38px', boxShadow: '0px -1px 7px -1px #000', cursor: 'row-resize' }}>
        <span className='rem-gradient-layer' style={{ right: '1px'}} onClick={onRem}>x</span>
        <span className='rem-gradient-layer' style={{ top: '-3px'}} onClick={onToggle}>^</span>
      </div>
      <div className="menu-cr">
        <GradientPointContainers isOpen={isOpen} crName={`${crName}_${grdCrName}`} type={type} />
        {jFabMenu}
      </div>
    </li>
  );
}

const ContextGradientMenu = ({ onAdd, onRem, onUpdate, isOpen }: any) => {
  const onCancelEv = () => {
    DataManager.ob().contextMenu.onCloseFn();
  }

  const onAddColorPoint = () => {
    DataManager.ob().contextMenu.onCloseFn();
  }

  const onAddEv = () => {
    DataManager.ob().contextMenu.onCloseFn();
    onAdd();
    onUpdate();
  }

  const onRemEv = () => {
    DataManager.ob().contextMenu.onCloseFn();
    onRem();
    onUpdate();
  }

  const extra = isOpen ? <div className='conttext-item' onClick={onAddColorPoint}>add point</div> : null;

  return (
    <>
      <div className='conttext-item' onClick={onCancelEv}>cancel</div>
      {extra}
      <div className='conttext-item' onClick={onAddEv}>add</div>
      <div className='conttext-item' onClick={onRemEv}>rem</div>
    </>
  );
}

export default GradientComponent;
