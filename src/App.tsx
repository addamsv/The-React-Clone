import React, { useState } from "./rct/Rct";
import Test from "./components/Test";

const App = () => {
  const [isLoading, setIsLoading] = useState(1);

  // Similar to componentDidMount / componentDidUpdate:
  //   useEffect(() => {
  //     document.title = `using ${appState.d} Data [Loggedin: ${appState.isLoggedin ? 'true' : 'false'}]`;
  //     updateApp();
  //   }, []);

  const onLoad = (isSetsDefault: boolean) => {
    const d = `${isSetsDefault ? "Default" : "Server"}`;
    setIsLoading(0);
  };

  // const preloader = isLoading ? <Preloader onLoad={onLoad} /> : null;

  return (
    <div>
      <Test />
    </div>
  );
};

export default App;
