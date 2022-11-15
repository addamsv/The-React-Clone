import './index.scss';
import React, { useState } from "react";

type ContrastRangeTestT = {
  onContrastChange: (ev: any) => void,
  uID: string,
  contrast: string
}

const ContrastRangeTest = ({ onContrastChange, uID, contrast }: ContrastRangeTestT) => {
  const [currValue, setCurrValue] = useState(contrast);

  const onInput = (e: any) => {
    setCurrValue(e.target.value);
    onContrastChange(e);
  }

  return (
    <div className='vertical-input-range-back contrast-pos'>
      <div id={`${uID}contrast`} className={`vertical-input-range-color ${uID}contrast`}>
        <input id={`${uID}contrastCursor`}
          type="range"
          className="vertical-input-range upside"
          min='0'
          max='255'
          step='1'
          value={currValue}
          onInput={onInput}
        />
      </div>
    </div>
  );
}

export default ContrastRangeTest;
