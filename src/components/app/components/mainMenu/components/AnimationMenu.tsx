import React, { useState } from "react";
import DataManager from "../../../../../core/dataManager";
import RootContainerSortModel from "./animationMenu/rootContainerSortModel";
import Model from "../../../../../models/model";
import Strings from "../../../../../sets/lang/strings";
import { changeCSSClasses } from "../../../../../utils/css";
import State from "../../../../../utils/state";
import JFab from "../../../../appFabrica/JFab";
import Draggable from "../../draggable/Draggable";

const AnimationMenu = ({crName} : { crName: string }) => {
  const onClose = () => {
    DataManager.ob().anmationMenu.onCloseFn();
  }

  const onStart = () => {
    /* data-play='play_slide_btn' */
    changeCSSClasses('animate', 'animated');
    Model.ob().animation.startAnimation();
    changeCSSClasses('play-slide', 'stop-slide');
  }

  const onStop = () => {
    // changeCSSClasses('animate', 'animated');
    // Model.ob().animation.startAnimation();
    // changeCSSClasses('stop-slide', 'play-slide');
  }

  const isPaying = false;

  const playStopSlideBtn = isPaying
    ? <div id='play-slide' className='stop-slide' title='play' onClick={onStop}></div>
    : <div id='play-slide' className='play-slide' title='play' onClick={onStart}></div>;

  return (
    <>
      <div className="clr-menu clr-menu-timeline" onClick={onClose}>x</div>
      <div id='animationPannel' className='anim-nav-panel'>
        <div id='toStrtBtn' className='toStrtBtn' title='to the Start'></div>
        {playStopSlideBtn}
        <div id='toEndBtn' className='toEndBtn' title='to the End'></div>
        <input id='time' className='time' type='number' step='0.001' min='0'
          value={Model.ob().animation.getInterval('sec')} readOnly />
        <div className='time-sec'>{Strings.id('sec')}</div>
      </div>
      <TimeLineBrush />
      <TimeLines crName={crName} />
    </>
  )
}

const TimeLineBrush = () => {
  // const timeVal = '10'; //(document.getElementById('time') as HTMLInputElement).value;
  // const intervalMSec = Model.ob().animation.getInterval();
  // const obResult = parseFloat(timeVal) * 1000;
  // const percent = (100 * obResult) / intervalMSec;

  // let cssObj = Model.ob().styleSheetMdl.getCustomClassRule('.time-line-cursor.animated');

  // if (parseFloat(timeVal) >= (intervalMSec / 1000)) {
  //   cssObj.style.animationDelay = '0s';
  // } else {
  //   cssObj.style.animationDelay = `-${timeVal}s`;
  // }
  // cssObj = Model.ob().styleSheetMdl.getCustomClassRule('.time-line-cursor');

  // if (Model.ob().animation.getAnimationPlayState() === 'running') {
  //   cssObj.style.animationPlayState = 'running';
  //   changeCSSClass('time-line-cursor', 'animate', 'animated');
  // } else {
  //   cssObj.style.left = `${percent}%`;
  // }

  // cssObj = Model.ob().styleSheetMdl.getCustomClassRule('.next-slide-trigger');
  // const rootCrName = Model.ob().cssMaker.getRootCrName(crName);
  // /*
  // *  100 - 100% - full anim time (%)
  // * 10 - 10s  - full anim time (sec)
  // */
  // const nextSlideTriggerTime = (Number(Model.ob().data.getDataShort(rootCrName, 'animationDuration')) * 100) / 10;
  // cssObj.style.left = `${nextSlideTriggerTime}%`;

  // // Model.ob().animation.dragAnimationCursor.init(intervalMSec);

  Model.ob().animation.intervalMSec = Model.ob().animation.getInterval(); // intervalMSec; // 1000

  let el: any, pEl: any, cssObjA: any, ob: any;
  let pos1 = 0;
  let tPos = 0;
  let cPos = 0;
  let pos3 = 0;
  let obResult;
  let cssClassName;
  let computed;
  let duration;
  let cssObjB;

  const cursorOn = (event: MouseEvent) => {
    // calculate a new cursor position:
    if (pEl && Model.ob().animation.getAnimationPlayState() === 'paused') {
      computed = pEl.getBoundingClientRect();
      cPos = event.clientX - computed.left;
    } else {
      pos1 = pos3 - event.clientX;
      pos3 = event.clientX;
      cPos = el ? el.offsetLeft - pos1 : cPos;
    }

    if (pEl && cPos >= 0) {
      tPos = (cPos * 100) / pEl.clientWidth;
      tPos = (tPos * 1000) / 1000;
    }
    if (pEl && cPos >= pEl.clientWidth) {
      tPos = 100;
    }

    obResult = (tPos * Model.ob().animation.intervalMSec) / 100;
    Model.ob().animation.setTimerResult(obResult);
    obResult /= 1000;

    (document.getElementById('time') as HTMLInputElement).value = obResult.toString();

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssClassName = ob[i].id;
      cssObjB = Model.ob().styleSheetMdl.getClassRule(`.${cssClassName}.animated`);
      if (cssObjB) {
        cssObjB.style.animationPlayState = 'paused';
        duration = cssObjB.style.animationDuration;
        duration = parseFloat(duration.replace('s', ''));
        if (duration > obResult) {
          cssObjB.style.animationDelay = `-${obResult}s`;
        } else {
          cssObjB.style.animationDelay = `-${duration}s`;
        }
      }
    }

    cssObjA.style.animationPlayState = 'paused';
    cssObjA.style.animationDelay = `-${obResult}s`;
    changeCSSClasses('animate', 'animated');
  }

  const elementDrag = (event: MouseEvent) => {
    event.preventDefault();
    cursorOn(event);
    Model.ob().animation.stop();
  }

  const closeDragElement = () => {
    /* stop moving when a mouse button is released: */
    document.onmouseup = null;
    document.onmousemove = null;
  }

  const dragMouseDown = (event: any) => {
    event.preventDefault();
    /* init */
    el = event.target;
    pEl = el ? el.parentElement : null;
    ob = document.getElementsByClassName('change-point');
    cssObjA = Model.ob().styleSheetMdl.getCustomClassRule('.time-line-cursor.animated');

    pos3 = event.clientX;
    if (cssObjA.style.left !== '100%') {
      cssObjA.style.left = '100%';
    }
    if (Model.ob().animation.getAnimationPlayState() === 'paused') {
      changeCSSClasses('animated', 'animate');
      cursorOn(event);
    }
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  return (
    <div className="time-line">
      <div className="time-line__items">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span className="last">100%</span>
      </div>

      <div id="time-line__brush" className="time-line__brush">
        <div id="time-line-cursor" onMouseDown={dragMouseDown} className="change-point time-line-cursor animate" title="Animation Cursor"></div>
        <div id="next-slide-trigger" className="next-slide-trigger" title="Next Slide Trigger" style={{left: '90%'}}></div>
        <div className="time-line__brush-item item-0-percent"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item item-25-percent"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item item-50-percent"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item item-75-percent"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item"></div>
        <div className="time-line__brush-item last"></div>
      </div>
    </div>
  );
}

