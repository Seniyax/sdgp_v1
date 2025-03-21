/* eslint-disable no-unused-vars */
import React from "react";
import "../style/FloorPlanWaiting.css"; // Make sure this file includes your loader CSS/SCSS

const FloorPlanWaiting = () => {
  return (
    <div className="loader">
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__ball"></div>
    </div>
  );
};

export default FloorPlanWaiting;
