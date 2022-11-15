import './index.scss';
import React, { useState } from 'react';
import State from '../../../../utils/state';
import Model from '../../../../models/model';

const Textarea = ({ title, crName, subCr, type }: { title: string, crName: string, subCr: string, type: string }) => {
  const [currValue, setCurrValue] = useState(State.get(crName, subCr));

  const onTextChange = (value: string) => {
    // const value = e.target.value;
    const oldVal = subCr === 'akfTimelinePos' ? Model.ob().container.getCrVal('', crName, subCr) : '';

    State.set({ crName, valType: subCr, value });
    Model.ob().cssMaker.makeCSSRules(crName, subCr, value, oldVal);
    setCurrValue(value);
  }
  const defValue = State.getDefault(type, subCr);

  const titleStyle = defValue !== currValue ? { color: 'rgb(105, 105, 105)' } : {};

  return (
    <div className='input-textarea'>
      <div className='label-component' style={titleStyle}>{title}</div>
      <textarea className='dark-stl-input' value={currValue}
        onChange={({target: {value}}) => onTextChange(value)} />
    </div>
  )
}

export default Textarea;
