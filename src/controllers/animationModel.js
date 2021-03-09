class AnimationModel {
  constructor(mdl) {
    this.animationPlayState = '';
    this.mdl = mdl;
  }

  pause() {
    this.animationPlayState = 'paused';
  }

  running() {
    this.animationPlayState = 'running';
  }

  stop(selector = 'time-line-cursor', percent) {
    let cssObj = this.mdl.getCstmClassRule(`.${selector}.animated`);
    cssObj.style.animationDelay = `-${document.getElementById('time').value}s`;
    cssObj = this.mdl.getCstmClassRule(`.${selector}`);
    cssObj.style.left = `${percent}%`;
  }
}

export default AnimationModel;