const TimeLines = ({crName} : { crName: string }) => {
  const jsnASC = RootContainerSortModel.getRootJsnAscByPriority(
    Model.ob().container.getCrsJSN(crName),
  );

  const validCrN = { cs: false, rwd: true, akf: true, grt: true, grd: true, };

  const crsArr = Object
    .keys(jsnASC)
    .map((entity, indx) => {
      if (!(Model.ob().container.getCrNameWithoutNum(entity) in validCrN)) {
        const crType = Model.ob().container.getCrType(`${crName}_${entity}`); // the slide here is like an oldPriorityPrf and sent like a subCr
        if (crType === 'cntnr') {
          return <TimelineContainers key={`${indx}`} crName={`${crName}_${entity}`} />
        }
        return <TimelineContainers key={`${indx}`} crName={`${crName}_${entity}`} subCrName={crName} /> // JComponent({ container: 'subCrItems', crName: `${crName}_${entity}`, subCr: crName });
      }
      return null;
    });

  return (
    <>
      {crsArr}
    </>
  );
}

const TimelineContainers = ({crName, subCrName}: { crName: string, subCrName?: string }) => {
  const [upd, setUpdate] = useState({updateTimes: 1});
  const updateRows = () => {
    setUpdate({updateTimes: upd.updateTimes + 1});
  }

  const Thumbnail = subCrName
    ? null
    : <img className="thumbnail" src={Model.ob().data.getData(Model.ob().data.getJsn(), crName, 'backgroundImage', 'getIMG')} />

  const descriptionContent = subCrName ? 'Item' : Strings.id('Layer');
  const itemClass = subCrName ? ' description-item' : '';

  return (
    <div className='timeline-animation-chain-cr'>
      <div className='cr-menu'>
        {Thumbnail}
        <div className={`description${itemClass}`}>
          {descriptionContent}
        </div>
        <div className='time-line__keyframes'>
          {getAkfRowArray(crName, updateRows)}
        </div>
      </div>
    </div>
  );
}

