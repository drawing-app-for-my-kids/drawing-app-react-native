import { RNCv, Mat, CvType, CvSize, ColorConv } from "react-native-opencv3";
import downloadAssetSource from "react-native-opencv3/downloadAssetSource";
import {
  rnfsTemporaryPictureUri,
  rnfsTemporaryPictureUriWithourPrefix,
} from "./rnfsHelper";
import * as RNFS from "react-native-fs";

export const makeProcessImageUri = async (
  filePath,
  sigma,
  lowThreshold,
  highThreshold,
  handler,
) => {
  const newImagePath = rnfsTemporaryPictureUri;
  const dstMat = await new Mat().init();

  console.log("[opencvHelper]1");
  console.log("[opencvHelper]filePath", filePath);

  const sourceFile = await downloadAssetSource(
    rnfsTemporaryPictureUriWithourPrefix,
  );
  const srcMat = await RNCv.imageToMat(sourceFile);
  const gaussianKernelSize = new CvSize(3, 3);

  console.log("[opencvHelper]2");
  console.log("srcMat", srcMat);

  RNCv.invokeMethod("cvtColor", {
    p1: srcMat,
    p2: dstMat,
    p3: ColorConv.COLOR_BGR2GRAY,
  });
  RNCv.invokeMethod("GaussianBlur", {
    p1: dstMat,
    p2: dstMat,
    p3: gaussianKernelSize,
    p4: sigma,
    p5: sigma,
  });
  RNCv.invokeMethod("Canny", {
    p1: dstMat,
    p2: dstMat,
    p3: lowThreshold,
    p4: highThreshold,
    p5: 3,
  });
  RNCv.invokeMethod("bitwise_not", {
    p1: dstMat,
    p2: dstMat,
  });

  console.log("[opencvHelper]3");
  console.log(dstMat);

  console.log(newImagePath);
  const result = await RNCv.matToImage(dstMat, newImagePath);
  console.log(result.uri);

  console.log("[opencvHelper]final");
  RNCv.deleteMat(dstMat);

  handler(result.uri);
};
