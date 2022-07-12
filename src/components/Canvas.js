import React, { Fragment, useMemo, forwardRef } from "react";
import { StyleSheet } from "react-native";
import { Canvas, useImage, Image, Path } from "@shopify/react-native-skia";

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
              case "normal":
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
              default:
                break;
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
