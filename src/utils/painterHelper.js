export const resizeImageInfoMake = (
  loadImage,
  MAX_CANVAS_WIDTH,
  MAX_CANVAS_HEIGHT,
) => {
  const resizeImageInfo = {};

  const loadImageWidth = loadImage.width();
  const loadImageHeight = loadImage.height();

  const widthRatio = loadImageWidth / MAX_CANVAS_WIDTH;
  const heightRatio = loadImageHeight / MAX_CANVAS_HEIGHT;

  resizeImageInfo.caculatedWidth =
    widthRatio > heightRatio
      ? MAX_CANVAS_WIDTH
      : (loadImageWidth * MAX_CANVAS_HEIGHT) / loadImageHeight;

  resizeImageInfo.caculatedHeight =
    widthRatio > heightRatio
      ? (loadImageHeight * MAX_CANVAS_WIDTH) / loadImageWidth
      : MAX_CANVAS_HEIGHT;

  resizeImageInfo.offsetX = Math.floor(
    (MAX_CANVAS_WIDTH - resizeImageInfo.caculatedWidth) / 2,
  );
  resizeImageInfo.offsetY = Math.floor(
    (MAX_CANVAS_HEIGHT - resizeImageInfo.caculatedHeight) / 2,
  );

  return resizeImageInfo;
};
