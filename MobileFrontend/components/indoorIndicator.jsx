import React from "react";
import { G, Rect, Text } from "react-native-svg";

const IndoorIndicator = ({ shape }) => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const rotation = shape.rotation || 0;

  return (
    <G transform={`translate(${centerX}, ${centerY}) rotate(${rotation})`}>
      <Rect
        x={-shape.width / 2}
        y={-shape.height / 2}
        width={shape.width}
        height={shape.height}
        fill="transparent"
        stroke="#805AD5"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <Text
        x={0}
        y={0}
        fill="#805AD5"
        fontSize="16"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Indoor
      </Text>
    </G>
  );
};

export default IndoorIndicator;
