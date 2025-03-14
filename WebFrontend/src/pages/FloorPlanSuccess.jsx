/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const FloorPlanSuccess = ({ goToDashboard }) => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="alert alert-success text-center w-100" role="alert">
        <h1 className="display-4">Success!</h1>
        <p className="lead">Your floor plan was created successfully.</p>
      </div>
      <button onClick={goToDashboard} className="btn btn-primary mt-4">
        Go to Dashboard
      </button>
    </div>
  );
};

export default FloorPlanSuccess;
