import React from "../../rct/rct";

import ChildrenComp from "./ChildrenComp";
import ChildrenClassComponent from "./ChildrenClassComponent";
import { OldStyleMakingCode } from "./OldStyleMakingCode";
import WithChildren from "./WithChildren";
import SomeBtn from "./SomeBtn";
import SpecialTestComponent from "./specialStateComponent/SpecialStateComponent";
import InputField from "./InputField";

import "./index.scss";

/* style props for DEMO purpouse */
const Test = () => {
  const elementus = (
    <div
      className="simple-element"
      style={{
        background: "#aaa",
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
    <div className="test">
      {elementus}

      <div
        style={{
          background: "#888",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        <h1 style={{ color: "white" }}>Input Field Test</h1>
        <InputField />
      </div>

      <div
        style={{
          background: "#888",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        <h1 style={{ color: "white" }}>Input Field Test</h1>
        <InputField />
        <InputField />
      </div>

      <div
        style={{
          background: "#888",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        <h1 style={{ color: "white" }}>Special State Test</h1>
        <SpecialTestComponent />
      </div>

      <div
        style={{
          background: "#888",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        <h1 style={{ color: "white" }}>Inner DIV</h1>
        <ChildrenClassComponent text="'text out of props test'" />
        <ChildrenComp />
        <ChildrenComp>{(item: string) => item}</ChildrenComp>
        <WithChildren>
          <SomeBtn />
        </WithChildren>
        <SomeBtn />
        <SomeBtn />
      </div>

      {OldStyleMakingCode}
    </div>
  );
};

export default Test;
