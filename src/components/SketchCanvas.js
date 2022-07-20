import {
  Canvas,
  Path,
  useCanvasRef,
  useTouchHandler,
  useImage,
  Image,
} from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { drawingState, derivedPaths } from "../store/index";
import { useSnapshot } from "valtio";
import createHistoryStack from "../utils/create-history-stack";
import { resizeImageInfoMake } from "../utils/painterHelper";
import { penSize } from "../constants/painterOptions";

const MAX_CANVAS_WIDTH = 1051;
const MAX_CANVAS_HEIGHT = 759;

const SketchCanvas = forwardRef(
  (
    { filePath, currentPenType, currentPenColor, strokeStyle = "fill" },
    ref,
  ) => {
    const loadImage = filePath ? useImage(filePath) : null;
    const pathsSnapshot = useSnapshot(derivedPaths);
    const canvasRef = useCanvasRef();
    const stack = useMemo(
      () =>
        createHistoryStack({
          currentPoints: drawingState.currentPoints,
          completedPoints: drawingState.completedPoints,
        }),
      [],
    );
    const resizeImageInfo = useMemo(() => {
      if (loadImage) {
        return resizeImageInfoMake(
          loadImage,
          MAX_CANVAS_WIDTH,
          MAX_CANVAS_HEIGHT,
        );
      } else {
        return null;
      }
    }, [loadImage]);

    const LoadImage = useCallback(
      (imageInput, imageInfo) => (
        <Image
          image={imageInput}
          fit="cover"
          x={imageInfo.offsetX}
          y={imageInfo.offsetY}
          width={imageInfo.caculatedWidth}
          height={imageInfo.caculatedHeight}
        />
      ),
      [],
    );

    useEffect(() => {
      drawingState.currentPoints.width = penSize[currentPenType];
    }, [currentPenType]);

    useImperativeHandle(ref, () => ({
      reset() {
        drawingState.currentPoints.points = null;
        drawingState.completedPoints = [];
        stack.push({
          currentPoints: drawingState.currentPoints,
          completedPoints: drawingState.completedPoints,
        });
      },
      undo() {
        const value = stack.undo();
        drawingState.currentPoints = value.currentPoints;
        drawingState.completedPoints = value.completedPoints;
      },
      redo() {
        const value = stack.redo();
        drawingState.currentPoints = value.currentPoints;
        drawingState.completedPoints = value.completedPoints;
      },
      toBase64() {
        const image = canvasRef.current.makeImageSnapshot();
        const base64File = image.encodeToBase64();
        return base64File;
      },
    }));

    const touchHandler = useTouchHandler(
      {
        onStart: (touchInfo) => {
          drawingState.isDrawing = true;
          drawingState.currentPoints.points = [[touchInfo.x, touchInfo.y]];
        },
        onActive: (touchInfo) => {
          if (!drawingState.isDrawing) {
            return;
          }

          drawingState.currentPoints.points = [
            ...(drawingState.currentPoints.points ?? []),
            [touchInfo.x, touchInfo.y],
          ];
        },
        onEnd: (touchInfo) => {
          drawingState.isDrawing = false;

          if (!drawingState.currentPoints.points) {
            return;
          }

          drawingState.completedPoints = [
            ...drawingState.completedPoints,
            {
              id: touchInfo.timestamp,
              points: drawingState.currentPoints.points,
              width: drawingState.currentPoints.width,
              color: currentPenColor,
              style: strokeStyle,
            },
          ];
          drawingState.currentPoints.points = null;

          stack.push({
            currentPoints: drawingState.currentPoints,
            completedPoints: drawingState.completedPoints,
          });
        },
      },
      [currentPenColor, strokeStyle],
    );

    return (
      <Canvas ref={canvasRef} onTouch={touchHandler} style={styles.canvas}>
        {loadImage && LoadImage(loadImage, resizeImageInfo)}
        {pathsSnapshot.completed.map((path) => (
          <Path
            path={path.path}
            key={path.id}
            style={path.style}
            color={path.color}
          />
        ))}
        {pathsSnapshot.current ? (
          <Path
            path={pathsSnapshot.current}
            color={currentPenColor}
            style={strokeStyle}
          />
        ) : (
          <></>
        )}
      </Canvas>
    );
  },
);

SketchCanvas.displayName = "SketchCanvas";

export default SketchCanvas;

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
