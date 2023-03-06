import React, { ReactDOM } from "./rct/Rct";

import "./index.scss";
import App from "./components/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
