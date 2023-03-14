import React from "../../rct/rct";

type ChildrenComps = {
  children?: any; // React.ReactNode; 👈️ children type
};

const WithChildren = (props: ChildrenComps) => {
  return <div>{props.children}</div>;
};

export default WithChildren;
