/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import FloorPlanStep1 from "./FloorPlanStep1";
import FloorPlanStep2 from "./FloorPlanStep2";
import FloorPlanStep3 from "./FloorPlanStep3";

function FloorPlanDesigner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [floorCount, setFloorCount] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(0);

  // Use arrays to store both grey shapes and tables for each floor
  const [floorShapes, setFloorShapes] = useState([]);
  const [floorTables, setFloorTables] = useState([]);

  // Handle Step 1 submission
  const handleStep1Submit = (widthValue, heightValue, floorCountValue) => {
    // If we're going back to step 1, preserve existing shapes and tables
    if (currentStep > 1) {
      // If floor count increased, add new empty floors
      if (floorCountValue > floorCount) {
        const newFloorShapes = [...floorShapes];
        const newFloorTables = [...floorTables];
        for (let i = floorCount; i < floorCountValue; i++) {
          newFloorShapes.push([]);
          newFloorTables.push([]);
        }
        setFloorShapes(newFloorShapes);
        setFloorTables(newFloorTables);
      }
      // If floor count decreased, remove extra floors
      else if (floorCountValue < floorCount) {
        const newFloorShapes = floorShapes.slice(0, floorCountValue);
        const newFloorTables = floorTables.slice(0, floorCountValue);
        setFloorShapes(newFloorShapes);
        setFloorTables(newFloorTables);
      }
    }

    setWidth(widthValue);
    setHeight(heightValue);
    setFloorCount(floorCountValue);
    setCurrentStep(2);
    setCurrentFloor(0);
  };

  const handleNextStep = (shapes) => {
    if (currentStep === 2) {
      // Update grey shapes when moving from step 2 to 3
      const updatedFloorShapes = [...floorShapes];
      // Ensure we preserve all properties including rotation
      updatedFloorShapes[currentFloor] = shapes.map((shape) => ({
        ...shape,
        rotation: shape.rotation || 0,
      }));
      setFloorShapes(updatedFloorShapes);
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep === 3) {
      // Store the current tables before going back
      const updatedFloorTables = [...floorTables];
      updatedFloorTables[currentFloor] = floorTables[currentFloor];
      setFloorTables(updatedFloorTables);
    }
    setCurrentStep(currentStep - 1);
  };

  const handleStep2Complete = (shapes) => {
    // Update only the grey shapes, keep existing tables
    const updatedFloorShapes = [...floorShapes];
    updatedFloorShapes[currentFloor] = shapes.map((shape) => ({
      ...shape,
      rotation: shape.rotation || 0,
    }));
    setFloorShapes(updatedFloorShapes);
    setCurrentStep(3);
  };

  // Handle table updates in Step 3
  const handleTableUpdate = (tables) => {
    const updatedFloorTables = [...floorTables];
    updatedFloorTables[currentFloor] = tables;
    setFloorTables(updatedFloorTables);
  };

  // Render floor selection buttons
  const renderFloorButtons = () => {
    return (
      <div
        style={{
          position: "absolute",
          right: "20px",
          bottom: "20px",
          display: "flex",
          flexDirection: "column-reverse", // Reverse the order so floor 1 is at bottom
          gap: "8px", // Add spacing between buttons
        }}
      >
        {Array.from({ length: floorCount }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFloor(index)}
            style={{
              backgroundColor: currentFloor === index ? "#4299E1" : "white",
              color: currentFloor === index ? "white" : "#4A5568",
              border: "1px solid #CBD5E0",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              width: "100px", // Fixed width for consistency
              textAlign: "center",
              transition: "all 0.2s ease",
            }}
          >
            Floor {index + 1}
          </button>
        ))}
      </div>
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FloorPlanStep1
            onSubmit={handleStep1Submit}
            initialWidth={width}
            initialHeight={height}
            initialFloorCount={floorCount}
          />
        );

      case 2:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <FloorPlanStep2
              onNext={handleStep2Complete}
              initialShapes={floorShapes[currentFloor]}
              onShapesUpdate={(shapes) => {
                const updatedFloorShapes = [...floorShapes];
                updatedFloorShapes[currentFloor] = shapes.map((shape) => ({
                  ...shape,
                  rotation: shape.rotation || 0,
                }));
                setFloorShapes(updatedFloorShapes);
              }}
              width={width}
              height={height}
            />
            <div
              style={{
                position: "absolute",
                left: "20px",
                bottom: "20px",
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  backgroundColor: "white",
                  color: "#4A5568",
                  border: "1px solid #CBD5E0",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: "8px" }}>←</span>
                Back to Step 1
              </button>
            </div>
            {renderFloorButtons()}
          </div>
        );

      case 3:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <FloorPlanStep3
              onNext={handleNextStep}
              floorShapes={floorShapes[currentFloor]}
              initialTables={floorTables[currentFloor]}
              onTablesUpdate={handleTableUpdate}
              onPreviousStep={handlePreviousStep}
              width={width}
              height={height}
            />
            <div
              style={{
                position: "absolute",
                left: "20px",
                bottom: "20px",
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  backgroundColor: "white",
                  color: "#4A5568",
                  border: "1px solid #CBD5E0",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: "8px" }}>←</span>
                Back to Step 1
              </button>
            </div>
            {renderFloorButtons()}
          </div>
        );

      default:
        return null;
    }
  };

  // Ensure first floor is selected by default when step 2 is reached
  useEffect(() => {
    if (currentStep === 2 && floorCount > 0 && currentFloor === undefined) {
      setCurrentFloor(0);
    }
  }, [currentStep, floorCount]);

  return renderCurrentStep();
}

export default FloorPlanDesigner;
