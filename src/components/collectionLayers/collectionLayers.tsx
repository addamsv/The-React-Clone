import './index.scss';
import React from 'react';
import Model from '../../models/model';
import Sections from './Sections';
import getNewUID from '../../core/id';
import Data from '../../models/dataPackage/dataModel';

type PostID = {hdr: {cs: {ptID: string}}};

const CollectionLayers = ({crName}: {crName: string}) => {
  const onAddSectionBtnClick = () => {
    return crName;
  }

  const sectionsMenuItems = (Data.custom || [])
    .map(({hdr: {cs: {ptID: elementIndex}}}: PostID) => <Sections key={`key_${getNewUID()}`} {...{elementIndex}} />);

  const addBtn = sectionsMenuItems.length ? null : <a title="Add Section" className="add-layer-button" onClick={onAddSectionBtnClick}>+</a>;

  return (
    <>
      <ul className='cstmzLst' style={{padding: '0', margin: '0'}}>
        {addBtn}
        {sectionsMenuItems}
      </ul>
    </>
  );
}

export default CollectionLayers;
