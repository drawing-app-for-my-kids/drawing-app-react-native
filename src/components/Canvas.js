import React, {
  Fragment,
  useMemo,
  forwardRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  useImage,
  Image,
  Path,
  Paint,
} from "@shopify/react-native-skia";

import {
  makeImageFile,
  copyLoadImageFileToCacheDirectory,
  temporaryPictureUri,
} from "../utils/fileSystemHelper";

import { resizeImageInfoMake } from "../utils/painterHelper";
import useTouchDrawing from "../hooks/useTouchDrawing";

const MAX_CANVAS_WIDTH = 1051;
const MAX_CANVAS_HEIGHT = 759;

const SCanvas = (
  { filePath, currentMode, currentPenColor, currentPenType, notebookId },
  ref,
) => {
  const [canvasElements, setCanvasElements] = useState([]);
  const [prevCanvasElementLengthList, setPrevCanvasElementLengthList] =
    useState([]);
  const [currentImage, setCurrentImage] = useState(temporaryPictureUri);

  const loadImage = currentImage ? useImage(currentImage) : null;
  const resizeImageInfo = useMemo(() => {
    if (loadImage) {
      return resizeImageInfoMake(
        loadImage,
        MAX_CANVAS_WIDTH,
        MAX_CANVAS_HEIGHT,
      );
    } else {
      return null;
    }
  }, [loadImage]);

  const handleCanvasElemets = useCallback(
    (newElement) =>
      setCanvasElements((prevState) => {
        return [...prevState, newElement];
      }),
    [],
  );

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

  const handleTempSave = useCallback(async () => {
    const image = ref.current.makeImageSnapshot();
    if (image) {
      const base64File = image.encodeToBase64();
      await makeImageFile(temporaryPictureUri, base64File);
    }
  }, [ref]);

  useLayoutEffect(() => {
    const makeTempImageFile = async () => {
      await copyLoadImageFileToCacheDirectory(filePath);
    };

    makeTempImageFile();
  }, [filePath]);

  useEffect(() => {
    const batchProcess = async () => {
      await handleTempSave();
      setTimeout(() => setCurrentImage(temporaryPictureUri), 1000);
      setTimeout(() => setCanvasElements([]), 1000);
      setTimeout(() => setPrevCanvasElementLengthList([]), 1000);
    };

    if (prevCanvasElementLengthList.length > 3) {
      console.log("hi");
      batchProcess();
    }
  }, [prevCanvasElementLengthList, canvasElements, handleTempSave]);

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

  return (
    <Fragment>
      <Canvas style={styles.canvas} onTouch={touchHandler} ref={ref}>
        {loadImage && LoadImage(loadImage, resizeImageInfo)}
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

export const SkiaCanvas = forwardRef(SCanvas);

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});