const setAkfRowRule = (crName: string, position: string, elPercentWidth: string): void => {
  Model.ob().styleSheetMdl.addCSSRule(`.${crName}-time-line__keyframe__${position}`, 'elWidth', elPercentWidth);
}

const getAkfRowArray = (crName: string, updateRows: () => void): Array<any> => {
  const jsn = Model.ob().data.getJsn();
  const timeout = Model.ob().animation.getInterval('sec');
  const crJSN = Model.ob().container.getCrsJSN(crName, jsn);
  const animationDuration = Model.ob().data.getDataShort(crName, 'animationDuration');
  const keyframeRowArray: Array<any> = [];
  let tLinePosA: any = [];
  let position: number;

  Object
    .keys(crJSN)
    .some((c) => {
      if (c.substring(0, 3) === 'akf') {
        tLinePosA.push(c);
      }
      return false;
    });

  /* Should to be get refactored */
  const getSortedTLinePosA = (inTLine: object, crJSN: any): any => {
    let hold = [];
    const tLine: any = inTLine;
    let curPosition;
    let nextPosition;

    Object
      .keys(tLine)
      .some(() => {
        for (let i = 0, l = tLine.length; i < l - 1; i += 1) {
          curPosition = Number(crJSN[tLine[i]].cs.akfTimelinePos);
          nextPosition = Number(crJSN[tLine[i + 1]].cs.akfTimelinePos);
          if (curPosition > nextPosition) {
            hold = tLine[i];
            tLine[i] = tLine[i + 1];
            tLine[i + 1] = hold;
          }
        }
        return false;
      });

    return tLine;
  }

  tLinePosA = getSortedTLinePosA(tLinePosA, crJSN);

  const keyframesAmount = tLinePosA.length - 1;

  Object
    .keys(tLinePosA)
    .some((pos) => {
      position = Number(pos);
      keyframeRowArray.push(
        <AkfRow key={`key_${crName}_${tLinePosA[position]}`}
          {...{ crName, updateRows, position, keyframesAmount, animationDuration: Number(animationDuration), timeout, tLinePosA, crJSN }}
        />
      );
      return false;
    });

  return keyframeRowArray;
}

type TAkfRow = {
  crName: string,
  updateRows: () => void,
  position: number,
  keyframesAmount: number,
  animationDuration: number,
  timeout: number,
  tLinePosA: any,
  crJSN: any
}

