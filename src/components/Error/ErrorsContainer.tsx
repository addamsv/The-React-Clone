import React from "../../rct/rct";
import { ReactDOM } from "../../rct/rct-dom";
import ErrorBoundary from "./ErrorBoundary";
import ErrorButton from "./ErrorBtn";

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

  /* style props for DEMO purpouse */
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
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>

      <br />
      <div>Last DIV</div>
      <button onClick={rerender} style={{ cursor: "pointer" }}>
        rerender
      </button>
    </div>
  );
};

export default ErrorsContainer;
