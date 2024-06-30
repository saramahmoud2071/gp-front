import React from "react";
import './loader.css';
// import "bootstrap/dist/css/bootstrap.css";
// import "../assets/css/loader.css";

function Loader(props) {
  return (
    <div className="loader-wrapper">
      <div className="content-loader">
        <div className="sp sp-wave"></div>
      </div>
    </div>
  );
}
export default Loader;
