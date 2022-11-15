import './index.scss';
import React, { useState } from "react";

const OpacityRangeTest = ({ onOpacityChange, uID, opacity }: { onOpacityChange: (ev: any) => void, uID: string, opacity: string }) => {
  const [currValue, setCurrValue] = useState(opacity);

  const onInput = (ev: any) => {
    onOpacityChange(ev);
    setCurrValue(ev.target.value);
  }

  return (
    <div className='vertical-input-range-back opacity-pos'>
      <div id={`${uID}opacity`} className={`vertical-input-range-color ${uID}opacity`}>
        <input id={ `${uID}opacityCursor` }
          type="range"
          className="vertical-input-range upsidedown"
          min='0'
          max='1'
          step='0.01'
          value={currValue}
          onInput={onInput}
        />
      </div>
    </div>
  );
}

export default OpacityRangeTest;
