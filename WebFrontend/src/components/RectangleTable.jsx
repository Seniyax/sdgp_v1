/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Group, Rect, Circle, Text } from "react-konva";

// Calculate chair distribution based on seat count
function calculateChairSlots(seatCount) {
  let longSideChairs, shortSideChairs;

  if (seatCount <= 6) {
    longSideChairs = 2;
    shortSideChairs = 1;
  } else if (seatCount <= 10) {
    longSideChairs = 4;
    shortSideChairs = 1;
  } else if (seatCount <= 16) {
    longSideChairs = 6;
    shortSideChairs = 2;
  } else {
    longSideChairs = 8;
    shortSideChairs = 2;
  }
  return [shortSideChairs, longSideChairs, shortSideChairs, longSideChairs];
}

// Determine which chairs are active based on seat count
function calculateActiveChairs(seatCount) {
  const activeChairs = {};
  let chairCount = 0;
  const sides = ["top", "right", "bottom", "left"];
  const [topSlots, rightSlots, bottomSlots, leftSlots] =
    calculateChairSlots(seatCount);
  const slots = [topSlots, rightSlots, bottomSlots, leftSlots];

  for (
    let sideIndex = 0;
    chairCount < seatCount;
    sideIndex = (sideIndex + 1) % 4
  ) {
    const side = sides[sideIndex];
    const maxSlotsForSide = slots[sideIndex];

    for (let i = 0; i < maxSlotsForSide && chairCount < seatCount; i++) {
      activeChairs[`${side}-${i}`] = true;
      chairCount++;
    }
  }
  return activeChairs;
}

