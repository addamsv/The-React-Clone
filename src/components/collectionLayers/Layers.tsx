import './index.scss';
import React, { useState } from 'react';
import Model from '../../models/model';
import AddLayerMenuButton from './addLayerButton/addLayerButton';
import Draggable from '../app/components/draggable/Draggable';
import JFab from '../appFabrica/JFab';
import DataManager from '../../core/dataManager';
import ContextLayerMenu from './ContextLayerMenu';
import State from '../../utils/state';
import onSortStart from '../appFabrica/comps/collectionShadow/box/components/sortModel';
import Container from '../../models/dataPackage/containerModel';
import { remAllRulesInCr } from '../../models/styleSheetPackage/styleSheetModel';

type priorityT = {cs: {priority: string}};

const Layers = ({crName, elementIndex}: {crName: string, elementIndex: string}) => {
  const [menu, setUpdateMenu] = useState({crNic: 'none', menuUpdateTimes: 1});
  const updateMenu = (crNic? : string) => {
    if (crNic) {
      setUpdateMenu({crNic, menuUpdateTimes: menu.menuUpdateTimes + 1});
      return;
    }
    setUpdateMenu({...menu, ...{menuUpdateTimes: menu.menuUpdateTimes + 1}});
  }

  const layers = Object
    .entries(Container.getCrsJSN(crName))
    .filter(([subCrName]) => (subCrName !== 'cs' && subCrName.substring(0, 1) === 'c') || subCrName.substring(0, 1) === 'i')
    .sort(([, val1], [,val2]) => {
      const {cs: {priority: a}} = val1 as priorityT;
      const {cs: {priority: b}} = val2 as priorityT;
      return Number(a) - Number(b);
    })
    .map(([subCrName]) => {
      if (`${crName}_${subCrName}` === menu.crNic) {
        return <CrNicInputField key={`key_container_${crName}_${subCrName}`} crName={`${crName}_${subCrName}`} updateMenu={updateMenu} />
      }
      return (subCrName.substring(0, 1) === 'c')
       ? <ContainerLi key={`key_container_${crName}_${subCrName}`} crName={`${crName}_${subCrName}`} elementIndex={elementIndex} updateMenu={updateMenu} />
       : <Item key={`key_item_${crName}_${subCrName}`} crName={`${crName}_${subCrName}`} updateMenu={updateMenu} />;
    });

  const addLayerMenuButton = layers.length ? null : <AddLayerMenuButton crName={crName} updateMenu={updateMenu} />;

  return (
    <ul className="cstmzLst priority-cr">
      {addLayerMenuButton}
      {layers}
    </ul>
  );
}

const ContainerLi = ({crName, elementIndex, updateMenu}: {crName: string, elementIndex: string,  updateMenu: () => void}) => {
  const [jFabMenu, setJFabMenu] = useState(false);

  const layers = jFabMenu
    ? (
    <div className='collections-pst' style={{paddingLeft: '2px', marginLeft: '7px'}}>
      <Layers crName={crName} elementIndex={elementIndex} />
    </div>
    )
    : null;

  const onToggle = () => setJFabMenu(jFabMenu ? false : true);

  const onCrClick = () => {
    const crType = Container.getCrType(crName);
    DataManager.ob().commonMenu.content = (
      <Draggable title='Scale' onOuterCloseFn={DataManager.ob().commonMenu.onCloseFn}>
        <JFab {...{route: `${crType}_${crType}Menu_content`, crName}} />
      </Draggable>
    );
    DataManager.ob().commonMenu.onShowFn();
  }

  // React.SyntheticEvent, you can also type them as following: Event, MouseEvent, KeyboardEvent...etc
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
        <ContextLayerMenu crName={crName} updateMenu={updateMenu} />
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }

  const activeClass = jFabMenu ? ' active' : '';

  const crNic = State.get(crName, 'crNic') || crName.split('_').slice(-1);

  // const j = Container.getCrsJSN(crName);
  // const {cs: {priority}} = j;
  const priority = State.get(crName, 'priority');

  const onRem = () => {
    onRemLayer(crName, updateMenu);
  }

  return (
    <li title={`Layer ${crName}`} id={`id_${crName}_title`} className="priority-el"
      data-priority={priority} data-cr={crName} onContextMenu={onContextMenu}
    >
      <div className={`layer-angle-brackets${activeClass}`} onClick={onToggle}>{'>'}</div>
      <div className='layer-title data-context-shadow'
        onClick={onCrClick}
        onMouseDown= {(e: React.MouseEvent) => onSortStart(e, `id_${crName}_title`, '', onRem, onPriorityChange, 'onMouseDown')}
        onTouchStart= {(e: React.TouchEvent) => onSortStart(e, `id_${crName}_title`, '', onRem, onPriorityChange, 'onTouchStart')}
      >{crNic}</div>
      {layers}
    </li>
  );
}

