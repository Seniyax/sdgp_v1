/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Group, Rect, Text, Circle, Line } from "react-konva";

const AlcoholBar = ({
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
  const textRef = useRef();
  const resizeHandleSize = 8;
  const [rotation, setRotation] = useState(shape.rotation || 0);

  // Compute center coordinates
  const centerX = shape.width / 2;
  const centerY = shape.height / 2;

  // Handle drag end by updating the top-left position from the centered group position.
  const handleDragEnd = (e) => {
    const newX = e.target.x() - centerX;
    const newY = e.target.y() - centerY;
    onDragEnd(shape.id, newX, newY);
  };

  // Handle rotation by calculating the angle relative to the global center.
  const handleRotateStart = (e) => {
    if (isPreview) return;
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const globalCenterX = shape.x + centerX;
    const globalCenterY = shape.y + centerY;
    const initialPos = stage.getPointerPosition();
    const initialAngle = Math.atan2(
      initialPos.y - globalCenterY,
      initialPos.x - globalCenterX
    );
    const initialRotation = rotation;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const newAngle = Math.atan2(pos.y - globalCenterY, pos.x - globalCenterX);
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

  // Utility function to transform a point into local coordinates
  const transformPoint = (point, cx, cy, rotation) => {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(-rad);
    const sin = Math.sin(-rad);
    const dx = point.x - cx;
    const dy = point.y - cy;
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    };
  };

  // Handle resizing similar to GreyRectangle, using the centered coordinates.
  const handleResizeStart = (e, handle) => {
    if (isPreview) return;
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const globalCenterX = shape.x + centerX;
    const globalCenterY = shape.y + centerY;

    const initialPos = transformPoint(
      stage.getPointerPosition(),
      globalCenterX,
      globalCenterY,
      rotation
    );

    const initialWidth = shape.width;
    const initialHeight = shape.height;
    const initialX = shape.x;
    const initialY = shape.y;

    const onMouseMove = () => {
      const pos = transformPoint(
        stage.getPointerPosition(),
        globalCenterX,
        globalCenterY,
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
      x={shape.x + centerX}
      y={shape.y + centerY}
      draggable={!isPreview}
      onDragEnd={isPreview ? undefined : handleDragEnd}
      onClick={!isPreview ? () => onSelect(shape.id) : undefined}
      onTap={!isPreview ? () => onSelect(shape.id) : undefined}
    >
      {/* Inner group that applies rotation */}
      <Group rotation={rotation}>
        <Rect
          ref={shapeRef}
          x={-centerX}
          y={-centerY}
          width={shape.width}
          height={shape.height}
          fill="#8B4513" // Dark brown color
          stroke={isSelected ? "#4299E1" : "#A0AEC0"}
          strokeWidth={2}
        />
        <Text
          ref={textRef}
          x={-centerX + centerX - 40} // roughly center text; adjust as needed
          y={-centerY + centerY - 10}
          text="Alcohol Bar"
          fontSize={16}
          fontStyle="bold"
          fill="#FFFFFF"
        />
      </Group>
      {isSelected && (
        <>
          {/* Resize handles */}
          <Circle
            x={-centerX}
            y={-centerY}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "topLeft")}
          />
          <Circle
            x={centerX}
            y={-centerY}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "topRight")}
          />
          <Circle
            x={-centerX}
            y={centerY}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "bottomLeft")}
          />
          <Circle
            x={centerX}
            y={centerY}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "bottomRight")}
          />
          {/* Rotation handle */}
          <Group x={0} y={centerY + 20} onMouseDown={handleRotateStart}>
            <Circle radius={10} fill="#4CAF50" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
            <Line points={[5, -5, -5, 5]} stroke="white" strokeWidth={2} />
          </Group>
          {/* Delete button */}
          <Group x={0} y={-centerY - 20}>
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
