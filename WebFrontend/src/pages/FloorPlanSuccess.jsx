/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/FloorPlan.css";

const FloorPlanSuccess = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate(`/reservation-dashboard/${encodeURIComponent(businessId)}`);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="alert alert-success text-center w-100" role="alert">
        <h1 className="display-4">Success!</h1>
        <p className="lead">Your floor plan was created successfully.</p>
      </div>
      <button onClick={handleGoToDashboard} className="btn btn-violet mt-4">
        Go to Dashboard
      </button>
    </div>
  );
};

export default FloorPlanSuccess;
