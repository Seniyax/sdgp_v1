/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Group, Path, Circle, Line } from "react-konva";

const CurvedWall = ({
  shape,
  isSelected,
  isPreview,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
  onRotate,
  onThicknessResize, // new callback prop for adjusting thickness
}) => {
  const shapeRef = useRef();
  const resizeHandleSize = 8;
  const [rotation, setRotation] = useState(shape.rotation || 0);

  const generateCenteredPath = () => {
    const w = shape.width;
    const h = shape.height;
    return `M${-w / 2},${-h / 2} Q0,${h / 2} ${w / 2},${-h / 2}`;
  };

  // Convert the drag end center back to top-left
  const handleDragEnd = (e) => {
    const newCenterX = e.target.x();
    const newCenterY = e.target.y();
    const newX = newCenterX - shape.width / 2;
    const newY = newCenterY - shape.height / 2;
    onDragEnd(shape.id, newX, newY);
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
      if (handle === "right") newWidth = Math.max(initialWidth + dx, 50);
      if (handle === "bottom") newHeight = Math.max(initialHeight + dy, 20);
      onResize(shape.id, initialX, initialY, newWidth, newHeight);
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.body.style.cursor = handle === "right" ? "ew-resize" : "ns-resize";
    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  const handleThicknessResizeStart = (e) => {
    if (isPreview) return;
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const initialPos = stage.getPointerPosition();
    const initialThickness = shape.thickness || 15;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const dx = pos.x - initialPos.x;
      const newThickness = Math.max(initialThickness - dx, 1);
      if (onThicknessResize) {
        onThicknessResize(shape.id, newThickness);
      }
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.body.style.cursor = "ew-resize";
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
      {/* Rotating group that holds the curved wall path */}
      <Group rotation={rotation}>
        <Path
          ref={shapeRef}
          data={generateCenteredPath()}
          stroke="#CBD5E0"
          strokeWidth={shape.thickness || 15}
        />
      </Group>

      {isSelected && !isPreview && (
        <>
          {/* Resize handles for width and height */}
          <Circle
            x={shape.width / 2}
            y={-shape.height / 2}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "right")}
          />
          <Circle
            x={0}
            y={shape.height / 2}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          />
          {/* New thickness resize handle */}
          <Circle
            x={-shape.width / 2 - 20}
            y={0}
            radius={resizeHandleSize / 2}
            fill="#FFA500"
            onMouseDown={handleThicknessResizeStart}
          />

          {/* Rotate button */}
          <Group
            x={0}
            y={shape.height / 2 + 20}
            onMouseDown={handleRotateStart}
          >
            <Circle radius={10} fill="#4CAF50" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
            <Line points={[5, -5, -5, 5]} stroke="white" strokeWidth={2} />
          </Group>

          {/* Delete button */}
          <Group x={0} y={-shape.height / 2 - 20} onClick={handleDelete}>
            <Circle radius={10} fill="red" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
            <Line points={[-5, 5, 5, -5]} stroke="white" strokeWidth={2} />
          </Group>
        </>
      )}
    </Group>
  );
};

export default CurvedWall;
