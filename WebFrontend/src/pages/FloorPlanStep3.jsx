/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import SquareTable from "../components/SquareTable";
import CircularTable from "../components/CircularTable";
import OvalTable from "../components/OvalTable";
import RectangleTable from "../components/RectangleTable";
import GreyRectangle from "../components/GreyRectangle";
import GreyCircle from "../components/GreyCircle";
import EmergancyExit from "../components/EmergancyExit";
import RegularDoor from "../components/RegularDoor";
import Windows from "../components/Window";
import CurvedWalls from "../components/CurvedWall";
import Staircase from "../components/Staircase";
import JuiceBar from "../components/JuiceBar";
import AlcoholBar from "../components/AlcoholBar";
import BuffetStation from "../components/BuffetStation";
import ReceptionDesk from "../components/HostDesk";
import POSStation from "../components/POSStation";
import VisibleKitchen from "../components/VisibleKitchen";
import Restrooms from "../components/Restrooms";
import OutdoorIndicator from "../components/OutdoorIndicator";
import IndoorIndicator from "../components/IndoorIndicator";

// Toolbar item component with number input for tables
function ToolbarItem({
  text,
  isSelected,
  onClick,
  isTable,
  seatCount,
  onSeatCountChange,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isSelected ? "#EBF8FF" : "transparent",
        borderLeft: isSelected ? "4px solid #4299E1" : "4px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: "14px",
        fontWeight: isSelected ? "600" : "normal",
        color: isSelected ? "#2D5282" : "#4A5568",
      }}
    >
      <span>{text}</span>
      {isTable && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="number"
            min="1"
            max="20"
            value={seatCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= 20) {
                onSeatCountChange(value);
              }
            }}
            style={{
              width: "40px",
              height: "24px",
              textAlign: "center",
              border: "1px solid #CBD5E0",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          <span
            style={{ marginLeft: "6px", fontSize: "12px", color: "#718096" }}
          >
            seats
          </span>
        </div>
      )}
    </div>
  );
}

