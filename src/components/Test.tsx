import React, { ReactDOM, useState } from "../rct/Rct";

import ChildrenComp from "./ChildrenComp";
import ChildrenClassComponent from "./ChildrenClassComponent";
import ErrorBoundary from "./ErrorBoundary";
import Preloader from "./Preloader";
import { OldStyleMakingCode } from "./OldStyleMakingCode";

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

  const rerender = () => {
    ReactDOM.render(
      <div>rendered ok</div>,
      document.getElementById("src_to_render")
    );
    const root = ReactDOM.createRoot(
      document.getElementById("src_to_render") as HTMLElement
    );
    root.render(<div>rendered ok</div>);
  };

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

      <div
        style={{
          background: "blue",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        <h1 style={{ color: "white" }}>Error Boundry Test:</h1>
        <ErrorBoundary>ErrorBoundary</ErrorBoundary>
        <ErrorButton />

        <br />
        <div>Last DIV</div>
        <button onClick={rerender} style={{ cursor: "pointer" }}>
          rerender
        </button>
      </div>

      {OldStyleMakingCode}
    </div>
  );
};

const ErrorButton = () => {
  const [st, setSt] = useState(false);

  const makeErr = () => setSt(true);

  if (st) {
    throw new Error("I crashed!");
  }

  return (
    <button onClick={makeErr} style={{ marginLeft: "5px", cursor: "pointer" }}>
      Make Error
    </button>
  );
};

export default Test;
