/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Group, Rect, Text, Circle, Line } from "react-konva";

const JuiceBar = ({
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

  // Handle drag end to notify parent of position change
  const handleDragEnd = (e) => {
    onDragEnd(shape.id, e.target.x(), e.target.y());
  };

  // Handle rotation logic on mouse events
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

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const newAngle = Math.atan2(
        pos.y - (shape.y + centerY),
        pos.x - (shape.x + centerX)
      );

      let delta = (newAngle - initialAngle) * (180 / Math.PI) * 1.2;
      const newRotation = (initialRotation + delta) % 360;
      setRotation(newRotation);

      // Notify parent of rotation change
      if (onRotate) {
        onRotate(shape.id, newRotation);
      }
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
    };

    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Handle resizing by updating the shape dimensions
  const handleResizeStart = (e, handle) => {
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();

    const initialPos = stage.getPointerPosition();
    const initialWidth = shape.width;
    const initialHeight = shape.height;
    const initialX = shape.x;
    const initialY = shape.y;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const dx = pos.x - initialPos.x;
      const dy = pos.y - initialPos.y;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      // Switch based on the resize handle selected
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

      // Notify parent of new shape size and position
      onResize(shape.id, newX, newY, newWidth, newHeight);
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
      <Rect
        ref={shapeRef}
        width={shape.width}
        height={shape.height}
        fill="#D2B48C" // Light wood color
        stroke={isSelected ? "#4299E1" : "#A0AEC0"}
        strokeWidth={2}
      />

      <Text
        ref={textRef}
        x={shape.width / 2 - 30}
        y={shape.height / 2 - 10}
        text="Juice Bar"
        fontSize={16}
        fontStyle="bold"
        fill="#4A5568"
      />

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

          {/* Rotate button */}
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

export default JuiceBar;
