import React, { useState, useRef, Fragment, useMemo } from "react";
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

export const SkiaCanvas = ({
  filePath,
  currentElements,
  currentMode,
  currentPenColor,
  currentPenType,
  handleCurrentElemets,
}) => {
  const [isDrawing, setDrawing] = useState(false);
  const currentPath = useRef(null);
  const prevPointRef = useRef(null);
  const loadImage = filePath ? useImage(filePath) : null;
  const resizeImageInfo = loadImage
    ? resizeImageInfoMake(loadImage, MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT)
    : null;

  const pathMaker = (x, y) =>
    createPath(x, y, currentPenColor, penSize[currentPenType], "normal");

  console.log("outside", currentPenColor);

  const touchHandler = useTouchHandler({
    onStart: ({ x, y }) => {
      if (isDrawing) return;

      setDrawing(true);
      console.log("start");
      console.log("onstart indsie1", currentPenColor);
      switch (currentMode) {
        case undefined:
        case "draw": {
          console.log("onstart indsie2", currentPenColor);
          currentPath.current = pathMaker(x, y);

          break;
        }
        case "erase": {
          currentPath.current = pathMaker();

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
      if (!isDrawing) return;

      switch (currentMode) {
        default:
          console.log("finish!");
          currentPath.current = null;
          setDrawing(false);
          break;
      }
    },
  });

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
      <Canvas style={styles.canvas} onTouch={touchHandler}>
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

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
