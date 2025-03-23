/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Group, Rect, Circle, Text } from "react-konva";

// Function to calculate how to distribute chair slots around the table
function calculateChairSlots(seatCount) {
  const totalSlots = Math.min(Math.ceil(seatCount / 4) * 4, 20);

  const slotsPerSide = Math.ceil(totalSlots / 4);
  return [slotsPerSide, slotsPerSide, slotsPerSide, slotsPerSide]; // [top, right, bottom, left]
}

// Function to calculate the active chairs based on the seat count
function calculateActiveChairs(seatCount) {
  const activeChairs = {};
  let chairCount = 0;

  const actualSeatCount = Math.min(seatCount, 20);

  const sides = ["top", "right", "bottom", "left"];
  const [topSlots, rightSlots, bottomSlots, leftSlots] =
    calculateChairSlots(actualSeatCount);
  const slots = [topSlots, rightSlots, bottomSlots, leftSlots];

  // Distribute the chairs across the four sides of the table
  for (
    let sideIndex = 0;
    chairCount < actualSeatCount;
    sideIndex = (sideIndex + 1) % 4
  ) {
    const side = sides[sideIndex];
    const maxSlotsForSide = slots[sideIndex];

    for (let i = 0; i < maxSlotsForSide && chairCount < actualSeatCount; i++) {
      activeChairs[`${side}-${i}`] = true;
      chairCount++;
    }
  }

  return activeChairs;
}

