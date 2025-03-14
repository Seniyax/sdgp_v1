/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import "../style/FloorPlan.css";
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

// Toolbar item component
function ToolbarItem({ icon, text, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        backgroundColor: isSelected ? "#EBF8FF" : "transparent",
        borderLeft: isSelected ? "4px solid #4299E1" : "4px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: "14px",
        fontWeight: isSelected ? "600" : "normal",
        color: isSelected ? "#2C5282" : "#4A5568",
      }}
    >
      <span style={{ marginRight: "8px" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function FloorplanStep2({
  onNext,
  initialShapes = [],
  onShapesUpdate,
  width = 100,
  height = 100,
}) {
  // Calculate canvas size based on aspect ratio
  const SIZE = 1000;
  const aspectRatio = width / height;
  const canvasWidth = aspectRatio >= 1 ? SIZE : SIZE * aspectRatio;
  const canvasHeight = aspectRatio >= 1 ? SIZE / aspectRatio : SIZE;

  const [selectedId, setSelectedId] = useState(null);
  const [selectedShapeType, setSelectedShapeType] = useState(null);
  const stageRef = useRef();
  const [clipboard, setClipboard] = useState(null);

  // Ensure shapes have rotation property
  const shapes = initialShapes.map((shape) => ({
    ...shape,
    rotation: shape.rotation || 0,
  }));

  // Handle shape dragging
  const handleDragEnd = (id, newX, newY) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === id ? { ...shape, x: newX, y: newY } : shape
    );
    onShapesUpdate(updatedShapes);
  };

  // Updated handleResize function in FloorPlanStep2.jsx
  const handleResize = (id, newX, newY, newWidth, newHeight, newRadius) => {
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        // Treat these types like a rectangle for resizing
        if (
          shape.type === "rectangle" ||
          shape.type === "emergency_exit" ||
          shape.type === "regular_door" ||
          shape.type === "windows" ||
          shape.type === "curved_walls" ||
          shape.type === "staircase" ||
          shape.type === "juice_bar" ||
          shape.type === "alcohol_bar" ||
          shape.type === "buffet_station" ||
          shape.type === "reception_desk" ||
          shape.type === "pos_station" ||
          shape.type === "visible_kitchen" ||
          shape.type === "restrooms" ||
          shape.type === "outdoor_indicator" ||
          shape.type === "indoor_indicator"
        ) {
          return {
            ...shape,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          };
        } else if (shape.type === "circle") {
          return {
            ...shape,
            x: newX,
            y: newY,
            radius: newRadius,
          };
        }
      }
      return shape;
    });
    onShapesUpdate(updatedShapes);
  };

  const handleThicknessResize = (id, newThickness) => {
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id && shape.type === "curved_walls") {
        return {
          ...shape,
          thickness: newThickness,
        };
      }
      return shape;
    });
    onShapesUpdate(updatedShapes);
  };

  // Delete selected shape
  const handleDelete = useCallback(
    (id) => {
      const updatedShapes = shapes.filter((shape) => shape.id !== id);
      onShapesUpdate(updatedShapes);
      if (selectedId === id) {
        setSelectedId(null);
      }
    },
    [shapes, onShapesUpdate, selectedId]
  );

  // Rotate selected shape
  const handleRotate = useCallback(
    (id, newRotation) => {
      const updatedShapes = shapes.map((shape) =>
        shape.id === id ? { ...shape, rotation: newRotation } : shape
      );
      onShapesUpdate(updatedShapes);
    },
    [shapes, onShapesUpdate]
  );

  // Handle keyboard shortcuts
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
              };
              onShapesUpdate([...shapes, pastedShape]);
              setSelectedId(pastedShape.id);
            }
            break;
        }
      }
    },
    [selectedId, shapes, clipboard, handleDelete, onShapesUpdate]
  );

  // Set up keyboard event listener
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, shapes, clipboard, handleKeyDown]);

  // Handle stage mouse clicks
  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      if (selectedShapeType) {
        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        addShape(pos.x, pos.y);
      } else {
        setSelectedId(null);
      }
    } else {
      setSelectedShapeType(null);
    }
  };

  // Add new shape to canvas
  const addShape = (x, y) => {
    const now = Date.now();
    let newShape;

    switch (selectedShapeType) {
      case "rectangle":
        newShape = {
          id: now,
          type: "rectangle",
          x: x - 100,
          y: y - 75,
          width: 200,
          height: 150,
        };
        break;
      case "circle":
        newShape = {
          id: now,
          type: "circle",
          x: x,
          y: y,
          radius: 75,
        };
        break;
      case "emergency_exit":
        newShape = {
          id: now,
          type: "emergency_exit",
          x: x - 50,
          y: y - 25,
          width: 100,
          height: 50,
        };
        break;
      case "regular_door":
        newShape = {
          id: now,
          type: "regular_door",
          x: x - 40,
          y: y - 20,
          width: 80,
          height: 40,
        };
        break;
      case "windows":
        newShape = {
          id: now,
          type: "windows",
          x: x - 75,
          y: y - 30,
          width: 150,
          height: 60,
        };
        break;
      case "curved_walls":
        newShape = {
          id: now,
          type: "curved_walls",
          x: x - 100,
          y: y - 100,
          width: 200,
          height: 200,
        };
        break;
      case "staircase":
        newShape = {
          id: now,
          type: "staircase",
          x: x - 70,
          y: y - 70,
          width: 140,
          height: 140,
        };
        break;
      case "juice_bar":
        newShape = {
          id: now,
          type: "juice_bar",
          x: x - 100,
          y: y - 50,
          width: 200,
          height: 100,
        };
        break;
      case "alcohol_bar":
        newShape = {
          id: now,
          type: "alcohol_bar",
          x: x - 120,
          y: y - 50,
          width: 240,
          height: 100,
        };
        break;
      case "buffet_station":
        newShape = {
          id: now,
          type: "buffet_station",
          x: x - 100,
          y: y - 40,
          width: 200,
          height: 80,
        };
        break;
      case "reception_desk":
        newShape = {
          id: now,
          type: "reception_desk",
          x: x - 80,
          y: y - 40,
          width: 160,
          height: 80,
        };
        break;
      case "pos_station":
        newShape = {
          id: now,
          type: "pos_station",
          x: x - 40,
          y: y - 40,
          width: 80,
          height: 80,
        };
        break;
      case "visible_kitchen":
        newShape = {
          id: now,
          type: "visible_kitchen",
          x: x - 125,
          y: y - 100,
          width: 250,
          height: 200,
        };
        break;
      case "restrooms":
        newShape = {
          id: now,
          type: "restrooms",
          x: x - 75,
          y: y - 75,
          width: 150,
          height: 150,
        };
        break;
      case "outdoor_indicator":
        newShape = {
          id: now,
          type: "outdoor_indicator",
          x: x - 80,
          y: y - 40,
          width: 160,
          height: 80,
        };
        break;
      case "indoor_indicator":
        newShape = {
          id: now,
          type: "indoor_indicator",
          x: x - 80,
          y: y - 40,
          width: 160,
          height: 80,
        };
        break;
      default:
        return;
    }

    onShapesUpdate([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  // Render appropriate component based on shape type
  const renderShape = (shape) => {
    switch (shape.type) {
      case "rectangle":
        return (
          <GreyRectangle
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "circle":
        return (
          <GreyCircle
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
          />
        );
      case "emergency_exit":
        return (
          <EmergancyExit
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "regular_door":
        return (
          <RegularDoor
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "windows":
        return (
          <Windows
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "curved_walls":
        return (
          <CurvedWalls
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
            onThicknessResize={handleThicknessResize}
          />
        );
      case "staircase":
        return (
          <Staircase
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "juice_bar":
        return (
          <JuiceBar
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "alcohol_bar":
        return (
          <AlcoholBar
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "buffet_station":
        return (
          <BuffetStation
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "reception_desk":
        return (
          <ReceptionDesk
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "pos_station":
        return (
          <POSStation
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "visible_kitchen":
        return (
          <VisibleKitchen
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "restrooms":
        return (
          <Restrooms
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "outdoor_indicator":
        return (
          <OutdoorIndicator
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      case "indoor_indicator":
        return (
          <IndoorIndicator
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onDelete={handleDelete}
            onRotate={handleRotate}
          />
        );
      default:
        return null;
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
          height: "100vh",
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
            Floor Plan Tools
          </h3>
        </div>

        {/* Scrollable toolbar items */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Basic Tools */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                margin: 0,
                color: "#2D3748",
              }}
            >
              Basic Tools
            </h4>
            <ToolbarItem
              icon="🔍"
              text="Selection Tool"
              isSelected={selectedShapeType === null}
              onClick={() => setSelectedShapeType(null)}
            />
          </div>

          {/* Walls & Doors */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                margin: 0,
                color: "#2D3748",
              }}
            >
              Walls & Doors
            </h4>
            <ToolbarItem
              icon="⬛"
              text="Straight Wall"
              isSelected={selectedShapeType === "rectangle"}
              onClick={() => setSelectedShapeType("rectangle")}
            />
            <ToolbarItem
              icon="⭕"
              text="Circular Wall"
              isSelected={selectedShapeType === "circle"}
              onClick={() => setSelectedShapeType("circle")}
            />
            <ToolbarItem
              icon="🚪"
              text="Emergency Exit"
              isSelected={selectedShapeType === "emergency_exit"}
              onClick={() => setSelectedShapeType("emergency_exit")}
            />
            <ToolbarItem
              icon="🚪"
              text="Regular Doors"
              isSelected={selectedShapeType === "regular_door"}
              onClick={() => setSelectedShapeType("regular_door")}
            />
            <ToolbarItem
              icon="🪟"
              text="Windows"
              isSelected={selectedShapeType === "windows"}
              onClick={() => setSelectedShapeType("windows")}
            />
            <ToolbarItem
              icon="🧱"
              text="Curved Walls"
              isSelected={selectedShapeType === "curved_walls"}
              onClick={() => setSelectedShapeType("curved_walls")}
            />
          </div>

          {/* Stairs & Areas */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                margin: 0,
                color: "#2D3748",
              }}
            >
              Stairs & Areas
            </h4>
            <ToolbarItem
              icon="🪜"
              text="Staircase"
              isSelected={selectedShapeType === "staircase"}
              onClick={() => setSelectedShapeType("staircase")}
            />
          </div>

          {/* Food & Beverage */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                margin: 0,
                color: "#2D3748",
              }}
            >
              Food & Beverage
            </h4>
            <ToolbarItem
              icon="🧃"
              text="Juice Bar"
              isSelected={selectedShapeType === "juice_bar"}
              onClick={() => setSelectedShapeType("juice_bar")}
            />
            <ToolbarItem
              icon="🍸"
              text="Alcohol Bar"
              isSelected={selectedShapeType === "alcohol_bar"}
              onClick={() => setSelectedShapeType("alcohol_bar")}
            />
            <ToolbarItem
              icon="🍽️"
              text="Buffet Station"
              isSelected={selectedShapeType === "buffet_station"}
              onClick={() => setSelectedShapeType("buffet_station")}
            />
            <ToolbarItem
              icon="🛎️"
              text="Reception Desk"
              isSelected={selectedShapeType === "reception_desk"}
              onClick={() => setSelectedShapeType("reception_desk")}
            />
            <ToolbarItem
              icon="💲"
              text="POS Station"
              isSelected={selectedShapeType === "pos_station"}
              onClick={() => setSelectedShapeType("pos_station")}
            />
            <ToolbarItem
              icon="👨‍🍳"
              text="Visible Kitchen"
              isSelected={selectedShapeType === "visible_kitchen"}
              onClick={() => setSelectedShapeType("visible_kitchen")}
            />
          </div>

          {/* Facilities */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                margin: 0,
                color: "#2D3748",
              }}
            >
              Facilities
            </h4>
            <ToolbarItem
              icon="🚻"
              text="Restrooms"
              isSelected={selectedShapeType === "restrooms"}
              onClick={() => setSelectedShapeType("restrooms")}
            />
          </div>

          {/* Indicators */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                margin: 0,
                color: "#2D3748",
              }}
            >
              Indicators
            </h4>
            <ToolbarItem
              icon="🌳"
              text="Outdoor Indicator"
              isSelected={selectedShapeType === "outdoor_indicator"}
              onClick={() => setSelectedShapeType("outdoor_indicator")}
            />
            <ToolbarItem
              icon="🏠"
              text="Indoor Indicator"
              isSelected={selectedShapeType === "indoor_indicator"}
              onClick={() => setSelectedShapeType("indoor_indicator")}
            />
          </div>
        </div>

        {/* Fixed bottom section */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #E2E8F0",
          }}
        >
          <p
            style={{ fontSize: "14px", color: "#718096", margin: "0 0 12px 0" }}
          >
            Click on the canvas to add shapes. Drag to move. Resize with the
            handles when selected.
          </p>
          <p
            style={{ fontSize: "14px", color: "#718096", margin: "0 0 12px 0" }}
          >
            Press Delete key to remove selected items.
          </p>
          <button
            onClick={() => onShapesUpdate([])}
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
            Clear All Shapes
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
                {/* Grid lines */}
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

                {/* Render all shapes */}
                {shapes.map(renderShape)}
              </Layer>
            </Stage>

            {/* Empty canvas instructions */}
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
                  Add Floor Areas
                </h4>
                <p style={{ margin: "0", color: "#4A5568" }}>
                  Click on the canvas to place items for your floor plan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action area */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
            padding: "0 20px",
          }}
        >
          <button
            onClick={() => onNext && onNext(shapes)}
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
            Next
            <span style={{ marginLeft: "8px" }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloorplanStep2;
