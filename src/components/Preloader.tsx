import React from "../rct/rct";

import img from "../assets/img/logo.svg";

const Preloader = () => {
  return (
    <div className="preloader">
      <img width={400} height={50} src={img} alt="logo" />
      <h1 style={{ display: "block", textAlign: "center" }}>Loading...</h1>
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
        <div
          style={{
            display: "block",
            height: "5px",
            width: "100px",
            background: "#aaa",
            borderRadius: "2.2px",
          }}
        ></div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Preloader;
