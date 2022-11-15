import './index.scss';
import React from 'react';
import { CSS } from '../../../../../../utils/css';

const ColorPad = (props: { onColorPicker: (event: any, eventType: string) => void, onPadTouch: (event: any, eventType: string) => void, uID: string, left: string, top: string, contrast: string }) => {
  const { onColorPicker, onPadTouch , uID, left, top, contrast } = props;
  CSS.make(`.${uID}pickerField`, { backgroundImage: `-webkit-linear-gradient(left, ${contrast})` });
  CSS.make(`.${uID}padDragCursor`, { left: left, top: top });

  return (
    <div className='color-picker'>
      {/* <ColorGradientOverlay_COLOR /> */}
      <div id={`${uID}pickerField`} className={`pickerField ${uID}pickerField`}></div>

      {/* <ColorGradientOverlay__BLACK /> */}
      <div
        id={`${uID}touchPad`}
        className='colorPickerGradientOverlay__black'
        onMouseDown={(e: any) => onPadTouch(e, 'onMouseDown')}
      ></div>

      {/* <ColorPickerCursor /> */}
      <div
        id={`${uID}padDragCursor`}
        className={`colorPickerCursor ${uID}padDragCursor`}
        onTouchStart={(e: any) => onColorPicker(e, 'onTouchStart')}
        onMouseDown={(e: any) => onColorPicker(e, 'onMouseDown')}
        // style={{ left: left, top: top }}
      >
      </div>
    </div>
  );
}

export default ColorPad;
