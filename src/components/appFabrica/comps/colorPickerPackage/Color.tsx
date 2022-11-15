/** 
 * @link https://javascript.ru/ui/draganddrop
*/

import './index.scss';
import React from 'react';
import DOM from '../../../../utils/dom';

import { hexToRgb, getPickerH, getPickerL, getContrast, getContrastBackgroundGrd, eventListeners } from './colorUtils';
import OpacityRangeTest from './components/opacityRange/OpacityRangeTest';
import ContrastRangeTest from './components/contrastRange/ContrastRangeTest';
import HexOpacityInputFields from './components/hexOpacityInputFields/HexOpacityInputFields';
import ColorPad from './components/colorPad/ColorPad';
import CustomPalette from './components/customPalette/CustomPalette';
import RgbInputField from './components/rgbInputField/rgbInputField';
import { CSS } from '../../../../utils/css';

const Color = (props: { uID: string, hex: string, opacity: string, palette: any, stateCallback: (hex: string, opacity?: string) => void }) => {
  const { uID, hex, opacity, palette, stateCallback } = props;

  const {
    onRgbInputChange,
    onHexInputChange,
    onOpacityInputChange,
    onColorPicker,
    onPadTouch,
    onContrastChange,
    onOpacityChange,
    onCustomPaletteItemClick
  } = eventListeners(uID, stateCallback);

  const red = hexToRgb(hex.slice(1, 3));
  const green = hexToRgb(hex.slice(3, 5));
  const blue = hexToRgb(hex.slice(5, 7));

  DOM.remEl(`${uID}colorPickerContainer`);

  /* Styles For ContrastRangeTest */
  const contrast = String(getPickerH(hex) - 10);
  CSS.make(`.${uID}contrast`, { backgroundImage: `-webkit-linear-gradient(top, rgb(${red},${green},${blue}), rgb(${contrast}, ${contrast}, ${contrast}))` });

  /* Styles For OpacityRangeTest */
  CSS.make(`.${uID}opacity`, { backgroundImage: `linear-gradient(180deg,  rgba(0, 0, 0, 0) 0%, rgba(${red},${green},${blue}, 1) 100%)` });

  return (
    <div id={`${uID}colorPickerContainer`} className='color-picker-main' >
      <div className='rgb-hex-wrapper'>
        <RgbInputField onRgbInputChange={onRgbInputChange} id={`${uID}red`} value={red} color='red' />
        <RgbInputField onRgbInputChange={onRgbInputChange} id={`${uID}grn`} value={green} color='green' />
        <RgbInputField onRgbInputChange={onRgbInputChange} id={`${uID}blu`} value={blue} color='blue' />
        
        <HexOpacityInputFields onHexInputChange={onHexInputChange}  onOpacityInputChange={onOpacityInputChange} uID={uID} hexVal={hex} opacity={opacity} />
      </div>

      <div className='color-picker-pad'>
        <ColorPad onColorPicker={onColorPicker} uID={uID} onPadTouch={onPadTouch} left={`${getPickerL(hex) - 10}px`} top={`${getPickerH(hex) - 10}px`} contrast={`${getContrastBackgroundGrd(hex)}`} />
        <ContrastRangeTest onContrastChange={onContrastChange} uID={uID} contrast={String(getContrast(hex))} />
        <OpacityRangeTest onOpacityChange={onOpacityChange} uID={uID} opacity={opacity} />
      </div>

      <CustomPalette onCustomPaletteItemClick={onCustomPaletteItemClick} uID={uID} palette={palette} />
    </div>
  );
}

export default Color;
