import './index.scss';
import React from 'react';
import DataManager from '../../core/dataManager';

const DialogBox = (props: { okBtnTitle?: string, skipBtnTitle?: string, message: string, callback: () => void }) => {
  const { okBtnTitle = 'ok', skipBtnTitle = 'skip', message, callback } = props;

  const remDialogBox = (): void => {
    DataManager.ob().alertMenu.onCloseFn();
  }

  const confirm = (): void => {
    DataManager.ob().alertMenu.onCloseFn();
    callback();
  }

  return (
    <div id='DialogBox' className='dialog-window' title='f' style={{background: 'white', padding: '10px', borderRadius: '5px'}}>
      { message }
      <div className='button-container'>
        <div className='confirm-button' onClick={confirm}>
          { okBtnTitle }
        </div>
        <div className='confirm-button' onClick={remDialogBox}>
          { skipBtnTitle }
        </div>
      </div>
    </div>
  );
}

export default DialogBox;
