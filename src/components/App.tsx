import React, { useEffect, useState } from "../rct/rct";
import Preloader from "./preloader/Preloader";

import Test from "./Test";

const App = () => {
  const [isLoading, setIsLoading] = useState(1);

  useEffect(() => {
    document.title = `The React Clone Test`;
    setTimeout(() => {
      setIsLoading(0);
    }, 3000);
  }, []);

  // console.log(isLoading ? <Preloader /> : <Test />);

  // return isLoading ? <Preloader /> : <Test />;
  return <div>{isLoading ? <Preloader /> : <Test />}</div>;
  return (
    <div>
      <Test />
    </div>
  );
};

export default App;
