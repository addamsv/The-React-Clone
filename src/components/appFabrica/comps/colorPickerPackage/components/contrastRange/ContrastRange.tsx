import React from "react";
import { getContrast } from "../../colorUtils";

const ContrastRange = (props: { idPrefix: string, rgba: { red: string, green: string, blue: string, opacity: string}, hexVal: string }) => {
    const { idPrefix, rgba: {red, green, blue, opacity}, hexVal } = props;
  
    return (
      <div  id={`${idPrefix}contrast`}
            style={{
              display: 'inline-block',
              height: '255px',
              width: '15px',
              borderRadius: '5px',
              backgroundImage: `-webkit-linear-gradient(top, rgb(${red},${green},${blue}), rgb(255, 255, 255))`,
              marginLeft: '6px'
            }}>
  
        {/* <ContrastInputField /> */}
        <div className='hidden'>
          contrast
          <input  className='opacity-input'
                  id={`${idPrefix}cnt`}
                  type='number'
                  value={ getContrast(hexVal) }></input>
        </div>
  
        {/* <ContrastCursor /> */}
        <div  id={`${idPrefix}contrastCursor`}
              style={{
                display: 'block',
                position: 'absolute',
                top: `${getContrast(hexVal) - 5}px`,
                height: '0px',
                width: '17px',
                borderRight: '8px solid #333',
                borderTop: '5px solid rgba(0,0,0,0)',
                borderBottom: '5px solid rgba(0,0,0,0)',
                marginLeft: '0px',
                cursor: 'pointer'
              }}></div>
      </div>
    );
  }

  export default ContrastRange;
