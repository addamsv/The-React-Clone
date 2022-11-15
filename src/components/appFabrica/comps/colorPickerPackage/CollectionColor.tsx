import React from 'react';
import Model from '../../../../models/model';
import State from '../../../../utils/state';
import Thumb from './components/thumb/Thumb';

const CollectionColor = ({crName, subCr}: {crName: string, subCr: string}) => {
  const hex = Model.ob().data.getDataShort(crName, subCr);
  const opacity = Model.ob().data.getDataShort(crName, `${subCr}Opacity`);
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
    Model.ob().cssMaker.makeCSSRules(crName, subCr, hex);
  }
  /* Color Component */
  return (
    <Thumb uID={`${crName}_${subCr}__`} hex={hex} opacity={opacity} palette={palette} stateCallback={stateCallback} />
  );
}

export default CollectionColor;
