import React, { useRef, useState } from "../../rct/rct";

const InputField = () => {
  const [st, setSt] = useState("");

  const divRef = useRef(null);

  const changing = (val: string) => {
    setSt(val);
  };

  return (
    <div ref={divRef}>
      <span>{st === "hello" && st}</span>
      <span>{false}</span>
      <input
        type="text"
        onInput={(e: any) => changing(e.target.value)}
        placeholder="text hello here"
        value={st}
      />
    </div>
  );
};

export default InputField;
