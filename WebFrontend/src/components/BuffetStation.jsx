/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";

const BuffetStation = ({
  shape,
  isSelected,
  isPreview,
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

  // Convert global coordinates to local ones
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

  const handleDelete = (e) => {
    if (isPreview) return;
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  return (
    <Group
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      draggable={!isPreview}
      onDragEnd={isPreview ? undefined : handleDragEnd}
      onClick={!isPreview ? () => onSelect(shape.id) : undefined}
      onTap={!isPreview ? () => onSelect(shape.id) : undefined}
    >
      {/* Rotating group containing the rectangle and resize handles */}
      <Group rotation={rotation}>
        <Rect
          ref={shapeRef}
          x={-shape.width / 2}
          y={-shape.height / 2}
          width={shape.width}
          height={shape.height}
          fill="black"
          stroke={isSelected ? "#4299E1" : "transparent"}
          strokeWidth={2}
          onClick={!isPreview ? () => onSelect(shape.id) : undefined}
          onTap={!isPreview ? () => onSelect(shape.id) : undefined}
        />

        {/* Label for the station */}
        <Text
          x={-shape.width / 2 + 10}
          y={-shape.height / 2 + shape.height / 2 - 10}
          width={shape.width - 20}
          text="Buffet Station"
          fontSize={16}
          fill="white"
          align="center"
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
              isPreview ? undefined : (e) => handleResizeStart(e, "bottomLeft")
            }
          />
          <Rect
            x={shape.width / 2 - resizeHandleSize / 2}
            y={shape.height / 2 - resizeHandleSize / 2}
            width={resizeHandleSize}
            height={resizeHandleSize}
            fill="#4299E1"
            onMouseDown={
              isPreview ? undefined : (e) => handleResizeStart(e, "bottomRight")
            }
          />
        </>
      )}
    </Group>
  );
};

export default BuffetStation;
