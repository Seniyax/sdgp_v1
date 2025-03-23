import React from "react";
import { G, Rect, Text } from "react-native-svg";

const Staircase = ({ shape }) => {
  const { x = 0, y = 0, width, height, rotation = 0, direction = "Up" } = shape;
  const stepsCount = 6;
  const stepWidth = width;
  const stepHeight = height / stepsCount;

  // Generate staircase steps
  const steps = [];
  for (let i = 0; i < stepsCount; i++) {
    steps.push(
      <Rect
        key={i}
        x={0}
        y={i * stepHeight}
        width={stepWidth}
        height={stepHeight - 2}
        fill="#CBD5E0"
        stroke="#A0AEC0"
        strokeWidth={1}
      />
    );
  }

  return (
    <G transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <G>
        {steps}
        <Text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          fontWeight="bold"
          fill="black"
        >
          {direction}
        </Text>
      </G>
    </G>
  );
};

export default Staircase;
