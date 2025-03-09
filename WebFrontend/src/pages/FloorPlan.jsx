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
  const [floorNames, setFloorNames] = useState([]);

  const [floorShapes, setFloorShapes] = useState([]);
  const [floorTables, setFloorTables] = useState([]);

  // Receive width, height, floor count, and floor names from Step 1
  const handleStep1Submit = (
    widthValue,
    heightValue,
    floorCountValue,
    names
  ) => {
    if (currentStep > 1) {
      if (floorCountValue > floorCount) {
        const newFloorShapes = [...floorShapes];
        const newFloorTables = [...floorTables];
        for (let i = floorCount; i < floorCountValue; i++) {
          newFloorShapes.push([]);
          newFloorTables.push([]);
        }
        setFloorShapes(newFloorShapes);
        setFloorTables(newFloorTables);
      } else if (floorCountValue < floorCount) {
        setFloorShapes(floorShapes.slice(0, floorCountValue));
        setFloorTables(floorTables.slice(0, floorCountValue));
      }
    }
    setWidth(widthValue);
    setHeight(heightValue);
    setFloorCount(floorCountValue);
    setFloorNames(names);
    setCurrentStep(2);
    setCurrentFloor(0);
  };

  const handleNextStep = (shapes) => {
    if (currentStep === 2) {
      const updated = [...floorShapes];
      updated[currentFloor] = shapes.map((shape) => ({
        ...shape,
        rotation: shape.rotation || 0,
      }));
      setFloorShapes(updated);
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep === 3) {
      const updated = [...floorTables];
      updated[currentFloor] = floorTables[currentFloor];
      setFloorTables(updated);
    }
    setCurrentStep(currentStep - 1);
  };

  const handleStep2Complete = (shapes) => {
    const updated = [...floorShapes];
    updated[currentFloor] = shapes.map((shape) => ({
      ...shape,
      rotation: shape.rotation || 0,
    }));
    setFloorShapes(updated);
    setCurrentStep(3);
  };

  const handleTableUpdate = (tables) => {
    const updated = [...floorTables];
    updated[currentFloor] = tables;
    setFloorTables(updated);
  };

  // Render floor selection buttons with the user-defined names
  const renderFloorButtons = () => {
    return (
      <div
        style={{
          position: "absolute",
          right: "20px",
          bottom: "20px",
          display: "flex",
          flexDirection: "column-reverse",
          gap: "8px",
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
              width: "100px",
              textAlign: "center",
              transition: "all 0.2s ease",
            }}
          >
            {floorNames[index] ? floorNames[index] : `Floor ${index + 1}`}
          </button>
        ))}
      </div>
    );
  };

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
                const updated = [...floorShapes];
                updated[currentFloor] = shapes.map((shape) => ({
                  ...shape,
                  rotation: shape.rotation || 0,
                }));
                setFloorShapes(updated);
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

  useEffect(() => {
    if (currentStep === 2 && floorCount > 0 && currentFloor === undefined) {
      setCurrentFloor(0);
    }
  }, [currentStep, floorCount]);

  return renderCurrentStep();
}

export default FloorPlanDesigner;
