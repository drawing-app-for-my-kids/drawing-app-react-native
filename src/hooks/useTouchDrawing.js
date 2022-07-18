import { useRef, useState } from "react";
import { useTouchHandler } from "@shopify/react-native-skia";

import { penSize } from "../constants/painterOptions";
import { createPath } from "../utils/painterHelper";

const useTouchDrawing = (
  currentElementsLength,
  currentMode,
  currentPenColor,
  currentPenType,
  prevElementsLengthList,
  handleCurrentElemets,
  handlePrevElementsLengthList,
) => {
  const [isDrawing, setDrawing] = useState(false);
  const currentPath = useRef(null);
  const prevPointRef = useRef(null);

  return useTouchHandler(
    {
      onStart: ({ x, y }) => {
        if (isDrawing) return;

        const flooredX = Math.floor(x);
        const flooredY = Math.floor(y);

        setDrawing(true);
        switch (currentMode) {
          case undefined:
          case "draw": {
            currentPath.current = createPath(
              flooredX,
              flooredY,
              currentPenColor,
              penSize[currentPenType],
              currentPenType,
            );

            break;
          }
          case "erase": {
            currentPath.current = createPath(
              flooredX,
              flooredY,
              currentPenColor,
              penSize[currentPenType],
              "erasing",
            );

            break;
          }
          default:
            break;
        }
        prevPointRef.current = { x: flooredX, y: flooredY };
      },

      onActive: ({ x, y }) => {
        if (!isDrawing) return;

        const flooredX = Math.floor(x);
        const flooredY = Math.floor(y);

        switch (currentMode) {
          case undefined:
          case "draw": {
            const xMid = (prevPointRef.current.x + flooredX) / 2;
            const yMid = (prevPointRef.current.y + flooredY) / 2;
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
            const xMid = (prevPointRef.current.x + flooredX) / 2;
            const yMid = (prevPointRef.current.y + flooredY) / 2;
            currentPath.current.path.quadTo(
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
        prevPointRef.current = { x: flooredX, y: flooredY };
      },

      onEnd: () => {
        if (!isDrawing) return;
        currentPath.current = null;
        handlePrevElementsLengthList(currentElementsLength);
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
};

export default useTouchDrawing;
