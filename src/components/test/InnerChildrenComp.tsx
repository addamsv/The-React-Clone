import React from "../../rct/rct";

const InnerChildrenComp = ({ text }: { text: string }) => {
  if (text === "1" || text === "2") {
    return null;
  }

  /* style props for DEMO purpouse */
  return (
    <div
      id="src_to_render"
      style={{
        background: "#888",
        padding: "10px",
        marginTop: "10px",
        color: "#555",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "10px",
          marginTop: "10px",
          color: "#f00",
          borderRadius: "4px",
        }}
      >
        <b>If likes === 1 || likes === 2 it should be disappeared</b>
      </div>
      <b>likes: {text}</b>
      <div
        style={{
          background: "#777",
          padding: "10px",
          marginTop: "10px",
          color: "#444",
          borderRadius: "4px",
        }}
      >
        <b>likes {text}</b>
      </div>
    </div>
  );
};

export default InnerChildrenComp;
