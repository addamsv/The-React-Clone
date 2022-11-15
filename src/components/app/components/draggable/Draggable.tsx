import React, { useState } from "react";

const Draggable = ({title, positionStyle, onOuterCloseFn, children}: {title?: string, onOuterCloseFn?: () => void, positionStyle?: any, children?: React.ReactNode}) => {
  const [isApeared, setAppearance] = useState(true);

  const onClose = () => {
    if (onOuterCloseFn) {
      onOuterCloseFn();
    }
    setAppearance(false);
  }

  if (! isApeared) {
    return null;
  }

  return (
    <div className="menu-absolute-pos" style={positionStyle}>
      <DraggableHeader title={title} onClose={onClose}/>
      {children}
    </div>
  );
}

const DraggableHeader = (props: {onClose?: () => void, title?: string, className?: string, style?: any, closeBtn?: boolean}) => {
  const { onClose, title = '', className, style, closeBtn = true } = props;

  let tx = 0;
  let ty = 0;
  let offsetX = 0;
  let offsetY = 0;

  let ob: HTMLElement | null = null;

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }

  const elementTouchDrag = (e: TouchEvent) => {
    tx = e.targetTouches[0].pageX - offsetX;
    ty = e.targetTouches[0].pageY - offsetY;
    if (ob) {
      ob.style.left = `${tx}px`;
      ob.style.top = `${ty}px`;
    }
  }

  const elementDrag = (e: MouseEvent) => {
    tx = offsetX - e.clientX;
    ty = offsetY - e.clientY;
    offsetX = e.clientX;
    offsetY = e.clientY;
    if (ob) {
      ob.style.top = `${ob.offsetTop - ty}px`;
      ob.style.left = `${ob.offsetLeft - tx}px`;
    }
  }

  const dragTouchstart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    ob = target ? target.parentElement : null;
    if (ob) {
      offsetX = e.targetTouches[0].pageX - ob.offsetLeft;
      offsetY = e.targetTouches[0].pageY - ob.offsetTop;
    }
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementTouchDrag;
  }

  const dragMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    ob = target ? target.parentElement : null;
    offsetX = e.clientX;
    offsetY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  const closeBtnComponent = closeBtn ? <CloseDraggableHeaderBtn onClose={onClose} /> : null;

  const cClass = className ? ` ${className}` : '';

  return (
    <div className={`menu-absolute-pos-header${cClass}`} style={style} onMouseDown={dragMouseDown} onTouchStart={dragTouchstart}>
      {closeBtnComponent}
      {title}
    </div>
  );
}

const CloseDraggableHeaderBtn = ({onClose}: {onClose?: () => void}) => {
  const onCloseEv = () => {
    if(onClose) {
      onClose();
    }
  }
  return <div className='clr-menu' onClick={onCloseEv}>x</div>
}

export { DraggableHeader };
export default Draggable;
