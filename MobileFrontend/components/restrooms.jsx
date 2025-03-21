import React from "react";
import { G, Rect, Circle, Line } from "react-native-svg";

const Restrooms = ({ shape }) => {
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
        fill="transparent"
        stroke="transparent"
        strokeWidth={2}
      />

      {/* Male restroom */}
      <G transform={`translate(${-width / 4}, 0)`}>
        <Rect
          x={-width / 8}
          y={-height / 4}
          width={width / 4}
          height={height / 2}
          fill="#3498DB"
          stroke="#2980B9"
          strokeWidth={1}
          rx={2}
          ry={2}
        />
        <Circle cx={0} cy={-height / 8} r={width / 16} fill="white" />
        <Line
          x1={0}
          y1={-height / 16}
          x2={0}
          y2={height / 8}
          stroke="white"
          strokeWidth={2}
        />
      </G>

      {/* Female restroom */}
      <G transform={`translate(${width / 4}, 0)`}>
        <Rect
          x={-width / 8}
          y={-height / 4}
          width={width / 4}
          height={height / 2}
          fill="#E74C3C"
          stroke="#C0392B"
          strokeWidth={1}
          rx={2}
          ry={2}
        />
        <Circle cx={0} cy={-height / 8} r={width / 16} fill="white" />
        <Line
          x1={0}
          y1={-height / 16}
          x2={0}
          y2={height / 8}
          stroke="white"
          strokeWidth={2}
        />
        <Line
          x1={-width / 16}
          y1={height / 16}
          x2={width / 16}
          y2={height / 16}
          stroke="white"
          strokeWidth={2}
        />
      </G>
    </G>
  );
};

export default Restrooms;
