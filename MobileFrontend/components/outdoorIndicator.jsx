import React from "react";
import { G, Rect, Text } from "react-native-svg";

const OutdoorIndicator = ({ shape }) => {
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
        fill="transparent"
        stroke="#4299E1"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <Text
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={16}
        fill="#4299E1"
      >
        Outdoor
      </Text>
    </G>
  );
};

export default OutdoorIndicator;
