import './index.scss';
import React, { useState } from 'react';
import State from '../../../../utils/state';
import Model from '../../../../models/model';

const Input = ({ title, crName, subCr }: { title: string, crName: string, subCr: string }) => {
  const [currValue, setCurrValue] = useState(State.get(crName, subCr));

  const onTextChange = (value: string) => {
    const oldVal = subCr === 'akfTimelinePos' ? Model.ob().container.getCrVal('', crName, subCr) : '';

    State.set({ crName, valType: subCr, value });
    Model.ob().cssMaker.makeCSSRules(crName, subCr, value, oldVal);
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
