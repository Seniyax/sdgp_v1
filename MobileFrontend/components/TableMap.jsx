import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { Svg, Rect, Circle, Text as SvgText, G, Path, Line } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
const mapWidth = screenWidth * 0.9;
const mapHeight = mapWidth * 1.2;

// Table status constants
const TABLE_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  RESERVED: 'reserved',
  OCCUPIED: 'occupied'
};

// Table types
const TABLE_TYPE = {
  SMALL: 'small', // 2 people
  MEDIUM: 'medium', // 4 people
  LARGE: 'large', // 6 people
  BOOTH: 'booth', // 4-6 people
  BAR: 'bar' // 1 person
};

const TableMap = ({
  tables = [],
  selectedTableId = null,
  onTableSelect,
  legend = true,
  interactive = true
}) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedTable, setSelectedTable] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // Initialize selected table from prop
  useEffect(() => {
    if (selectedTableId) {
      const table = tables.find(t => t.id === selectedTableId);
      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }
  }, [selectedTableId, tables]);
  
  // Handle table press
  const handleTablePress = (table) => {
    if (!interactive) return;
    
    // Check if table is available
    if (table.status === TABLE_STATUS.AVAILABLE) {
      setSelectedTable(table);
      if (onTableSelect) {
        onTableSelect(table);
      }
    } else if (table.status === TABLE_STATUS.SELECTED) {
      // Deselect table
      setSelectedTable(null);
      if (onTableSelect) {
        onTableSelect(null);
      }
    } else if (table.status === TABLE_STATUS.RESERVED || table.status === TABLE_STATUS.OCCUPIED) {
      // Table is not available
      Alert.alert('Table Not Available', 'This table is already reserved or occupied.');
    }
  };
  
  // Get color for table based on status
  const getTableColor = (status) => {
    switch (status) {
      case TABLE_STATUS.AVAILABLE:
        return isDarkMode ? '#4CAF50' : '#4CAF50';
      case TABLE_STATUS.SELECTED:
        return theme.primary;
      case TABLE_STATUS.RESERVED:
        return '#FFC107';
      case TABLE_STATUS.OCCUPIED:
        return '#F44336';
      default:
        return '#CCCCCC';
    }
  };
  
  // Get text color based on status
  const getTextColor = (status) => {
    switch (status) {
      case TABLE_STATUS.AVAILABLE:
      case TABLE_STATUS.RESERVED:
        return '#000000';
      case TABLE_STATUS.SELECTED:
      case TABLE_STATUS.OCCUPIED:
        return '#FFFFFF';
      default:
        return '#000000';
    }
  };
  
  // Render table based on type and status
  const renderTable = (table) => {
    const { id, type, status, x, y, width, height, label, capacity } = table;
    const isSelected = selectedTable?.id === id || status === TABLE_STATUS.SELECTED;
    const actualStatus = isSelected ? TABLE_STATUS.SELECTED : status;
    const fillColor = getTableColor(actualStatus);
    const textColor = getTextColor(actualStatus);
    
    // Different table shapes based on type
    switch (type) {
      case TABLE_TYPE.SMALL:
        // Small round table
        return (
          <React.Fragment key={id}>
            <Circle
              cx={x}
              cy={y}
              r={width / 2}
              fill={fillColor}
              stroke={isDarkMode ? '#FFFFFF' : '#000000'}
              strokeWidth={1}
            />
            <SvgText
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill={textColor}
            >
              {label}
            </SvgText>
          </React.Fragment>
        );
      
      case TABLE_TYPE.MEDIUM:
      case TABLE_TYPE.LARGE:
        // Rectangular table
        return (
          <React.Fragment key={id}>
            <Rect
              x={x - width / 2}
              y={y - height / 2}
              width={width}
              height={height}
              rx={10}
              ry={10}
              fill={fillColor}
              stroke={isDarkMode ? '#FFFFFF' : '#000000'}
              strokeWidth={1}
            />
            <SvgText
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill={textColor}
            >
              {label}
            </SvgText>
          </React.Fragment>
        );
      
      case TABLE_TYPE.BOOTH:
        // Booth table (semi-circle)
        const boothPath = `
          M ${x - width / 2} ${y + height / 2}
          L ${x - width / 2} ${y - height / 4}
          Q ${x} ${y - height / 2} ${x + width / 2} ${y - height / 4}
          L ${x + width / 2} ${y + height / 2}
          Z
        `;
        return (
          <React.Fragment key={id}>
            <Path
              d={boothPath}
              fill={fillColor}
              stroke={isDarkMode ? '#FFFFFF' : '#000000'}
              strokeWidth={1}
            />
            <SvgText
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill={textColor}
            >
              {label}
            </SvgText>
          </React.Fragment>
        );
      
      case TABLE_TYPE.BAR:
        // Bar seat (small circle)
        return (
          <React.Fragment key={id}>
            <Circle
              cx={x}
              cy={y}
              r={width / 2}
              fill={fillColor}
              stroke={isDarkMode ? '#FFFFFF' : '#000000'}
              strokeWidth={1}
            />
            <SvgText
              x={x}
              y={y + 3}
              textAnchor="middle"
              fontSize={10}
              fontWeight="bold"
              fill={textColor}
            >
              {label}
            </SvgText>
          </React.Fragment>
        );
      
      default:
        // Default rectangular table
        return (
          <React.Fragment key={id}>
            <Rect
              x={x - width / 2}
              y={y - height / 2}
              width={width}
              height={height}
              rx={5}
              ry={5}
              fill={fillColor}
              stroke={isDarkMode ? '#FFFFFF' : '#000000'}
              strokeWidth={1}
            />
            <SvgText
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill={textColor}
            >
              {label}
            </SvgText>
          </React.Fragment>
        );
    }
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };
  
  // Render clickable areas for tables
  const renderTableHitAreas = () => {
    return tables.map(table => {
      const { id, x, y, width, height } = table;
      
      return (
        <Rect
          key={`hit-${id}`}
          x={x - width / 2 - 10}
          y={y - height / 2 - 10}
          width={width + 20}
          height={height + 20}
          fill="transparent"
          onPress={() => handleTablePress(table)}
        />
      );
    });
  };
  
  // Calculate transform for map panning and zooming
  const transform = `scale(${scale}) translate(${pan.x}, ${pan.y})`;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={2}
        minimumZoomScale={0.5}
      >
        <Svg
          width={mapWidth}
          height={mapHeight}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          style={[
            styles.map,
            { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }
          ]}
        >
          {/* Background grid for reference */}
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <Line
                x1={0}
                y1={i * (mapHeight / 20)}
                x2={mapWidth}
                y2={i * (mapHeight / 20)}
                stroke={isDarkMode ? '#333333' : '#DDDDDD'}
                strokeWidth={1}
              />
              <Line
                x1={i * (mapWidth / 20)}
                y1={0}
                x2={i * (mapWidth / 20)}
                y2={mapHeight}
                stroke={isDarkMode ? '#333333' : '#DDDDDD'}
                strokeWidth={1}
              />
            </React.Fragment>
          ))}
          
          {/* Door and entrance */}
          <Rect
            x={mapWidth / 2 - 20}
            y={mapHeight - 10}
            width={40}
            height={10}
            fill={isDarkMode ? '#555555' : '#888888'}
          />
          <SvgText
            x={mapWidth / 2}
            y={mapHeight - 15}
            textAnchor="middle"
            fontSize={12}
            fill={isDarkMode ? '#FFFFFF' : '#000000'}
          >
            Entrance
          </SvgText>
          
          {/* Bar area */}
          <Rect
            x={10}
            y={20}
            width={mapWidth - 20}
            height={80}
            rx={5}
            ry={5}
            fill={isDarkMode ? '#3D3D3D' : '#D1D1D1'}
          />
          <SvgText
            x={mapWidth / 2}
            y={60}
            textAnchor="middle"
            fontSize={16}
            fontWeight="bold"
            fill={isDarkMode ? '#FFFFFF' : '#000000'}
          >
            Bar
          </SvgText>
          
          {/* Render all tables */}
          <G transform={transform}>
            {tables.map(table => renderTable(table))}
            {interactive && renderTableHitAreas()}
          </G>
        </Svg>
      </ScrollView>
      
      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={[styles.zoomButton, { backgroundColor: theme.card }]}
          onPress={handleZoomIn}
        >
          <Ionicons name="add" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.zoomButton, { backgroundColor: theme.card }]}
          onPress={handleZoomOut}
        >
          <Ionicons name="remove" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {/* Legend */}
      {legend && (
        <View style={[styles.legendContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.legendTitle, { color: theme.text }]}>
            Table Status
          </Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: getTableColor(TABLE_STATUS.AVAILABLE) }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Available</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: getTableColor(TABLE_STATUS.SELECTED) }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Selected</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: getTableColor(TABLE_STATUS.RESERVED) }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Reserved</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: getTableColor(TABLE_STATUS.OCCUPIED) }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Occupied</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  scrollContainer: {
    padding: wp('2%'),
  },
  map: {
    borderRadius: wp('2%'),
  },
  zoomControls: {
    position: 'absolute',
    top: wp('4%'),
    right: wp('4%'),
    flexDirection: 'column',
    borderRadius: wp('3%'),
    overflow: 'hidden',
  },
  zoomButton: {
    width: wp('10%'),
    height: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
    borderRadius: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  legendContainer: {
    position: 'absolute',
    bottom: wp('4%'),
    right: wp('4%'),
    padding: wp('3%'),
    borderRadius: wp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  legendTitle: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.3%'),
  },
  legendItem: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
  },
  legendText: {
    fontSize: wp('3.2%'),
  },
});

export default TableMap;
