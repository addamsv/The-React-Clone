import './index.scss';
import React from 'react';
import ID from '../../../../core/id';
import JFab from '../../JFab';
import Container from '../../../../models/dataPackage/containerModel';

const CollectionHover = ({ crName }: { crName: string, type: string }) => {
  const onAddBtn = () => {
    // data-input: "add_hover_btn" ${crName} ${type}`
  }

  const hoverEventsListArr = Object
  .keys(Container.getCrsJSN(crName))
  .filter((c) => c.substring(0, 3) === 'hvr')
  .map((c) => {
    const onRemEvent = () => {
      // data-input: "rem_hvr_btn" ${crName} ${crName}_${c}
    }

    return (
      <li key={`key_event_${ID.new()}`} className="">
        <div className="menu-cr">
          <span className='rem-layer' onClick={onRemEvent}>x</span>
          <JFab route='collectionHover' crName={`${crName}_${c}`} />
        </div>
      </li>
    );
  });

  return (
    <ul>
      <a className="btn-algn-right dark-stl dstl-blck" onClick={onAddBtn}>+</a>
      <li key="key_event_1" className="">
        <div className="menu-cr">
          <JFab crName={crName} route="collectionClick" />
        </div>
      </li>
      {hoverEventsListArr}
    </ul>
  );
}

export default CollectionHover;
