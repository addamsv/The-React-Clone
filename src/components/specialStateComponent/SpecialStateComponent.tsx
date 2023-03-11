import React, { useState } from "../../rct/rct";
import SpecialBtn from "./SpecialBtn";

const SpecialTestComponent = () => {
  const [st, setSt] = useState("-");

  return (
    <div>
      {st}
      <SpecialBtn stateFn={setSt} />
    </div>
  );
};

export default SpecialTestComponent;
