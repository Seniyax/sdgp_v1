/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Stage, Layer, Line } from "react-konva";

// Import your custom components for rendering floor elements.
import SquareTable from "../components/SquareTable";
import CircularTable from "../components/CircularTable";
import OvalTable from "../components/OvalTable";
import RectangleTable from "../components/RectangleTable";
import GreyRectangle from "../components/GreyRectangle";
import GreyCircle from "../components/GreyCircle";
import EmergancyExit from "../components/EmergancyExit";
import RegularDoor from "../components/RegularDoor";
import Windows from "../components/Window";
import CurvedWalls from "../components/CurvedWall";
import Staircase from "../components/Staircase";
import JuiceBar from "../components/JuiceBar";
import AlcoholBar from "../components/AlcoholBar";
import BuffetStation from "../components/BuffetStation";
import ReceptionDesk from "../components/HostDesk";
import POSStation from "../components/POSStation";
import VisibleKitchen from "../components/VisibleKitchen";
import Restrooms from "../components/Restrooms";
import OutdoorIndicator from "../components/OutdoorIndicator";
import IndoorIndicator from "../components/IndoorIndicator";

const ViewFloorPlan = ({ canvasWidth, canvasHeight, floor, tables }) => {
  let floorData = { shapes: [], tables: [] };
  try {
    floorData = JSON.parse(floor.floor_plan);
  } catch (err) {
    console.error("Error parsing floor plan JSON", err);
  }

  // Combine shapes from the floor plan with tables.
  // If the JSON contains tables, you could choose to use those;
  // otherwise, use the tables passed from ReservationDashboard.
  const combinedItems = [
    ...(floorData.shapes || []),
    ...(floorData.tables && floorData.tables.length > 0
      ? floorData.tables
      : tables),
  ];

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      style={{ border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <Layer>
        {/* Draw grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Line
            key={`grid-h-${i}`}
            points={[
              0,
              (i * canvasHeight) / 10,
              canvasWidth,
              (i * canvasHeight) / 10,
            ]}
            stroke="#ddd"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <Line
            key={`grid-v-${i}`}
            points={[
              (i * canvasWidth) / 10,
              0,
              (i * canvasWidth) / 10,
              canvasHeight,
            ]}
            stroke="#ddd"
            strokeWidth={1}
          />
        ))}

        {/* Render floor shapes and tables */}
        {combinedItems.map((shape, idx) => {
          switch (shape.type) {
            case "rectangle":
              return (
                <GreyRectangle
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "circle":
              return (
                <GreyCircle
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "emergency_exit":
              return (
                <EmergancyExit
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "regular_door":
              return (
                <RegularDoor
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "windows":
              return (
                <Windows key={shape.id || idx} shape={shape} isPreview={true} />
              );
            case "curved_walls":
              return (
                <CurvedWalls
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "staircase":
              return (
                <Staircase
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "juice_bar":
              return (
                <JuiceBar
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "alcohol_bar":
              return (
                <AlcoholBar
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "buffet_station":
              return (
                <BuffetStation
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "reception_desk":
              return (
                <ReceptionDesk
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "pos_station":
              return (
                <POSStation
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "visible_kitchen":
              return (
                <VisibleKitchen
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "restrooms":
              return (
                <Restrooms
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "outdoor_indicator":
              return (
                <OutdoorIndicator
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "indoor_indicator":
              return (
                <IndoorIndicator
                  key={shape.id || idx}
                  shape={shape}
                  isPreview={true}
                />
              );
            case "squareTable":
              return <SquareTable key={shape.id || idx} shape={shape} />;
            case "circularTable":
              return <CircularTable key={shape.id || idx} shape={shape} />;
            case "rectangleTable":
              return <RectangleTable key={shape.id || idx} shape={shape} />;
            case "ovalTable":
              return <OvalTable key={shape.id || idx} shape={shape} />;
            default:
              return null;
          }
        })}
      </Layer>
    </Stage>
  );
};

export default ViewFloorPlan;