function RectangleTable({
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

  const seatCount = shape.seatCount || 6;
  const [topSlots, rightSlots, bottomSlots, leftSlots] =
    calculateChairSlots(seatCount);
  const initialActiveChairs = calculateActiveChairs(seatCount);
  const [activeChairCount, setActiveChairCount] = useState(seatCount);

  const tableWidth = shape.width || 200;
  const tableHeight = tableWidth * 2;
  const minChairWidth = Math.min(tableWidth, tableHeight) * 0.15;
  const chairHeight = Math.min(tableWidth, tableHeight) * 0.15;
  const chairOffset = Math.min(tableWidth, tableHeight) * 0.05;

  useEffect(() => {
    if (shape.onRotate && rotation !== shape.rotation) {
      shape.onRotate(shape.id, rotation);
    }
  }, [rotation, shape.id, shape.rotation]);

  useEffect(() => {
    if (shape.onChairsUpdate) {
      shape.onChairsUpdate(shape.id, toggledChairs);
    }
  }, [toggledChairs, shape.id]);

  const handleRotateStart = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const centerX = tableWidth / 2;
    const centerY = tableHeight / 2;
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

  useEffect(() => {
    let count = 0;
    const sides = ["top", "right", "bottom", "left"];
    const slots = [topSlots, rightSlots, bottomSlots, leftSlots];

    sides.forEach((side, sideIndex) => {
      const slotsForSide = slots[sideIndex];
      for (let i = 0; i < slotsForSide; i++) {
        const chairKey = `${side}-${i}`;
        if (toggledChairs[chairKey] !== undefined) {
          if (!toggledChairs[chairKey]) count++;
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

  const handleResizeMouseDown = (e) => {
    e.cancelBubble = true;
    const stage = groupRef.current.getStage();
    const initialPointer = stage.getPointerPosition();
    const initialWidth = tableWidth;

    const onMouseMove = () => {
      const pos = stage.getPointerPosition();
      const diffX = pos.x - initialPointer.x;
      const newWidth = Math.min(Math.max(initialWidth + diffX, 50), 320);
      const newHeight = newWidth * 2;
      const newX = shape.x + (initialWidth - newWidth) / 2;
      const newY = shape.y + (initialWidth * 2 - newHeight) / 2;

      onResize(shape.id, newWidth, newHeight, newX, newY);
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
    e.cancelBubble = true;
    onDelete(shape.id);
  };

  const toggleChair = (side, index) => {
    const chairKey = `${side}-${index}`;
    const newToggledChairs = {
      ...toggledChairs,
      [chairKey]: !toggledChairs[chairKey],
    };
    setToggledChairs(newToggledChairs);
  };

  const isChairActive = (side, index) => {
    const chairKey = `${side}-${index}`;
    if (toggledChairs[chairKey] !== undefined) {
      return !toggledChairs[chairKey];
    }
    return initialActiveChairs[chairKey] === true;
  };

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

  const renderChairs = (side, slotCount) => {
    if (slotCount <= 0) return null;
    const chairs = [];
    const isLongSide = side === "right" || side === "left";
    const sideLength = isLongSide ? tableHeight : tableWidth;
    const chairWidth = Math.max((sideLength / slotCount) * 0.8, minChairWidth);

    for (let i = 0; i < slotCount; i++) {
      let x, y;
      const isVertical = side === "left" || side === "right";

      switch (side) {
        case "top":
          x =
            -tableWidth / 2 +
            (tableWidth -
              chairWidth * slotCount -
              (slotCount - 1) * chairOffset) /
              2 +
            i * (chairWidth + chairOffset);
          y = -tableHeight / 2 - chairHeight - chairOffset;
          break;
        case "right":
          x = tableWidth / 2 + chairOffset;
          y =
            -tableHeight / 2 +
            (tableHeight -
              chairWidth * slotCount -
              (slotCount - 1) * chairOffset) /
              2 +
            i * (chairWidth + chairOffset);
          break;
        case "bottom":
          x =
            -tableWidth / 2 +
            (tableWidth -
              chairWidth * slotCount -
              (slotCount - 1) * chairOffset) /
              2 +
            i * (chairWidth + chairOffset);
          y = tableHeight / 2 + chairOffset;
          break;
        case "left":
          x = -tableWidth / 2 - chairHeight - chairOffset;
          y =
            -tableHeight / 2 +
            (tableHeight -
              chairWidth * slotCount -
              (slotCount - 1) * chairOffset) /
              2 +
            i * (chairWidth + chairOffset);
          break;
        default:
          x = 0;
          y = 0;
      }

      const isActive = isChairActive(side, i);
      chairs.push(
        <Group
          key={`${side}-${i}`}
          onClick={(e) => {
            e.cancelBubble = true;
            toggleChair(side, i);
          }}
        >
          <Rect
            x={x}
            y={y}
            width={isVertical ? chairHeight : chairWidth}
            height={isVertical ? chairWidth : chairHeight}
            cornerRadius={2}
            stroke={colors.defaultStroke}
            strokeWidth={1}
            dash={isActive ? [] : [2, 2]}
            opacity={isActive ? 1 : 0.5}
            fill={isActive ? colors.chairFill : undefined}
          />
        </Group>
      );
    }
    return chairs;
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
      <Group
        ref={tableGroupRef}
        rotation={rotation}
        x={tableWidth / 2}
        y={tableHeight / 2}
      >
        {isSelected && (
          <Rect
            width={tableWidth + 10}
            height={tableHeight + 10}
            x={-tableWidth / 2 - 5}
            y={-tableHeight / 2 - 5}
            stroke={colors.selectionDash}
            strokeWidth={2}
            dash={[5, 5]}
            cornerRadius={6}
            perfectDrawEnabled={false}
          />
        )}
        <Rect
          width={tableWidth}
          height={tableHeight}
          x={-tableWidth / 2}
          y={-tableHeight / 2}
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
          x={-tableWidth / 2} // ensures centering horizontally
          y={-tableHeight / 2} // ensures centering vertically
          width={tableWidth}
          height={tableHeight}
          align="center"
          verticalAlign="middle"
          fontStyle="bold"
        />

        {renderChairs("top", topSlots)}
        {renderChairs("right", rightSlots)}
        {renderChairs("bottom", bottomSlots)}
        {renderChairs("left", leftSlots)}
      </Group>

      {(isSelected || isHovered) && (
        <>
          <Group x={tableWidth - 5} y={5} onMouseDown={handleDelete}>
            <Circle radius={10} fill={colors.deleteButton} />
            <Text text="×" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>

          <Group x={5} y={tableHeight - 5} onMouseDown={handleRotateStart}>
            <Circle radius={10} fill={colors.rotateButton} />
            <Text text="↻" fontSize={16} fill="white" x={-5} y={-8} />
          </Group>

          <Group
            x={tableWidth - 10}
            y={tableHeight - 10}
            onMouseDown={handleResizeMouseDown}
          >
            <Circle radius={10} fill={colors.resizeButton} />
            <Text text="↘" fontSize={12} fill="white" x={-5} y={-7} />
          </Group>
        </>
      )}

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

export default RectangleTable;
