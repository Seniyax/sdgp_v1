import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  Alert,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import Svg, { Line } from "react-native-svg";
import { API_BASE_URL } from "@env";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import useReservationsSocket from "../hooks/useReservationsSocket";
import useReservationStore from "../store/reservationStore";

import StraightWall from "../components/straightWall";
import SquareTable from "../components/squareTable";
import CircularTable from "../components/circularTable";
import OvalTable from "../components/ovalTable";
import RectangleTable from "../components/rectangleTable";
import CircularWall from "../components/circularWall";
import EmergancyExit from "../components/emergancyExit";
import RegularDoor from "../components/regularDoor";
import Window from "../components/window";
import CurvedWalls from "../components/curvedWall";
import Staircase from "../components/staircase";
import JuiceBar from "../components/juiceBar";
import AlcoholBar from "../components/alcoholBar";
import BuffetStation from "../components/buffetStation";
import ReceptionDesk from "../components/hostDesk";
import POSStation from "../components/posStation";
import VisibleKitchen from "../components/visibleKitchen";
import Restrooms from "../components/restrooms";
import OutdoorIndicator from "../components/outdoorIndicator";
import IndoorIndicator from "../components/indoorIndicator";

// New animated button component
const AnimatedPressable = ({
  outerStyle,
  style,
  children,
  onPress,
  ...props
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, outerStyle]}>
      <Pressable
        style={style}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