const AkfRow = ({crName, updateRows, position = 0, keyframesAmount = 0,
  animationDuration = 0, timeout = 0, tLinePosA, crJSN}: TAkfRow) => {
  let cssClassPost = '';
  let timePercentPosition = 0;


  const isAnimationGaps = (tLinePos: any, pos: number, crJSN: any): boolean => {
    const prop = ['opacity', 'translateY', 'translateX', 'translateZ', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scaleX', 'scaleY', 'elHeight', 'elWidth'];
    let flag = true;
    let curProperty;
    let nextProperty;
    Object
      .keys(prop)
      .some((c: any) => {
        curProperty = crJSN[tLinePos[pos]].cs[prop[c]];
        nextProperty = crJSN[tLinePos[Number(pos) + 1]].cs[prop[c]];
        flag = curProperty === nextProperty;
        if (!flag) {
          return true;
        }
        return false;
      });
    return flag;
  }

  if (position === 0 && position !== keyframesAmount) {
    cssClassPost = keyframesAmount !== 0 && isAnimationGaps(tLinePosA, position, crJSN) ? ' delay' : ' key';
    timePercentPosition = keyframesAmount === 0
      ? 100
      : crJSN[tLinePosA[(position + 1)]].cs.akfTimelinePos;
  }

  if (position !== keyframesAmount && position > 0) {
    cssClassPost = isAnimationGaps(tLinePosA, position, crJSN) ? ' delay' : ' key';
    const currPosition = crJSN[tLinePosA[position]].cs.akfTimelinePos;
    const nextPosition = crJSN[tLinePosA[position + 1]].cs.akfTimelinePos;
    timePercentPosition = nextPosition - currPosition;
  }

  if (position === keyframesAmount) {
    cssClassPost = ' key';
    timePercentPosition = 100 - crJSN[tLinePosA[position]].cs.akfTimelinePos;
  }

  const elPercentWidth = (animationDuration * timePercentPosition) / timeout;
  const sec = Math.round(((timeout * elPercentWidth) / 100) * 1000) / 1000;
  setAkfRowRule(crName, position.toString(), `${elPercentWidth}%`);

  const onClick = () => {
    DataManager.ob().contextMenu.content = (
      <Draggable title='A' onOuterCloseFn={DataManager.ob().contextMenu.onCloseFn}>
        <JFab {...{route: `collectionAnimation_menuElementStyleEntranceAnimation_content`, crName: `${crName}_${tLinePosA[position]}`}} />
      </Draggable>
    );
    DataManager.ob().contextMenu.onShowFn();
  }

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    /* -----Add------ */
    const onAdd = () => {
      DataManager.ob().contextMenu.onCloseFn();
      const newCrName = Model.ob().container.getNewCrNameS(crName, 'akf');
      if (!newCrName) {
        throw new Error('newCrName: undefined');
      }
      const newPosition = Model.ob().styleSheetMdl.addKeyframe(crName, newCrName);
      Model.ob().container.mkCrAkf(crName, newCrName, newPosition);
      updateRows();
    }

    const onRem = () => {
      DataManager.ob().contextMenu.onCloseFn();

      const remKeyFrame = (cName: string, akfCrName: string): string => {
        Model.ob().styleSheetMdl.remKeyframeRule(`${cName}_${tLinePosA[position]}`);
        let animationDurationNew = 0;

        if (akfCrName.substring(0, 3) === 'akf') {
          const crJSN = Model.ob().container.getCrsJSN(cName);
          const percent = parseFloat(crJSN[akfCrName].cs.akfTimelinePos);

          /* get the closest val to the shift */
          const prevPercent = Object
            .entries(crJSN)
            .reduce((prevPercent: number, [key, value]): number => {
              if (key !== akfCrName && key.substring(0, 3) === 'akf') {
                const {cs: {akfTimelinePos: currPercentValue}} = value as {cs: {akfTimelinePos: string}};
                if (prevPercent > parseFloat(currPercentValue) && parseFloat(currPercentValue) > percent) {
                  return parseFloat(currPercentValue);
                }
              }
              return prevPercent;
            }, 100);
          /** shift the animation duration val */
          const percentShift = prevPercent - percent;
          const animationDuration = parseFloat(Model.ob().data.getDataShort(cName, 'animationDuration'));
          animationDurationNew = animationDuration - ((percentShift * animationDuration) / 100);
          animationDurationNew = Math.round(animationDurationNew * 1000) / 1000;

          State.set({ crName: cName, valType: 'animationDuration', value: animationDurationNew.toString() });

          /** shift akfTimelinePos values */
          let tLinePosSec: number;
          let tLinePosPrcNew: number; Object
          .entries(crJSN)
          .forEach(([key, value]) => {
            if (key !== akfCrName && key.substring(0, 3) === 'akf') {
              const {cs: {akfTimelinePos: tLinePosPrc}} = value as {cs: {akfTimelinePos: string}};
              let prc = parseFloat(tLinePosPrc);
              if (prc > percent) {
                prc -= percentShift;
              }
              tLinePosSec = (animationDuration * prc) / 100; /* get Sec */
              tLinePosPrcNew = (tLinePosSec * 100) / animationDurationNew; /* get new percent */
              tLinePosPrcNew = Math.round(tLinePosPrcNew * 1000) / 1000;
              State.set({ crName: `${cName}_${key}`, valType: 'akfTimelinePos', value: tLinePosPrcNew.toString() });
            }
          });
        }
        Model.ob().container.remCr(`${cName}_${akfCrName}`);
        return animationDurationNew.toString();
      }
      const value = remKeyFrame(crName, tLinePosA[position]);
      Model.ob().cssMaker.makeCSSRules(`${crName}_${tLinePosA[position]}`, 'remKeyframe', value);
      updateRows();
    }

    DataManager.ob().contextMenu.content = (
      <div className="context-keyframe-row-menu menu-absolute-pos" style={{top: `${e.clientY - 15}px`, left:`${Number(e.clientX)}px`}}>
        {/* <ContextKeyframeRowMenu /> */}
        <div className="conttext-item" onClick={() => {DataManager.ob().contextMenu.onCloseFn()}}>cancel</div>
        <div className="conttext-item" onClick={onAdd}>add</div>
        <div className="conttext-item" onClick={onRem}>rem</div>
      </div>
    );
    DataManager.ob().contextMenu.onShowFn();
  }

  // <KeyframeRow />
  return (
    <div className={`${crName}-time-line__keyframe__${position} time-line__keyframes-item${cssClassPost}`}
      onClick={onClick} onContextMenu={onContextMenu}
    >
      {`${sec}s`}
      <div className="spread-drug-cursor"
        style={{ display: 'block', position: 'absolute', right: '0', top: '4px', width: '2px', height: '3px', backgroundColor: 'white', cursor: 'col-resize' }}
      ></div>
    </div>
  );
}

export default AnimationMenu;

