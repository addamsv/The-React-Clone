import React from "../rct/rct";
import ErrorButton from "./Error/ErrorBtn";

type ChildrenComps = {
  children?: any; // React.ReactNode; 👈️ children type
};

const WithChildren = (props: ChildrenComps) => {
  // return <div></div>;
  return <div>{props.children}</div>;
};

export default WithChildren;
