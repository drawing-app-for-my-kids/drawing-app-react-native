import React, { useRef } from "react";
import { useTouchHandler } from "@shopify/react-native-skia";

import { penSize } from "../constants/painterOptions";
import { createPath } from "../utils/painterHelper";

const useTouchDrawing = (
  currentMode,
  currentPenColor,
  currentPenType,
  handleCurrentElemets,
) => {
  const touchState = useRef(false);
  const currentPath = useRef(null);
  const prevPointRef = useRef(null);

  console.log("hooks inside color", currentPenColor);
  console.log("hooks inside pen type", currentPenType);

  return useTouchHandler({
    onStart: ({ x, y }) => {
      if (touchState.current) return;

      console.log("start");
      touchState.current = true;
      console.log("onstart indsie1", currentPenColor);

      switch (currentMode) {
        case undefined:
        case "draw": {
          console.log("onstart indsie2", currentPenColor);
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
      if (!touchState.current) return;

      switch (currentMode) {
        default:
          console.log("finish!");
          currentPath.current = null;
          touchState.current = false;
          break;
      }
    },
  });
};

export default useTouchDrawing;
