import React from "../../rct/rct";

import img from "../../assets/img/logo.svg";

import "./index.scss";

const Preloader = () => {
  /* style props for DEMO purpouse */
  return (
    <div className="preloader">
      <img width={400} height={50} src={img} alt="logo" />
      <h4 style={{ display: "block", textAlign: "center", color: "#aaa" }}>
        Loading...
      </h4>
      <div
        style={{
          margin: "auto",
          display: "block",
          height: "5px",
          width: "110px",
          border: "1px solid #aaa",
          borderRadius: "2.2px",
        }}
      >
        <div className="preloader-line"></div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Preloader;
