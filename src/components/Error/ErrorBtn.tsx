import React, { useState } from "../../rct/rct";

const ErrorButton = () => {
  const [st, setSt] = useState(false);

  const makeErr = () => setSt(true);

  if (st) {
    throw new Error("I crashed!");
  }

  return (
    <button onClick={makeErr} style={{ marginLeft: "5px", cursor: "pointer" }}>
      Make Error
    </button>
  );
};

export default ErrorButton;
