import React from 'react';
import DataManager from '../../core/dataManager';
import Container from '../../models/dataPackage/containerModel';
import Model from '../../models/model';
import CssMaker from '../../models/styleSheetPackage/cssMakerModel';
import Strings from '../../sets/lang/strings';
import DialogBox from '../dialogBoxCollection/DialogBox';

type menuValueT = {
  triggerID: string,
  cType: string,
  hint: string
}

const ContextLayerMenu = ({crName, updateMenu}: {crName: string, updateMenu: (crNic?: string) => void }) => {
  const onChangeTitle = () => {
    DataManager.ob().contextMenu.onCloseFn();
    updateMenu(crName);
  }

  const getRequiredCrName = (crName: string): string => {
    if ((Container.getCrType(crName) === 'cntnr')) {
      return crName;
    }

    const routeArr = crName.split('_');
    routeArr.pop();
    const parentCrName = routeArr.join('_');

    return parentCrName;
  }

  const onAdd = (clientY: number, clientX: number) => {

    DataManager.ob().contextMenu.content = (
      <div className="menu-absolute-pos" style={{top: `${clientY - 15}px`, left:`${clientX}px`}}>
        {Object
        .values(Model.ob().set.addedLayerTypes)
        .map((value, indx) => {
          const { triggerID, cType, hint } = value as menuValueT;

          const onAddComponent = () => {
            DataManager.ob().contextMenu.onCloseFn();

            const type = triggerID === 'add_cntnr_btn' ? 'c' : 'i';

            /* if item ? -> parentCrName */
            const requaredCrName = getRequiredCrName(crName);

            const newCrName = Container.getNewCrName(requaredCrName, type);
            Container.mkCr(requaredCrName, newCrName, cType);

            updateMenu();

            /* Upd CSS */
            CssMaker.makeCSSRules(`${requaredCrName}_${newCrName}`);
            const updateSceneAndFramePicker = DataManager.getOnSectionChangeFn();
            updateSceneAndFramePicker();
          }

          return (
            <div key={`key_${indx}`} className='add-layer-item' onClick={onAddComponent}>
              {hint}
            </div>
          );
        })}
      </div>
    );

    DataManager.ob().contextMenu.onCloseFn();
    setTimeout(() => DataManager.ob().contextMenu.onShowFn(), 0);
  }

  const onRem = () => {
    DataManager.ob().contextMenu.onCloseFn();
    const message = `${Strings.id('areYouSureYouWantToRemove')}the Layer?`;

    const callback = () => {
      if (! crName) {
        // console.log('there is no crName here');
        return;
      }

      // const selector = CssMaker.getCssClassName(crName);
      // document.querySelectorAll(selector)
      // .forEach(element => element.remove());

      /* Wow (so complictd) - View UpdateProcess */
      Model.ob().setJsnByHidToCustomData();
      const updateScene = DataManager.getOnSectionChangeFn();
      updateScene();

      Model.ob().styleSheetMdl.remAllRulesInCr(crName);
      Container.remCr(crName);
      updateMenu();
    }

    DataManager.ob().alertMenu.content = <DialogBox {...{message, okBtnTitle: 'yes', callback}} />;
    DataManager.ob().alertMenu.onShowFn();
  }

  return (
    <>
      <div className='conttext-item' onClick={onChangeTitle}>rename</div>
      <div className='conttext-item' onClick={({clientY, clientX}) => onAdd(clientY, clientX)}>add</div>
      <div className='conttext-item' onClick={onRem}>rem</div>
    </>
  );
}

export default ContextLayerMenu;
