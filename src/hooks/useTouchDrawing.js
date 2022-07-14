import { useRef, useState } from "react";
import { useTouchHandler } from "@shopify/react-native-skia";

import { penSize } from "../constants/painterOptions";
import { createPath } from "../utils/painterHelper";

const useTouchDrawing = (
  currentElements,
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

        setDrawing(true);
        switch (currentMode) {
          case undefined:
          case "draw": {
            currentPath.current = createPath(
              x,
              y,
              currentPenColor,
              penSize[currentPenType],
              currentPenType,
            );

            break;
          }
          case "erase": {
            currentPath.current = createPath(
              x,
              y,
              currentPenColor,
              penSize[currentPenType],
              "erasing",
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
};

export default useTouchDrawing;
