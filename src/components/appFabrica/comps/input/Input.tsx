import './index.scss';
import React, { useState } from 'react';
import State from '../../../../utils/state';
import CssMaker from '../../../../models/styleSheetPackage/cssMakerModel';
import Container from '../../../../models/dataPackage/containerModel';

const Input = ({ title, crName, subCr }: { title: string, crName: string, subCr: string }) => {
  const [currValue, setCurrValue] = useState(State.get(crName, subCr));

  const onTextChange = (value: string) => {
    const oldVal = subCr === 'akfTimelinePos' ? Container.getCrVal('', crName, subCr) : '';

    State.set({ crName, valType: subCr, value });
    CssMaker.makeCSSRules(crName, subCr, value, oldVal);
    setCurrValue(value);
  }

  return (
    <div className='input-text'>
      <div className='label-component no-sort'>{title}</div>
      <input
        type='text'
        className='dark-stl-input no-sort'
        onChange={({target: {value}}) => onTextChange(value)}
        value={currValue}
      />
    </div>
  )
}

export default Input;
