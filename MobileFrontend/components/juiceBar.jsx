import React from "react";
import { G, Rect, Text } from "react-native-svg";

const JuiceBar = ({ shape }) => {
  const { x, y, width, height, rotation = 0 } = shape;
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
        fill="#D2B48C" // Light wood color
        stroke="#A0AEC0"
        strokeWidth={2}
      />
      <Text
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={16}
        fontWeight="bold"
        fill="#4A5568"
      >
        Juice Bar
      </Text>
    </G>
  );
};

export default JuiceBar;
