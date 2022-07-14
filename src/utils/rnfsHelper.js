import * as RNFS from "react-native-fs";

const { DocumentDirectoryPath, CachesDirectoryPath } = RNFS;

export const rnfsTemporaryPicture = "rnfsTemporaryPicture.png";
export const rnfsTemporaryPictureUri =
  "file://" + DocumentDirectoryPath + "/" + rnfsTemporaryPicture;

export const rnfsTemporaryPictureUriWithourPrefix =
  DocumentDirectoryPath + "/" + rnfsTemporaryPicture;

export const rnfsCopyPhotoAlbumImageFileToCacheDirectory = async (
  orginalImageUri,
) => {
  try {
    const temporaryImageFile = await RNFS.exists(rnfsTemporaryPictureUri);

    if (temporaryImageFile) {
      await rnfsDeleteTemporaryImage();
    }

    await RNFS.copyFile(orginalImageUri, rnfsTemporaryPictureUri);

    console.log("rnfs 임시파일 생성 성공!");
  } catch (error) {
    console.log(error);
  }
};

//rnfs downloadFile 명령어 사용
export const rnfsDownloadTemporaryImageToCacheDirectory = async (url) => {
  try {
    const temporaryImageFile = await RNFS.exists(rnfsTemporaryPictureUri);

    if (temporaryImageFile) {
      await rnfsDeleteTemporaryImage();
    }

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: rnfsTemporaryPictureUri,
    });

    console.log("rnfs로 다운 받고 저장 성공 ", result.statusCode);
  } catch (error) {
    console.log(error);
  }
};

export const rnfsDeleteTemporaryImage = async () => {
  try {
    await RNFS.unlink(rnfsTemporaryPictureUri);
    console.log("rnfs 임시 파일 삭제 성공");
  } catch (error) {
    console.log(error);
  }
};
