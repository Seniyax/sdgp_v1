import React from "react";
import { G, Rect, Text } from "react-native-svg";

const AlcoholBar = ({ shape }) => {
  // Calculate center point for rotation
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
        fill="#8B4513" // Dark brown fill
        stroke="#A0AEC0" // Lighter stroke for contrast
        strokeWidth="2"
      />
      <Text
        x={centerX}
        y={centerY}
        fill="#FFFFFF"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Alcohol Bar
      </Text>
    </G>
  );
};

export default AlcoholBar;
