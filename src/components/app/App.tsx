/**
*  ╭───────────────────────────────────────────────────────────────────────╮
*  │      ©  2 0 2 2   L A N I A K E A  L L C                              │
*  │                                                                       │
*  │ About Press Copyright Contact us Creators Advertise Developers        │
*  │ Terms Privacy Policy & Safety How Site&Theme works Test new features  │
*  │                                                                       │
*  │  Copyright (c) 2017-2022 S.Adamovich                                  │
*  │  License: no one can use it                                           │
*  │  Version: 0.0.0-N-R (10-JUL-2018/22)                                  │
*  ╰───────────────────────────────────────────────────────────────────────╯
*/

// import React, { useState } from '../../core/rct/Rct';
// import TestReact from "../testComponents/Test";
import React, { useState } from "react";
import Scene from "./components/Scene";
import DataManager from "../../core/dataManager";
// import Preloader from "./components/Preloader";
// import LoginView from "./components/LoginView";


// type stateType = { isLoading?: boolean, isLoggedin?: boolean, d?: string };

const App = () => {
  // const [appState, setAppState] = useState<stateType>({ isLoading: true, isLoggedin: false, d: '' });

  // Similar to componentDidMount / componentDidUpdate:
  //   useEffect(() => {
  //     document.title = `using ${appState.d} Data [Loggedin: ${appState.isLoggedin ? 'true' : 'false'}]`;
  //     updateApp();
  //   });

  //  const updateApp = () => {
  //    return;
  //  }

  // const onLoad = (isSetsDefault: boolean) => {
  //   const d = `${isSetsDefault ? 'Default' : 'Server'}`;
  //   setAppState((appState: stateType) => { return {...appState, ...{isLoading: false, d}} });
  // }

  // const onLogin = () => setAppState((appState: stateType) => { return {...appState, ...{isLoggedin: true}} });

  // const { isLoading, isLoggedin } = appState;

  // const preloader = isLoading ? <Preloader onLoad={onLoad} /> : null;
  
  /* uncomment this line for test */
  // const test = null; // !isLoggedin && !isLoading ? <TestReact /> : null;

  // const loginView = !test && !isLoggedin && !isLoading ? <LoginView onLogin={onLogin} /> : null;
  // const scene = isLoggedin && !isLoading 
  //   ? (
  //     <>
  //       <CommonMenu />
  //       <LayersMenu />
  //       <AnimationMenu />
  //       <AlertMenu />
  //       <ContextMenu />
  //       <Scene />
  //     </>
  //   )
  //   : null;
  const scene = (
    <>
      <AlertMenu />
      <AnimationMenu />
      <LayersMenu />
      <CommonMenu />
      <ContextMenu />
      <Scene />
    </>
  );

  return (
    <>
      {/* {preloader} */}
      {/* {test} */}
      {/* {loginView} */}
      {scene}
    </>
  );
}

const CommonMenu = () => {
  const [apear, setApear] = useState(false);
  DataManager.ob().commonMenu.onCloseFn = () => setApear(false);
  DataManager.ob().commonMenu.onShowFn = () => setApear(true);

  if (apear) {
    const content = DataManager.ob().commonMenu.content;
    return (
      <>
        {content}
      </>
    );
  }
  return null;
}

const LayersMenu = () => {
  const [apear, setApear] = useState(false);
  DataManager.ob().layersMenu.onCloseFn = () => setApear(false);
  DataManager.ob().layersMenu.onShowFn = () => setApear(true);
  if (apear) {
    const content = DataManager.ob().layersMenu.content;
    return (
      <>
        {content}
      </>
    );
  }
  return null;
}

const AnimationMenu = () => {
  const [apear, setApear] = useState(false);
  DataManager.ob().anmationMenu.onCloseFn = () => setApear(false);
  DataManager.ob().anmationMenu.onShowFn = () => setApear(true);
  if (apear) {
    const content = DataManager.ob().anmationMenu.content;
    return (
      <div className="time-line__wrp">
        {content}
      </div>
    );
  }
  return null;
}

const AlertMenu = () => {
  const [apear, setApear] = useState(false);
  DataManager.ob().alertMenu.onCloseFn = () => setApear(false);
  DataManager.ob().alertMenu.onShowFn = () => setApear(true);

  if (apear) {
    const content = DataManager.ob().alertMenu.content;
    return (
      <div style={{ display: 'block', position: 'fixed', height: '200px', width: '350px', zIndex: '110', right: '0' }}>
        {content}
      </div>
    );
  }
  return null;
}

const ContextMenu = () => {
  const [apear, setApear] = useState(false);
  DataManager.ob().contextMenu.onCloseFn = () => setApear(false);
  DataManager.ob().contextMenu.onShowFn = () => setApear(true);
  if (apear) {
    const content = DataManager.ob().contextMenu.content;
    return (
      <>
        {content}
      </>
    );
  }
  return null;
}

export default App;
