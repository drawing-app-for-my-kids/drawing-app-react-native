import { useRef, useState, useContext } from "react";
import { useTouchHandler } from "@shopify/react-native-skia";

import { penSize } from "../constants/painterOptions";
import { createPath } from "../utils/painterHelper";
import { PainterContext } from "../screens/PainterScreen";

const useTouchDrawing = () => {
  const [isDrawing, setDrawing] = useState(false);
  const currentPath = useRef(null);
  const prevPointRef = useRef(null);

  const { currentMode, currentPenColor, currentPenType, handleCurrentElemets } =
    useContext(PainterContext);

  const pathMaker = (x, y) =>
    createPath(x, y, currentPenColor, penSize[currentPenType], "normal");

  return useTouchHandler({
    onStart: ({ x, y }) => {
      if (isDrawing) return;

      setDrawing(true);
      switch (currentMode) {
        case undefined:
        case "draw": {
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
          currentPath.current = null;
          setDrawing(false);
          break;
      }
    },
  });
};

export default useTouchDrawing;
