import React from 'react';
import getArrSortedByPriority from '../../../../utils/getArrSortedByPriority';
import State from '../../../../utils/state';
import JFab from '../../JFab';
import CollectionShadow from './box/CollectionShadow';
import Strings from '../../../../sets/lang/strings';
import DialogBox from '../../../dialogBoxCollection/DialogBox';
import DataManager from '../../../../core/dataManager';
import CssMaker from '../../../../models/styleSheetPackage/cssMakerModel';
import Model from '../../../../models/model';
import Container from '../../../../models/dataPackage/containerModel';

const Shadow = ({ crName, subCr, data }: {crName: string, subCr: string, data: any}) => {
  /**
   * @link https://www.chakshunyu.com/blog/how-to-prevent-unnecessary-react-state-update-re-renders/
   *  State UpdateProcess Without Update its component!
   * (b|t)sc - (Box|Text) Shadow Contaner
   */

  const shadowCrType = data.subType; // See app-sets/jData.json -> near 'collectionShadowForCntr' subType: 'bsc' | 'tsc'

  const onRemoveShadow = (shadowCrName: string) => {
  const message = `${Strings.id('areYouSureYouWantToRemove')}the Shadow?`;

  const callback = () => {
    /* Update State */
    Container.remCr(`${crName}_${shadowCrName}`);
    /* Update Component */
    // DOM.remEl(`id_${shadowCrName}`);
    /* View UpdateProcess */
    const jsnCr = Container.getCrsJSN(crName);
    const shadCrNameArr = Object
      .keys(jsnCr)
      .filter((shadCrName: string) => {
        if (shadCrName.substring(0,3) === shadowCrType) {
          return shadCrName;
        }
      });

    if (shadCrNameArr.length) {
      /* Set Shadows in Order */
      CssMaker.makeCSSRules(`${crName}_${shadCrNameArr[0]}`, 'priority');
    } else {
      /* Style of Shadow None */
      const cssClassName = `.h${Model.ob().getHID()}-${crName.replace(/_/g, '-')}-${Container.getCrType(crName)}`;
      const cssObj = Model.ob().styleSheetMdl.getClassRule(cssClassName);
      if (data.subType === 'bsc') {
        cssObj.style.boxShadow = 'none';
      } else {
        cssObj.style.textShadow = 'none';
      }
    }
  }

  DataManager.ob().alertMenu.content = <DialogBox {...{message, okBtnTitle: 'yes', callback}} />;
  DataManager.ob().alertMenu.onShowFn();
  }

  const onPriorityChange = (shadowCrNameArr: Array<string>) => {
    const state: Array<{crName: string, props: { priority: number }}> = [];
    shadowCrNameArr.some((sc: string, priorityCounter: number) => {
      state.push({ crName: `${crName}_${sc}`, props: { priority: priorityCounter } });
      return;
    });
    /* Update State */
    State.set(state);
    /* View UpdateProcess */
    CssMaker.makeCSSRules(`${crName}_${shadowCrNameArr[0]}`, 'priority');
  }

  const getNewShadCrName = () => {
    /* Make New Container and Get Its Name */
    const newCrName = Container.makeBsTsCr(crName, shadowCrType);
    /* View UpdateProcess */
    CssMaker.makeCSSRules(`${crName}_${newCrName}`, 'priority');
    // return newCrName;
  }

  const getContextMenuComponent = (c: string) => {
    const layerJDataRoute = 'collectionShadowForCntr_menuBoxShadow_content';
    const textJDataRoute = 'collectionShadowForText_menutextShadow_content';
    const jDtatRoute = c.substring(0,3) === 'bsc' ? layerJDataRoute : textJDataRoute;
    return JFab({ route: jDtatRoute, crName: `${crName}_${c}` });
  }

  const getShadowCrNic = (c: string) => {
    return State.get(`${crName}_${c}`, 'crNic');
  }

  const getPriority = (c: string) => {
    return State.get(`${crName}_${c}`, 'priority');
  }

  const getSortedListItems = () => {
    const jsnCr = Container.getCrsJSN(crName);
    return getArrSortedByPriority(jsnCr, shadowCrType);
  }

  const setShadowCrNic = (c: string, value: string) => {
    State.set({ crName: `${crName}_${c}`, valType: 'crNic', value });
  }

  return (
    <CollectionShadow {...{
      uID: `uid_${crName}_${subCr}__`,
      getSortedListItems,
      getContextMenuComponent,
      onRemoveShadow,
      onPriorityChange,
      getNewShadCrName,
      getShadowCrNic,
      getPriority,
      setShadowCrNic
    }} />
  );
}

export default Shadow;
