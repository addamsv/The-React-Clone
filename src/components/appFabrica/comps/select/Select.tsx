import './index.scss';
import React, { useState } from 'react';
import State from '../../../../utils/state';
import Model from '../../../../models/model';
import getNewUID from '../../../../core/id';
import CssMaker from '../../../../models/styleSheetPackage/cssMakerModel';

const Select = ({ crName, subCr, type, title }: { crName: string, subCr: string, type: string, title: string }) => {
  const options = optionsArr({ subCr, type });

  const [currValue, setCurrValue] = useState(State.get(crName, subCr));

  const defValue = State.getDefault(type, subCr);

  const titleStyle = defValue !== currValue ? { color: 'rgb(105, 105, 105)', lineHeight: '1em', margin: '10px 0 10px' } : {lineHeight: '1em', margin: '10px 0 10px'};

  const onSelectChange = (value: string) => {
    State.set({ crName: crName, valType: subCr, value });

    /**
     *    CSS.make(crName, subCr, ev.target.value);
     */
    CssMaker.makeCSSRules(crName, subCr, value);
    setCurrValue(value);
  }

  return (
    <div className='select-container' style={titleStyle}>
      <div className="">{title}</div>
      <select className='dark-stl-input' value={currValue} onChange={(e: any) => onSelectChange(e.target.value)}>
        {options}
      </select>
    </div>
  );
}

const optionsArr = (props: { subCr: string, type: string }) => {
  const { subCr, type } = props;

  return Object
    .entries(State.getDefault(type, `${subCr}Select`))
    .map(([key, val]: [string, any]) => <option key={`key_${getNewUID()}`} value={key}>{val}</option>);
}

export default Select;
