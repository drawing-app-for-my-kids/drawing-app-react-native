// 페인터의 기본 기능은 무엇인가?

// 펜의 타입을 정한다.
// 펜의 색깔을 정한다.

// 그리기
import { Skia } from "@shopify/react-native-skia";

export const createPath = (x, y, color, size, pathType) => {
  const path = Skia.Path.Make();
  path.moveTo(x, y);
  return {
    type: "path",
    path,
    color,
    size,
    pathType,
  };
};

// 지우개 기능
// 언두 기능

// 저장 - 로컬 스토리지에 저장
// 저장 - 카메라 롤에 저장
// 삭제 - 해당 파일 삭제
// 복사 - 원하는 노트복에 복사해서 옮기기

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
