import React from "react";
// import ReactDOM from 'react-dom/client';
import DataManager from "../../../../core/dataManager";
import ID from "../../../../core/id";
import Container from "../../../../models/dataPackage/containerModel";
import Data from "../../../../models/dataPackage/dataModel";
import { saveAllHeaderObj } from "../../../../models/dbModel";
import Model from "../../../../models/model";
import Strings from '../../../../sets/lang/strings';
import CollectionLayers from "../../../collectionLayers/collectionLayers";
import MenuFile from "../../../menuFile/menuFile";
import Draggable, { DraggableHeader } from "../draggable/Draggable";
import AnimationMenu from "./components/AnimationMenu";
import SlidesMenu from "./components/SlidesMenu";

const MainMenu = () => {
  const crName =  Container.getFirstCrName();
  return (
    <div className='cstmzblocks-upper-menu'>
      <DraggableHeader style={{ position: 'absolute' }} closeBtn={false} />
      <MenuFileBtn />
      <MenuRWDBtn />
      <MenuScaleBtn />
      <MenuLayersButton crName={crName} />
      <MenuAnimationBtn crName={crName} />
      <UndoBtn />
      <SaveBtn />
      <SlidesMenu />
      {/* <div style={{background: '#00e'}}>
        <img src="/assets/img/MenuIcon.svg" alt="" height="20px" />
        <span>T</span>
      </div> */}
    </div>
  );
}

const MenuMode = (props: {menuMode: any} ) => {
  const { menuMode } = props;

  const dataInputEv = (id: string, rwdMode = '') => {
    console.log(id, rwdMode); // 'dataInputEv' { detail: { id, rwdMode } },
  }

  return (
    <>
      {...Object.keys(menuMode)
       .map((keyA: any) => {
        const text = ((menuMode[keyA].width === Model.ob().set.rwdDflt) ? Strings.id('Common') : `>${menuMode[keyA].width}${Strings.id('px')}`);

        return (
          <div key={`key_${ID.new()}`} title={menuMode[keyA].name} className='dark-stl'
            onClick={() => dataInputEv('set_rwdMode_btn', menuMode[keyA].width)}
          >
            {text}
          </div>
        )
      })}
      <div className='dark-stl' onClick={() => dataInputEv('add_rwdMode_btn')}>+</div>
    </>
  );
}

const MenuRWDBtn = () => {
  const onRwdMenu = () => {
    const hash = Model.ob().set.rwd;

    const altRWDArray =  Data.getJsn().hdr.altRWD;

    if (altRWDArray) {
      altRWDArray.some((propss: { resolution: string, description: string }, indx: number) => {
        hash[indx] = [];
        hash[indx].name = propss.description;
        hash[indx].width = propss.resolution;
        hash[indx].descr = 'custom mode';
        return false;
      });
    }

    const menuMode = Data.getSortedDefaultRwdModeArrayByWidth(hash);

    DataManager.ob().commonMenu.content = (
      <Draggable title='Scale' onOuterCloseFn={DataManager.ob().commonMenu.onCloseFn}>
        <MenuMode menuMode={menuMode} />
      </Draggable>
    );
    DataManager.ob().commonMenu.onShowFn();
  }

  return (
    <div title='Styles Breakpoint (RWD)' className='dark-stl dstl-inline' onClick={onRwdMenu}>
      {Strings.id('RWD')}
    </div>
  );
}

const MenuScale = () => {
  const scaleMenu = Object.entries(Model.ob().set.scale);

  return (
    <>
      {scaleMenu.map(([scaleProp]: [string, unknown]) => {
        const dataInputEv = () => {
          console.log('dataInputEv { detail: { id: set_scale_btn', scaleProp);
        }

        return (
          <div key={`key_${ID.new()}`} className='dark-stl' onClick={dataInputEv}>
            {`${scaleProp}%`}
          </div>
        )})
      }
    </>
  );
}

const MenuScaleBtn = () => {
  const onScaleMenu = () => {
    DataManager.ob().commonMenu.content = (
      <Draggable title='Scale' onOuterCloseFn={DataManager.ob().commonMenu.onCloseFn}>
        <MenuScale />
      </Draggable>
    );
    DataManager.ob().commonMenu.onShowFn();
  }

  return (
    <div title='Scale' className='dark-stl dstl-inline' onClick={onScaleMenu}>
      100%
    </div>
  );
}

const MenuLayersButton = ({ crName = '' }: { crName?: string }) => {
  const onLayersMenu = () => {
    DataManager.ob().layersMenu.content = (
      <Draggable title='Layers' onOuterCloseFn={DataManager.ob().layersMenu.onCloseFn}>
        <CollectionLayers crName={crName} />
      </Draggable>
    );
    DataManager.ob().layersMenu.onShowFn();
  }

  return (
    <div title={Strings.id('Layers')} className='dark-stl dstl-inline' onClick={onLayersMenu}>
      {Strings.id('Layers')}
    </div>
  );
}

const MenuAnimationBtn = ({crName}: {crName?: string}) => {
  const onAnimationClick = () => {
    if (crName) {
      DataManager.ob().anmationMenu.content = <AnimationMenu crName={crName}/>;
      DataManager.ob().anmationMenu.onShowFn();
    }
  }

  return (
    <div title='Animation' className='dark-stl dstl-inline' onClick={onAnimationClick}>
      A
    </div>
  );
}

/* RemScene Button Menu Slides Panel */
//   MenuSlidesPanelRemSceneButton.args(crName),

/* add dashed frame */
// remAllDashedFrame();
// changeCSSClasses('edit-mode-active');
// addCssClass(ob, 'edit-mode-active');


const MenuFileBtn = () => {
  const dataPstAttrs = () => {
    const menu = Object
      .entries(Model.ob().set.menuFile) as Array<[string, string]>;

    DataManager.ob().commonMenu.content = (
      <Draggable title='Scale' onOuterCloseFn={DataManager.ob().commonMenu.onCloseFn}>
         <MenuFile menu={menu} />
      </Draggable>
    );
    DataManager.ob().commonMenu.onShowFn();
  }

  return (
    <div title='Menu File' className='dark-stl dstl-inline' onClick={dataPstAttrs}>
      {Strings.id('File')}
    </div>
  );
}

const SaveBtn = () => {
  const onSave = () => {
    saveAllHeaderObj(Data.getJsn(), 'save');
  }

  return (
    <div title='Save Changes' className='dark-stl dstl-inline' onClick={onSave}>
      {Strings.id('save')}
    </div>
  );
}

const UndoBtn = () => {
  const onUndo = () => {
    return true;
  }

  return (
    <div title='Undo' className='dark-stl dstl-inline' onClick={onUndo}>
      Undo
    </div>
  );
}

export default MainMenu;

