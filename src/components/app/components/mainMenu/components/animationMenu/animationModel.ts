import { changeCSSClasses } from '../../../../../../utils/css';
import Data from '../../../../../../models/dataPackage/dataModel';
import { getClassRule, getCustomClassRule } from '../../../../../../models/styleSheetPackage/styleSheetModel';

const Animation = {
  intervalMSec: 0,

  animationPlayState: 'stopped',

  timerID: 0,

  timerResult: 0,

  getAnimationPlayState: (): string => {
    return Animation.animationPlayState;
  },

  pause: (): void => {
    Animation.animationPlayState = 'paused';
  },

  running: (): void => {
    Animation.animationPlayState = 'running';
  },

  stop: (): void => {
    Animation.animationPlayState = 'stopped';
  },

  getTimerID: (): number => {
    return Animation.timerID;
  },

  setTimerID: (id: number): void => {
    if (id === undefined) {
      throw new Error('timerID: nothing was passed');
    }
    Animation.timerID = id;
  },

  clearTimerID: (): void => {
    Animation.timerID = 0;
  },

  setTimerResult: (timerResult: number): void => {
    if (timerResult === undefined) {
      throw new Error('timerResult: nothing was passed');
    }
    Animation.timerResult = timerResult;
  },

  getTimerResult: (): number => {
    return Animation.timerResult;
  },

  getInterval: (ret = 'mSec'): number => {
    const jsn = Data.getJsn();
    const intervalSec = Data.getData(jsn, 'hdr', 'timeout', 'hdr');
    switch (ret) {
      case 'mSec':
        return (Number(intervalSec) * 1000);
      default:
        return parseFloat(intervalSec);
    }
  },

  startAnimation: () => {
    clearInterval(Animation.getTimerID());
    Animation.startSecTimer();
    let cssObj: any;
    let cssClassName;
    const ob = document.getElementsByClassName('change-point');

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssClassName = ob[i].id;
      cssObj = getClassRule(`.${cssClassName}.animated`);
      if (cssObj) {
        cssObj.style.animationPlayState = 'running';
      }
    }

    cssObj = getCustomClassRule('.time-line-cursor');
    cssObj.style.left = '100%';
    cssObj = getCustomClassRule('.time-line-cursor.animated');
    cssObj.style.animationPlayState = 'running';
    Animation.running();
  },

  /**
  *  ╭───────────────────────────────────────────────────────────────╮
  *  │                                                               │
  *  │                                                               │
  *  │        P R I V A T E  A N I M A T I O N   M O D E L           │
  *  │                                                               │
  *  │                                                               │
  *  ╰───────────────────────────────────────────────────────────────╯
  */

  startSecTimer: (): void => {
    let total = 0;

    const shift = Animation.getTimerResult();
    const intervalMSec = Animation.getInterval();
    const start = Date.now();
    const obResult = document.getElementById('time') as HTMLInputElement;

    const timerID = setInterval(() => {
      total = Date.now() - start + shift;
      if (total >= intervalMSec) {
        obResult.value = (total / 1000).toString();
        Animation.setTimerResult(total);
        clearInterval(timerID);
        Animation.clearTimerID();
        Animation.endAnimation();
      } else {
        obResult.value = (total / 1000).toString();
      }
    }, 1);

    Animation.setTimerID(Number(timerID));
  },

  appointOriginalAnimationPlayState: (spot = 'change-point'): void => {
    const ob = document.getElementsByClassName(spot);
    let cssObj: any;
    let cssClassName;

    for (let i = 0, l = ob.length; i < l; i += 1) {
      cssClassName = ob[i].id;
      cssObj = getClassRule(`.${cssClassName}.animated`);
      if (cssObj) {
        cssObj.style.animationPlayState = 'running';
        cssObj.style.animationDelay = '0s';
      }
    }
    cssObj = getCustomClassRule('.time-line-cursor.animated');
    cssObj.style.animationPlayState = 'running';
    cssObj.style.animationDelay = '0s';

    if (Animation.getAnimationPlayState() !== 'paused') {
      cssObj = getCustomClassRule('.time-line-cursor');
      cssObj.style.left = '100%';
    }
  },

  endAnimation: () => {
    const playSlideBtn = document.getElementById('play-slide');

    if (playSlideBtn) {
      playSlideBtn.setAttribute('data-play', 'play_slide_btn');
    }

    changeCSSClasses('stop-slide', 'play-slide');
    Animation.appointOriginalAnimationPlayState('change-point');
    Animation.setTimerResult(0);
    changeCSSClasses('animated', 'animate');

    Animation.stop();
  }
}

const pauseAnimation = () => {
  const ob = document.getElementsByClassName('change-point');
  let cssObj: any;

  clearInterval(Animation.getTimerID());
  const time = document.getElementById('time') as HTMLInputElement;
  Animation.setTimerResult(Number(time.value) * 1000);

  for (let i = 0, l = ob.length; i < l; i += 1) {
    cssObj = getClassRule(`.${ob[i].id}.animated`);

    if (cssObj) {
      cssObj.style.animationPlayState = 'paused';
    }
  }

  cssObj = getCustomClassRule('.time-line-cursor.animated');
  cssObj.style.animationPlayState = 'paused';

  Animation.pause();
}

const setPausePlayState = (id: string, state: string): void => {
  const playSlideBtn = document.getElementById(id);
  switch (state) {
    case 'play_slide_btn':
      changeCSSClasses('animate', 'animated');
      Animation.startAnimation();
      changeCSSClasses('play-slide', 'stop-slide');
      if (playSlideBtn) {
        playSlideBtn.setAttribute('data-play', 'paused_slide_btn');
      }
      break;
    case 'paused_slide_btn':
      pauseAnimation();
      changeCSSClasses('stop-slide', 'play-slide');
      if (playSlideBtn) {
        playSlideBtn.setAttribute('data-play', 'play_slide_btn');
      }
      break;
    default: break;
  }
}
export default Animation;
