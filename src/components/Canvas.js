import React from "react";
import { StyleSheet } from "react-native";

import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  vec,
  useImage,
  Image,
} from "@shopify/react-native-skia";

const MAX_CANVAS_WIDTH = 1051;
const MAX_CANVAS_HEIGHT = 759;

const SkiaCanvas = ({ filePath }) => {
  const loadImage = useImage(filePath);
  let loadImageWidth;
  let loadImageHeight;
  let caculatedWidth;
  let caculatedHeight;
  let offsetX;
  let offsetY;
  console.log(loadImage);

  if (loadImage) {
    console.log("Load!!");

    loadImageWidth = loadImage.width();
    loadImageHeight = loadImage.height();
    console.log(loadImageWidth);
    console.log(loadImageHeight);

    const widthRatio = loadImageWidth / MAX_CANVAS_WIDTH;
    const heightRatio = loadImageHeight / MAX_CANVAS_HEIGHT;

    caculatedWidth =
      widthRatio > heightRatio
        ? MAX_CANVAS_WIDTH
        : (loadImageWidth * MAX_CANVAS_HEIGHT) / loadImageHeight;

    caculatedHeight =
      widthRatio > heightRatio
        ? (loadImageHeight * MAX_CANVAS_WIDTH) / loadImageWidth
        : MAX_CANVAS_HEIGHT;

    offsetX = Math.floor((MAX_CANVAS_WIDTH - caculatedWidth) / 2);
    offsetY = Math.floor((MAX_CANVAS_HEIGHT - caculatedHeight) / 2);
  }

  return (
    <Canvas style={styles.canvas}>
      {loadImage && (
        <Image
          image={loadImage}
          fit="contain"
          x={offsetX}
          y={offsetY}
          width={caculatedWidth}
          height={caculatedHeight}
        />
      )}
    </Canvas>
  );
};

export default SkiaCanvas;

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
