import './index.scss';
import React, { useState } from "react";

import getArrSortedByPriority from '../../../../utils/getArrSortedByPriority';

import JFab from '../../../appFabrica/JFab';
import Draggable from '../draggable/Draggable';
import { addCssClass, changeCSSClasses } from '../../../../utils/css';
import DataManager from '../../../../core/dataManager';
import Container from '../../../../models/dataPackage/containerModel';

const Picker = ({hid, incomeCrJsn, crName} : {hid: string, incomeCrJsn: any, crName: string}) => {
  const ins = getArrSortedByPriority(incomeCrJsn)
    .map(([cr, crJsn]) => {
      const {cs: {type}} = crJsn as any;
      return <Item key={`h${hid}-${crName}-${cr}-${type}-main`} {...{hid, cr, crName, crJsn}} />
    });

  return (
    <>
      {ins}
    </>
  );
}

const Item = ({hid, cr, crName, crJsn}: {hid: string, cr: string, crName: string, crJsn: any}) => {
  const [apear, setApear] = useState(false);

  const onPickerItemClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const crType = Container.getCrType(`${crName}_${cr}`);

    DataManager.ob().commonMenu.content = (
      <Draggable title='Prop' onOuterCloseFn={DataManager.ob().commonMenu.onCloseFn}>
         <JFab {...{route: `${crType}_${crType}Menu_content`, crName: `${crName.replace(/-/g, '_')}_${cr}`}} />
      </Draggable>
    );
    DataManager.ob().commonMenu.onShowFn();

    changeCSSClasses('edit-mode-active');
    addCssClass(e.target, 'edit-mode-active');
    setApear(apear ? false : true);
  }

  const {cs: {type}} = crJsn;

  const cssForStdAndForm = (type === 'stdWrp' || type === 'form')
    ? 'std-section__wrapper '
    : '';

  const content = isContainer(type) ? <Picker {...{hid, incomeCrJsn: crJsn, crName: `${crName}-${cr}`}} /> : null;

  // const id = `h${hid}-${crName}-${cr}-${type}`;

  const pickerResize = apear ? <ResizableElement {...{crName: `${crName}_${cr}`}} /> : null;

  return (
    <div
      id={`h${hid}-${crName}-${cr}-${type}-main`}
      className={`${cssForStdAndForm}drgbl-elmnt ${type}h${hid} h${hid}-${crName}-${cr}-${type} notanimate edit-mode`}
      title={`h${hid}-${crName}-${cr}-${type}`}
      onClick={onPickerItemClick}
      style={{color: 'rgba(0,0,0,0)', textShadow: 'none'}}
    >
      {content}
      {pickerResize}
    </div>
  );
}

const isContainer = (type: string): boolean => ['cntnr', 'stdWrp', 'form', 'video'].includes(type);

