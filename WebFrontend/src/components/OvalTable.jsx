/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { Group, Ellipse, Circle, Text } from "react-konva";

// Calculate chair positions around the oval table
function calculateChairPositions(radiusX, radiusY, seatCount) {
  const positions = [];
  const maxSeats = Math.min(seatCount, 20); // Cap at 20 seats
  const offset = Math.min(radiusX, radiusY) * 0.4; // Increased offset

  for (let i = 0; i < maxSeats; i++) {
    // Distribute chairs evenly around the oval
    const angle = (i / maxSeats) * Math.PI * 2 - Math.PI / 2; // Start from top
    const x = Math.cos(angle) * (radiusX + offset); // Dynamic offset from table edge
    const y = Math.sin(angle) * (radiusY + offset);
    positions.push({ x, y, angle });
  }

  return positions;
}

function OvalTable({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
}) {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(shape.rotation || 0);
  const [toggledChairs, setToggledChairs] = useState(shape.toggledChairs || {});

  // Default values to avoid NaN issues
  const tableWidth = typeof shape.width === "number" ? shape.width : 200;
  const tableHeight = typeof shape.height === "number" ? shape.height : 150;
  const tableX = typeof shape.x === "number" ? shape.x : 0;
  const tableY = typeof shape.y === "number" ? shape.y : 0;
  const seatCount = shape.seatCount || 4;

  // Calculate oval dimensions and center point
  const radiusX = tableWidth / 2;
  const radiusY = tableHeight / 2;
  const centerX = tableWidth / 2;
  const centerY = tableHeight / 2;

  // Calculate positions for chairs
  const chairPositions = calculateChairPositions(radiusX, radiusY, seatCount);

  // Rotation handler for the table (without affecting control buttons)
  const handleRotateStart = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const initialPos = stage.getPointerPosition();
    const initialAngle = Math.atan2(
      initialPos.y - (tableY + centerY),
      initialPos.x - (tableX + centerX)
    );
    const initialRotation = rotation;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const newAngle = Math.atan2(
        pos.y - (tableY + centerY),
        pos.x - (tableX + centerX)
      );
      let delta = (newAngle - initialAngle) * (180 / Math.PI) * 1.2;
      const newRotation = (initialRotation + delta) % 360;
      setRotation(newRotation);
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

  // Handle resizing using manual event listeners
  const handleResizeMouseDown = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const initialPointer = stage.getPointerPosition();
    const initialWidth = tableWidth;
    const initialHeight = tableHeight;
    const initialCenter = {
      x: tableX + initialWidth / 2,
      y: tableY + initialHeight / 2,
    };

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const diffX = pos.x - initialPointer.x;
      const newWidth = Math.min(Math.max(initialWidth + diffX, 70), 400);
      const newHeight = (newWidth * 2) / 3; // Maintain aspect ratio
      const newX = initialCenter.x - newWidth / 2;
      const newY = initialCenter.y - newHeight / 2;
      onResize(shape.id, null, newWidth, newHeight, newX, newY);
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

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

  // Chair size is relative to table size with constraints
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
      {/* Rotated group for the oval table and chairs */}
      <Group rotation={rotation} x={centerX} y={centerY}>
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

        {/* Render chairs */}
        {chairPositions.map((pos, index) => {
          const isActive = toggledChairs[index] !== true;
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
                radius={chairSize / 2}
                fill={isActive ? colors.chairFill : "transparent"}
                stroke={colors.defaultStroke}
                strokeWidth={1}
                dash={isActive ? [] : [2, 2]}
                opacity={isActive ? 1 : 0.5}
              />
            </Group>
          );
        })}
      </Group>

      {/* Table number rendered outside the rotated group */}
      <Text
        text={shape.tableNumber ? shape.tableNumber.toString() : ""}
        fontSize={24}
        fill="white"
        // Center relative to the outer group
        x={centerX}
        y={centerY}
        offset={{ x: centerX, y: centerY }}
        width={tableWidth}
        height={tableHeight}
        align="center"
        verticalAlign="middle"
        fontStyle="bold"
      />

      {/* Control Buttons (rendered outside the rotated group) */}
      {(isSelected || isHovered) && (
        <>
          <Group x={tableWidth - 5} y={5} onClick={handleDelete}>
            <Circle
              radius={10}
              fill={colors.deleteButton}
              stroke="#fff"
              strokeWidth={2}
            />
            <Text text="×" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>

          <Group x={5} y={5} onMouseDown={handleRotateStart}>
            <Circle
              radius={10}
              fill={colors.rotateButton}
              stroke="#fff"
              strokeWidth={2}
            />
            <Text text="↻" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>

          <Group
            x={tableWidth - 10}
            y={tableHeight - 10}
            onMouseDown={handleResizeMouseDown}
          >
            <Circle
              radius={10}
              fill={colors.resizeButton}
              stroke="#fff"
              strokeWidth={2}
            />
            <Text text="↘" fontSize={12} fill="white" x={-5} y={-7} />
          </Group>
        </>
      )}
    </Group>
  );
}

export default OvalTable;
