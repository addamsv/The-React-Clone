import React, { useEffect, useRef } from "../rct/rct";
import Test from "./Test";

const App = () => {
  /* The feature we'are working at now!!! */
  const divRef = useRef(null);

  /* The feature we'are working at now!!! */
  useEffect(() => {
    document.title = `The React Clone Test`;
  }, []);

  return (
    <div ref={divRef}>
      <Test />
    </div>
  );
};

export default App;
