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

import React, { useState } from './core/rct/Rct';
import TestReact from "./components/Test";
// import React, { useState } from "react";
import Preloader from "./components/Preloader";

import ApiService, { IApiService } from "./core/apiService";

const App = () => {
  const [isLoading, setIsLoading] = useState(1);

  // Similar to componentDidMount / componentDidUpdate:
  //   useEffect(() => {
  //     document.title = `using ${appState.d} Data [Loggedin: ${appState.isLoggedin ? 'true' : 'false'}]`;
  //     updateApp();
  //   });

  //  const updateApp = () => {
  //    return;
  //  }
  const apiService: IApiService = new ApiService();

  apiService.getCustomFromServer()
    .then(() => {
      setIsLoading(0);
    })
    .catch(() => {
      setIsLoading(0);
    });

  const onLoad = (isSetsDefault: boolean) => {
    const d = `${isSetsDefault ? 'Default' : 'Server'}`;
    // setIsLoading(0);
    
    // console.log(isLoading);
  }

  // const preloader = isLoading ? <Preloader onLoad={onLoad} /> : null;
  
  /* uncomment this line for test */
  // const test = !isLoading ? <TestReact /> : null;
  // const test = <TestReact />;

  console.log(isLoading);
  
  return (
    <div>
      {/* {preloader} */}
      <TestReact />
    </div>
  );
}

export default App;
