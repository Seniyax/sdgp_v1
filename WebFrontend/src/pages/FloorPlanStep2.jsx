/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback, useEffect } from "react";
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
      className={`fps2-toolbar-item ${
        isSelected ? "fps2-toolbar-item-selected" : ""
      }`}
      onClick={onClick}
    >
      <span className="fps2-toolbar-item-icon">{icon}</span>
      <span className="fps2-toolbar-item-text">{text}</span>
    </div>
  );
}

function FloorplanStep2({
  onNext,
  initialShapes = [],
  onShapesUpdate,
  canvasWidth,
  canvasHeight,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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

  // Updated handleResize function
  const handleResize = (id, newX, newY, newWidth, newHeight, newRadius) => {
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
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
          default:
            break;
        }
      }
    },
    [selectedId, shapes, clipboard, handleDelete, onShapesUpdate]
  );

  useEffect(() => {
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
    <div className="fps2-container">
      {/* Left Toolbar */}
      <div className="fps2-sidebar">
        <div className="fps2-sidebar-header">
          <h3 className="fps2-sidebar-title">Floor Plan Tools</h3>
        </div>

        {/* Scrollable toolbar items */}
        <div className="fps2-sidebar-items">
          {/* Basic Tools */}
          <div>
            <h4 className="fps2-sidebar-section-header">Basic Tools</h4>
            <ToolbarItem
              icon="🔍"
              text="Selection Tool"
              isSelected={selectedShapeType === null}
              onClick={() => setSelectedShapeType(null)}
            />
          </div>

          {/* Walls & Doors */}
          <div>
            <h4 className="fps2-sidebar-section-header">Walls & Doors</h4>
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
            <h4 className="fps2-sidebar-section-header">Stairs & Areas</h4>
            <ToolbarItem
              icon="🪜"
              text="Staircase"
              isSelected={selectedShapeType === "staircase"}
              onClick={() => setSelectedShapeType("staircase")}
            />
          </div>

          {/* Food & Beverage */}
          <div>
            <h4 className="fps2-sidebar-section-header">Food & Beverage</h4>
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
            <h4 className="fps2-sidebar-section-header">Facilities</h4>
            <ToolbarItem
              icon="🚻"
              text="Restrooms"
              isSelected={selectedShapeType === "restrooms"}
              onClick={() => setSelectedShapeType("restrooms")}
            />
          </div>

          {/* Indicators */}
          <div>
            <h4 className="fps2-sidebar-section-header">Indicators</h4>
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
        <div className="fps2-sidebar-bottom">
          <p className="fps2-sidebar-bottom-text">
            Click on the canvas to add shapes. Drag to move. Resize with the
            handles when selected.
          </p>
          <p className="fps2-sidebar-bottom-text">
            Press Delete key to remove selected items.
          </p>
          <button
            className="fps2-clear-button"
            onClick={() => onShapesUpdate([])}
          >
            Clear All Shapes
          </button>
        </div>
      </div>
      {/* Canvas Area */}
      <div className="fps2-canvas-container">
        <div className="fps2-canvas-inner-container">
          <div
            className="fps2-canvas"
            style={{ width: canvasWidth, height: canvasHeight }}
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
              <div className="fps2-empty-canvas-overlay">
                <h4 className="fps2-empty-canvas-title">Add Floor Areas</h4>
                <p className="fps2-empty-canvas-text">
                  Click on the canvas to place items for your floor plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        {/* Bottom action area */}
        <div className="fps2-bottom-action">
          <button
            className="fps2-next-button"
            onClick={() => onNext && onNext(shapes)}
          >
            Next <span className="fps2-button-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloorplanStep2;
