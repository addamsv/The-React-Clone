import React, { useEffect, useRef, useState } from "../rct/rct";
import Test from "./Test";

const App = () => {
  const [isLoading, setIsLoading] = useState(1);

  /* The feature we'are working at now!!! */
  const divRef = useRef(null);

  setTimeout(() => {
    setIsLoading(0);
  }, 5000);

  /* The feature we'are working at now!!! */
  useEffect(() => {
    document.title = `The React Clone Test`;
    setIsLoading(0);
  }, []);

  return (
    <div ref={divRef}>
      <Test />
    </div>
  );
};

export default App;
