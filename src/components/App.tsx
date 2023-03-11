import React, { useEffect } from "../rct/rct";

import Test from "./Test";

const App = () => {
  useEffect(() => {
    document.title = `The React Clone Test`;
  }, []);

  return (
    <div>
      <Test />
    </div>
  );
};

export default App;
