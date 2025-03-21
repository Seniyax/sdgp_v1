import React from "react";
import { G, Rect, Circle, Text } from "react-native-svg";

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
    table: isReserved ? "#999999" : "#333333", // change table color if reserved
    chairFill: "#666666",
    selectedStroke: "#8B5CF6",
    defaultStroke: "#222222",
    selectionDash: "#A78BFA",
  };

  // Helper: Render chairs on one side
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
          rx={2}
          ry={2}
          stroke={colors.defaultStroke}
          strokeWidth={1}
          fill={colors.chairFill}
        />
      );
    }
    return chairs;
  };

  return (
    <G transform={`translate(${x}, ${y})`} onPress={onPress}>
      <G
        transform={`translate(${tableSize / 2}, ${
          tableSize / 2
        }) rotate(${rotation})`}
      >
        {isSelected && (
          <Rect
            x={-tableSize / 2 - 5}
            y={-tableSize / 2 - 5}
            width={tableSize + 10}
            height={tableSize + 10}
            stroke={colors.selectionDash}
            strokeWidth={20}
            rx={6}
            ry={6}
            fill="none"
          />
        )}
        <Rect
          x={-tableSize / 2}
          y={-tableSize / 2}
          width={tableSize}
          height={tableSize}
          fill={colors.table}
          stroke={isSelected ? colors.selectedStroke : colors.defaultStroke}
          strokeWidth={2}
          rx={4}
          ry={4}
        />
        <Text
          x={0}
          y={0}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={24}
          fill="white"
          fontWeight="bold"
        >
          {!isReserved && tableNumber ? tableNumber.toString() : ""}
        </Text>
        {renderChairs("top", topSlots)}
        {renderChairs("right", rightSlots)}
        {renderChairs("bottom", bottomSlots)}
        {renderChairs("left", leftSlots)}
      </G>
      {isSelected && (
        <G transform={`translate(5, 5)`}>
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
            {activeChairCount}
          </Text>
        </G>
      )}

      {/* Reserved indicator */}
      {isReserved && (
        <G
          transform={`translate(${tableSize / 2 - 32}, ${
            tableSize / 2 + 40
          }) rotate(-45)`}
        >
          <Text fontSize={25} fill="red" fontWeight="bold" stroke={"black"} strokeWidth={0.8}>
            Reserved
          </Text>
        </G>
      )}
    </G>
  );
};

export default SquareTable;
