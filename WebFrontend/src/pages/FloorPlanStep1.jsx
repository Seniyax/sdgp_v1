/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../style/FloorPlan.css";

function FloorPlanStep1({
  onSubmit,
  initialWidth,
  initialHeight,
  initialFloorCount,
}) {
  const [width, setWidth] = useState(initialWidth || "");
  const [height, setHeight] = useState(initialHeight || "");
  const [floorCount, setFloorCount] = useState(initialFloorCount || "1");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const floorCountNum = parseFloat(floorCount);

    // Validate the inputs
    if (isNaN(widthNum) || isNaN(heightNum) || isNaN(floorCountNum)) {
      setError("Please enter valid numbers for width, height, and floors.");
      return;
    }

    if (widthNum <= 0 || heightNum <= 0) {
      setError("Dimensions must be greater than zero.");
      return;
    }

    if (floorCountNum < 1) {
      setError("Number of floors must be at least 1.");
      return;
    }

    // Submit the data
    onSubmit(widthNum, heightNum, floorCountNum);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="bg-white rounded shadow p-4 w-100 w-md-50">
        <h1 className="h4 text-dark mb-4 d-flex align-items-center">
          <i className="bi bi-rulers mr-2" style={{ fontSize: "24px" }}></i>
          Floor Plan Dimensions
        </h1>

        <p className="text-muted mb-4">
          Please provide the size of your floor area in square meters. This will
          be used to determine the initial aspect ratio of the canvas.
        </p>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="width" className="form-label">
              Width (meters)
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="form-control"
              placeholder="Enter width"
              step="0.1"
              min="0.1"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="height" className="form-label">
              Height (meters)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="form-control"
              placeholder="Enter height"
              step="0.1"
              min="0.1"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="floorAmount" className="form-label">
              Floors
            </label>
            <input
              type="number"
              id="floorAmount"
              value={floorCount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 1) {
                  setFloorCount(value);
                }
              }}
              className="form-control"
              placeholder="Number of floors"
              min="1"
              required
            />
          </div>

          {error && <div className="text-danger mb-3">{error}</div>}

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center"
            >
              Next
              <i className="bi bi-arrow-right ml-2"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FloorPlanStep1;