const onPriorityChange = (сrNameArr: Array<string>) => {
  const state: Array<{crName: string, props: { priority: number }}> = [];
  сrNameArr.some((crName: string, priorityCounter: number) => {
    state.push({ crName, props: { priority: priorityCounter } });
    return;
  });

  /* Update State */
  State.set(state);
  /* Wow (so complictd) - View UpdateProcess */
  Model.ob().setJsnByHidToCustomData();
  const updateScene = DataManager.getOnSectionChangeFn();
  updateScene();
}

const onRemLayer = (crName: string, updateMenu: () => void) => {
  // const selector = CssMaker.getCssClassName(crName);
  // document.querySelectorAll(selector)
  // .forEach(element => element.remove());

  /* Wow (so complictd) - View UpdateProcess */
  Model.ob().setJsnByHidToCustomData();
  const updateScene = DataManager.getOnSectionChangeFn();
  updateScene();
  
  remAllRulesInCr(crName);
  Container.remCr(crName);
  updateMenu();
}

const Item = ({crName, updateMenu}: {crName: string, updateMenu: () => void}) => {
  const onItemClick = () => {
    const crType = Container.getCrType(crName);
    DataManager.ob().commonMenu.content = (
      <Draggable title='Scale' onOuterCloseFn={DataManager.ob().commonMenu.onCloseFn}>
         <JFab {...{route: `${crType}_${crType}Menu_content`, crName}} />
      </Draggable>
    );
    DataManager.ob().commonMenu.onShowFn();
  }

  // React.SyntheticEvent, you can also type them as following: Event, MouseEvent, KeyboardEvent...etc
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${e.clientX}px`}}>
        <ContextLayerMenu crName={crName} updateMenu={updateMenu} />
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }

  const crNic = State.get(crName, 'crNic') || crName.split('_').slice(-1);

  // const j = Container.getCrsJSN(crName);
  // const {cs: {priority}} = j;

  const priority = State.get(crName, 'priority');

  const onRem = () => {
    onRemLayer(crName, updateMenu);
  }

  return (
    <li title={`Item ${crName}`} className='item-title priority-el'
      data-priority={priority} data-cr={crName} id={`id_${crName}_title`}
      onClick={onItemClick}
      onContextMenu={onContextMenu}
      onMouseDown= {(e: React.MouseEvent) => onSortStart(e, `id_${crName}_title`, '', onRem, onPriorityChange, 'onMouseDown')}
      onTouchStart= {(e: React.TouchEvent) => onSortStart(e, `id_${crName}_title`, '', onRem, onPriorityChange, 'onTouchStart')}
    >
      {crNic}
    </li>
  );
}

const CrNicInputField = ({ crName, updateMenu }: { crName: string, updateMenu: (crName?: string) => void }) => {
  const [currValue, setCurrValue] = useState(State.get(crName, 'crNic') || crName.split('_').slice(-1)[0]);

  const setCrNic = (value: string) => State.set({ crName, valType: 'crNic', value });

  const onFocusBlur = ({target: {value}}: React.FocusEvent<HTMLInputElement>) => {
    setCrNic(value);
    updateMenu('none');
  }

  const onKeyPress = ({key}: React.KeyboardEvent) => {
    if (key === 'Enter') {
      setCrNic(currValue);
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
      placeholder={crName.split('_').pop()}
      // autoComplete="off"
      spellCheck="false"
    >
    </input>
  )
}

export default Layers;
