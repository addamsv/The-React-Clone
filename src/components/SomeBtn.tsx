import React, { useState } from "../rct/rct";

const SomeBtn = () => {
  const [st, setSt] = useState(1);

  const changing = () => {
    console.log(setSt.innerObj);
    setSt(st + 1);
  };

  /* style props for DEMO purpouse */
  return (
    <button onClick={changing} style={{ marginLeft: "5px", cursor: "pointer" }}>
      {st.toString()}
    </button>
  );
};

export default SomeBtn;
