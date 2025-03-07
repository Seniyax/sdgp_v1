/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Group, Path, Circle, Line } from "react-konva";

const CurvedWall = ({
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

  // Generate a simple curved path
  const generatePath = () => {
    return `M0,0 Q${shape.width / 2},${shape.height} ${shape.width},0`;
  };

  const handleDragEnd = (e) => {
    onDragEnd(shape.id, e.target.x(), e.target.y());
  };

  // Rotate the shape smoothly
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

  // Resize the curved wall
  const handleResizeStart = (e, handle) => {
    e.cancelBubble = true;
    const stage = shapeRef.current.getStage();
    const initialPos = stage.getPointerPosition();
    const initialWidth = shape.width;
    const initialHeight = shape.height;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const dx = pos.x - initialPos.x;
      const dy = pos.y - initialPos.y;

      let newWidth = initialWidth;
      let newHeight = initialHeight;

      if (handle === "right") newWidth = Math.max(initialWidth + dx, 50);
      if (handle === "bottom") newHeight = Math.max(initialHeight + dy, 20);

      onResize(shape.id, shape.x, shape.y, newWidth, newHeight);
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
      {/* Curved wall */}
      <Path
        ref={shapeRef}
        data={generatePath()}
        stroke="#808080"
        strokeWidth={15}
      />

      {isSelected && (
        <>
          {/* Resize handles */}
          <Circle
            x={shape.width}
            y={0}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "right")}
          />

          <Circle
            x={shape.width / 2}
            y={shape.height}
            radius={resizeHandleSize / 2}
            fill="#4299E1"
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          />

          {/* Rotate button */}
          <Group
            x={shape.width / 2}
            y={shape.height + 20}
            onMouseDown={handleRotateStart}
          >
            <Circle radius={10} fill="#4CAF50" />
            <Line points={[-5, -5, 5, 5]} stroke="white" strokeWidth={2} />
            <Line points={[5, -5, -5, 5]} stroke="white" strokeWidth={2} />
          </Group>

          {/* Delete button */}
          <Group x={shape.width / 2} y={-20} onClick={handleDelete}>
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
