/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Circle, Group, Line, Rect, Text, Arc } from "react-konva";

const HostDesk = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
  onRotate,
  isPreview, // new prop added
}) => {
  const shapeRef = useRef();
  const resizeHandleSize = 8;
  const [rotation, setRotation] = useState(shape.rotation || 0);

  // Handle dragging the host desk
  const handleDragEnd = (e) => {
    if (isPreview) return;
    const newX = e.target.x() - shape.width / 2;
    const newY = e.target.y() - shape.height / 2;
    onDragEnd(shape.id, newX, newY);
  };

  // Transform point from stage coordinates to local coordinates for rotation
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

  // Handle rotation logic
  const handleRotateStart = (e) => {
    if (isPreview) return;
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

  // Handle resizing of the host desk
  const handleResizeStart = (e, handle) => {
    if (isPreview) return;
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const centerX = shape.x + shape.width / 2;
    const centerY = shape.y + shape.height / 2;

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
        default:
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

  // Handle deletion of the shape
  const handleDelete = (e) => {
    if (isPreview) return;
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  // Determine if the shape is a half-circle or rectangle
  const isHalfCircle = shape.style === "halfCircle";

  return (
    <Group
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      draggable={!isPreview}
      onDragEnd={isPreview ? undefined : handleDragEnd}
      onClick={!isPreview ? () => onSelect(shape.id) : undefined}
      onTap={!isPreview ? () => onSelect(shape.id) : undefined}
    >
      {/* Rotating group containing the shape and resize handles */}
      <Group rotation={rotation}>
        {isHalfCircle ? (
          <Arc
            ref={shapeRef}
            x={-shape.width / 2}
            y={-shape.height / 2}
            innerRadius={0}
            outerRadius={shape.width}
            angle={180}
            fill="white"
            stroke={isSelected ? "#4299E1" : "transparent"}
            strokeWidth={2}
            onClick={!isPreview ? () => onSelect(shape.id) : undefined}
            onTap={!isPreview ? () => onSelect(shape.id) : undefined}
          />
        ) : (
          <Rect
            ref={shapeRef}
            x={-shape.width / 2}
            y={-shape.height / 2}
            width={shape.width}
            height={shape.height}
            fill="white"
            stroke={isSelected ? "#4299E1" : "grey"}
            strokeWidth={2}
            onClick={!isPreview ? () => onSelect(shape.id) : undefined}
            onTap={!isPreview ? () => onSelect(shape.id) : undefined}
          />
        )}

        <Text
          x={-shape.width / 2 + 10}
          y={-shape.height / 2 + 5}
          width={shape.width - 20}
          text="Host Desk"
          fontSize={14}
          fill="black"
          align="center"
        />

        {isSelected && (
          <>
            <Rect
              x={-shape.width / 2 - resizeHandleSize / 2}
              y={-shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={
                isPreview ? undefined : (e) => handleResizeStart(e, "topLeft")
              }
            />
            <Rect
              x={shape.width / 2 - resizeHandleSize / 2}
              y={-shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={
                isPreview ? undefined : (e) => handleResizeStart(e, "topRight")
              }
            />
            <Rect
              x={-shape.width / 2 - resizeHandleSize / 2}
              y={shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={
                isPreview
                  ? undefined
                  : (e) => handleResizeStart(e, "bottomLeft")
              }
            />
            <Rect
              x={shape.width / 2 - resizeHandleSize / 2}
              y={shape.height / 2 - resizeHandleSize / 2}
              width={resizeHandleSize}
              height={resizeHandleSize}
              fill="#4299E1"
              onMouseDown={
                isPreview
                  ? undefined
                  : (e) => handleResizeStart(e, "bottomRight")
              }
            />
          </>
        )}
      </Group>

      {isSelected && (
        <>
          <Group
            x={-shape.width / 2 - 10}
            y={shape.height / 2 + 10}
            onMouseDown={isPreview ? undefined : handleRotateStart}
          >
            <Circle radius={10} fill="#4CAF50" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
          </Group>
          <Group x={shape.width / 2 + 10} y={-shape.height / 2 - 10}>
            <Circle
              radius={10}
              fill="red"
              onClick={isPreview ? undefined : handleDelete}
            />
            <Line
              points={[-5, -5, 5, 5]}
              stroke="white"
              strokeWidth={2}
              onClick={isPreview ? undefined : handleDelete}
            />
            <Line
              points={[-5, 5, 5, -5]}
              stroke="white"
              strokeWidth={2}
              onClick={isPreview ? undefined : handleDelete}
            />
          </Group>
        </>
      )}
    </Group>
  );
};

export default HostDesk;
