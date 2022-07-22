import notebookReducer from "./reducers/noteBookReducer";
import {
  setItemToAsyncStorage,
  getItemFromAsyncStorage,
} from "../utils/asyncStorageHelper";
import getStroke from "perfect-freehand";
import { proxy } from "valtio";
import { derive } from "valtio/utils";
import getSvgPathFromStroke from "../utils/get-svg-path-from-stroke";

export const dispatchNotes = async (action) => {
  const currentState = await getItemFromAsyncStorage("Notes");
  let initialState = [];
  if (currentState) {
    initialState = currentState;
  }

  const result = notebookReducer(initialState, action);
  await setItemToAsyncStorage("Notes", result);
};

export const drawingState = proxy({
  isDrawing: false,
  currentPoints: { points: null, strokeWidth: 8 },
  completedPoints: [],
});

export const derivedPaths = derive({
  current: (get) =>
    get(drawingState).currentPoints.points !== null
      ? getSvgPathFromStroke(
          getStroke(get(drawingState).currentPoints.points, {
            size: get(drawingState).currentPoints.width,
          }),
        )
      : null,
  completed: (get) =>
    get(drawingState).completedPoints.map((point) => {
      const { points, width, ...rest } = point;
      return {
        path: getSvgPathFromStroke(
          getStroke(points, {
            size: width,
          }),
        ),
        ...rest,
      };
    }),
});
