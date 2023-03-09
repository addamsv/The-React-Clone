import React from "./rct/rct";
import { ReactDOM } from "./rct/rct-dom";
import App from "./components/App";

import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
