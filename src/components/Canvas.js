import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { StyleSheet } from "react-native";

import {
  Canvas,
  Circle,
  useImage,
  Image,
  useValue,
  useTouchHandler,
  Path,
  Skia,
} from "@shopify/react-native-skia";

import { resizeImageInfoMake } from "../utils/painterHelper";
const MAX_CANVAS_WIDTH = 1051;
const MAX_CANVAS_HEIGHT = 759;

export const SkiaCanvas = ({ filePath, controller }) => {
  const {
    currentMode,
    currentPenType,
    currentPenColor,
    handleCurrentMode,
    handleCurrentPenColor,
    handleCurrentPenType,
  } = controller;
  const touchState = useRef(false);
  const currentPath = useRef(null);
  const canvasRef = useRef(null);
  const [completedPaths, setCompletedPaths] = useState([]);

  const loadImage = filePath ? useImage(filePath) : null;
  const resizeImageInfo = loadImage
    ? resizeImageInfoMake(loadImage, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT)
    : null;

  const cx = useValue(100);
  const cy = useValue(100);

  const onDrawingStart = () => {
    console.log("start");
  };

  const onDrawingActive = ({ x, y }) => {
    cx.current = x;
    cy.current = y;
    console.log(x, y);
  };

  const onDrawingFinish = () => {
    console.log("finish!");
  };

  const touchHandler = useTouchHandler({
    onStart: onDrawingStart,
    onActive: onDrawingActive,
    onEnd: onDrawingFinish,
  });

  return (
    <Fragment>
      <Canvas style={styles.canvas} onTouch={touchHandler} ref={canvasRef}>
        {loadImage && (
          <Image
            image={loadImage}
            fit="contain"
            x={resizeImageInfo.offsetX}
            y={resizeImageInfo.offsetY}
            width={resizeImageInfo.caculatedWidth}
            height={resizeImageInfo.caculatedHeight}
          />
        )}
        <Circle cx={cx} cy={cy} r={10} color="red" />
      </Canvas>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
