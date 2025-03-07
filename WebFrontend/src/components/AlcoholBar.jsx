/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Group, Rect, Text, Circle, Line } from "react-konva";

const AlcoholBar = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
  onRotate,
}) => {
  const shapeRef = useRef();
  const textRef = useRef();
  const resizeHandleSize = 8;
  const [rotation, setRotation] = useState(shape.rotation || 0);

  // Handle the end of a drag event
  const handleDragEnd = (e) => {
    onDragEnd(shape.id, e.target.x(), e.target.y());
  };

  // Start rotation handling
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

    // Rotation movement handler
    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const newAngle = Math.atan2(
        pos.y - (shape.y + centerY),
        pos.x - (shape.x + centerX)
      );

      let delta = (newAngle - initialAngle) * (180 / Math.PI) * 1.2;
      const newRotation = (initialRotation + delta) % 360;
      setRotation(newRotation);

      if (onRotate) {
        onRotate(shape.id, newRotation);
      }
    };

    // Stop rotation on mouse up
    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
    };

    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Handle the start of resizing
  const handleResizeStart = (e, handle) => {
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();

    const initialPos = stage.getPointerPosition();
    const initialWidth = shape.width;
    const initialHeight = shape.height;
    const initialX = shape.x;
    const initialY = shape.y;

    // Resizing movement handler
    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const dx = pos.x - initialPos.x;
      const dy = pos.y - initialPos.y;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      switch (handle) {
        case "topLeft":
          newWidth = Math.max(initialWidth - dx, 100);
          newHeight = Math.max(initialHeight - dy, 50);
          newX = initialX + (initialWidth - newWidth);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "topRight":
          newWidth = Math.max(initialWidth + dx, 100);
          newHeight = Math.max(initialHeight - dy, 50);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "bottomLeft":
          newWidth = Math.max(initialWidth - dx, 100);
          newHeight = Math.max(initialHeight + dy, 50);
          newX = initialX + (initialWidth - newWidth);
          break;
        case "bottomRight":
          newWidth = Math.max(initialWidth + dx, 100);
          newHeight = Math.max(initialHeight + dy, 50);
          break;
      }

      onResize(shape.id, newX, newY, newWidth, newHeight);
    };

    // Stop resizing on mouse up
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
      x={shape.x}
      y={shape.y}
      rotation={rotation}
      draggable
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(shape.id)}
      onTap={() => onSelect(shape.id)}
    >
      {/* Render the bar shape */}
      <Rect
        ref={shapeRef}
        width={shape.width}
        height={shape.height}
        fill="#8B4513" // Dark brown color
        stroke={isSelected ? "#4299E1" : "#A0AEC0"}
        strokeWidth={2}
      />

      {/* Label for the bar */}
      <Text
        ref={textRef}
        x={shape.width / 2 - 40}
        y={shape.height / 2 - 10}
        text="Alcohol Bar"
        fontSize={16}
        fontStyle="bold"
        fill="#FFFFFF"
      />

      {/* Only show the following when selected */}
      {isSelected && (
        <>
          {/* Resize handles */}
          <Circle
            x={0}
            y={0}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "topLeft")}
          />

          <Circle
            x={shape.width}
            y={0}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "topRight")}
          />

          <Circle
            x={0}
            y={shape.height}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "bottomLeft")}
          />

          <Circle
            x={shape.width}
            y={shape.height}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "bottomRight")}
          />

          {/* Rotation handle */}
          <Group
            y={shape.height + 20}
            x={shape.width / 2}
            onMouseDown={handleRotateStart}
          >
            <Circle radius={10} fill="#4CAF50" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
            <Line points={[5, -5, -5, 5]} stroke="white" strokeWidth={2} />
          </Group>

          {/* Delete button */}
          <Group y={-20} x={shape.width / 2}>
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

export default AlcoholBar;
