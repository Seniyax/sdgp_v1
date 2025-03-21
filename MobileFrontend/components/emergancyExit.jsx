import React from "react";
import { G, Rect } from "react-native-svg";

const EmergencyExit = ({ shape }) => {
  // Use shape.x/y as top-left and apply rotation about the center.
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
        fill="#FF0000" // Red fill for emergency exit
      />
    </G>
  );
};

export default EmergencyExit;
