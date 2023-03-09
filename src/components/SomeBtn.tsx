import React, { useState } from "../rct/rct";

const SomeBtn = () => {
  const [st, setSt] = useState(1);

  const changing = () => {
    console.log("here", st);

    setSt(st + 1);
  };

  return (
    <button onClick={changing} style={{ marginLeft: "5px", cursor: "pointer" }}>
      {st.toString()}
    </button>
  );
};

export default SomeBtn;
