import React from "react";
import { G, Rect } from "react-native-svg";

const StraightWall = ({ shape }) => {
  // Calculate the center point for rotation if needed.
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
        fill="#CBD5E0"
        stroke="transparent"
        strokeWidth="2"
      />
    </G>
  );
};

export default StraightWall;
