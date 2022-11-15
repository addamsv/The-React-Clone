// import React, { useState } from "../../core/rct/Rct";
import React, { useState } from "react";

import cite from "../../core/data";
import InnerChildrenComp from "./InnerChildrenComp";

type ChildrenComps = {
  children?: (item: string) => string; // React.ReactNode; // 👈️ type children
};

const ChildrenComp = (props: ChildrenComps) => {

  const [ likes, setLikes ] = useState(0);

  const like = () => {
    const likesCount = likes + 1;
    
    setLikes(likesCount);
  }

  const dislike = () => {
    const likesCount =  likes - 1;
    setLikes(likesCount);
  }

  const getStyle = () => {
    return { cursor: "pointer" };
  }

  const getIndex = () => {
    return Math.ceil(Math.random() * (cite.length)) - 1;
  }

  const childsFunction = props.children ? <h1>{props.children('Hello From Children Fn()')}</h1> : null;

  return (
    <div>
      {cite[getIndex()].cite}
      <br />
      <div>
        likes: <span>{ likes }</span>
        <button onClick={like} data-ok={`width`} className={`children-comp mode-${likes}`}  style={getStyle()}>
          {/* ❤️ */}
          like
        </button>
        <button onClick={dislike} data-ok={`width`} className={`children-comp mode-${likes}`}  style={getStyle()}>
          dislike
        </button>
        <br />
        <br />
        <InnerChildrenComp text={likes.toString()} />
        <br />
        <br />
        <div>
          <div>
            after InnerChildrenComp: {likes}
          </div>
        </div>

        {childsFunction}

      </div>
    </div>
  );
}

export default ChildrenComp;
