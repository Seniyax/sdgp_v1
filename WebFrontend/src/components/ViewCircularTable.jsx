/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Group, Circle, Rect, Text } from "react-konva";

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

const CircularTable = ({ shape, isSelected, onPress, isReserved }) => {
  const size = shape.size || 50;
  const radius = size / 2;
  const rotation = shape.rotation || 0;
  const seatCount = shape.seatCount || 4;
  const chairPositions = calculateChairPositions(radius, seatCount);
  const chairSize = Math.min(Math.max(size * 0.2, 15), 30);

  const colors = {
    table: isReserved ? "#999999" : "#333333",
    defaultStroke: "#222222",
    selectedStroke: "#8B5CF6",
  };

  return (
    <Group x={shape.x} y={shape.y} onClick={onPress}>
      {/* Rotated group for table and chairs */}
      <Group x={size / 2} y={size / 2} rotation={rotation}>
        {isSelected && !isReserved && (
          <Circle
            x={0}
            y={0}
            radius={radius + 5}
            stroke={colors.selectedStroke}
            strokeWidth={10}
            dash={[5, 5]}
            fill="transparent"
          />
        )}
        <Circle
          radius={radius}
          fill={colors.table}
          stroke={
            isSelected && !isReserved
              ? colors.selectedStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
        />
        {chairPositions.map((pos, index) => (
          <Group
            key={index}
            x={pos.x}
            y={pos.y}
            rotation={(pos.angle * 180) / Math.PI}
          >
            <Rect
              x={-chairSize / 2}
              y={-chairSize / 2}
              width={chairSize}
              height={chairSize}
              cornerRadius={2}
              stroke={colors.defaultStroke}
              strokeWidth={1}
              fill="#666666"
            />
          </Group>
        ))}
      </Group>
      {/* Render table number outside the rotated group */}
      {shape.tableNumber && !isReserved && (
        <Text
          x={size / 2}
          y={size / 2}
          width={size}
          height={size}
          text={shape.tableNumber.toString()}
          fontSize={24}
          fill="white"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          offset={{ x: size / 2, y: size / 2 }}
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
        <Group x={radius - 32} y={radius + 40} rotation={-45}>
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

export default CircularTable;
