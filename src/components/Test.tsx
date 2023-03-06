import React, { ReactDOM, useState } from "../rct/Rct";

import ChildrenComp from "./ChildrenComp";
import ChildrenClassComponent from "./ChildrenClassComponent";
import ErrorBoundary from "./ErrorBoundary";
import Preloader from "./Preloader";
import { OldStyleMakingCode } from "./OldStyleMakingCode";
import ErrorsContainer from "./ErrorsContainer";

const Test = () => {
  const elementus = (
    <div
      style={{
        background: "red",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <h1
        style={{
          color: "white",
        }}
      >
        Simple React Element
      </h1>
    </div>
  );

  return (
    <div
      style={{
        width: "400px",
        margin: "auto",
        color: "white",
      }}
    >
      <Preloader />

      {elementus}

      <div
        style={{
          background: "green",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        <h1 style={{ color: "white" }}>Inner DIV</h1>
        <ChildrenClassComponent text="'text out of props test'" />
        <ChildrenComp />
        <ChildrenComp>children text</ChildrenComp>
        {/* {(item: string) => `${item}`} */}
      </div>

      {/* <ErrorsContainer /> */}

      {OldStyleMakingCode}
    </div>
  );
};

export default Test;
