import React from "react";
import { G, Rect, Text } from "react-native-svg";

const POSStation = ({ shape }) => {
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
        fill="#2B6CB0" // Dark blue color for POS Station
        stroke="transparent"
        strokeWidth={2}
      />
      <Text
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={14}
        fill="white"
      >
        Counter
      </Text>
    </G>
  );
};

export default POSStation;
