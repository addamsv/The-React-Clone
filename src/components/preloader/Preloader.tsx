import React from "../../rct/rct";

import img from "../../assets/img/logo.svg";

import "./index.scss";

const Preloader = () => {
  return (
    <div className="preloader">
      <img className="preloader-logo" src={img} alt="logo" />
      <h4 className="preloader-title">Loading...</h4>
      <div className="preloader-line-wrapper">
        <div className="preloader-line"></div>
      </div>
    </div>
  );
};

export default Preloader;