// Special component just for date/time buttons
const DateTimeButton = ({ onPress, children }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      style={styles.dateButton}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          { transform: [{ scale: scaleValue }] },
          { width: "100%", alignItems: "center" },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const FloorPlan = () => {
  const [floorPlanData, setFloorPlanData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();

  const allowedStartHour = 9;
  const allowedEndHour = 22;

  const computeDefaultDate = () => {
    const now = new Date();
    const defaultDate = new Date(now);
    defaultDate.setHours(now.getHours() + 1);
    if (
      defaultDate.getHours() < allowedStartHour ||
      defaultDate.getHours() >= allowedEndHour
    ) {
      // Move to the next day and set time to 12:00 PM
      defaultDate.setDate(defaultDate.getDate() + 1);
      defaultDate.setHours(12, 0, 0, 0);
    }
    return defaultDate;
  };

  const [selectedDate, setSelectedDate] = useState(computeDefaultDate());

  const customAnimation = {
    duration: 5000,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const triggerAnimation = () => {
    LayoutAnimation.configureNext(customAnimation);
  };

  // Animate layout changes when selected tables change
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [selectedTableIds]);

  // Initialize socket for reservations
  useReservationsSocket();
  // Get reservations from the store
  const { reservations } = useReservationStore();

  // Fetch the floor plan data
  const fetchFloorPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/floor-plan/get`, {
        business_id: 20,
      });
      if (response.data.success) {
        setFloorPlanData(response.data);
        if (response.data.floors && response.data.floors.length > 0) {
          setSelectedFloor(response.data.floors[0]);
        }
      } else {
        setError("Failed to load floor plan.");
      }
    } catch (err) {
      console.log("Network Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloorPlan();
  }, []);

  // Update isTableReserved() to accept a table object and use the new 'dbId'
  const isTableReserved = (table) => {
    const tableId = table.dbId || table.id;
    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    const selectedTimeMinutes =
      selectedDate.getHours() * 60 + selectedDate.getMinutes();

    return reservations.some((res) => {
      if (res.table_id === tableId && res.end_date === selectedDateStr) {
        const [startH, startM] = res.start_time.split(":").map(Number);
        const [endH, endM] = res.end_time.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        return (
          selectedTimeMinutes >= startMinutes &&
          selectedTimeMinutes <= endMinutes &&
          res.status === "Active"
        );
      }
      return false;
    });
  };

  // Update toggleTableSelection() to use the dbId as well
  const toggleTableSelection = (table) => {
    triggerAnimation();
    const id = table.dbId || table.id;
    setSelectedTableIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  // Handle date change
  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(currentDate);
  };

  // Handle time change with allowed range validation
  const onTimeChange = (event, selected) => {
    const currentTime = selected || selectedDate;
    setShowTimePicker(Platform.OS === "ios");

    const hours = currentTime.getHours();
    if (hours < allowedStartHour || hours >= allowedEndHour) {
      Alert.alert(
        "Invalid Time",
        `Please choose a time between ${allowedStartHour}:00 and ${allowedEndHour}:00.`
      );
      return;
    }
    setSelectedDate(currentTime);
  };

  // Returns all mapped tables from all floors in the API response.
  const getAllMappedTables = () => {
    if (!floorPlanData) return [];
    const tableIdMapping = {};
    if (floorPlanData.tables && floorPlanData.tables.length > 0) {
      floorPlanData.tables.forEach((dbTable) => {
        tableIdMapping[dbTable.table_number] = dbTable.id;
      });
    }

    let allMappedTables = [];
    floorPlanData.floors.forEach((floor) => {
      try {
        const floorData = JSON.parse(floor.floor_plan);
        const mappedTables = (floorData.tables || []).map((table) => ({
          ...table,
          dbId: tableIdMapping[table.tableNumber] || table.id,
        }));
        allMappedTables.push(...mappedTables);
      } catch (err) {
        console.error("Error parsing floor plan JSON", err);
      }
    });
    return allMappedTables;
  };

  const getSelectedTablesDetails = () => {
    const allTables = getAllMappedTables();
    return allTables.filter((table) =>
      selectedTableIds.includes(table.dbId || table.id)
    );
  };

  // Renders the floor plan using react-native-svg.
  const renderFloorPlan = () => {
    if (!selectedFloor) return null;

    const tableIdMapping = {};
    if (floorPlanData && floorPlanData.tables) {
      floorPlanData.tables.forEach((dbTable) => {
        tableIdMapping[dbTable.table_number] = dbTable.id;
      });
    }

    let floorData = { shapes: [], tables: [] };
    try {
      if (selectedFloor && selectedFloor.floor_plan) {
        floorData = JSON.parse(selectedFloor.floor_plan);
      }
    } catch (err) {
      console.error("Error parsing floor plan JSON", err);
    }

    const mappedTables = (floorData.tables || []).map((table) => ({
      ...table,
      dbId: tableIdMapping[table.tableNumber] || table.id,
    }));

    const combinedItems = [...(floorData.shapes || []), ...mappedTables];

    const canvasWidth = selectedFloor.canvas_width;
    const canvasHeight = selectedFloor.canvas_height;
    const screenWidth = Dimensions.get("window").width;
    const margin = 15;
    const svgWidth = screenWidth - margin * 2;
    const aspectRatio = canvasHeight / canvasWidth;
    const svgHeight = svgWidth * aspectRatio;

    return (
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Line
            key={`grid-h-${i}`}
            x1="0"
            y1={(i * canvasHeight) / 10}
            x2={canvasWidth}
            y2={(i * canvasHeight) / 10}
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <Line
            key={`grid-v-${i}`}
            x1={(i * canvasWidth) / 10}
            y1="0"
            x2={(i * canvasWidth) / 10}
            y2={canvasHeight}
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}

        {combinedItems.map((item, idx) => {
          switch (item.type) {
            case "rectangle":
              return <StraightWall key={item.id || idx} shape={item} />;
            case "circle":
              return <CircularWall key={item.id || idx} shape={item} />;
            case "emergency_exit":
              return <EmergancyExit key={item.id || idx} shape={item} />;
            case "regular_door":
              return <RegularDoor key={item.id || idx} shape={item} />;
            case "windows":
              return <Window key={item.id || idx} shape={item} />;
            case "curved_walls":
              return <CurvedWalls key={item.id || idx} shape={item} />;
            case "staircase":
              return <Staircase key={item.id || idx} shape={item} />;
            case "juice_bar":
              return <JuiceBar key={item.id || idx} shape={item} />;
            case "alcohol_bar":
              return <AlcoholBar key={item.id || idx} shape={item} />;
            case "buffet_station":
              return <BuffetStation key={item.id || idx} shape={item} />;
            case "reception_desk":
              return <ReceptionDesk key={item.id || idx} shape={item} />;
            case "pos_station":
              return <POSStation key={item.id || idx} shape={item} />;
            case "visible_kitchen":
              return <VisibleKitchen key={item.id || idx} shape={item} />;
            case "restrooms":
              return <Restrooms key={item.id || idx} shape={item} />;
            case "outdoor_indicator":
              return <OutdoorIndicator key={item.id || idx} shape={item} />;
            case "indoor_indicator":
              return <IndoorIndicator key={item.id || idx} shape={item} />;
            case "squareTable":
              return (
                <SquareTable
                  key={item.id || idx}
                  shape={item}
                  isSelected={selectedTableIds.includes(item.dbId || item.id)}
                  isReserved={isTableReserved(item)}
                  onPress={() => {
                    if (isTableReserved(item)) {
                      Alert.alert(
                        "Table Reserved",
                        "This table is reserved for the selected time."
                      );
                      return;
                    }
                    toggleTableSelection(item);
                  }}
                />
              );
            case "circularTable":
              return (
                <CircularTable
                  key={item.id || idx}
                  shape={item}
                  isSelected={selectedTableIds.includes(item.dbId || item.id)}
                  isReserved={isTableReserved(item)}
                  onPress={() => {
                    if (isTableReserved(item)) {
                      Alert.alert(
                        "Table Reserved",
                        "This table is reserved for the selected time."
                      );
                      return;
                    }
                    toggleTableSelection(item);
                  }}
                />
              );
            case "rectangleTable":
              return (
                <RectangleTable
                  key={item.id || idx}
                  shape={item}
                  isSelected={selectedTableIds.includes(item.dbId || item.id)}
                  isReserved={isTableReserved(item)}
                  onPress={() => {
                    if (isTableReserved(item)) {
                      Alert.alert(
                        "Table Reserved",
                        "This table is reserved for the selected time."
                      );
                      return;
                    }
                    toggleTableSelection(item);
                  }}
                />
              );
            case "ovalTable":
              return (
                <OvalTable
                  key={item.id || idx}
                  shape={item}
                  isSelected={selectedTableIds.includes(item.dbId || item.id)}
                  isReserved={isTableReserved(item)}
                  onPress={() => {
                    if (isTableReserved(item)) {
                      Alert.alert(
                        "Table Reserved",
                        "This table is reserved for the selected time."
                      );
                      return;
                    }
                    toggleTableSelection(item);
                  }}
                />
              );
            default:
              return null;
          }
        })}
      </Svg>
    );
  };

  const selectedTables = getSelectedTablesDetails();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Floor Plan</Text>
        </View>

        {/* Date & Time Picker Section */}
        <View style={styles.dateTimeContainer}>
          {/* Date Picker Button */}
          <DateTimeButton onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </DateTimeButton>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Time Picker Button */}
          <DateTimeButton onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateButtonText}>
              {selectedDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </DateTimeButton>
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#420F54" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {/* Floor Selector */}
            <View style={styles.floorSelector}>
              {floorPlanData.floors.map((floor) => (
                <AnimatedPressable
                  key={floor.id}
                  style={({ pressed }) => [
                    styles.floorButton,
                    selectedFloor?.id === floor.id && styles.activeFloorButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => setSelectedFloor(floor)}
                >
                  <Text
                    style={[
                      styles.floorButtonText,
                      selectedFloor?.id === floor.id &&
                        styles.activeFloorButtonText,
                    ]}
                  >
                    {floor.floor_name}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>

            {/* Floor Plan Display */}
            <View style={styles.floorPlanContainer}>{renderFloorPlan()}</View>

            {/* Selected Tables Details */}
            {getSelectedTablesDetails().length > 0 && (
              <View style={styles.selectedTablesContainer}>
                <Text style={styles.selectedTablesTitle}>Selected Tables</Text>
                <View style={styles.tableDetailsContainer}>
                  {getSelectedTablesDetails().map((table) => (
                    <View
                      key={table.dbId || table.id}
                      style={styles.tableDetailCard}
                    >
                      <Text style={styles.tableNumber}>
                        Table {table.tableNumber || table.id}
                      </Text>
                      <Text style={styles.tableSeats}>
                        {(table.seatCount || table.seats || "N/A") + " Seats"}
                      </Text>
                      <Text style={styles.tableFloor}>
                        {table.floor || "Unknown Floor"}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Proceed Button */}
            <AnimatedPressable
              style={styles.proceedButton}
              onPress={() => {
                const now = new Date();

                // Check if any selected table is already reserved
                const reservedSelectedTables =
                  getSelectedTablesDetails().filter((table) =>
                    isTableReserved(table)
                  );
                if (reservedSelectedTables.length > 0) {
                  const tableNumbers = reservedSelectedTables
                    .map((table) => table.tableNumber || table.id)
                    .join(" and ");
                  Alert.alert(
                    "Table already reserved",
                    `Table ${tableNumbers} ${
                      reservedSelectedTables.length > 1 ? "have" : "has"
                    } already been reserved.`
                  );
                  return;
                }
                if (selectedDate < now) {
                  Alert.alert(
                    "Invalid Reservation",
                    "You cannot make a reservation in the past."
                  );
                  return;
                }
                if (selectedTableIds.length === 0) {
                  Alert.alert(
                    "No Table Selected",
                    "Please select at least one table before proceeding."
                  );
                  return;
                }
                router.push({
                  pathname: "/makeReservation",
                  params: {
                    selectedTables: JSON.stringify(getSelectedTablesDetails()),
                    date: selectedDate.toISOString().split("T")[0], // "YYYY-MM-DD"
                    time: selectedDate.toTimeString().slice(0, 8), // "HH:MM:SS"
                  },
                });
              }}
            >
              <Text style={styles.proceedButtonText}>Make Reservation</Text>
            </AnimatedPressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    padding: "5%",
    alignItems: "center",
    flexGrow: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "2%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#420F54",
    marginBottom: 5,
  },
  dateTimeContainer: {
    width: "100%",
    marginBottom: "2%",
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: "#F6E6FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: "2%",
  },
  floorSelector: {
    flexDirection: "row",
    marginBottom: "2%",
    width: "100%",
    justifyContent: "center",
    marginTop: 15,
  },
  floorButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#F0F0F5",
  },
  activeFloorButton: {
    backgroundColor: "#420F54",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  floorButtonText: {
    color: "#333",
    fontSize: 14,
  },
  activeFloorButtonText: {
    color: "#FFFFFF",
  },
  floorPlanContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "white",
  },
  selectedTablesContainer: {
    width: "100%",
    marginBottom: "2%",
  },
  selectedTablesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#420F54",
    marginBottom: "1%",
  },
  tableDetailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  tableDetailCard: {
    backgroundColor: "#F0F0F5",
    borderRadius: 8,
    padding: "3%",
    margin: "1%",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#420F54",
  },
  tableSeats: {
    fontSize: 14,
    color: "#666",
    marginTop: "0.5%",
  },
  tableFloor: {
    fontSize: 14,
    color: "#666",
    marginTop: "0.5%",
  },
  proceedButton: {
    backgroundColor: "#420F54",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginTop: "2%",
    marginBottom: "5%",
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default FloorPlan;
