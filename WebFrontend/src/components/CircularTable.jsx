/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Group, Circle, Rect, Text } from "react-konva";

// Distributes chairs evenly around the table
function calculateChairPositions(radius, seatCount) {
  const positions = [];
  const maxSeats = Math.min(seatCount, 20);
  const offset = radius * 0.3;

  for (let i = 0; i < maxSeats; i++) {
    const angle = (i / maxSeats) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * (radius + offset);
    const y = Math.sin(angle) * (radius + offset);
    positions.push({ x, y, angle });
  }

  return positions;
}

function CircularTable({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onResize,
  onDelete,
}) {
  const groupRef = useRef();
  const tableGroupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(shape.rotation || 0);
  const [toggledChairs, setToggledChairs] = useState(shape.toggledChairs || {});

  const seatCount = shape.seatCount || 4;
  const radius = shape.size / 2;
  const chairPositions = calculateChairPositions(radius, seatCount);

  // Determines if a chair is active
  const isChairActive = useCallback(
    (index) => toggledChairs[index] !== true,
    [toggledChairs]
  );

  const [activeChairCount, setActiveChairCount] = useState(seatCount);

  useEffect(() => {
    let count = 0;
    chairPositions.forEach((_, index) => {
      if (isChairActive(index)) count++;
    });
    setActiveChairCount(count);
  }, [toggledChairs, chairPositions, isChairActive]);

  // Notify parent of rotation changes
  useEffect(() => {
    if (shape.onRotate && rotation !== shape.rotation) {
      shape.onRotate(shape.id, rotation);
    }
  }, [rotation, shape.id, shape.rotation]);

  // Notify parent when chair states change
  useEffect(() => {
    if (shape.onChairsUpdate) {
      shape.onChairsUpdate(shape.id, toggledChairs);
    }
  }, [toggledChairs, shape.id]);

  // Handles rotation by tracking mouse movement
  const handleRotateStart = (e) => {
    e.cancelBubble = true;

    const stage = groupRef.current.getStage();
    const centerX = shape.size / 2;
    const centerY = shape.size / 2;
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
      if (shape.onRotate) shape.onRotate(shape.id, newRotation);
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
    };

    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Handles resizing
  const handleResizeMouseDown = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const initialPointer = stage.getPointerPosition();
    const initialSize = shape.size;
    const initialCenter = {
      x: shape.x + initialSize / 2,
      y: shape.y + initialSize / 2,
    };

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const delta = Math.max(
        pos.x - initialPointer.x,
        pos.y - initialPointer.y
      );
      const newSize = Math.min(Math.max(initialSize + delta, 60), 400);
      const newX = initialCenter.x - newSize / 2;
      const newY = initialCenter.y - newSize / 2;
      onResize(shape.id, newSize, newX, newY);
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

  // Handles deletion
  const handleDelete = (e) => {
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  // Toggles chair visibility
  const toggleChair = (index) => {
    setToggledChairs({ ...toggledChairs, [index]: !toggledChairs[index] });
  };

  // Colors for table and controls
  const colors = {
    table: "#333333",
    chairFill: "#666666",
    selectedStroke: "#8B5CF6",
    hoverStroke: "#C4B5FD",
    defaultStroke: "#222222",
    deleteButton: "#FF5252",
    resizeButton: "#8B5CF6",
    rotateButton: "#4CAF50",
    selectionDash: "#A78BFA",
  };

  const chairSize = Math.min(Math.max(shape.size * 0.2, 15), 30);

  return (
    <Group
      x={shape.x}
      y={shape.y}
      draggable
      ref={groupRef}
      onDragEnd={(e) => onDragEnd(shape.id, e.target.x(), e.target.y())}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(shape.id);
      }}
    >
      {/* Dashed selection outline */}
      {isSelected && (
        <Circle
          x={shape.size / 2}
          y={shape.size / 2}
          radius={radius + 5}
          stroke={colors.selectionDash}
          strokeWidth={2}
          dash={[5, 5]}
          perfectDrawEnabled={false}
        />
      )}

      {/* Rotatable group */}
      <Group
        ref={tableGroupRef}
        rotation={rotation}
        x={shape.size / 2}
        y={shape.size / 2}
      >
        {/* Table */}
        <Circle
          radius={radius}
          fill={colors.table}
          stroke={
            isSelected
              ? colors.selectedStroke
              : isHovered
              ? colors.hoverStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={isSelected || isHovered ? 6 : 0}
          shadowOffset={{ x: 0, y: 2 }}
          shadowOpacity={0.3}
        />

        {/* Chairs */}
        {chairPositions.map((pos, index) => (
          <Group
            key={index}
            x={pos.x}
            y={pos.y}
            rotation={(pos.angle * 180) / Math.PI}
            onClick={(e) => {
              e.cancelBubble = true;
              toggleChair(index);
            }}
          >
            <Rect
              x={-chairSize / 2}
              y={-chairSize / 2}
              width={chairSize}
              height={chairSize}
              cornerRadius={2}
              stroke={colors.defaultStroke}
              strokeWidth={1}
              dash={isChairActive(index) ? [] : [2, 2]}
              opacity={isChairActive(index) ? 1 : 0.5}
              fill={isChairActive(index) ? colors.chairFill : undefined}
            />
          </Group>
        ))}
      </Group>

      {/* Controls */}
      {(isSelected || isHovered) && (
        <>
          <Group x={radius * 2 - 10} y={10} onMouseDown={handleDelete}>
            <Circle radius={10} fill={colors.deleteButton} />
            <Text text="×" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>
        </>
      )}
    </Group>
  );
}

export default CircularTable;
