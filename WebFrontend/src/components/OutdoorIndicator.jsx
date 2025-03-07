/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";

const OutdoorIndicator = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
  onRotate,
}) => {
  const shapeRef = useRef();
  const resizeHandleSize = 8;
  const [rotation, setRotation] = useState(shape.rotation || 0);

  // Handle drag end to update the position of the shape
  const handleDragEnd = (e) => {
    const newX = e.target.x() - shape.width / 2;
    const newY = e.target.y() - shape.height / 2;
    onDragEnd(shape.id, newX, newY);
  };

  // Function to transform point from stage coordinates to local coordinates
  const transformPoint = (point, centerX, centerY, rotation) => {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(-rad);
    const sin = Math.sin(-rad);
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos,
    };
  };

  // Handle rotation start to initiate rotation process
  const handleRotateStart = (e) => {
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const centerX = shape.width / 2;
    const centerY = shape.height / 2;

    const initialPos = stage.getPointerPosition();
    const initialAngle = Math.atan2(
      initialPos.y - (shape.y + centerY),
      initialPos.x - (shape.x + centerX)
    );

    const initialRotation = rotation;

    // Rotate while mouse moves
    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const newAngle = Math.atan2(
        pos.y - (shape.y + centerY),
        pos.x - (shape.x + centerX)
      );

      let delta = (newAngle - initialAngle) * (180 / Math.PI) * 1.2;
      const newRotation = (initialRotation + delta) % 360;
      setRotation(newRotation);

      // Notify parent about rotation change
      if (onRotate) {
        onRotate(shape.id, newRotation);
      }
    };

    // Stop rotation when mouse is released
    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
    };

    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Handle resizing of the shape based on the selected corner
  const handleResizeStart = (e, handle) => {
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const centerX = shape.x + shape.width / 2;
    const centerY = shape.y + shape.height / 2;

    // Get initial position in local coordinates
    const initialPos = transformPoint(
      stage.getPointerPosition(),
      centerX,
      centerY,
      rotation
    );

    const initialWidth = shape.width;
    const initialHeight = shape.height;
    const initialX = shape.x;
    const initialY = shape.y;

    // Update size and position during resizing
    const onMouseMove = () => {
      const pos = transformPoint(
        stage.getPointerPosition(),
        centerX,
        centerY,
        rotation
      );

      const dx = pos.x - initialPos.x;
      const dy = pos.y - initialPos.y;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      // Handle resizing based on corner selection
      switch (handle) {
        case "topLeft":
          newWidth = Math.max(initialWidth - dx, 80); // Ensure minimum width for text
          newHeight = Math.max(initialHeight - dy, 30); // Ensure minimum height for text
          newX = initialX + (initialWidth - newWidth);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "topRight":
          newWidth = Math.max(initialWidth + dx, 80);
          newHeight = Math.max(initialHeight - dy, 30);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "bottomLeft":
          newWidth = Math.max(initialWidth - dx, 80);
          newHeight = Math.max(initialHeight + dy, 30);
          newX = initialX + (initialWidth - newWidth);
          break;
        case "bottomRight":
          newWidth = Math.max(initialWidth + dx, 80);
          newHeight = Math.max(initialHeight + dy, 30);
          break;
      }

      onResize(shape.id, newX, newY, newWidth, newHeight);
    };

    // Stop resizing when mouse is released
    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.body.style.cursor = "nwse-resize";
    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Handle delete action
  const handleDelete = (e) => {
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  return (
    <Group
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      draggable
      onDragEnd={handleDragEnd}
    >
      {/* Rotating group containing the rectangle and resize handles */}
      <Group rotation={rotation}>
        <Rect
          ref={shapeRef}
          x={-shape.width / 2}
          y={-shape.height / 2}
          width={shape.width}
          height={shape.height}
          fill="transparent"
          stroke="#4299E1"
          strokeWidth={2}
          dash={[5, 5]} // Creates the dotted border effect
          onClick={() => onSelect(shape.id)}
          onTap={() => onSelect(shape.id)}
        />

        {/* The "Outdoor" text */}
        <Text
          x={-shape.width / 2}
          y={-shape.height / 2}
          width={shape.width}
          height={shape.height}
          text="Outdoor"
          align="center"
          verticalAlign="middle"
          fontSize={16}
          fill="#4299E1"
          onClick={() => onSelect(shape.id)}
          onTap={() => onSelect(shape.id)}
        />

        {isSelected && (
          <>
            {/* Resize handles */}
            <Rect
              x={-shape.width / 2 - resizeHandleSize / 2}
              y={-shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={(e) => handleResizeStart(e, "topLeft")}
            />

            <Rect
              x={shape.width / 2 - resizeHandleSize / 2}
              y={-shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={(e) => handleResizeStart(e, "topRight")}
            />

            <Rect
              x={-shape.width / 2 - resizeHandleSize / 2}
              y={shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={(e) => handleResizeStart(e, "bottomLeft")}
            />

            <Rect
              x={shape.width / 2 - resizeHandleSize / 2}
              y={shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={(e) => handleResizeStart(e, "bottomRight")}
            />
          </>
        )}
      </Group>

      {/* Non-rotating controls */}
      {isSelected && (
        <>
          {/* Rotate button */}
          <Group
            x={-shape.width / 2 - 10}
            y={shape.height / 2 + 10}
            onMouseDown={handleRotateStart}
          >
            <Circle radius={10} fill="#4CAF50" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
          </Group>

          {/* Delete button */}
          <Group x={shape.width / 2 + 10} y={-shape.height / 2 - 10}>
            <Circle radius={10} fill="red" onClick={handleDelete} />
            <Line
              points={[-5, -5, 5, 5]}
              stroke="white"
              strokeWidth={2}
              onClick={handleDelete}
            />
            <Line
              points={[-5, 5, 5, -5]}
              stroke="white"
              strokeWidth={2}
              onClick={handleDelete}
            />
          </Group>
        </>
      )}
    </Group>
  );
};

export default OutdoorIndicator;
