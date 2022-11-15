import './index.scss';
import React, { useState } from "react";
import onSortStart from "./sortModel";
import ContextShadowMenu from './ContextShadowMenu';
import DataManager from '../../../../../../core/dataManager';

const BoxShadowCr = (props: {
  insertID: string,
  c: string,
  setShadowCrNic: (c: string, value: string) => void,
  getShadowCrNic: (c: string) => string,
  getNewShadCrName: () => void,
  getContextMenuComponent: (c: string) => React.ReactNode,
  getPriority: (c: string) => string,
  onPriorityChange: (shadowCrNameArr: Array<string>) => void,
  onRemoveShadow: (shadowCrName: string) => void,
  updateMenu: (crName?: string) => void
}) => {
  const { insertID:  ulID, c, onRemoveShadow, onPriorityChange, getShadowCrNic,
    setShadowCrNic, getPriority, getContextMenuComponent, updateMenu, getNewShadCrName } = props;

  const blockID = `id_${c}`;
  const crNic = getShadowCrNic(c);
  const priority = getPriority(c);

  // const onContextMenu = useCallback((e: any) => {
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
        <ContextShadowMenu {...{ crName: c, getNewShadCrName,setShadowCrNic, getShadowCrNic, onRemoveShadow, updateMenu }} />
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }

  const onTgl = () => {
    updateComponent();
  }

  const [isToggle, setToggle] = useState(false);

  const updateComponent = () => {
    setToggle(isToggle ? false : true);
  }

  const menu = isToggle ? <div id={`${blockID}_pst`} className="collections-pst">{getContextMenuComponent(c)}</div> : null;

  return (
    <li
      id={blockID}
      className="priority-el"
      data-cr={c}
      data-priority={priority}
      onContextMenu={onContextMenu}
    >
      <div
        className="shadow-header-title data-context-shadow data-tgl-attrs"
        id={`${blockID}_title`}
        title={`Layer Shadow\nid: ${c}\nname: ${crNic || 'not yet'}`}
        onMouseDown={(e: React.MouseEvent) => onSortStart(e, blockID, ulID, onRemoveShadow, onPriorityChange, 'onMouseDown')}
        onTouchStart={(e: React.TouchEvent) => onSortStart(e, blockID, ulID, onRemoveShadow, onPriorityChange, 'onTouchStart')}
        onClick={onTgl}
      >
        {crNic || `s${c.replace(/[^0-9]/g, '')}`}
      </div>
      {menu}
    </li>
  );
}

// {JFab({ route, crName: `${crName}_${c}` })}
// data-tgl-attrs={`{"tglID":"", "jDataDest": "collectionShadowForCntr_menuBoxShadow_content", "contentID":"crVal", "slide":"${crName}_${c}"}`}

export default BoxShadowCr;
