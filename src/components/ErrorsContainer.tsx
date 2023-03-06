import React, { ReactDOM, useState } from "../rct/Rct";
import ErrorBoundary from "./ErrorBoundary";

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

const ErrorsContainer = () => {
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
  );
};

export default ErrorsContainer;
