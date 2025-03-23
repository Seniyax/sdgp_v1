import React from "react";
import { G, Rect, Text } from "react-native-svg";

const VisibleKitchen = ({ shape }) => {
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
        fill="#FFD700"
        stroke="transparent"
        strokeWidth={2}
      />
      <Text
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={16}
        fontWeight="bold"
        fill="#000"
      >
        Visible Kitchen
      </Text>
    </G>
  );
};

export default VisibleKitchen;
