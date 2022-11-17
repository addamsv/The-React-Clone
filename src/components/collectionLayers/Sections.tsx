import './index.scss';
import React, { useState } from 'react';
import Model from '../../models/model';
import Slides from './Slides';
import ID from '../../core/id';
import Data from '../../models/dataPackage/dataModel';
// import DataManager from '../../core/dataManager';
// import ContextLayerMenu from './ContextLayerMenu';

type priorityT = Array<{cs: {priority: string}}>;

const Sections = ({elementIndex}: {elementIndex: string}) => {
  const [jFabMenu, setJFabMenu] = useState(false);

  const onSectionsSetClick = () => {
    // console.log('index (PtID):', elementIndex);
  }

  const onToggle = () => setJFabMenu(jFabMenu ? false : true);

  const slidesArray = Object
    .entries((() => {
      const current = (Data.custom || [])
      .filter(({hdr: {cs: {ptID}}}: {hdr: {cs: {ptID: string}}}) => ptID === elementIndex);
      if (current.length > 1) {
        // console.warn('Identical ptID of Sections');
      }
      return current[0];
    })())
    .filter(([crName]) => crName.substring(0, 1) === 'c')
    .sort(
      (
        [, {cs: {priority: a}}]: priorityT,
        [, {cs: {priority: b}}]: priorityT
      ) => Number(a) - Number(b))
    .map(([crName]) => <Slides key={`key_${ID.new()}`} elementIndex={elementIndex} crName={crName}/>);

  const addBtn = slidesArray.length ? null : <a title="Add Slide" className="add-layer-button">+</a>;

  const slides = jFabMenu
    ? (
    <div className='collections-pst' style={{paddingLeft: '2px', marginLeft: '7px'}}>
      {addBtn}
      <ul>
        {slidesArray}
      </ul>
    </div>
    )
    : null;

  // React.SyntheticEvent, you can also type them as following: Event, MouseEvent, KeyboardEvent...etc
  // const onContextMenu = useCallback((e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   DataManager.ob().contextMenu.content = (
  //     <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
  //       {/* <ContextLayerMenu crName='' updateMenu={updateMenu} /> */}
  //       <div>add</div>
  //       <div>rem</div>
  //     </div>
  //   );
  //   DataManager.ob().contextMenu.onShowFn();
  // }, []);

  // const updateMenu = () => {
  //   // console.log('updateSec');
  // }

  return (
    <li style={{whiteSpace: 'nowrap'}} title={`Section ${elementIndex}`}>
      <div className={`layer-angle-brackets${jFabMenu ? ' active' : ''}`} onClick={onToggle}>{'>'}</div>
      <div className='layer-title' onClick={onSectionsSetClick}>
        { `S${elementIndex}` }
      </div>
      {slides}
    </li>
  );
}

export default Sections;