function FloorPlanStep3({
  onNext,
  onPreviousStep,
  floorShapes = [],
  initialTables = [],
  onTablesUpdate,
  width,
  height,
  currentFloorName,
}) {
  // Calculate canvas size based on aspect ratio
  const aspectRatio = width / height;
  const SIZE = 1000;
  const canvasWidth = aspectRatio >= 1 ? SIZE : SIZE * aspectRatio;
  const canvasHeight = aspectRatio >= 1 ? SIZE / aspectRatio : SIZE;

  const [shapes, setShapes] = useState(initialTables);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedShapeType, setSelectedShapeType] = useState("squareTable");

  // Track seat counts for each table type
  const [seatCounts, setSeatCounts] = useState({
    squareTable: 4,
    circularTable: 4,
    rectangleTable: 4,
    ovalTable: 4,
  });

  const [clipboard, setClipboard] = useState(null);
  const stageRef = useRef();

  // Update local state when parent changes
  useEffect(() => {
    if (JSON.stringify(shapes) !== JSON.stringify(initialTables)) {
      setShapes(initialTables);
    }
  }, [initialTables]);

  // Update both local state and parent
  const updateShapes = useCallback(
    (newShapes) => {
      setShapes(newShapes);
      if (onTablesUpdate) {
        onTablesUpdate(newShapes);
      }
    },
    [onTablesUpdate]
  );

  // Handle dragging shapes
  const handleDragEnd = (id, newX, newY) => {
    updateShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, x: newX, y: newY } : shape
      )
    );
  };

  // Handle rotating shapes
  const handleRotate = (id, newRotation) => {
    updateShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, rotation: newRotation } : shape
      )
    );
  };

  // Handle chair toggling
  const handleChairsUpdate = (id, newToggledChairs) => {
    updateShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, toggledChairs: newToggledChairs } : shape
      )
    );
  };

  // Handle resizing shapes
  const handleResize = (id, newSize, newWidth, newHeight, newX, newY) => {
    updateShapes(
      shapes.map((shape) => {
        if (shape.id === id) {
          if (shape.type === "squareTable" || shape.type === "circularTable") {
            return { ...shape, size: newSize };
          } else if (shape.type === "rectangleTable") {
            return { ...shape, width: newWidth / 2 };
          } else if (shape.type === "ovalTable") {
            return {
              ...shape,
              width: newWidth,
              height: newHeight,
              x: newX,
              y: newY,
            };
          }
        }
        return shape;
      })
    );
  };

  // Handle deleting shapes
  const handleDelete = useCallback(
    (id) => {
      updateShapes(shapes.filter((shape) => shape.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    },
    [shapes, selectedId, updateShapes]
  );

  // Add a new shape at given position
  const addShape = (x, y) => {
    if (!selectedShapeType || isPositionOccupied(x, y)) return;

    const now = Date.now();
    let newShape;

    const currentSeatCount = seatCounts[selectedShapeType];

    switch (selectedShapeType) {
      case "squareTable":
        newShape = {
          id: now,
          type: "squareTable",
          x: x - 100,
          y: y - 100,
          size: 200,
          seatCount: currentSeatCount,
          tableNumber: 0,
          floor: currentFloorName,
        };
        break;
      case "circularTable":
        newShape = {
          id: now,
          type: "circularTable",
          x: x - 100,
          y: y - 100,
          size: 200,
          seatCount: currentSeatCount,
          tableNumber: 0,
          floor: currentFloorName,
        };
        break;
      case "rectangleTable":
        newShape = {
          id: now,
          type: "rectangleTable",
          x: x - 100,
          y: y - 75,
          width: 200,
          height: 150,
          seatCount: currentSeatCount,
          tableNumber: 0,
          floor: currentFloorName,
        };
        break;
      case "ovalTable":
        newShape = {
          id: now,
          type: "ovalTable",
          x: x - 100,
          y: y - 75,
          width: 200,
          height: 150,
          seatCount: currentSeatCount,
          tableNumber: 0,
          floor: currentFloorName,
        };
        break;
      default:
        return;
    }

    updateShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  // List of floor shape types that use rectangular collision detection
  const rectangleTypes = [
    "rectangle",
    "emergency_exit",
    "regular_door",
    "windows",
    "curved_walls",
    "staircase",
    "juice_bar",
    "alcohol_bar",
    "buffet_station",
    "reception_desk",
    "pos_station",
    "visible_kitchen",
    "restrooms",
    "outdoor_indicator",
    "indoor_indicator",
  ];

  // Check if position overlaps with fixed shapes
  const isPositionOccupied = (x, y) => {
    return floorShapes.some((shape) => {
      if (rectangleTypes.includes(shape.type)) {
        return (
          x >= shape.x &&
          x <= shape.x + (shape.width || 0) &&
          y >= shape.y &&
          y <= shape.y + (shape.height || 0)
        );
      } else if (shape.type === "circle") {
        const dx = x - (shape.x + shape.radius);
        const dy = y - (shape.y + shape.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= shape.radius;
      }
      return false;
    });
  };

  // Handle mouse clicks on the stage
  const handleStageMouseDown = (e) => {
    const pointerPos = e.target.getStage().getPointerPosition();

    const clickedOnGreyShape = floorShapes.some((shape) => {
      if (rectangleTypes.includes(shape.type)) {
        return (
          pointerPos.x >= shape.x &&
          pointerPos.x <= shape.x + (shape.width || 0) &&
          pointerPos.y >= shape.y &&
          pointerPos.y <= shape.y + (shape.height || 0)
        );
      } else if (shape.type === "circle") {
        const dx = pointerPos.x - (shape.x + shape.radius);
        const dy = pointerPos.y - (shape.y + shape.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= shape.radius;
      }
      return false;
    });

    if (
      e.target === e.target.getStage() &&
      !clickedOnGreyShape &&
      selectedShapeType
    ) {
      addShape(pointerPos.x, pointerPos.y);
    } else if (e.target === e.target.getStage() && !clickedOnGreyShape) {
      setSelectedId(null);
    } else if (!clickedOnGreyShape) {
      setSelectedShapeType(null);
    }
  };

  // Update seat count for table types
  const handleSeatCountChange = (tableType, count) => {
    setSeatCounts({
      ...seatCounts,
      [tableType]: count,
    });
  };

  // Handle keyboard shortcuts for copy/paste/delete
  const handleKeyDown = useCallback(
    (e) => {
      if (e.target.tagName === "INPUT") return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "c":
            e.preventDefault();
            if (selectedId) {
              const selectedShape = shapes.find(
                (shape) => shape.id === selectedId
              );
              if (selectedShape) {
                const shapeCopy = JSON.parse(JSON.stringify(selectedShape));
                delete shapeCopy.id;
                setClipboard(shapeCopy);
              }
            }
            break;
          case "x":
            e.preventDefault();
            if (selectedId) {
              const selectedShape = shapes.find(
                (shape) => shape.id === selectedId
              );
              if (selectedShape) {
                const shapeCopy = JSON.parse(JSON.stringify(selectedShape));
                delete shapeCopy.id;
                setClipboard(shapeCopy);
                handleDelete(selectedId);
              }
            }
            break;
          case "v":
            e.preventDefault();
            if (clipboard) {
              const pastedShape = {
                ...clipboard,
                id: Date.now(),
                x: clipboard.x + 20,
                y: clipboard.y + 20,
                tableNumber: 0,
              };
              updateShapes([...shapes, pastedShape]);
              setSelectedId(pastedShape.id);
            }
            break;
        }
      }
    },
    [selectedId, shapes, clipboard, handleDelete, updateShapes]
  );

  // Setup keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, shapes, clipboard, handleKeyDown]);

  // Pass tables to next step
  const handleNextStep = () => {
    if (onNext) {
      onNext(shapes);
    }
  };

  // Go back to previous step
  const handlePreviousStep = () => {
    if (onPreviousStep) {
      onPreviousStep();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "transparent",
      }}
    >
      {/* Left Toolbar */}
      <div
        style={{
          width: "200px",
          backgroundColor: "white",
          borderRight: "1px solid #E2E8F0",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #E2E8F0" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "600",
              color: "#2D3748",
            }}
          >
            Tables
          </h3>
        </div>

        <ToolbarItem
          text="Selection Tool"
          isSelected={selectedShapeType === null}
          onClick={() => setSelectedShapeType(null)}
          isTable={false}
        />

        <ToolbarItem
          text="Square Table"
          isSelected={selectedShapeType === "squareTable"}
          onClick={() => setSelectedShapeType("squareTable")}
          isTable={true}
          seatCount={seatCounts.squareTable}
          onSeatCountChange={(count) =>
            handleSeatCountChange("squareTable", count)
          }
        />

        <ToolbarItem
          text="Circular Table"
          isSelected={selectedShapeType === "circularTable"}
          onClick={() => setSelectedShapeType("circularTable")}
          isTable={true}
          seatCount={seatCounts.circularTable}
          onSeatCountChange={(count) =>
            handleSeatCountChange("circularTable", count)
          }
        />

        <ToolbarItem
          text="Rectangle Table"
          isSelected={selectedShapeType === "rectangleTable"}
          onClick={() => setSelectedShapeType("rectangleTable")}
          isTable={true}
          seatCount={seatCounts.rectangleTable}
          onSeatCountChange={(count) =>
            handleSeatCountChange("rectangleTable", count)
          }
        />

        <ToolbarItem
          text="Oval Table"
          isSelected={selectedShapeType === "ovalTable"}
          onClick={() => setSelectedShapeType("ovalTable")}
          isTable={true}
          seatCount={seatCounts.ovalTable}
          onSeatCountChange={(count) =>
            handleSeatCountChange("ovalTable", count)
          }
        />

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #E2E8F0",
            marginTop: "auto",
          }}
        >
          <p
            style={{ fontSize: "14px", color: "#718096", margin: "0 0 12px 0" }}
          >
            Click on the canvas to add tables. Drag to move. Resize with the
            blue handles when selected.
          </p>
          <p
            style={{ fontSize: "14px", color: "#718096", margin: "0 0 12px 0" }}
          >
            Press Delete key to remove selected items.
          </p>
          <button
            onClick={() => updateShapes([])}
            style={{
              width: "100%",
              backgroundColor: "#F56565",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Clear All Tables
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        style={{
          flex: 1,
          background: "transparent",
          padding: "20px",
          boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: "#F7FAFC",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <Stage
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={handleStageMouseDown}
              ref={stageRef}
            >
              <Layer>
                {/* Grid lines for reference */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <Line
                    key={`grid-h-${i}`}
                    points={[
                      0,
                      (i * canvasHeight) / 10,
                      canvasWidth,
                      (i * canvasHeight) / 10,
                    ]}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <Line
                    key={`grid-v-${i}`}
                    points={[
                      (i * canvasWidth) / 10,
                      0,
                      (i * canvasWidth) / 10,
                      canvasHeight,
                    ]}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                ))}

                {/* Render preview floor shapes directly without extra wrapper */}
                {floorShapes.map((shape) => {
                  const commonProps = {
                    shape: shape,
                    isPreview: true,
                  };

                  if (shape.type === "rectangle") {
                    return (
                      <GreyRectangle
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  } else if (shape.type === "circle") {
                    return (
                      <GreyCircle key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "emergency_exit") {
                    return (
                      <EmergancyExit
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  } else if (shape.type === "regular_door") {
                    return (
                      <RegularDoor key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "windows") {
                    return (
                      <Windows key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "curved_walls") {
                    return (
                      <CurvedWalls key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "staircase") {
                    return (
                      <Staircase key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "juice_bar") {
                    return (
                      <JuiceBar key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "alcohol_bar") {
                    return (
                      <AlcoholBar key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "buffet_station") {
                    return (
                      <BuffetStation
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  } else if (shape.type === "reception_desk") {
                    return (
                      <ReceptionDesk
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  } else if (shape.type === "pos_station") {
                    return (
                      <POSStation key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "visible_kitchen") {
                    return (
                      <VisibleKitchen
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  } else if (shape.type === "restrooms") {
                    return (
                      <Restrooms key={`fixed-${shape.id}`} {...commonProps} />
                    );
                  } else if (shape.type === "outdoor_indicator") {
                    return (
                      <OutdoorIndicator
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  } else if (shape.type === "indoor_indicator") {
                    return (
                      <IndoorIndicator
                        key={`fixed-${shape.id}`}
                        {...commonProps}
                      />
                    );
                  }
                  return null;
                })}

                {/* Interactive table shapes */}
                {shapes.map((shape) => {
                  switch (shape.type) {
                    case "squareTable":
                      return (
                        <SquareTable
                          key={shape.id}
                          shape={{
                            ...shape,
                            onRotate: handleRotate,
                            onChairsUpdate: handleChairsUpdate,
                          }}
                          isSelected={shape.id === selectedId}
                          onSelect={(id) => setSelectedId(id)}
                          onDragEnd={handleDragEnd}
                          onResize={handleResize}
                          onDelete={handleDelete}
                        />
                      );
                    case "circularTable":
                      return (
                        <CircularTable
                          key={shape.id}
                          shape={{
                            ...shape,
                            onRotate: handleRotate,
                            onChairsUpdate: handleChairsUpdate,
                          }}
                          isSelected={shape.id === selectedId}
                          onSelect={(id) => setSelectedId(id)}
                          onDragEnd={handleDragEnd}
                          onResize={handleResize}
                          onDelete={handleDelete}
                        />
                      );
                    case "ovalTable":
                      return (
                        <OvalTable
                          key={shape.id}
                          shape={{
                            ...shape,
                            onRotate: handleRotate,
                            onChairsUpdate: handleChairsUpdate,
                          }}
                          isSelected={shape.id === selectedId}
                          onSelect={(id) => setSelectedId(id)}
                          onDragEnd={handleDragEnd}
                          onResize={handleResize}
                          onDelete={handleDelete}
                        />
                      );
                    case "rectangleTable":
                      return (
                        <RectangleTable
                          key={shape.id}
                          shape={{
                            ...shape,
                            onRotate: handleRotate,
                            onChairsUpdate: handleChairsUpdate,
                          }}
                          isSelected={shape.id === selectedId}
                          onSelect={(id) => setSelectedId(id)}
                          onDragEnd={handleDragEnd}
                          onResize={handleResize}
                          onDelete={handleDelete}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </Layer>
            </Stage>

            {/* Empty state instructions */}
            {shapes.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", color: "#2D3748" }}>
                  Add Tables
                </h4>
                <p style={{ margin: "0", color: "#4A5568" }}>
                  Click on the canvas to place tables in your floor plan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            padding: "0 20px",
          }}
        >
          <button
            onClick={handlePreviousStep}
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
            Back
          </button>

          <button
            onClick={handleNextStep}
            style={{
              borderRadius: "4px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            className="btn btn-violet-light"
          >
            Save
            <span style={{ marginLeft: "8px" }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloorPlanStep3;
