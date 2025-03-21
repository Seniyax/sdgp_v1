/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Stage, Layer, Line } from "react-konva";

import SquareTable from "../components/ViewSquareTable";
import CircularTable from "../components/ViewCircularTable";
import OvalTable from "../components/ViewOvalTable";
import RectangleTable from "../components/ViewRectangleTable";

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

const ViewFloorPlan = ({
  canvasWidth,
  canvasHeight,
  floor,
  tables,
  addingReservation,
  onTableSelect,
  selectedTables,
  reservedTables, // NEW prop containing an array of reserved table numbers
}) => {
  let floorData = { shapes: [], tables: [] };
  try {
    floorData = JSON.parse(floor.floor_plan);
  } catch (err) {
    console.error("Error parsing floor plan JSON", err);
  }

  // Combine shapes from the floor plan with tables.
  const combinedItems = [
    ...(floorData.shapes || []),
    ...(floorData.tables && floorData.tables.length > 0
      ? floorData.tables
      : tables),
  ];

  return (
    <div
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
      }}
    >
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
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
            // For tables we want to pass the reserved status.
            // We assume that table shapes have a unique tableNumber property.
            const tableReserved =
              reservedTables && reservedTables.includes(shape.tableNumber);
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
                  <Windows
                    key={shape.id || idx}
                    shape={shape}
                    isPreview={true}
                  />
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
              // For table shapes, pass the onPress, selected state and the new isReserved prop.
              case "squareTable":
                return (
                  <SquareTable
                    key={shape.id || idx}
                    shape={shape}
                    onPress={
                      addingReservation && !tableReserved
                        ? () => onTableSelect(shape)
                        : undefined
                    }
                    isSelected={selectedTables.some(
                      (t) =>
                        t.id === shape.id || t.tableNumber === shape.tableNumber
                    )}
                    isReserved={tableReserved}
                  />
                );

              case "circularTable":
                return (
                  <CircularTable
                    key={shape.id || idx}
                    shape={shape}
                    onPress={
                      addingReservation && !tableReserved
                        ? () => onTableSelect(shape)
                        : undefined
                    }
                    isSelected={selectedTables.some(
                      (t) =>
                        t.id === shape.id || t.tableNumber === shape.tableNumber
                    )}
                    isReserved={tableReserved}
                  />
                );
              case "rectangleTable":
                return (
                  <RectangleTable
                    key={shape.id || idx}
                    shape={shape}
                    onPress={
                      addingReservation && !tableReserved
                        ? () => onTableSelect(shape)
                        : undefined
                    }
                    isSelected={selectedTables.some(
                      (t) =>
                        t.id === shape.id || t.tableNumber === shape.tableNumber
                    )}
                    isReserved={tableReserved}
                  />
                );
              case "ovalTable":
                return (
                  <OvalTable
                    key={shape.id || idx}
                    shape={shape}
                    onPress={
                      addingReservation && !tableReserved
                        ? () => onTableSelect(shape)
                        : undefined
                    }
                    isSelected={selectedTables.some(
                      (t) =>
                        t.id === shape.id || t.tableNumber === shape.tableNumber
                    )}
                    isReserved={tableReserved}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default ViewFloorPlan;