const ResizableElement = ({crName}: {crName: string}) => {
  let resisableElement: HTMLElement | null;
  let mainResisableElement: HTMLElement | null;
  let tX = 0;
  let tY = 0;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;

  const onEdit = (e: any, direction: string): void => {
    e.stopPropagation();
    resisableElement = e.target.parentElement || null;
    let id: string = e.target.parentElement.id;

    if (direction !== 'position' && resisableElement) {
      resisableElement = resisableElement?.parentElement;
      id = e.target.parentElement.parentElement.id;
    }

    mainResisableElement = document.getElementById(id?.replace(/(-main)$/g, ''));

    if (document.defaultView && resisableElement) {
      startX = e.clientX;
      startY = e.clientY;

      startWidth = parseInt(document.defaultView.getComputedStyle(resisableElement).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(resisableElement).height, 10);
    }

    switch (direction) {
      case "position":
        document.documentElement.addEventListener('mousemove', doPositionDrag, true);
      break;
      case "bottomRight":
        document.documentElement.addEventListener('mousemove', doBottomRightDrag, true);
      break;
      case "right":
        document.documentElement.addEventListener('mousemove', doRightDrag, true);
      break;
      case "bottom":
        document.documentElement.addEventListener('mousemove', doBottomDrag, true);
      break;
      case "top":
        startHeight += 2;
        document.documentElement.addEventListener('mousemove', doTopDrag, true);
      break;
      case "topRight":
        startHeight += 2;
        document.documentElement.addEventListener('mousemove', doTopRightDrag, true);
      break;
      case "left":
        startWidth += 2;
        document.documentElement.addEventListener('mousemove', doLeftDrag, true);
      break;
      case "topLeft":
        startHeight += 2;
        startWidth += 2;
        document.documentElement.addEventListener('mousemove', doTopLeftDrag, true);
      break;
      case "bottomLeft":
        startHeight += 2;
        startWidth += 2;
        document.documentElement.addEventListener('mousemove', doBotomLeftDrag, true);
      break;
    }
    document.documentElement.addEventListener('mouseup', stopDrag, true);
  }

  const doPositionDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      // e.preventDefault();
      tX = startX - e.clientX;
      tY = startY - e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      resisableElement.style.left = `${resisableElement.offsetLeft - tX}px`;
      resisableElement.style.top = `${resisableElement.offsetTop - tY}px`;

      mainResisableElement.style.left = `${mainResisableElement.offsetLeft - tX}px`;
      mainResisableElement.style.top = `${mainResisableElement.offsetTop - tY}px`;
    }
  }

  const doBottomRightDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      resisableElement.style.width = (startWidth + e.clientX - startX) + 'px';
      resisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
      mainResisableElement.style.width = (startWidth + e.clientX - startX) + 'px';
      mainResisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
    }
  }

  const doRightDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      resisableElement.style.width = (startWidth + e.clientX - startX) + 'px';
      mainResisableElement.style.width = (startWidth + e.clientX - startX) + 'px';
    }
  }

  const doTopDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      startHeight = startHeight - e.clientY + startY;
      startY = e.clientY;
      resisableElement.style.height = startHeight + 'px';
      resisableElement.style.top = startY + 'px';
      mainResisableElement.style.height = startHeight + 'px';
      mainResisableElement.style.top = startY + 'px';
    }
  }

  const doTopRightDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      startHeight = startHeight - e.clientY + startY;
      startY = e.clientY;
      resisableElement.style.height = startHeight + 'px';
      resisableElement.style.top = startY + 'px';

      resisableElement.style.width = (startWidth + e.clientX - startX) + 'px';

      mainResisableElement.style.height = startHeight + 'px';
      mainResisableElement.style.top = startY + 'px';

      mainResisableElement.style.width = (startWidth + e.clientX - startX) + 'px';
    }
  }

  const doBottomDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      resisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
      resisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
      mainResisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
      mainResisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
    }
  }

  const doLeftDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      startWidth = startWidth - (e.clientX - startX);
      startX = e.clientX;
      resisableElement.style.width = startWidth + 'px';
      resisableElement.style.left = startX + 'px';
      mainResisableElement.style.width = startWidth + 'px';
      mainResisableElement.style.left = startX + 'px';
    }
  }

  const doTopLeftDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      startHeight = startHeight - e.clientY + startY;
      startY = e.clientY;
      resisableElement.style.height = startHeight + 'px';
      resisableElement.style.top = startY + 'px';
      mainResisableElement.style.height = startHeight + 'px';
      mainResisableElement.style.top = startY + 'px';

      startWidth = startWidth - (e.clientX - startX);
      startX = e.clientX;
      resisableElement.style.width = startWidth + 'px';
      resisableElement.style.left = startX + 'px';
      mainResisableElement.style.width = startWidth + 'px';
      mainResisableElement.style.left = startX + 'px';
    }
  }

  const doBotomLeftDrag = (e: any) => {
    if (resisableElement && mainResisableElement) {
      startWidth = startWidth - (e.clientX - startX);
      startX = e.clientX;
      resisableElement.style.width = startWidth + 'px';
      resisableElement.style.left = startX + 'px';

      resisableElement.style.height = (startHeight + e.clientY - startY) + 'px';

      mainResisableElement.style.width = startWidth + 'px';
      mainResisableElement.style.left = startX + 'px';

      mainResisableElement.style.height = (startHeight + e.clientY - startY) + 'px';
    }
  }

  const stopDrag = () => {
    document.documentElement.removeEventListener('mousemove', doPositionDrag, true);
    document.documentElement.removeEventListener('mousemove', doBottomRightDrag, true);
    document.documentElement.removeEventListener('mousemove', doRightDrag, true);
    document.documentElement.removeEventListener('mousemove', doBottomDrag, true);
    document.documentElement.removeEventListener('mousemove', doTopDrag, true);
    document.documentElement.removeEventListener('mousemove', doTopRightDrag, true);
    document.documentElement.removeEventListener('mousemove', doLeftDrag, true);
    document.documentElement.removeEventListener('mousemove', doTopLeftDrag, true);
    document.documentElement.removeEventListener('mousemove', doBotomLeftDrag, true);
    document.documentElement.removeEventListener('mouseup', stopDrag, true);
  }

  const topLeftPicker = { top: "-4px", left: "-4px", cursor: "nwse-resize" };
  const topMiddlePicker = { top: "-4px", left: 'calc(50% - 2px)', cursor: "row-resize" };
  const leftMiddlePicker = { top: 'calc(50% - 2px)', left: "-4px", cursor: "col-resize" };
  const rightMiddlePicker = { top: 'calc(50% - 2px)', right: "-4px", cursor: "col-resize" };
  const topRightPicker = { top: "-4px", right: "-4px", cursor: "nesw-resize" };
  const bottomLeftPicker = { bottom: "-4px", left: "-4px", cursor: "nesw-resize" };
  const bottomMiddlePicker = { bottom: "-4px", left: 'calc(50% - 2px)', cursor: "row-resize" };
  const bottomRightPicker = { bottom: "-4px", right: "-4px", cursor: "nwse-resize" }; //  as React.CSSProperties;

  return (
    <div id='position-container' style={{width: "100%", height: "100%"}} onMouseDown={(e: any) => onEdit(e, 'position')}>
      <div className='picker' style={topLeftPicker} onMouseDown={(e: any) => onEdit(e, 'topLeft')}></div>
      <div className='picker' style={topMiddlePicker} onMouseDown={(e: any) => onEdit(e, 'top')}></div>
      <div className='picker' style={leftMiddlePicker} onMouseDown={(e: any) => onEdit(e, 'left')}></div>
      <div className='picker' style={rightMiddlePicker} onMouseDown={(e: any) => onEdit(e, 'right')}></div>
      <div className='picker' style={topRightPicker} onMouseDown={(e: any) => onEdit(e, 'topRight')}></div>
      <div className='picker' style={bottomLeftPicker} onMouseDown={(e: any) => onEdit(e, 'bottomLeft')}></div>
      <div className='picker' style={bottomMiddlePicker} onMouseDown={(e: any) => onEdit(e, 'bottom')}></div>
      <div className='picker' style={bottomRightPicker} onMouseDown={(e: any) => onEdit(e, 'bottomRight')}></div>
    </div>
  );
}

export default Picker;
