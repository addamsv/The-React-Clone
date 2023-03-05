import React, { useState } from "../rct/Rct";

import cite from "../data/data";
import InnerChildrenComp from "./InnerChildrenComp";

type ChildrenComps = {
  children?: string; // (item: string) => any; // React.ReactNode; 👈️ type children
};

const ChildrenComp = (props: ChildrenComps) => {
  const [likes, setLikes] = useState(0);

  const like = () => {
    const likesCount = likes + 1;

    setLikes(likesCount);
  };

  const dislike = () => {
    const likesCount = likes - 1;

    setLikes(likesCount);
  };

  const btnStyle = { cursor: "pointer", marginLeft: "5px" };

  const getIndex = () => Math.ceil(Math.random() * cite.length) - 1;

  const childsFunction = props.children ? (
    <div>
      <b>{props.children}</b>
    </div> // props.children("Hello From Children Fn()")
  ) : null;

  return (
    <div
      style={{
        background: "yellow",
        padding: "10px",
        marginTop: "10px",
        color: "green",
        borderRadius: "4px",
      }}
    >
      <div>
        <b>Function Component</b>
      </div>
      {cite[getIndex()].cite}
      <br />
      <div>
        likes: <span>{likes}</span>
        <button
          onClick={like}
          data-ok={`width`}
          className={`children-comp mode-${likes}`}
          style={btnStyle}
        >
          {/* ❤️ */}
          like
        </button>
        <button
          onClick={dislike}
          data-ok={`width`}
          className={`children-comp mode-${likes}`}
          style={btnStyle}
        >
          dislike
        </button>
        <InnerChildrenComp text={likes.toString()} />
        <div>
          <div>after InnerChildrenComp: {likes}</div>
        </div>
        {childsFunction}
      </div>
    </div>
  );
};

export default ChildrenComp;
