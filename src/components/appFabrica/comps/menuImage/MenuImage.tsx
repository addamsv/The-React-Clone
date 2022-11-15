import './index.scss';
import React, { useCallback, useState } from 'react';
import Model from '../../../../models/model';
import getWpMedia from './wpMedia.js';
import JFab from '../../JFab';
import Strings from '../../../../sets/lang/strings';
import DataManager from '../../../../core/dataManager';
import DialogBox from '../../../dialogBoxCollection/DialogBox';
import State from '../../../../utils/state';

const MenuImage = ({crName, subCr, type}: {crName: string, subCr: string, type: string, title: string}) => {
  const [component, setUpdateComponent] = useState(1);
  const updatecomponent = () => setUpdateComponent(component + 1);

  const onImageUpload = (): void => {
    /** TODO: Menu: Own Pictures | ByURL | Load a Picture by the WP MediaUploader */
    if (Model.ob().isWordPressEnable) {
      /** Load a Picture by the WP MediaUploader */
      const mediaUploader = getWpMedia();
      if (mediaUploader) {
        mediaUploader.on('select', () => {
          // const attachment = mediaUploader.state().get('selection').first().toJSON();
          const { url } = mediaUploader.state().get('selection').first().toJSON();
          update(url);
        });
        mediaUploader.open();
      }
      return;
    }
    console.log('Menu "Picture" = Pick or set URL');
  }

  const onImageRemove = (): void => {
    const message = `${Strings.id('areYouSureYouWantToRemove')}the Picture?`;

    const callback = () => {
      update(Model.ob().set.dfltImg);
    }
    DataManager.ob().alertMenu.content = <DialogBox {...{message, okBtnTitle: 'yes', callback}} />;
    DataManager.ob().alertMenu.onShowFn();

    DataManager.ob().contextMenu.onCloseFn();
  }

  const update = (value: string) => {
    State.set({crName, valType: `${subCr}Image`, value});
    Model.ob().cssMaker.makeCSSRules(crName, `${subCr}Image`, value);
    updatecomponent();
  }

  const onContextMenu = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
        <div onClick={onImageRemove}>rem</div>
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }, []);

  const src = Model.ob().data.getData(Model.ob().data.getJsn(), crName, `${subCr}Image`, 'getIMG');

  // const remBtn = src === Model.ob().set.dfltImg ? null : <a className='rem-picture-style-btn' onClick={onImageRemove}>x</a>;
  const imageSets = src === Model.ob().set.dfltImg ? null : <JFab {...{route: 'collectionImgSETS', crName, type}} />;

  return (
    <>
      <img className='ui-upload-image' onClick={onImageUpload} onContextMenu={onContextMenu} src={src} />
      {imageSets}
    </>
  );
}

export default MenuImage;
