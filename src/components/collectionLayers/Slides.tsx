import './index.scss';
import React, { useCallback, useState } from 'react';
import Layers from './Layers';
import DataManager from '../../core/dataManager';
import ContextLayerMenu from './ContextLayerMenu';

const Slides = ({ elementIndex, crName }: {elementIndex: string, crName: string}) => {
  const [jFabMenu, setJFabMenu] = useState(false);
  const onSLideToggle = () => setJFabMenu(jFabMenu ? false : true);
  const [menu, setUpdateMenu] = useState(1);
  const updateMenu = () => setUpdateMenu(menu + 1);

  const onSlideSetClick = () => {
    // console.log('crName:', crName);
  }

  const layers = jFabMenu
    ? (
    <div className='collections-pst' style={{paddingLeft: '2px', marginLeft: '7px'}}>
      <Layers crName={crName} elementIndex={elementIndex} />
    </div>
    )
    : null;

  // React.SyntheticEvent, you can also type them as following: Event, MouseEvent, KeyboardEvent...etc
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
        {/* <ContextLayerMenu crName={crName} updateMenu={updateMenu} /> */}
        <div>add</div>
        <div>rem</div>
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }, []);

  const activeClass = jFabMenu ? ' active' : '';

  return (
    <li style={{whiteSpace: 'nowrap'}} title={`Slide ${crName}`}>
      <div className={`layer-angle-brackets${activeClass}`} onClick={onSLideToggle}>{'>'}</div>
      <div className="cstm-nav-balls" style={{display: 'inline-block', marginRight: '4px', marginLeft: '4px'}}></div>
      <div className='layer-title' onClick={onSlideSetClick}>{crName}</div>
      {layers}
    </li>
  );
}

export default Slides;
