/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Group, Rect, Text, Circle } from "react-konva";

const calculateChairSlots = (seatCount) => {
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
};

const renderChairs = (
  side,
  slotCount,
  tableWidth,
  tableHeight,
  chairHeight,
  chairOffset,
  minChairWidth
) => {
  if (slotCount <= 0) return null;
  const chairs = [];
  const isVertical = side === "left" || side === "right";
  const sideLength = isVertical ? tableHeight : tableWidth;
  const chairWidth = Math.max((sideLength / slotCount) * 0.8, minChairWidth);

  for (let i = 0; i < slotCount; i++) {
    let x = 0,
      y = 0;
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
        break;
    }
    chairs.push(
      <Rect
        key={`${side}-${i}`}
        x={x}
        y={y}
        width={isVertical ? chairHeight : chairWidth}
        height={isVertical ? chairWidth : chairHeight}
        cornerRadius={2}
        stroke="#222222"
        strokeWidth={1}
        fill="#666666"
      />
    );
  }
  return chairs;
};

const RectangleTable = ({ shape, isSelected, onPress, isReserved }) => {
  const {
    seatCount = 6,
    x = 0,
    y = 0,
    width = 200,
    rotation = 0,
    tableNumber,
  } = shape;

  const [topSlots, rightSlots, bottomSlots, leftSlots] =
    calculateChairSlots(seatCount);
  const tableWidth = width;
  const tableHeight = tableWidth * 2;
  const minChairWidth = Math.min(tableWidth, tableHeight) * 0.15;
  const chairHeight = Math.min(tableWidth, tableHeight) * 0.15;
  const chairOffset = Math.min(tableWidth, tableHeight) * 0.05;

  const colors = {
    table: isReserved ? "#999999" : "#333333",
    selectedStroke: "#8B5CF6",
    defaultStroke: "#222222",
  };

  return (
    <Group x={x} y={y} onClick={onPress}>
      <Group x={tableWidth / 2} y={tableHeight / 2} rotation={rotation}>
        {isSelected && !isReserved && (
          <Rect
            x={-tableWidth / 2 - 5}
            y={-tableHeight / 2 - 5}
            width={tableWidth + 10}
            height={tableHeight + 10}
            stroke={colors.selectedStroke}
            strokeWidth={10}
            dash={[5, 5]}
            cornerRadius={6}
            fill="transparent"
          />
        )}
        <Rect
          x={-tableWidth / 2}
          y={-tableHeight / 2}
          width={tableWidth}
          height={tableHeight}
          fill={colors.table}
          stroke={
            isSelected && !isReserved
              ? colors.selectedStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
          cornerRadius={4}
        />
        <Text
          x={-tableWidth / 2}
          y={-tableHeight / 2}
          width={tableWidth}
          height={tableHeight}
          text={!isReserved && tableNumber ? tableNumber.toString() : ""}
          fontSize={24}
          fill="white"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
        />
        {renderChairs(
          "top",
          topSlots,
          tableWidth,
          tableHeight,
          chairHeight,
          chairOffset,
          minChairWidth
        )}
        {renderChairs(
          "right",
          rightSlots,
          tableWidth,
          tableHeight,
          chairHeight,
          chairOffset,
          minChairWidth
        )}
        {renderChairs(
          "bottom",
          bottomSlots,
          tableWidth,
          tableHeight,
          chairHeight,
          chairOffset,
          minChairWidth
        )}
        {renderChairs(
          "left",
          leftSlots,
          tableWidth,
          tableHeight,
          chairHeight,
          chairOffset,
          minChairWidth
        )}
      </Group>
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
            x={0}
            y={0}
            text={seatCount.toString()}
            fontSize={14}
            fill={colors.defaultStroke}
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}
      {isReserved && (
        <Group x={tableWidth / 2 - 32} y={tableHeight / 2 + 40} rotation={-45}>
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

export default RectangleTable;
