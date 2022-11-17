import './index.scss';
import React, { useState } from 'react';
import State from '../../../../utils/state';
import Model from '../../../../models/model';
import CssMaker from '../../../../models/styleSheetPackage/cssMakerModel';
import Container from '../../../../models/dataPackage/containerModel';

const getDefaultMinMaxStepArr = (subCr: string) => {
  const defaultValue = Model.ob().set.dflt[subCr];

  return Array.isArray(defaultValue) ? defaultValue : [];
}

interface InputRangeInterface {
  crName: string;
  subCr: string;
  title: string;
  data?: { m?: '%' | 'sec'| 'Sec' | 'Deg'| 'deg' | 'px'| 'times' | 'em' };
}

const InputRange = ({ crName, subCr, title = '', data = {} }: InputRangeInterface) => {
  const { m: unitOfMeasure } = data;
  
  const onInputRangeChange = (value: string) => {
    const oldVal = subCr === 'akfTimelinePos' ? Container.getCrVal('', crName, subCr) : '';

    if (subCr === 'fontSize') {
      const pickerEl = document.getElementById(`h${Model.ob().getHID()}-${crName.replace(/_/g, '-')}-${Container.getCrType(crName)}-input-text-edit`);

      pickerEl?.setAttribute('style', `font-size: ${value}px; box-shadow: 'none';`);
      State.set({ crName, valType: subCr, value: value });
    }

    /**
     * should be like: State.cssSet(crName, prop, val, oldVal);
     */
    CssMaker.makeCSSRules(crName, subCr, value, oldVal);

    setValue(value);
  }

  const onInputRangeSetState = (value: string) => {
    const oldVal = subCr === 'akfTimelinePos' ? Container.getCrVal('', crName, subCr) : '';

    State.set({ crName, valType: subCr, value: value });
    CssMaker.makeCSSRules(crName, subCr, value, oldVal);

    setValue(value);
  }


  const [defVal, min, max, step] = getDefaultMinMaxStepArr(subCr);  

  const [value, setValue] = useState(State.get(crName, `${subCr}`));
  // const value = State.get(crName, `${subCr}`);

  const lebelStyle = {
    color: value === defVal ? 'rgb(105, 105, 105)' :  'rgb(150, 150, 150)',
    lineHeight: '1em'
  }

  const label = title ? <div className="" style={lebelStyle}>{title}</div> : null;

  const unitOfMeasureLabel = unitOfMeasure ? <label className='input-range-label-m'>{unitOfMeasure}</label> : null;

  const callback = () => {
    // console.log(crName, subCr, 'value:', value, 'defVal:', Model.ob().set.dflt[subCr]);
  }

  return (
    <div className='input-range-main'>
      {label}
      <div className='input-range'>
        <input type='number' className='input-range-num'
          min={min} max={max} step={step} value={value}
          onChange={({target: {value}}) => onInputRangeChange(value)}
        />
        {unitOfMeasureLabel}
        <input type='range' className='input__range input__range__wrp'
          min={min} max={max} step={step} value={value}
          onChange={({target: {value}}) => onInputRangeSetState(value)}
        />
        <DefaultButton callback={callback} />
      </div>
    </div>
  );
}

const DefaultButton = ({callback}: {callback: () => void}) => {
  const def = () => callback();
  return <div className='back-def__btn' onClick={def}></div>;
}

export default InputRange;
