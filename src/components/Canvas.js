import React, { useState, useRef, Fragment, useMemo, forwardRef } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  useImage,
  Image,
  Path,
  useTouchHandler,
} from "@shopify/react-native-skia";

import { penSize } from "../constants/painterOptions";
import { resizeImageInfoMake, createPath } from "../utils/painterHelper";

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
  const [isDrawing, setDrawing] = useState(false);
  const currentPath = useRef(null);
  const prevPointRef = useRef(null);
  const loadImage = filePath ? useImage(filePath) : null;
  const resizeImageInfo = loadImage
    ? resizeImageInfoMake(loadImage, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT)
    : null;

  const touchHandler = useTouchHandler(
    {
      onStart: ({ x, y }) => {
        if (isDrawing) return;

        setDrawing(true);
        switch (currentMode) {
          case undefined:
          case "draw": {
            currentPath.current = createPath(
              x,
              y,
              currentPenColor,
              penSize[currentPenType],
              "normal",
            );

            break;
          }
          case "erase": {
            currentPath.current = createPath(
              x,
              y,
              currentPenColor,
              penSize[currentPenType],
              "normal",
            );

            break;
          }
          default:
            break;
        }
        prevPointRef.current = { x, y };
      },

      onActive: ({ x, y }) => {
        switch (currentMode) {
          case undefined:
          case "draw": {
            const xMid = (prevPointRef.current.x + x) / 2;
            const yMid = (prevPointRef.current.y + y) / 2;
            currentPath.current.path.quadTo(
              prevPointRef.current.x,
              prevPointRef.current.y,
              xMid,
              yMid,
            );

            handleCurrentElemets(currentPath.current);

            break;
          }

          case "erase": {
            const xMid = (prevPointRef.current.x + x) / 2;
            const yMid = (prevPointRef.current.y + y) / 2;
            currentPath.current.quadTo(
              prevPointRef.current.x,
              prevPointRef.current.y,
              xMid,
              yMid,
            );

            handleCurrentElemets(currentPath.current);

            break;
          }

          default:
            break;
        }
        prevPointRef.current = { x, y };
      },

      onEnd: () => {
        currentPath.current = null;
        handlePrevElementsLengthList(currentElements.length);
        setDrawing(false);
      },
    },
    [
      currentMode,
      currentPenType,
      currentPenColor,
      isDrawing,
      prevElementsLengthList,
    ],
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
