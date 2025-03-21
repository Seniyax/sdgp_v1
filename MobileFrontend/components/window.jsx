import React from "react";
import { G, Rect, Text } from "react-native-svg";

const Window = ({ shape }) => {
  const { x = 0, y = 0, width, height, rotation = 0 } = shape;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <G
      transform={`translate(${x + centerX}, ${
        y + centerY
      }) rotate(${rotation})`}
    >
      {/* Main window rectangle */}
      <Rect
        x={-centerX}
        y={-centerY}
        width={width}
        height={height}
        fill="#ADD8E6"
        stroke="transparent"
        strokeWidth={2}
      />

      {/* Text label */}
      <Text
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={Math.min(12, width / 10)}
        fill="#333"
      >
        Window
      </Text>
    </G>
  );
};

export default Window;
