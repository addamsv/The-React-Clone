import React, { useState } from "../rct/rct";
import cite from "../data/data";
import InnerChildrenComp from "./InnerChildrenComp";
import img2 from "../assets/img/dislike.svg";
import img3 from "../assets/img/like.svg";

type ChildrenComps = {
  children?: (item: string) => string; // React.ReactNode; 👈️ children type
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
      <b>{props.children("Hello From Children Fn()")}</b>
    </div>
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
        {/* ❤️ */}
        likes: <span>{likes}</span>
        <button
          onClick={like}
          data-ok={`width`}
          className={`children-comp mode-${likes}`}
          style={btnStyle}
        >
          <img width={16} height={16} src={img3} alt="like" />
          {/* like */}
        </button>
        <button
          onClick={dislike}
          data-ok={`width`}
          className={`children-comp mode-${likes}`}
          style={btnStyle}
        >
          {/* dislike */}
          <img width={16} height={16} src={img2} alt="dislike" />
        </button>
        <InnerChildrenComp text={likes.toString()} />
        <div>
          <div>after InnerChildrenComp likes: {likes}</div>
        </div>
        {childsFunction}
      </div>
    </div>
  );
};

export default ChildrenComp;
