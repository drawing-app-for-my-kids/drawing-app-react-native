import CameraRoll from "@react-native-community/cameraroll";

export const saveFileToCameraRoll = async (filePath) => {
  await CameraRoll.save(filePath);
};
