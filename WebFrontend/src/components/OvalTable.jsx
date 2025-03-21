/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Group, Ellipse, Rect, Circle, Text } from "react-konva";

// Calculate chair positions around the oval table
function calculateChairPositions(radiusX, radiusY, seatCount) {
  const positions = [];
  const maxSeats = Math.min(seatCount, 20); // Cap at 20 seats
  const offset = Math.min(radiusX, radiusY) * 0.4; // Increased offset from 0.2 to 0.25

  for (let i = 0; i < maxSeats; i++) {
    // Distribute chairs evenly around the oval
    const angle = (i / maxSeats) * Math.PI * 2 - Math.PI / 2; // Start from top
    const x = Math.cos(angle) * (radiusX + offset); // Dynamic offset from table edge
    const y = Math.sin(angle) * (radiusY + offset);
    positions.push({ x, y, angle });
  }

  return positions;
}

// Oval table component that supports variable seat counts with square chairs
function OvalTable({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
}) {
  const groupRef = useRef();
  const tableGroupRef = useRef(); // Reference for the inner group that will rotate
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(shape.rotation || 0);
  const [toggledChairs, setToggledChairs] = useState(shape.toggledChairs || {});

  // Set default values to avoid NaN issues
  const tableWidth = typeof shape.width === "number" ? shape.width : 200;
  const tableHeight = typeof shape.height === "number" ? shape.height : 150;
  const tableX = typeof shape.x === "number" ? shape.x : 0;
  const tableY = typeof shape.y === "number" ? shape.y : 0;

  // Use a default seat count of 4 if not specified
  const seatCount = shape.seatCount || 4;

  // Calculate oval dimensions
  const radiusX = tableWidth / 2;
  const radiusY = tableHeight / 2;
  const centerX = tableWidth / 2;
  const centerY = tableHeight / 2;

  // Updated rotation handler similar to circular table
  const handleRotateStart = (e) => {
    e.cancelBubble = true;

    const stage = groupRef.current.getStage();

    // Get initial pointer position and angle
    const initialPos = stage.getPointerPosition();
    const initialAngle = Math.atan2(
      initialPos.y - (shape.y + centerY),
      initialPos.x - (shape.x + centerX)
    );

    const initialRotation = rotation;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      // Calculate new angle
      const newAngle = Math.atan2(
        pos.y - (shape.y + centerY),
        pos.x - (shape.x + centerX)
      );

      // Calculate rotation delta in degrees with increased sensitivity
      let delta = (newAngle - initialAngle) * (180 / Math.PI) * 1.2;

      // Apply the rotation
      const newRotation = (initialRotation + delta) % 360;
      setRotation(newRotation);

      // If parent component needs to know about rotation
      if (shape.onRotate) {
        shape.onRotate(shape.id, newRotation);
      }
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
    };

    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Initialize active and toggled chairs
  const chairPositions = calculateChairPositions(radiusX, radiusY, seatCount);

  // Check if a specific chair is active
  const isChairActive = (index) => {
    return toggledChairs[index] !== true; // Default to active unless toggled off
  };

  // Update active chair count when toggled
  const [activeChairCount, setActiveChairCount] = useState(seatCount);

  useEffect(() => {
    let count = 0;
    // Define isChairActive inside useEffect to avoid dependency issues
    const isChairActive = (index) => {
      return toggledChairs[index] !== true;
    };

    chairPositions.forEach((_, index) => {
      if (isChairActive(index)) {
        count++;
      }
    });
    setActiveChairCount(count);
  }, [toggledChairs, chairPositions]);

  // Update the shape's rotation when it changes
  useEffect(() => {
    if (shape.onRotate && rotation !== shape.rotation) {
      shape.onRotate(shape.id, rotation);
    }
  }, [rotation, shape.id, shape.rotation]);

  // Update the shape's toggled chairs when they change
  useEffect(() => {
    if (shape.onChairsUpdate) {
      shape.onChairsUpdate(shape.id, toggledChairs);
    }
  }, [toggledChairs, shape.id]);

  // Handle resizing using manual event listeners
  const handleResizeMouseDown = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const initialPointer = stage.getPointerPosition();
    const initialWidth = tableWidth;
    const initialHeight = tableHeight;
    const initialCenter = {
      x: shape.x + initialWidth / 2,
      y: shape.y + initialHeight / 2,
    };

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const diffX = pos.x - initialPointer.x;
      const newWidth = Math.min(Math.max(initialWidth + diffX, 70), 400);
      const newHeight = (newWidth * 2) / 3; // Maintain 2:3 aspect ratio

      // Calculate new position to keep center point
      const newX = initialCenter.x - newWidth / 2;
      const newY = initialCenter.y - newHeight / 2;

      onResize(shape.id, null, newWidth, newHeight, newX, newY);
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    // Set cursor and register events
    document.body.style.cursor = "nwse-resize";
    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  const handleDelete = (e) => {
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  // Toggle chair visibility when clicked
  const toggleChair = (index) => {
    const newToggledChairs = {
      ...toggledChairs,
      [index]: !toggledChairs[index],
    };
    setToggledChairs(newToggledChairs);
  };

  const colors = {
    table: "#333333",
    chairFill: "#666666",
    selectedStroke: "#8B5CF6",
    hoverStroke: "#C4B5FD",
    defaultStroke: "#222222",
    deleteButton: "#FF5252",
    resizeButton: "#8B5CF6",
    rotateButton: "#4CAF50",
    selectionDash: "#A78BFA",
  };

  // Match chair size with table size but with minimum and maximum constraints
  const chairSize = Math.min(
    Math.max(Math.min(tableWidth, tableHeight) * 0.2, 15),
    30
  );

  return (
    <Group
      x={tableX}
      y={tableY}
      draggable
      ref={groupRef}
      onDragEnd={(e) => onDragEnd(shape.id, e.target.x(), e.target.y())}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(shape.id);
      }}
    >
      {/* Rotatable group containing table, chairs and selection outline */}
      <Group
        ref={tableGroupRef}
        rotation={rotation}
        x={tableWidth / 2}
        y={tableHeight / 2}
      >
        {/* Selection outline - inside the rotatable group */}
        {isSelected && (
          <Ellipse
            radiusX={radiusX + 5}
            radiusY={radiusY + 5}
            stroke={colors.selectionDash}
            strokeWidth={2}
            dash={[5, 5]}
            perfectDrawEnabled={false}
          />
        )}

        {/* Table */}
        <Ellipse
          radiusX={radiusX}
          radiusY={radiusY}
          fill={colors.table}
          stroke={
            isSelected
              ? colors.selectedStroke
              : isHovered
              ? colors.hoverStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={isSelected || isHovered ? 6 : 0}
          shadowOffset={{ x: 0, y: 2 }}
          shadowOpacity={0.3}
        />

        <Text
          text={shape.tableNumber ? shape.tableNumber.toString() : ""}
          fontSize={24} // adjust as needed
          fill="white" // choose a contrasting color
          x={-radiusX} // center horizontally based on radiusX
          y={-radiusY} // center vertically based on radiusY
          width={radiusX * 2} // ellipse width
          height={radiusY * 2} // ellipse height
          align="center"
          verticalAlign="middle"
          fontStyle="bold"
        />

        {/* Chairs */}
        {chairPositions.map((pos, index) => {
          const isActive = isChairActive(index);

          return (
            <Group
              key={index}
              x={pos.x}
              y={pos.y}
              rotation={(pos.angle * 180) / Math.PI}
              onClick={(e) => {
                e.cancelBubble = true;
                toggleChair(index);
              }}
            >
              <Circle
                width={chairSize}
                height={chairSize}
                fill={isActive ? colors.chairFill : "#B0BEC5"}
                stroke="#333"
                strokeWidth={1}
              />
            </Group>
          );
        })}

        {/* Table resize button */}
        <Circle
          x={radiusX - 10}
          y={radiusY - 10}
          radius={10}
          fill={colors.resizeButton}
          stroke="#fff"
          strokeWidth={2}
          onMouseDown={handleResizeMouseDown}
        />

        {/* Table rotate button */}
        <Circle
          x={0}
          y={-radiusY - 10}
          radius={10}
          fill={colors.rotateButton}
          stroke="#fff"
          strokeWidth={2}
          onMouseDown={handleRotateStart}
        />

        {/* Delete button */}
        <Circle
          x={radiusX - 10}
          y={-radiusY - 10}
          radius={10}
          fill={colors.deleteButton}
          stroke="#fff"
          strokeWidth={2}
          onClick={handleDelete}
        />
      </Group>
    </Group>
  );
}

export default OvalTable;
