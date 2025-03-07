/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { Circle, Group, Line } from "react-konva";

const GreyCircle = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
}) => {
  const shapeRef = useRef();
  const resizeHandleSize = 8;

  // Handle drag end event
  const handleDragEnd = (e) => {
    onDragEnd(shape.id, e.target.x(), e.target.y());
  };

  // Calculate new radius based on the distance from the center to the new point
  const calculateNewRadius = (originalX, originalY, newX, newY) => {
    const dx = newX - originalX;
    const dy = newY - originalY;
    return Math.max(Math.sqrt(dx * dx + dy * dy), 10); // Minimum radius is 10
  };

  return (
    <Group>
      {/* Main circle */}
      <Circle
        ref={shapeRef}
        x={shape.x}
        y={shape.y}
        radius={shape.radius}
        fill="#CBD5E0" // Light grey fill
        stroke={isSelected ? "#4299E1" : "transparent"} // Border color when selected
        strokeWidth={2}
        draggable
        onClick={(e) => {
          e.cancelBubble = true; // Prevent event bubbling
          onSelect(shape.id);
        }}
        onTap={(e) => {
          e.cancelBubble = true; // Prevent event bubbling
          onSelect(shape.id);
        }}
        onDragEnd={handleDragEnd}
      />

      {/* Resize handles when the shape is selected */}
      {isSelected && (
        <>
          {/* Top Resize Handle */}
          <Circle
            x={shape.x}
            y={shape.y - shape.radius}
            radius={resizeHandleSize / 2}
            fill="#4299E1" // Resize handle color
            draggable
            onDragMove={(e) => {
              const newRadius = calculateNewRadius(
                shape.x,
                shape.y,
                e.target.x(),
                e.target.y()
              );
              onResize(shape.id, shape.x, shape.y, null, null, newRadius);
            }}
          />

          {/* Right Resize Handle */}
          <Circle
            x={shape.x + shape.radius}
            y={shape.y}
            radius={resizeHandleSize / 2}
            fill="#4299E1" // Resize handle color
            draggable
            onDragMove={(e) => {
              const newRadius = calculateNewRadius(
                shape.x,
                shape.y,
                e.target.x(),
                e.target.y()
              );
              onResize(shape.id, shape.x, shape.y, null, null, newRadius);
            }}
          />

          {/* Bottom Resize Handle */}
          <Circle
            x={shape.x}
            y={shape.y + shape.radius}
            radius={resizeHandleSize / 2}
            fill="#4299E1" // Resize handle color
            draggable
            onDragMove={(e) => {
              const newRadius = calculateNewRadius(
                shape.x,
                shape.y,
                e.target.x(),
                e.target.y()
              );
              onResize(shape.id, shape.x, shape.y, null, null, newRadius);
            }}
          />

          {/* Left Resize Handle */}
          <Circle
            x={shape.x - shape.radius}
            y={shape.y}
            radius={resizeHandleSize / 2}
            fill="#4299E1" // Resize handle color
            draggable
            onDragMove={(e) => {
              const newRadius = calculateNewRadius(
                shape.x,
                shape.y,
                e.target.x(),
                e.target.y()
              );
              onResize(shape.id, shape.x, shape.y, null, null, newRadius);
            }}
          />

          {/* Close Button */}
          <Group
            x={shape.x + shape.radius + 10}
            y={shape.y - shape.radius - 10}
          >
            <Circle
              radius={10}
              fill="red" // Close button color
              onClick={(e) => {
                e.cancelBubble = true; // Prevent event bubbling
                onDelete(shape.id);
              }}
            />
            {/* X icon on the close button */}
            <Line
              points={[-5, -5, 5, 5]}
              stroke="white"
              strokeWidth={2}
              onClick={(e) => {
                e.cancelBubble = true; // Prevent event bubbling
                onDelete(shape.id);
              }}
            />
            <Line
              points={[-5, 5, 5, -5]}
              stroke="white"
              strokeWidth={2}
              onClick={(e) => {
                e.cancelBubble = true; // Prevent event bubbling
                onDelete(shape.id);
              }}
            />
          </Group>
        </>
      )}
    </Group>
  );
};

export default GreyCircle;
