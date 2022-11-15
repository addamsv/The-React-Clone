import './index.scss';
import React from 'react';

const HexOpacityInputFields = (
  props: {
    onHexInputChange: (e: any) => void,
    onOpacityInputChange: (opacity: any) => void,
    uID: string,
    hexVal: string,
    opacity: string
  }
) => {
  const { onHexInputChange, onOpacityInputChange, uID, hexVal, opacity } = props;
  const onAdd = (e: any) => {
    /* key: Up/Down */
    if (e.keyCode === 38 || e.keyCode === 40) {
      onHexInputChange(e);
    }
  }

  const getValidRange = (value: number, range: Array<number> = [0, 1]): number => {
    if (value > range[1]) {
      return range[1];
    }

    if (value < range[0]) {
      return range[0];
    }

    return value || range[0];
  }

  const getValidLength = (value: number): number => {
    return Number(value.toString().substring(0, 4));
  }
  
  const getValidFloat = (value: string): number => {
    return Number(value.substring(0, 4).replace(/[^0-9.]/g, ''));
  }

  const onOpacityInput = (e: any) => {
    if (e.target.value === '0.') {
      onOpacityInputChange('0');
      return;
    }

    const value = getValidFloat(e.target.value);

    e.target.value = getValidLength(getValidRange(value));
    onOpacityInputChange(e.target.value);
  }

  const onOpacityAdd = (e: any) => {
    /* key: Up */
    if (e.keyCode === 38) {
      let value = getValidFloat(e.target.value);
      value = ((value * 100) + 1) / 100;
      e.target.value = getValidLength(getValidRange(value));
      onOpacityInputChange(e.target.value);
    }

    /* key: Down */
    if (e.keyCode === 40) {
      let value = getValidFloat(e.target.value);
      value = ((value * 100) - 1) / 100;
      e.target.value = getValidLength(getValidRange(value));
      onOpacityInputChange(e.target.value);
    }
  }

  return (
    <div className='hex-opacity'>
      <input
        className='hex-input'
        id={`${uID}hex`}
        onKeyDown={ onAdd }
        onInput={ onHexInputChange }
        type='text'
        value={hexVal}>
      </input>
      <input
        className='opacity-input'
        id={`${uID}opc`}
        onKeyDown={ onOpacityAdd }
        // onClick={onOpacityInputChange}
        onInput={ onOpacityInput }
        type='text'
        value={ opacity }>
      </input>
    </div>
  );
}

export default HexOpacityInputFields;
