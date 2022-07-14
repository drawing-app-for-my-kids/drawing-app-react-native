import React, { Fragment, useMemo, forwardRef } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  useImage,
  Image,
  Path,
  Paint,
  DiscretePathEffect,
  DashPathEffect,
  Path1DPathEffect,
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
  const resizeImageInfo = loadImage
    ? resizeImageInfoMake(loadImage, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT)
    : null;

  const touchHandler = useTouchDrawing(
    currentElements,
    currentMode,
    currentPenColor,
    currentPenType,
    prevElementsLengthList,
    handleCurrentElemets,
    handlePrevElementsLengthList,
  );

  const memoImage = useMemo(() => loadImage, [loadImage]);

  const elementComponents = useMemo(
    () =>
      currentElements.map((element, index) => {
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
                    strokeCap="round">
                    <Path1DPathEffect
                      path="M -10 0 L 0 -10, 10 0, 0 10 Z"
                      advance={20}
                      phase={0}
                      style="rotate"
                    />
                  </Path>
                );
              case "spray":
                return (
                  <Path
                    key={index}
                    path={element.path}
                    color={element.color}
                    style="stroke"
                    strokeWidth={element.size}
                    strokeCap="round">
                    <DashPathEffect intervals={[10, 30]} />
                  </Path>
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
      }),
    [currentElements],
  );

  return (
    <Fragment>
      <Canvas style={styles.canvas} onTouch={touchHandler} ref={ref}>
        {loadImage && (
          <Image
            image={memoImage}
            fit="contain"
            x={resizeImageInfo.offsetX}
            y={resizeImageInfo.offsetY}
            width={resizeImageInfo.caculatedWidth}
            height={resizeImageInfo.caculatedHeight}
          />
        )}
        {elementComponents}
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
