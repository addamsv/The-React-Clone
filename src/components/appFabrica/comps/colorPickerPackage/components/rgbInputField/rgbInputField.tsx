import './index.scss';
import React, { useState } from 'react';

type rgbInputFieldT = {
  id: string,
  value: string,
  color: string,
  onRgbInputChange: () => void,
};

const RgbInputField = ({ onRgbInputChange, id, value, color }: rgbInputFieldT) => {
  const [currValue, setCurrValue] = useState(value);

  const validateValue = (value: string) => {
    /* if the first num eq '0' */
    return value.replace(/[^0-9]/g, '').toLowerCase();
  }

  const onChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(validateValue(value) || '0') > 255 ? '255' : Number(validateValue(value) || '0') < 0 ? '0' : validateValue(value) || '0';
    setCurrValue(val);
    onRgbInputChange();
  }

  const onArrow = (e: React.KeyboardEvent) => {
    const element = e.target as HTMLInputElement

    if (e.key === 'ArrowUp') {
      const value = Number(validateValue(element.value));
      setCurrValue(value >= 255 ? '255' : (value + 1).toString());
      onRgbInputChange();
    }
    if (e.key === 'ArrowDown') {
      const value = Number(validateValue(element.value));
      setCurrValue(value <= 0 ? '0' : (value - 1).toString());
      onRgbInputChange();
    }
  }

  return (
    <div className='rgb-palette-wrapper'>
      <input className='rgb-palette-input-field'
        id={id}
        type='text'
        onChange={onChange}
        onKeyDown={onArrow}
        value={currValue}
      />
      <div className={`color-palette ${color}`}></div>
    </div>
  );
}

export default RgbInputField;
