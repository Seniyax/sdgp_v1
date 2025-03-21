import React from "react";
import { G, Rect, Text } from "react-native-svg";

const BuffetStation = ({ shape }) => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const rotation = shape.rotation || 0;

  return (
    <G transform={`rotate(${rotation}, ${centerX}, ${centerY})`}>
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill="black"
        stroke="transparent"
        strokeWidth="2"
      />
      <Text
        x={centerX}
        y={centerY}
        fill="white"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Buffet Station
      </Text>
    </G>
  );
};

export default BuffetStation;
