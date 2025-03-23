import React from "react";
import { G, Rect, Text, Path } from "react-native-svg";

const HostDesk = ({ shape }) => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const rotation = shape.rotation || 0;
  const isHalfCircle = shape.style === "halfCircle";

  // If half-circle, create a path for a half-circle (assuming width equals height)
  let content;
  if (isHalfCircle) {
    const r = shape.width / 2;
    // Simple half-circle (bottom half filled) path:
    const d = `M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 L ${r} ${r} L ${-r} ${r} Z`;
    content = <Path d={d} fill="white" stroke="#4299E1" strokeWidth="2" />;
  } else {
    content = (
      <Rect
        x={-shape.width / 2}
        y={-shape.height / 2}
        width={shape.width}
        height={shape.height}
        fill="white"
        stroke="grey"
        strokeWidth="2"
      />
    );
  }

  return (
    <G transform={`translate(${centerX}, ${centerY}) rotate(${rotation})`}>
      {content}
      <Text
        x={0}
        y={0}
        fill="black"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Host Desk
      </Text>
    </G>
  );
};

export default HostDesk;
