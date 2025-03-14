/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const FloorPlanFaliure = ({ error, tryAgain }) => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="alert alert-danger text-center w-100" role="alert">
        <h1 className="display-4">Oops!</h1>
        <p className="lead">{error}</p>
      </div>
      <button onClick={tryAgain} className="btn btn-danger mt-4">
        Try Again
      </button>
    </div>
  );
};

export default FloorPlanFaliure;