// SquareTable component with separate rotation for table and chairs
function SquareTable({
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
  const [topSlots, rightSlots, bottomSlots, leftSlots] =
    calculateChairSlots(seatCount);

  const initialActiveChairs = calculateActiveChairs(seatCount);

  const [activeChairCount, setActiveChairCount] = useState(seatCount);

  useEffect(() => {
    if (shape.onRotate) {
      shape.onRotate(shape.id, rotation);
    }
  }, [rotation, shape.id]);

  useEffect(() => {
    if (shape.onChairsUpdate) {
      shape.onChairsUpdate(shape.id, toggledChairs);
    }
  }, [toggledChairs, shape.id]);

  // Handle table rotation interaction
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

      if (shape.onRotate) {
        shape.onRotate(shape.id, newRotation);
      }
    };

    const onMouseUp = () => {
      stage.off("mousemove", onMouseMove);
      stage.off("mouseup", onMouseUp);
    };

    stage.on("mousemove", onMouseMove);
    stage.on("mouseup", onMouseUp);
  };

  // Update active chair count based on toggled chairs
  useEffect(() => {
    let count = 0;

    const sides = ["top", "right", "bottom", "left"];
    const slots = [topSlots, rightSlots, bottomSlots, leftSlots];

    sides.forEach((side, sideIndex) => {
      const slotsForSide = slots[sideIndex];

      for (let i = 0; i < slotsForSide; i++) {
        const chairKey = `${side}-${i}`;

        if (toggledChairs[chairKey] !== undefined) {
          if (!toggledChairs[chairKey]) {
            count++;
          }
        } else if (initialActiveChairs[chairKey]) {
          count++;
        }
      }
    });

    setActiveChairCount(count);
  }, [
    toggledChairs,
    initialActiveChairs,
    topSlots,
    rightSlots,
    bottomSlots,
    leftSlots,
  ]);

  // Handle resize interaction
  const handleResizeMouseDown = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const initialPointer = stage.getPointerPosition();
    const initialSize = shape.size;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const diffX = pos.x - initialPointer.x;
      const newSize = Math.min(Math.max(initialSize + diffX, 60), 400);
      onResize(shape.id, newSize);
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

  // Handle delete interaction
  const handleDelete = (e) => {
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  // Toggle chair state on click
  const toggleChair = (side, index) => {
    const chairKey = `${side}-${index}`;
    const newToggledChairs = {
      ...toggledChairs,
      [chairKey]: !toggledChairs[chairKey],
    };
    setToggledChairs(newToggledChairs);
  };

  // Check if chair is active (enabled or disabled)
  const isChairActive = (side, index) => {
    const chairKey = `${side}-${index}`;

    if (toggledChairs[chairKey] !== undefined) {
      return !toggledChairs[chairKey];
    }

    return initialActiveChairs[chairKey] === true;
  };

  const tableSize = shape.size;
  const minChairWidth = tableSize * 0.15;
  const chairHeight = tableSize * 0.15;
  const chairOffset = tableSize * 0.05;

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
      {/* Rotatable group containing table, chairs, and selection outline */}
      <Group
        ref={tableGroupRef}
        rotation={rotation}
        x={tableSize / 2}
        y={tableSize / 2}
      >
        {/* Selection outline */}
        {isSelected && (
          <Rect
            width={tableSize + 10}
            height={tableSize + 10}
            x={-tableSize / 2 - 5}
            y={-tableSize / 2 - 5}
            stroke={colors.selectionDash}
            strokeWidth={2}
            dash={[5, 5]}
            cornerRadius={6}
            perfectDrawEnabled={false}
          />
        )}

        {/* Table */}
        <Rect
          width={tableSize}
          height={tableSize}
          x={-tableSize / 2}
          y={-tableSize / 2}
          fill={colors.table}
          stroke={
            isSelected
              ? colors.selectedStroke
              : isHovered
              ? colors.hoverStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
          cornerRadius={4}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={isSelected || isHovered ? 6 : 0}
          shadowOffset={{ x: 0, y: 2 }}
          shadowOpacity={0.3}
        />

        <Text
          text={shape.tableNumber ? shape.tableNumber.toString() : ""}
          fontSize={24} // adjust as needed
          fill="white" // choose a contrasting color
          x={-tableSize / 2} // ensures centering horizontally
          y={-tableSize / 2} // ensures centering vertically
          width={tableSize}
          height={tableSize}
          align="center"
          verticalAlign="middle"
          fontStyle="bold"
        />

        {/* Chair rendering for top, right, bottom, and left */}
        {["top", "right", "bottom", "left"].map((side, sideIndex) => {
          const slots = [topSlots, rightSlots, bottomSlots, leftSlots];
          const chairArray = Array.from({ length: slots[sideIndex] });

          return chairArray.map((_, i) => {
            const chairWidth = Math.max(
              (tableSize / slots[sideIndex]) * 0.8,
              minChairWidth
            );
            const totalChairsWidth =
              chairWidth * slots[sideIndex] +
              chairOffset * (slots[sideIndex] - 1);
            const startX = -totalChairsWidth / 2;
            const startY = -totalChairsWidth / 2;
            const x =
              side === "top" || side === "bottom"
                ? startX + i * (chairWidth + chairOffset)
                : side === "right"
                ? tableSize / 2 + chairOffset
                : -tableSize / 2 - chairHeight - chairOffset;
            const y =
              side === "top" || side === "bottom"
                ? side === "top"
                  ? -tableSize / 2 - chairHeight - chairOffset
                  : tableSize / 2 + chairOffset
                : startY + i * (chairWidth + chairOffset);

            const isActive = isChairActive(side, i);

            return (
              <Rect
                key={`${side}-${i}`}
                x={x}
                y={y}
                width={
                  side === "left" || side === "right" ? chairHeight : chairWidth
                }
                height={
                  side === "left" || side === "right" ? chairWidth : chairHeight
                }
                cornerRadius={2}
                stroke={colors.defaultStroke}
                strokeWidth={1}
                dash={isActive ? [] : [2, 2]}
                opacity={isActive ? 1 : 0.5}
                fill={isActive ? colors.chairFill : undefined}
                onClick={(e) => {
                  e.cancelBubble = true;
                  toggleChair(side, i);
                }}
              />
            );
          });
        })}
      </Group>

      {/* Control buttons */}
      {(isSelected || isHovered) && (
        <>
          {/* Delete button */}
          <Group x={tableSize - 5} y={5} onMouseDown={handleDelete}>
            <Circle radius={10} fill={colors.deleteButton} />
            <Text text="×" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>

          {/* Rotate button */}
          <Group x={5} y={tableSize - 5} onMouseDown={handleRotateStart}>
            <Circle radius={10} fill={colors.rotateButton} />
            <Text text="↻" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>

          {/* Resize handle */}
          <Group
            x={tableSize - 10}
            y={tableSize - 10}
            onMouseDown={handleResizeMouseDown}
          >
            <Circle radius={10} fill={colors.resizeButton} />
            <Text text="↘" fontSize={12} fill="white" x={-5} y={-7} />
          </Group>
        </>
      )}

      {/* Seat count indicator */}
      {isSelected && (
        <Group x={5} y={5}>
          <Circle
            radius={14}
            fill="white"
            stroke={colors.defaultStroke}
            strokeWidth={1}
          />
          <Text
            text={activeChairCount}
            fontSize={14}
            fill={colors.defaultStroke}
            x={activeChairCount >= 10 ? -8 : -4}
            y={-7}
            fontStyle="bold"
          />
        </Group>
      )}
    </Group>
  );
}

export default SquareTable;
