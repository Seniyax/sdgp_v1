/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Group, Rect, Text, Circle } from "react-konva";

const calculateChairSlots = (seatCount) => {
  const totalSlots = Math.min(Math.ceil(seatCount / 4) * 4, 20);
  const slotsPerSide = Math.ceil(totalSlots / 4);
  return [slotsPerSide, slotsPerSide, slotsPerSide, slotsPerSide];
};

const SquareTable = ({ shape, isSelected, onPress, isReserved }) => {
  const {
    x = 0,
    y = 0,
    size = 200,
    seatCount = 4,
    rotation = 0,
    tableNumber,
  } = shape;
  const tableSize = size;
  const [topSlots, rightSlots, bottomSlots, leftSlots] =
    calculateChairSlots(seatCount);
  const activeChairCount = seatCount; // All chairs are active by default

  const minChairWidth = tableSize * 0.15;
  const chairHeight = tableSize * 0.15;
  const chairOffset = tableSize * 0.05;

  const colors = {
    table: isReserved ? "#999999" : "#333333",
    chairFill: "#666666",
    selectedStroke: "#8B5CF6",
    defaultStroke: "#222222",
    selectionDash: "#A78BFA",
  };

  // Render chairs on one side
  const renderChairs = (side, slotCount) => {
    if (slotCount <= 0) return null;
    const chairs = [];
    const isVertical = side === "left" || side === "right";
    const chairWidth = Math.max((tableSize / slotCount) * 0.8, minChairWidth);

    for (let i = 0; i < slotCount; i++) {
      let xChair = 0,
        yChair = 0;
      switch (side) {
        case "top":
          xChair =
            -tableSize / 2 +
            (tableSize -
              (chairWidth * slotCount + chairOffset * (slotCount - 1))) /
              2 +
            i * (chairWidth + chairOffset);
          yChair = -tableSize / 2 - chairHeight - chairOffset;
          break;
        case "right":
          xChair = tableSize / 2 + chairOffset;
          yChair =
            -tableSize / 2 +
            (tableSize -
              (chairWidth * slotCount + chairOffset * (slotCount - 1))) /
              2 +
            i * (chairWidth + chairOffset);
          break;
        case "bottom":
          xChair =
            -tableSize / 2 +
            (tableSize -
              (chairWidth * slotCount + chairOffset * (slotCount - 1))) /
              2 +
            i * (chairWidth + chairOffset);
          yChair = tableSize / 2 + chairOffset;
          break;
        case "left":
          xChair = -tableSize / 2 - chairHeight - chairOffset;
          yChair =
            -tableSize / 2 +
            (tableSize -
              (chairWidth * slotCount + chairOffset * (slotCount - 1))) /
              2 +
            i * (chairWidth + chairOffset);
          break;
        default:
          break;
      }
      chairs.push(
        <Rect
          key={`${side}-${i}`}
          x={xChair}
          y={yChair}
          width={isVertical ? chairHeight : chairWidth}
          height={isVertical ? chairWidth : chairHeight}
          cornerRadius={2}
          stroke={colors.defaultStroke}
          strokeWidth={1}
          fill={colors.chairFill}
        />
      );
    }
    return chairs;
  };

  return (
    <Group x={x} y={y} onClick={onPress}>
      {/* Rotated group for table and chairs */}
      <Group x={tableSize / 2} y={tableSize / 2} rotation={rotation}>
        {isSelected && !isReserved && (
          <Rect
            x={-tableSize / 2 - 5}
            y={-tableSize / 2 - 5}
            width={tableSize + 10}
            height={tableSize + 10}
            stroke={colors.selectionDash}
            strokeWidth={10}
            dash={[5, 5]}
            cornerRadius={6}
            fill="transparent"
          />
        )}
        <Rect
          x={-tableSize / 2}
          y={-tableSize / 2}
          width={tableSize}
          height={tableSize}
          fill={colors.table}
          stroke={
            isSelected && !isReserved
              ? colors.selectedStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
          cornerRadius={4}
        />
        {renderChairs("top", topSlots)}
        {renderChairs("right", rightSlots)}
        {renderChairs("bottom", bottomSlots)}
        {renderChairs("left", leftSlots)}
      </Group>
      {/* Table number rendered outside the rotated group */}
      {!isReserved && tableNumber && (
        <Text
          x={0}
          y={0}
          width={tableSize}
          height={tableSize}
          text={tableNumber.toString()}
          fontSize={24}
          fill="white"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
        />
      )}
      {isSelected && (
        <Group x={5} y={5}>
          <Circle
            x={0}
            y={0}
            radius={14}
            fill="white"
            stroke={colors.defaultStroke}
            strokeWidth={1}
          />
          <Text
            x={activeChairCount >= 10 ? -8 : -4}
            y={-7}
            text={activeChairCount.toString()}
            fontSize={14}
            fill={colors.defaultStroke}
            fontStyle="bold"
          />
        </Group>
      )}
      {isReserved && (
        <Group x={tableSize / 2 - 32} y={tableSize / 2 + 40} rotation={-45}>
          <Text
            text="Reserved"
            fontSize={25}
            fill="red"
            fontStyle="bold"
            stroke="black"
            strokeWidth={0.8}
          />
        </Group>
      )}
    </Group>
  );
};

export default SquareTable;
