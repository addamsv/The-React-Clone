import React from 'react';
import Data from '../../../../models/dataPackage/dataModel';
import Model from '../../../../models/model';
import CssMaker from '../../../../models/styleSheetPackage/cssMakerModel';
import State from '../../../../utils/state';
import Thumb from './components/thumb/Thumb';

const CollectionColor = ({crName, subCr}: {crName: string, subCr: string}) => {
  const hex = Data.getDataShort(crName, subCr);
  const opacity = Data.getDataShort(crName, `${subCr}Opacity`);
  const palette = Model.ob().set.palettes || [];
  const stateCallback = (hex: string, opacity?: string) => {
    /**
     * @link https://www.chakshunyu.com/blog/how-to-prevent-unnecessary-react-state-update-re-renders/
     *  State UpdateProcess Without Update its component!
     */
    const state = { crName, props: {[subCr]: hex} };
    if (opacity) {
      Object.assign(state.props, {[`${subCr}Opacity`]: opacity});
    }
    State.set(state);

    /* View UpdateProcess */
    CssMaker.makeCSSRules(crName, subCr, hex);
  }
  /* Color Component */
  return (
    <Thumb uID={`${crName}_${subCr}__`} hex={hex} opacity={opacity} palette={palette} stateCallback={stateCallback} />
  );
}

export default CollectionColor;
