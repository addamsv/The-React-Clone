import './index.scss';
import React from 'react';
import Model from '../../models/model';
import Sections from './Sections';
import ID from '../../core/id';

type PostID = {hdr: {cs: {ptID: string}}};

const CollectionLayers = ({crName}: {crName: string}) => {
  const onAddSectionBtnClick = () => {
    return crName;
  }

  const sectionsMenuItems = (Model.ob().data.custom || [])
    .map(({hdr: {cs: {ptID: elementIndex}}}: PostID) => <Sections key={`key_${ID.new()}`} {...{elementIndex}} />);

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
