import React, { useEffect, useRef, useState } from "../rct/Rct";
import Test from "./Test";

const App = () => {
  const [isLoading, setIsLoading] = useState(1);

  /* The feature we'are working at now!!! */
  const divRef = useRef(null);

  /* The feature we'are working at now!!! */
  useEffect(() => {
    document.title = `The React Clone Test`;
    console.log(divRef);
    setIsLoading(0);
  }, []);

  return (
    <div ref={divRef}>
      <Test />
    </div>
  );
};

export default App;
