import React, {
  Fragment,
  useMemo,
  forwardRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  useImage,
  Image,
  Path,
  Paint,
} from "@shopify/react-native-skia";

import { makeImageFile, filePathMaker } from "../utils/fileSystemHelper";
import {
  addPictureToNotebook,
  updatePicture,
} from "../store/actions/noteBookActions";
import { dispatchNotes } from "../store/index";
import useTouchDrawing from "../hooks/useTouchDrawing";

const SCanvas = (
  { currentMode, currentPenColor, currentPenType, notebookId },
  ref,
) => {
  const [canvasElements, setCanvasElements] = useState([]);
  const [prevCanvasElementLengthList, setPrevCanvasElementLengthList] =
    useState([]);

  const handleCanvasElemets = useCallback(
    (newElement) =>
      setCanvasElements((prevState) => {
        return [...prevState, newElement];
      }),
    [],
  );

  console.log("empty Canvas");

  const handlePrevCanvasElementLengthList = useCallback(
    (elementLength) => {
      setPrevCanvasElementLengthList([
        ...prevCanvasElementLengthList,
        elementLength,
      ]);
    },
    [prevCanvasElementLengthList],
  );

  const touchHandler = useTouchDrawing(
    canvasElements.length,
    currentMode,
    currentPenColor,
    currentPenType,
    prevCanvasElementLengthList,
    handleCanvasElemets,
    handlePrevCanvasElementLengthList,
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

  const handleTempSave = async () => {
    const image = ref.current.makeImageSnapshot();
    if (image) {
      if (loadImage === null) {
        const newDate = new Date();
        const newPictureId = "picture" + newDate.getTime();
        const newFilePath = filePathMaker(notebookId, newPictureId);

        const newPictureInfo = {
          _id: newPictureId,
          createdAt: newDate,
          updatedAt: newDate,
          filePath: newFilePath,
        };
        const base64File = image.encodeToBase64();
        await dispatchNotes(addPictureToNotebook(notebookId, newPictureInfo));
        await makeImageFile(newFilePath, base64File);
      } else {
        const base64File = image.encodeToBase64();
        await dispatchNotes(updatePicture(notebookId, pictureId));
        await makeImageFile(filePath, base64File);
      }
    }
  };

  useEffect(() => {
    ref.current.handleDeleteLastElement = () => {
      setCanvasElements(
        canvasElements.slice(
          0,
          prevCanvasElementLengthList[prevCanvasElementLengthList.length - 1],
        ),
      );
      setPrevCanvasElementLengthList(
        prevCanvasElementLengthList.slice(
          0,
          prevCanvasElementLengthList.length - 1,
        ),
      );
    };
  }, [ref, canvasElements, prevCanvasElementLengthList]);

  useEffect(() => {
    const lastElementLength =
      prevCanvasElementLengthList[prevCanvasElementLengthList.length - 1];

    if (prevCanvasElementLengthList.length > 3) {
      console.log("hi");
    }
  }, [prevCanvasElementLengthList]);
  //prevCanvasElement의 마지막 길이가 특정 이상이면
  // 현재 캔버스 저장하고, 엘리먼트 갯수 줄인다.

  return (
    <Fragment>
      <Canvas style={styles.canvas} onTouch={touchHandler} ref={ref}>
        {canvasElements.map((element, index) => {
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

export const SkiaEmptyCanvas = forwardRef(SCanvas);

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
