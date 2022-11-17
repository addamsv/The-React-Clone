import './index.scss';
import React from "react";
import ID from "../../../../../core/id";
import Model from "../../../../../models/model";
import getArrSortedByPriority from "../../../../../utils/getArrSortedByPriority";
import DataManager from '../../../../../core/dataManager';
import Data from '../../../../../models/dataPackage/dataModel';

const SlidesMenu = () => {
  const onAddSlideBtnClick = () => {
    console.log('Adding Slide...');
    // data-input id: "add_slide_btn"
  }

  return (
    <div id='menuSlides' className='menu-slides'>
      <ul className='menu-slides-list'>
        <ListItemsOfSlides />
      </ul>
      <div id='addNewSlideBtn' className='add-slide-btn dstl-inline' onClick={onAddSlideBtnClick}>+</div>
    </div>
  );
}

const ListItemsOfSlides = () => {
  const onSlideClick = (slideCr: string) => {
    DataManager.setSlideFirstCr(Model.ob().getHID(), slideCr);
    const onSlidePick = DataManager.onSlidePickFn();
    onSlidePick();
    /* data-input id: "change_screen_ev", slide: crName */
  }

  const isCrActive = (crName: string): boolean => {
    const cr = DataManager.getSlideFirstCr(Model.ob().getHID());

    if (!cr) {
      DataManager.setSlideFirstCr(Model.ob().getHID(), crName);
      return true;
    }
    return crName === cr;
  }

  return (
    <>
      {getArrSortedByPriority(Data.getJsn())
      .map(([crName]) => {
        const activeClass = isCrActive(crName) ? ' active' : '';

        return (
          <li key={`key_${ID.new()}`} className='menu-slides-li' onClick={() => onSlideClick(crName)}>
            <div className={`menu-slides-item-contetnt${activeClass}`}></div>
          </li>
        );
      })}
    </>
  );
}

export default SlidesMenu;
