/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
  const [floorNames, setFloorNames] = useState([]);
  const [namingPage, setNamingPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const count = parseInt(floorCount);
    if (!isNaN(count) && floorNames.length !== count) {
      const newFloorNames = Array.from({ length: count }, (_, i) =>
        i === 0 ? "Ground" : `Floor ${i}`
      );
      setFloorNames(newFloorNames);
      setNamingPage(0);
    }
  }, [floorCount, floorNames.length]);

  const handleFloorNameChange = (index, value) => {
    const newNames = [...floorNames];
    newNames[index] = value;
    setFloorNames(newNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const floorCountNum = parseFloat(floorCount);
    if (isNaN(widthNum) || isNaN(heightNum) || isNaN(floorCountNum)) {
      setError("Please enter valid numbers for width, height, and floors");
      return;
    }
    if (widthNum <= 0 || heightNum <= 0) {
      setError("Dimensions must be greater than zero");
      return;
    }
    if (floorCountNum < 1) {
      setError("Number of floors must be at least 1");
      return;
    }
    for (let i = 0; i < floorNames.length; i++) {
      if (!floorNames[i] || floorNames[i].trim() === "") {
        setError(
          `Please enter a name for ${i === 0 ? "Ground" : `Floor ${i + 1}`}`
        );
        return;
      }
    }
    setError("");
    onSubmit(widthNum, heightNum, floorCountNum, floorNames);
  };

  const floorsPerPage = 5;
  const startIndex = namingPage * floorsPerPage;
  const endIndex = Math.min(startIndex + floorsPerPage, floorNames.length);

  const changeNamingPage = (newPage) => {
    setIsAnimating(true);
    setTimeout(() => {
      setNamingPage(newPage);
      setIsAnimating(false);
    }, 300);
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
          {parseInt(floorCount) > 0 && (
            <div className="mb-3">
              <label className="form-label">Floor Naming</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  transition: "opacity 300ms ease, transform 300ms ease",
                  opacity: isAnimating ? 0 : 1,
                }}
              >
                {floorNames.slice(startIndex, endIndex).map((name, index) => {
                  const floorIndex = startIndex + index;
                  return (
                    <input
                      key={floorIndex}
                      type="text"
                      value={floorNames[floorIndex]}
                      onChange={(e) =>
                        handleFloorNameChange(floorIndex, e.target.value)
                      }
                      className="form-control"
                      style={{ width: "150px", transition: "all 300ms ease" }}
                      required
                    />
                  );
                })}
              </div>
              <div className="d-flex justify-content-center align-items-center mt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginRight: "5px" }}
                  disabled={namingPage === 0}
                  onClick={() => changeNamingPage(namingPage - 1)}
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginLeft: "5px" }}
                  disabled={endIndex >= floorNames.length}
                  onClick={() => changeNamingPage(namingPage + 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
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
