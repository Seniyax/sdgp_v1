import React from "react";
import { G, Rect, Text } from "react-native-svg";

const RegularDoor = ({ shape }) => {
  const { x = 0, y = 0, width, height, rotation = 0 } = shape;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <G
      transform={`translate(${x + centerX}, ${
        y + centerY
      }) rotate(${rotation})`}
    >
      <Rect
        x={-centerX}
        y={-centerY}
        width={width}
        height={height}
        fill="#4CAF50" // Green color for regular door
        stroke="transparent"
        strokeWidth={2}
      />
      <Text
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={Math.min(12, width / 8)}
        fill="white"
      >
        Door
      </Text>
    </G>
  );
};

export default RegularDoor;
