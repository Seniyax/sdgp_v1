/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";

const Restrooms = ({
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

  const handleDragEnd = (e) => {
    const newX = e.target.x() - shape.width / 2;
    const newY = e.target.y() - shape.height / 2;
    onDragEnd(shape.id, newX, newY);
  };

  // Transform point from stage coordinates to local coordinates
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

  // Handle rotation
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

      // Notify parent about rotation change
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

  // Handle resizing
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

    const onMouseMove = () => {
      // Transform current position to local coordinates
      const pos = transformPoint(
        stage.getPointerPosition(),
        centerX,
        centerY,
        rotation
      );

      // Calculate differences in local coordinates
      const dx = pos.x - initialPos.x;
      const dy = pos.y - initialPos.y;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      switch (handle) {
        case "topLeft":
          newWidth = Math.max(initialWidth - dx, 20);
          newHeight = Math.max(initialHeight - dy, 20);
          newX = initialX + (initialWidth - newWidth);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "topRight":
          newWidth = Math.max(initialWidth + dx, 20);
          newHeight = Math.max(initialHeight - dy, 20);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "bottomLeft":
          newWidth = Math.max(initialWidth - dx, 20);
          newHeight = Math.max(initialHeight + dy, 20);
          newX = initialX + (initialWidth - newWidth);
          break;
        case "bottomRight":
          newWidth = Math.max(initialWidth + dx, 20);
          newHeight = Math.max(initialHeight + dy, 20);
          break;
      }

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

  // Handle delete
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
      {/* Rotating group containing the restroom indicators */}
      <Group rotation={rotation}>
        <Rect
          ref={shapeRef}
          x={-shape.width / 2}
          y={-shape.height / 2}
          width={shape.width}
          height={shape.height}
          fill="transparent"
          stroke={isSelected ? "#4299E1" : "transparent"}
          strokeWidth={2}
          onClick={() => onSelect(shape.id)}
          onTap={() => onSelect(shape.id)}
        />

        {/* Male restroom */}
        <Group x={-shape.width / 4} y={0}>
          <Rect
            x={-shape.width / 8}
            y={-shape.height / 4}
            width={shape.width / 4}
            height={shape.height / 2}
            fill="#3498DB" // Blue for male
            stroke="#2980B9"
            strokeWidth={1}
            cornerRadius={2}
            onClick={() => onSelect(shape.id)}
            onTap={() => onSelect(shape.id)}
          />

          {/* Male symbol simplified */}
          <Circle
            x={0}
            y={-shape.height / 8}
            radius={shape.width / 16}
            fill="white"
          />
          <Line
            points={[0, -shape.height / 16, 0, shape.height / 8]}
            stroke="white"
            strokeWidth={2}
          />
        </Group>

        {/* Female restroom */}
        <Group x={shape.width / 4} y={0}>
          <Rect
            x={-shape.width / 8}
            y={-shape.height / 4}
            width={shape.width / 4}
            height={shape.height / 2}
            fill="#E74C3C" // Red for female
            stroke="#C0392B"
            strokeWidth={1}
            cornerRadius={2}
            onClick={() => onSelect(shape.id)}
            onTap={() => onSelect(shape.id)}
          />

          {/* Female symbol simplified */}
          <Circle
            x={0}
            y={-shape.height / 8}
            radius={shape.width / 16}
            fill="white"
          />
          <Line
            points={[0, -shape.height / 16, 0, shape.height / 8]}
            stroke="white"
            strokeWidth={2}
          />
          <Line
            points={[
              -shape.width / 16,
              shape.height / 16,
              shape.width / 16,
              shape.height / 16,
            ]}
            stroke="white"
            strokeWidth={2}
          />
        </Group>

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

export default Restrooms;
