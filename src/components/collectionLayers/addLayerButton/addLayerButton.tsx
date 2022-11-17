import './index.scss';
import React from 'react';
import Model from '../../../models/model';
import Strings from '../../../sets/lang/strings';
import DataManager from '../../../core/dataManager';
import CssMaker from '../../../models/styleSheetPackage/cssMakerModel';
import Container from '../../../models/dataPackage/containerModel';

type menuValueT = {
  triggerID: string,
  cType: string,
  hint: string
}

const AddLayerMenuButton = ({crName, updateMenu}: {crName: string, updateMenu: () => void}) => {
  const onToggle = (clientY: number, clientX: number) => {
    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${clientY - 15}px`, left:`${clientX}px`}}>
        {Object
        .values(Model.ob().set.addedLayerTypes)
        .map((value, indx) => {
          const { triggerID, cType, hint } = value as menuValueT;

          const onAdd = () => {
            DataManager.ob().contextMenu.onCloseFn();

            const type = triggerID === 'add_cntnr_btn' ? 'c' : 'i';

            const newCrName = Container.getNewCrName(crName, type);
            Container.mkCr(crName, newCrName, cType);

            updateMenu();

            /* Upd CSS */
            CssMaker.makeCSSRules(`${crName}_${newCrName}`);
            const updateSceneAndFramePicker = DataManager.getOnSectionChangeFn();
            updateSceneAndFramePicker();
          }

          return (
            <div key={`key_${indx}`} className='add-layer-item' onClick={onAdd}>
              {hint}
            </div>
          );
        })}
      </div>
    );

    DataManager.ob().contextMenu.onShowFn();
  }

  return <a className='add-layer-button' onClick={({clientY, clientX}) => onToggle(clientY, clientX)} title={Strings.id('addLayer')}>+</a>;
}

export default AddLayerMenuButton;
