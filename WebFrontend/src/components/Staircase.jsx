/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Group, Rect, Text, Circle, Line } from "react-konva";

const Staircase = ({
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
  const textRef = useRef();
  const resizeHandleSize = 8;
  const [rotation, setRotation] = useState(shape.rotation || 0);
  const direction = shape.direction || "Up";

  const handleDragEnd = (e) => {
    if (isPreview) return;
    onDragEnd(shape.id, e.target.x(), e.target.y());
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

      switch (handle) {
        case "topLeft":
          newWidth = Math.max(initialWidth - dx, 50);
          newHeight = Math.max(initialHeight - dy, 50);
          newX = initialX + (initialWidth - newWidth);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "topRight":
          newWidth = Math.max(initialWidth + dx, 50);
          newHeight = Math.max(initialHeight - dy, 50);
          newY = initialY + (initialHeight - newHeight);
          break;
        case "bottomLeft":
          newWidth = Math.max(initialWidth - dx, 50);
          newHeight = Math.max(initialHeight + dy, 50);
          newX = initialX + (initialWidth - newWidth);
          break;
        case "bottomRight":
          newWidth = Math.max(initialWidth + dx, 50);
          newHeight = Math.max(initialHeight + dy, 50);
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

  const handleDelete = (e) => {
    if (isPreview) return;
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  // Toggle direction between Up and Down
  const toggleDirection = () => {
    if (isPreview) return;
    const newDirection = direction === "Up" ? "Down" : "Up";
    onRotate(shape.id, rotation, { direction: newDirection });
  };

  return (
    <Group
      x={shape.x}
      y={shape.y}
      rotation={rotation}
      draggable={!isPreview}
      onDragEnd={isPreview ? undefined : handleDragEnd}
      onClick={!isPreview ? () => onSelect(shape.id) : undefined}
      onTap={!isPreview ? () => onSelect(shape.id) : undefined}
    >
      <Group ref={shapeRef}>
        {/*
          Generate staircase steps (static rendering)
        */}
        {(() => {
          const steps = [];
          const stepsCount = 6;
          const stepWidth = shape.width;
          const stepHeight = shape.height / stepsCount;
          for (let i = 0; i < stepsCount; i++) {
            steps.push(
              <Rect
                key={i}
                x={0}
                y={i * stepHeight}
                width={stepWidth}
                height={stepHeight - 2}
                fill="#CBD5E0"
                stroke="#A0AEC0"
                strokeWidth={1}
              />
            );
          }
          return steps;
        })()}
        <Text
          ref={textRef}
          x={shape.width / 2 - 10}
          y={shape.height / 2 - 10}
          text={direction}
          fontSize={14}
          fontStyle="bold"
          onClick={!isPreview ? toggleDirection : undefined}
          onTap={!isPreview ? toggleDirection : undefined}
        />
      </Group>

      {isSelected && (
        <>
          {/* Resize handles */}
          <Circle
            x={0}
            y={0}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={
              isPreview ? undefined : (e) => handleResizeStart(e, "topLeft")
            }
          />
          <Circle
            x={shape.width}
            y={0}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={
              isPreview ? undefined : (e) => handleResizeStart(e, "topRight")
            }
          />
          <Circle
            x={0}
            y={shape.height}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={
              isPreview ? undefined : (e) => handleResizeStart(e, "bottomLeft")
            }
          />
          <Circle
            x={shape.width}
            y={shape.height}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={
              isPreview ? undefined : (e) => handleResizeStart(e, "bottomRight")
            }
          />
          {/* Rotate button */}
          <Group
            y={shape.height + 20}
            x={shape.width / 2}
            onMouseDown={isPreview ? undefined : handleRotateStart}
          >
            <Circle radius={10} fill="#4CAF50" />
            <Text
              text="↻"
              fontSize={14}
              fill="white"
              offsetX={5}
              offsetY={7}
              align="center"
            />
          </Group>

          {/* Delete button */}
          <Group y={-20} x={shape.width / 2}>
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

export default Staircase;
