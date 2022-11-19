import React, { useState } from 'react';
import { hexToRgbJSN } from '../../colorPickerPackage/colorUtils'; // colorPickerPackage/colorUtils';
import State from '../../../../../utils/state';
import JFab from '../../../JFab';
import CssMaker from '../../../../../models/styleSheetPackage/cssMakerModel';
import Data from '../../../../../models/dataPackage/dataModel';
import Container from '../../../../../models/dataPackage/containerModel';
import { addCSSRule } from '../../../../../models/styleSheetPackage/styleSheetModel';

const GradientPointContainers = ({ crName, type, isOpen }: { isOpen: boolean, crName: string, type: string }) => {
  // const idToInsertColorMenu = `tglID_${getNewUID()}`;
  // const headerType = type;
  const grtDivider = ', ';

  let outDataGrd = '';

  let color;
  let opacity;

  let pos;
  const jsnCr = Container.getCrsJSN(crName);
  const grdArr: any = [];
  let ai = 0;
  let hold = [];

  // Array of grt
  Object
  .keys(jsnCr)
  .some((grdPointC) => {
    if (grdPointC.substring(0, 3) === 'grt') {
      grdArr[ai] = jsnCr[grdPointC];
      ai += 1;
    }
    return false;
  });

  // sort by grdLinePos
  for (let pass = 1; pass < ai; pass += 1) {
    for (let i = 0; i < ai - 1; i += 1) {
      if (parseFloat(grdArr[i].cs.grdLinePos) > parseFloat(grdArr[i + 1].cs.grdLinePos)) {
        hold = grdArr[i];
        grdArr[i] = grdArr[i + 1];
        grdArr[i + 1] = hold;
      }
    }
  }

  // Make CSS
  Object
  .keys(grdArr)
  .some((grdLineC) => {
    if (grdArr[grdLineC].cs.grdLinePos) {
      pos = grdArr[grdLineC].cs.grdLinePos;
      color = (grdArr[grdLineC].cs.backgroundColor) ? grdArr[grdLineC].cs.backgroundColor : Data.getDefaultData(type, 'backgroundColor');
      opacity = (grdArr[grdLineC].cs.backgroundColorOpacity) ? grdArr[grdLineC].cs.backgroundColorOpacity : Data.getDefaultData(type, 'backgroundColorOpacity');
      const { red, grn, blu } = hexToRgbJSN(color);
      outDataGrd += `${grtDivider}rgba(${red}, ${grn}, ${blu}, ${opacity}) ${pos}%`;
    }
    return false;
  });

  // outDataGrd = `linear-gradient(to right${outDataGrd})`;
  // -webkit-${outDataGrd} -moz-${outDataGrd} -ms-${outDataGrd} -o-${outDataGrd}

  const finOutDataGrd = {
    backgroundImage: `linear-gradient(to right${outDataGrd})`,
  };

  const GradientsPanel = (
    <div className='gradient__background'>
      <div id={`${crName}_gradient__dynamic`} className='gradient__dynamic' style={finOutDataGrd}>
        {/* data-input={`{"id":"add_grtRWDkPrc_btn","insertID":"${idToInsertColorMenu}","idToInsertColorMenu":"${idToInsertColorMenu}","slide":"${crName}","type":"${headerType}"}`} */}
      </div>
    </div>
  );

  const stopColorPicker = Object
    .keys(jsnCr)
    .map((c) => {
      if (c.substring(0, 3) === 'grt') {
        pos = (jsnCr[c].cs.grdLinePos) ? jsnCr[c].cs.grdLinePos : Data.getDefaultData(type, 'grdLinePos');
        color = (jsnCr[c].cs.backgroundColor) ? jsnCr[c].cs.backgroundColor : Data.getDefaultData(type, 'backgroundColor');
        opacity = (jsnCr[c].cs.backgroundColorOpacity) ? jsnCr[c].cs.backgroundColorOpacity : Data.getDefaultData(type, 'backgroundColorOpacity');
        const { red, grn, blu } = hexToRgbJSN(color);

        addCSSRule(`.stop_color_bg_id_${crName}_${c}`, 'backgroundColor', `rgba(${red}, ${grn}, ${blu}, ${opacity})`);

        let element: HTMLElement;
        let pEl: HTMLElement;

        let tx = 0;
        let position = 0;
        let obOffsetL = 0;
        let offsetX = 0;
        let offsetBefore = 0;
    
        const elementDrag = (dragEv: MouseEvent) => {
          tx = offsetX - dragEv.clientX;
          offsetX = dragEv.clientX;
          obOffsetL = Number(element.offsetLeft - tx);
          if (pEl && obOffsetL >= 0) {
            position = (obOffsetL * 100) / Number(pEl.clientWidth);
          }
    
          if (pEl && obOffsetL >= Number(pEl.clientWidth)) {
            position = 100;
          }
          element.style.left = `${position}%`;
    
          /* View & State Update Process */
          const state = { crName: `${crName}_${c}`, props: {grdLinePos: position.toString()} };
          State.set(state);
          CssMaker.makeCSSRules(`${crName}_${c}`, "grdLinePos", position.toString());
        }
    
        const closeDragElement = () => {
          /* stop moving when mouse button is released: */
          document.onmouseup = null;
          document.onmousemove = null;
          if (offsetBefore === offsetX) {
            onColorThumbTgl();
          }
        }
    
        const dragMouseDown = (event: any) => {
          element = event.target.parentElement;
          pEl =  event.target.parentElement.parentElement;
          // get the mouse cursor position at startup:
          offsetX = event.clientX;
          offsetBefore = offsetX;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        const onColorThumbTgl = () => {
          onToggle();
          // console.log(`${crName}_${c} collectionGradientPointsType2_m1_content`);
          // data-tgl-attrs={`{"tglID":"${idToInsertColorMenu}", "jDataDest": "collectionGradientPointsType2_m1_content", "contentID":"crVal", "slide":"${crName}_${c}"}`}>
        }

        /* <stopColorPicker /> */
        const currID = `stop_color_id_${crName}_${c}`;
        const currBgID = `stop_color_bg_id_${crName}_${c}`;
        return (
          <div title='Color stop' key={currID} id={currID} className='color-stop color-stop-num'
            onMouseDown={dragMouseDown} style={{ left: `${pos}%` }} // color="" position="96" imarker="3"
          >
            <div id={currBgID} className={`color stop_color_bg_id_${crName}_${c}`} data-stp-clrbg-slctr={currBgID}></div>
          </div>
        );
      }
      return null;
    });

  const [menuNum, setJFabMenu] = useState(false);

  const onToggle = () => setJFabMenu(jFabMenu ? false : true);

  const jFabMenu = menuNum ? <JFab crName='c10_c2_grd5000k0_grt5000k0' route='collectionGradientPointsType2_m1_content' /> : null;

  const picker = isOpen
  ?(
    <div className='color-stops color-stops-color noselect'>
      {/* id={idToInsertColorMenu} title='Click to add a color stop' */}
      {stopColorPicker}
    </div>
  )
  : null;
  return (
    <>
      {GradientsPanel}
      {picker}
      {jFabMenu}
    </>
  );
}

export default GradientPointContainers;
