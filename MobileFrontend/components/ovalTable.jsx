import React from "react";
import { G, Ellipse, Circle, Text } from "react-native-svg";

// Helper: Calculate chair positions around the oval table
const calculateChairPositions = (radiusX, radiusY, seatCount) => {
  const positions = [];
  const maxSeats = Math.min(seatCount, 20);
  const offset = Math.min(radiusX, radiusY) * 0.4;

  for (let i = 0; i < maxSeats; i++) {
    const angle = (i / maxSeats) * (2 * Math.PI) - Math.PI / 2;
    const x = Math.cos(angle) * (radiusX + offset);
    const y = Math.sin(angle) * (radiusY + offset);
    positions.push({ x, y, angle });
  }

  return positions;
};

const OvalTable = ({ shape, isSelected, onPress, isReserved }) => {
  const {
    x: tableX = 0,
    y: tableY = 0,
    width: tableWidth = 200,
    height: tableHeight = 150,
    seatCount = 4,
    rotation = 0,
    tableNumber,
  } = shape;

  const radiusX = tableWidth / 2;
  const radiusY = tableHeight / 2;
  const centerX = tableWidth / 2;
  const centerY = tableHeight / 2;

  const chairPositions = calculateChairPositions(radiusX, radiusY, seatCount);

  const colors = {
    table: isReserved ? "#999999" : "#333333",
    chairFill: "#666666",
    defaultStroke: "#222222",
    selectedStroke: "#8B5CF6",
  };

  return (
    <G transform={`translate(${tableX}, ${tableY})`} onPress={onPress}>
      <G transform={`translate(${centerX}, ${centerY}) rotate(${rotation})`}>
        {isSelected && (
          <Ellipse
            cx={0}
            cy={0}
            rx={radiusX + 5}
            ry={radiusY + 5}
            stroke={colors.selectedStroke}
            strokeWidth="20"
            fill="none"
          />
        )}
        <Ellipse
          cx={0}
          cy={0}
          rx={radiusX}
          ry={radiusY}
          fill={colors.table}
          stroke={isSelected ? colors.selectedStroke : colors.defaultStroke}
          strokeWidth="2"
        />
        {tableNumber && (
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
        )}
        {chairPositions.map((pos, index) => (
          <G
            key={index}
            transform={`translate(${pos.x}, ${pos.y}) rotate(${
              (pos.angle * 180) / Math.PI
            })`}
          >
            <Circle
              cx={0}
              cy={0}
              r={
                Math.min(
                  Math.max(Math.min(tableWidth, tableHeight) * 0.2, 15),
                  30
                ) / 2
              }
              fill={colors.chairFill}
              stroke="#333"
              strokeWidth={1}
            />
            <Text
              x={0}
              y={0}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={10}
              fill="#fff"
            >
              {index + 1}
            </Text>
          </G>
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
            fontSize={14}
            fill={colors.defaultStroke}
            fontWeight="bold"
          >
            {seatCount}
          </Text>
        </G>
      )}
      {/* Reserved indicator */}
      {isReserved && (
        <G
          transform={`translate(${centerX - 32}, ${centerY + 40}) rotate(-45)`}
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

export default OvalTable;
