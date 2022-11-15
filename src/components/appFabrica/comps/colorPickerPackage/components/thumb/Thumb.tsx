import './index.scss';
import React, { useState } from 'react';
import { CSS } from '../../../../../../utils/css';
import { hexToRgb, rgbToHex, validateAndGetHexValue } from '../../colorUtils';
import Color from '../../Color';
import ID from '../../../../../../core/id';


const Thumb = (props: { uID?: string, hex: string, opacity: string, palette: Array<any>, stateCallback: (hex: string, opacity?: string) => void }) => {
  const { stateCallback, palette, uID = `uID_${ID.new()}__`, hex, opacity } = props;

  const [colorState, setColorState] = useState({ isOpent: false, hex, opacity });

  const onThumbClick = () => {
    if (document.getElementById(`${uID}colorPickerContainer`)) {
      const r = document.getElementById(`${uID}red`) as HTMLInputElement | null;
      const g = document.getElementById(`${uID}grn`) as HTMLInputElement | null;
      const b = document.getElementById(`${uID}blu`) as HTMLInputElement | null;
      const hexRGB = rgbToHex(Number(r?.value || 0), Number(g?.value || 0), Number(b?.value || 0));

      const [ hex ] = validateAndGetHexValue(hexRGB);

      const opacity = document.getElementById(`${uID}opacityCursor`) as HTMLInputElement | null;

      setColorState({ isOpent: false, hex: `#${hex}`, opacity: opacity?.value || '0' });
      return;
    }
    setColorState({ ...colorState, ...{ isOpent: true } });
  }

  const red = hexToRgb(colorState.hex.slice(1, 3));
  const green = hexToRgb(colorState.hex.slice(3, 5));
  const blue = hexToRgb(colorState.hex.slice(5, 7));
  CSS.make(`.${uID}check`, { backgroundColor: `rgba(${red},${green},${blue},${colorState.opacity})` });
  CSS.make(`.${uID}checkSolid`, { background: `rgb(${red},${green},${blue})` });

  const color = colorState.isOpent ? <Color uID={uID} hex={colorState.hex} opacity={colorState.opacity} stateCallback={stateCallback} palette={palette} /> : null;

  return (
    <div className='background-sasachki thumb-check'>
      <div id={`${uID}check`} className={`check-rgba__container ${uID}check`} onClick={ onThumbClick }>
        <div id={`${uID}checkSolid`} className={`check-solid__container ${uID}checkSolid`}></div>
      </div>
      {color}
    </div>
  );
}

export default Thumb;
