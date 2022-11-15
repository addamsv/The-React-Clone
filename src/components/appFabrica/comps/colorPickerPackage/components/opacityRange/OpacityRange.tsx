import './index.scss';

import React from "react";

const OpacityRange = (props: { idPrefix: string, rgba: { red: string, green: string, blue: string, opacity: string} }) => {
    const { idPrefix, rgba: {red, green, blue, opacity} } = props;

    let offsetY: any;

    let ty;

    let opacityElementOffsetTop;

    let opacityCursor: any;

    let opc;
    let parentElementOpcH: any; // = obOpacity ? obOpacity.parentElement : null;
    let check: any;
    let opcInp: any;
    let redInp: any;
    let grnInp: any;
    let bluInp: any;
  
    const mouseDownOpacity = (ev: any) => {
      offsetY = ev.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDragOpacity;
    }
  
    const closeDragElement = (ev: any) => {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }

    // const touchStartOpacity = (ev: any) => {
    // }

    const elementDragOpacity = (ev: any) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ty = offsetY - ev.clientY;
      offsetY = ev.clientY;
      opacityElementOffsetTop = opacityCursor ? Number(opacityCursor.offsetTop - ty) : 0;

      if (parentElementOpcH < opacityElementOffsetTop) {
        opacityElementOffsetTop = parentElementOpcH;
      }

      if (opacityElementOffsetTop < -5) {
        opacityElementOffsetTop = -5;
      }

      if (opacityCursor) {
        opacityCursor.style.top = `${opacityElementOffsetTop}px`;
      }

      opc = (((opacityElementOffsetTop + 5) * 100) / parentElementOpcH) / 100;

      if (opc > 1) {
        opc = 1;
      }

      const rgb = `${redInp.value}, ${grnInp.value}, ${bluInp.value}`;

      if (check) {
        check.style.background = `rgba(${rgb}, ${opc})`;
      }

      opcInp.value = opc.toString();

      opcInp.click();
    }

    return (
      <div className='clear-background' style={{ display: 'inline-block', height: '255px', width: '15px', marginLeft: '5px', borderRadius: '5px' }}>
        {/* <OpacityGradientOverlay /> */}
        <div id={`${idPrefix}opacity`} style={{ display: 'block', height: '100%', width: '15px', borderRadius: '5px', backgroundImage: `linear-gradient(180deg,  rgba(0, 0, 0, 0) 0%, rgba(${red},${green},${blue}, 1) 100%)`}}>
          {/* <OpacityCursor /> */}
          <div id={`${idPrefix}opacityCursor`}
               onMouseDown = { mouseDownOpacity }
              //  onTouchStart = { touchStartOpacity }
               style={{ display: 'block', position: 'absolute', top: `${Number(opacity) * 255 - 5}px`, height: '0px', width: '17px', borderRight: '8px solid #333', borderTop: '5px solid rgba(0,0,0,0)', borderBottom: '5px solid rgba(0,0,0,0)', marginLeft: '0px', cursor: 'pointer' }}></div>
        </div>
      </div>
    );
  }

  export default OpacityRange;
