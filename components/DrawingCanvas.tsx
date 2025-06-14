import React, { useRef, useState } from 'react';
import {
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  strokeWidth: number;
}

const DrawingCanvas: React.FC = () => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        const newPath: DrawingPath = {
          points: [{ x: locationX, y: locationY }],
          color: currentColor,
          strokeWidth: strokeWidth,
        };
        setCurrentPath(newPath);
      },
      onPanResponderMove: (event) => {
        if (currentPath) {
          const { locationX, locationY } = event.nativeEvent;
          setCurrentPath({
            ...currentPath,
            points: [...currentPath.points, { x: locationX, y: locationY }],
          });
        }
      },
      onPanResponderRelease: () => {
        if (currentPath) {
          setPaths([...paths, currentPath]);
          setCurrentPath(null);
        }
      },
    })
  ).current;

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const getPathString = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    const [first, ...rest] = points;
    return rest.reduce(
      (acc, point) => `${acc} L ${point.x} ${point.y}`,
      `M ${first.x} ${first.y}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvas} {...panResponder.panHandlers}>
        <Svg style={StyleSheet.absoluteFill}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={getPathString(path.points)}
              stroke={path.color}
              strokeWidth={path.strokeWidth}
              fill="none"
            />
          ))}
          {currentPath && (
            <Path
              d={getPathString(currentPath.points)}
              stroke={currentPath.color}
              strokeWidth={currentPath.strokeWidth}
              fill="none"
            />
          )}
        </Svg>
      </View>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: '#000000' }]}
          onPress={() => setCurrentColor('#000000')}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: '#FF0000' }]}
          onPress={() => setCurrentColor('#FF0000')}
        />
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: '#0000FF' }]}
          onPress={() => setCurrentColor('#0000FF')}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toolbar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DrawingCanvas;
