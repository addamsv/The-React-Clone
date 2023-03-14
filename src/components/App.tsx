import React, { useEffect, useState } from "../rct/rct";
import Preloader from "./preloader/Preloader";
import Test from "./test/Test";

const App = () => {
  const [isLoading, setIsLoading] = useState(1);

  useEffect(() => {
    document.title = `The React Clone Test`;
    setTimeout(() => {
      setIsLoading(0);
    }, 2000);
  }, []);

  // console.log(isLoading ? <Preloader /> : <Test />);

  // return isLoading ? <Preloader /> : <Test />;
  return <div className="app">{isLoading ? <Preloader /> : <Test />}</div>;
  return (
    <div>
      <Test />
    </div>
  );
};

export default App;
