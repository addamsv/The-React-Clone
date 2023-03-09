import React from "../rct/rct";

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
      If likes === 1 || likes === 2 it should be disappeared InnerChildrenComp
      likes: {text}
      <div
        style={{
          background: "yellow",
          padding: "10px",
          marginTop: "10px",
          color: "green",
          borderRadius: "4px",
        }}
      >
        likes {text}
      </div>
    </div>
  );
};

export default InnerChildrenComp;
