import React from "../rct/Rct";

const InnerChildrenComp = ({ text }: { text: string }) => {
  if (text === "1" || text === "2") {
    return null;
  }

  return (
    <div
      id="src_to_render"
      style={{
        background: "#040",
        padding: "10px",
        marginTop: "10px",
        color: "#0b0",
        borderRadius: "4px",
      }}
    >
      InnerChildrenComp text: {text}
      <div>{text}</div>
    </div>
  );
};

export default InnerChildrenComp;
