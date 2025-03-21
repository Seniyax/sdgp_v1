import React from "react";
import { G, Circle, Rect, Text } from "react-native-svg";

// Helper to calculate chair positions around the table.
function calculateChairPositions(radius, seatCount) {
  const positions = [];
  const maxSeats = Math.min(seatCount, 20);
  const offset = radius * 0.3;
  for (let i = 0; i < maxSeats; i++) {
    const angle = (i / maxSeats) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * (radius + offset);
    const y = Math.sin(angle) * (radius + offset);
    positions.push({ x, y });
  }
  return positions;
}

const CircularTable = ({ shape, isSelected, onPress, isReserved }) => {
  // Assume shape.size represents the diameter of the table.
  const size = shape.size || 50;
  const radius = size / 2;
  const rotation = shape.rotation || 0;
  const seatCount = shape.seatCount || 4;
  const chairPositions = calculateChairPositions(radius, seatCount);

  const colors = {
    table: isReserved ? "#999999" : "#333333",
    defaultStroke: "#222222",
    selectedStroke: "#8B5CF6",
  };

  return (
    <G onPress={onPress} transform={`translate(${shape.x}, ${shape.y})`}>
      <G transform={`rotate(${rotation}, ${radius}, ${radius})`}>
        {isSelected && (
          <Circle
            cx={radius}
            cy={radius}
            r={radius + 5}
            stroke={colors.selectedStroke}
            strokeWidth="20"
            fill="none"
          />
        )}
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill={colors.table}
          stroke={isSelected ? colors.selectedStroke : colors.defaultStroke}
          strokeWidth="2"
        />
        <Text
          x={radius}
          y={radius}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="24"
          fill="white"
          fontWeight="bold"
        >
          {!isReserved && shape.tableNumber ? shape.tableNumber.toString() : ""}
        </Text>
        {chairPositions.map((pos, index) => (
          <Rect
            key={index}
            x={radius + pos.x - 10}
            y={radius + pos.y - 10}
            width={20}
            height={20}
            fill="#666666"
            stroke="#222222"
            strokeWidth="1"
          />
        ))}
      </G>
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
            fontSize="14"
            fill={colors.defaultStroke}
            fontWeight="bold"
          >
            {seatCount}
          </Text>
        </G>
      )}
      {/* Reserved indicator */}
      {isReserved && (
        <G transform={`translate(${radius - 32}, ${radius + 40}) rotate(-45)`}>
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

export default CircularTable;
