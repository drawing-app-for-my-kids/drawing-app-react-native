import React, { Fragment, useMemo, forwardRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  useImage,
  Image,
  Path,
  Paint,
} from "@shopify/react-native-skia";

import { resizeImageInfoMake } from "../utils/painterHelper";
import useTouchDrawing from "../hooks/useTouchDrawing";

const MAX_CANVAS_WIDTH = 1051;
const MAX_CANVAS_HEIGHT = 759;

const SCanvas = (
  {
    filePath,
    currentElements,
    currentMode,
    currentPenColor,
    currentPenType,
    prevElementsLengthList,
    handleCurrentElemets,
    handlePrevElementsLengthList,
  },
  ref,
) => {
  const loadImage = filePath ? useImage(filePath) : null;
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

  const touchHandler = useTouchDrawing(
    currentElements.length,
    currentMode,
    currentPenColor,
    currentPenType,
    prevElementsLengthList,
    handleCurrentElemets,
    handlePrevElementsLengthList,
  );

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

  return (
    <Fragment>
      <Canvas style={styles.canvas} onTouch={touchHandler} ref={ref}>
        {loadImage && LoadImage(loadImage, resizeImageInfo)}
        {currentElements.map((element, index) => {
          switch (element.type) {
            case "image":
              return <Image fit="fill" key={index} image={element.image} />;
            default:
              switch (element.pathType) {
                case "lead-pencil":
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color={element.color}
                      style="stroke"
                      strokeWidth={element.size}
                      strokeCap="round"
                    />
                  );
                case "grease-pencil":
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color={element.color}
                      style="stroke"
                      strokeWidth={element.size}
                      strokeCap="round"
                    />
                  );
                case "brush":
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color={element.color}
                      style="stroke"
                      strokeWidth={element.size}
                      strokeCap="round"
                    />
                  );
                case "format-paint":
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color={element.color}
                      style="stroke"
                      strokeWidth={element.size}
                      strokeCap="round"
                    />
                  );
                case "spray":
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color={element.color}
                      style="stroke"
                      strokeWidth={element.size}
                      strokeCap="round"
                    />
                  );
                case "erasing":
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color="white"
                      style="stroke"
                      strokeWidth={9}
                      strokeCap="round">
                      <Paint blendMode="clear" />
                    </Path>
                  );
                default:
                  return (
                    <Path
                      key={index}
                      path={element.path}
                      color={element.color}
                      style="stroke"
                      strokeWidth={element.size}
                      strokeCap="round"
                    />
                  );
              }
          }
        })}
      </Canvas>
    </Fragment>
  );
};

export const SkiaCanvas = forwardRef(SCanvas);

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
