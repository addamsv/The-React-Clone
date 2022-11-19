import React from "../core/rct/Rct";
// import React from "react";

const InnerChildrenComp = ({ text }: { text: string }) => {
  if (text === '1' || text === '2') {    
    return null;
  }

  return (
    <div id="src_to_render">
      InnerChildrenComp text: {text}
      <div>
        {text}
      </div>
    </div>
  );
}

export default InnerChildrenComp;