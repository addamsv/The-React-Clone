import React from "../../rct/rct";

const SpecialBtn = ({ stateFn }: { stateFn: (prop: string) => void }) => {
  const changing = () => stateFn("ok");

  /* style props for DEMO purpouse */
  return (
    <button onClick={changing} style={{ marginLeft: "5px", cursor: "pointer" }}>
      change
    </button>
  );
};

export default SpecialBtn;
