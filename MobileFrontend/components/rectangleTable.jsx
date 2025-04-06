import React from "react";
import { G, Rect, Text, Circle } from "react-native-svg";

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
        rx={2}
        ry={2}
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
    <G transform={`translate(${x}, ${y})`} onPress={onPress}>
      <G
        transform={`translate(${tableWidth / 2}, ${
          tableHeight / 2
        }) rotate(${rotation})`}
      >
        {isSelected && (
          <Rect
            x={-tableWidth / 2 - 5}
            y={-tableHeight / 2 - 5}
            width={tableWidth + 10}
            height={tableHeight + 10}
            stroke={colors.selectedStroke}
            strokeWidth={20}
            rx={6}
            ry={6}
            fill="none"
          />
        )}
        <Rect
          x={-tableWidth / 2}
          y={-tableHeight / 2}
          width={tableWidth}
          height={tableHeight}
          fill={colors.table}
          stroke={isSelected ? colors.selectedStroke : colors.defaultStroke}
          strokeWidth={2}
          rx={4}
          ry={4}
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
      </G>
      {!isReserved && tableNumber && (
        <Text
          x={tableWidth / 2}
          y={tableHeight / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={24}
          fill="white"
          fontWeight="bold"
        >
          {tableNumber.toString()}
        </Text>
      )}
      {isSelected && (
        <G transform="translate(5,5)">
          <Circle
            cx={0}
            cy={0}
            r={14}
            fill="white"
            stroke={colors.defaultStroke}
            strokeWidth={1}
          />
          <Text
            x={0}
            y={0}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={14}
            fill={colors.defaultStroke}
            fontWeight="bold"
          >
            {seatCount}
          </Text>
        </G>
      )}
      {isReserved && (
        <G
          transform={`translate(${tableWidth / 2 - 32}, ${
            tableHeight / 2 + 40
          }) rotate(-45)`}
        >
          <Text
            fontSize={25}
            fill="red"
            fontWeight="bold"
            stroke="black"
            strokeWidth={0.8}
          >
            Reserved
          </Text>
        </G>
      )}
    </G>
  );
};

export default RectangleTable;
