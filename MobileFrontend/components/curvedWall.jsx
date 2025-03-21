import React from "react";
import { G, Path } from "react-native-svg";

const CurvedWall = ({ shape }) => {
  // Use the center of the shape as the pivot.
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const rotation = shape.rotation || 0;
  // Generate a centered quadratic curve.
  const w = shape.width;
  const h = shape.height;
  const pathData = `M${-w / 2},${-h / 2} Q0,${h / 2} ${w / 2},${-h / 2}`;

  return (
    <G
      transform={`translate(${centerX}, ${centerY}) rotate(${rotation})`}
    >
      <Path
        d={pathData}
        stroke="#CBD5E0"
        strokeWidth={shape.thickness || 15}
        fill="none"
      />
    </G>
  );
};

export default CurvedWall;
