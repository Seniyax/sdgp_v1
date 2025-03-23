/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../style/FloorPlan.css";

function FloorPlanStep1({
  onSubmit,
  initialWidth,
  initialHeight,
  initialFloorCount,
  initialFloorNames,
}) {
  const [width, setWidth] = useState(initialWidth || "");
  const [height, setHeight] = useState(initialHeight || "");
  const [floorCount, setFloorCount] = useState(initialFloorCount || "1");
  const [error, setError] = useState("");
  const [floorNames, setFloorNames] = useState(initialFloorNames || []);
  const [namingPage, setNamingPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const count = parseInt(floorCount);
    if (!isNaN(count)) {
      if (floorNames.length === 0) {
        // Initialize only if there are no names already
        const newFloorNames = Array.from({ length: count }, (_, i) =>
          i === 0 ? "Ground" : `Floor ${i}`
        );
        setFloorNames(newFloorNames);
        setNamingPage(0);
      } else if (floorNames.length < count) {
        // Append default names for any new floors
        const extraNames = Array.from(
          { length: count - floorNames.length },
          (_, i) => `Floor ${floorNames.length + i}`
        );
        setFloorNames([...floorNames, ...extraNames]);
      } else if (floorNames.length > count) {
        // Trim extra names if floors have been reduced
        setFloorNames(floorNames.slice(0, count));
      }
    }
  }, [floorCount]); // Depend only on floorCount so that once floorNames are set, they won't be overwritten

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
    <div className="floorplan-container">
      <div className="floorplan-card">
        <div className="floorplan-header">
          <i className="bi bi-rulers header-icon"></i>
          <h1 className="header-title">Floor Plan Dimensions</h1>
        </div>
        <p className="floorplan-description">
          Please provide the size of your floor area in square meters. This will
          be used to determine the initial aspect ratio of the canvas.
        </p>
        <form onSubmit={handleSubmit} className="floorplan-form">
          <div className="form-group">
            <label htmlFor="width" className="form-label">
              Width (meters)
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="form-input"
              placeholder="Enter width"
              step="0.1"
              min="0.1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="height" className="form-label">
              Height (meters)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="form-input"
              placeholder="Enter height"
              step="0.1"
              min="0.1"
              required
            />
          </div>
          <div className="form-group">
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
              className="form-input"
              placeholder="Number of floors"
              min="1"
              required
            />
          </div>
          {parseInt(floorCount) > 0 && (
            <div className="form-group">
              <label className="form-label">Floor Naming</label>
              <div className={`floor-names-container ${isAnimating ? 'animating' : ''}`}>
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
                      className="floor-name-input"
                      required
                    />
                  );
                })}
              </div>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={namingPage === 0}
                  onClick={() => changeNamingPage(namingPage - 1)}
                >
                  &lt;
                </button>
                <span className="pagination-info">
                  {startIndex + 1}-{endIndex} of {floorNames.length}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={endIndex >= floorNames.length}
                  onClick={() => changeNamingPage(namingPage + 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-violet"
            >
              Next
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FloorPlanStep1;