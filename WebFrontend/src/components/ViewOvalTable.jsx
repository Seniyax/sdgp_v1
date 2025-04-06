/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Group, Ellipse, Circle, Text } from "react-konva";

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
  const chairSize = Math.min(
    Math.max(Math.min(tableWidth, tableHeight) * 0.2, 15),
    30
  );

  const colors = {
    table: isReserved ? "#999999" : "#333333",
    chairFill: "#666666",
    defaultStroke: "#222222",
    selectedStroke: "#8B5CF6",
    selectionDash: "#A78BFA",
  };

  return (
    <Group x={tableX} y={tableY} onClick={onPress}>
      {/* Rotated group for table and chairs */}
      <Group x={centerX} y={centerY} rotation={rotation}>
        {isSelected && !isReserved && (
          <Ellipse
            radiusX={radiusX + 5}
            radiusY={radiusY + 5}
            stroke={colors.selectionDash}
            strokeWidth={10}
            dash={[5, 5]}
            perfectDrawEnabled={false}
          />
        )}
        <Ellipse
          radiusX={radiusX}
          radiusY={radiusY}
          fill={colors.table}
          stroke={
            isSelected && !isReserved
              ? colors.selectedStroke
              : colors.defaultStroke
          }
          strokeWidth={2}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={isSelected ? 6 : 0}
          shadowOffset={{ x: 0, y: 2 }}
          shadowOpacity={0.3}
        />
        {chairPositions.map((pos, index) => (
          <Group
            key={index}
            x={pos.x}
            y={pos.y}
            rotation={(pos.angle * 180) / Math.PI}
            onClick={(e) => {
              e.cancelBubble = true;
            }}
          >
            <Circle
              x={0}
              y={0}
              radius={chairSize / 2}
              fill={colors.chairFill}
              stroke="#333"
              strokeWidth={1}
            />
          </Group>
        ))}
      </Group>
      {/* Render table number outside the rotated group so it stays upright */}
      {tableNumber && !isReserved && (
        <Text
          x={0}
          y={0}
          width={tableWidth}
          height={tableHeight}
          text={tableNumber.toString()}
          fontSize={24}
          fill="white"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
        />
      )}
      {isReserved && (
        <Group x={centerX - 32} y={centerY + 40} rotation={-45}>
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

export default OvalTable;
