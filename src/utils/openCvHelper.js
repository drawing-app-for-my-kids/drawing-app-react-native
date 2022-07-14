import { RNCv, Mat, CvType, CvSize, ColorConv } from "react-native-opencv3";
import downloadAssetSource from "react-native-opencv3/downloadAssetSource";
import { temporaryPictureUri } from "./fileSystemHelper";

export const makeProcessImageUri = async (
  filePath,
  sigma,
  lowThreshold,
  highThreshold,
  handler,
) => {
  const newImagePath = temporaryPictureUri;

  const dstMat = await new Mat().init();

  console.log(1);

  // 이시점에 fileapath가 있는지 확인 필요

  const sourceFile = await downloadAssetSource(filePath);
  const srcMat = await RNCv.imageToMat(sourceFile);
  const gaussianKernelSize = new CvSize(3, 3);

  console.log(2);

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

  console.log(3);

  const { uri, width, height } = await RNCv.matToImage(dstMat, newImagePath);
  console.log(uri);

  console.log(4);

  handler(uri);
};
