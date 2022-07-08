import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const openImagePickerAsync = async () => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    Alert.alert("Permission to access camera roll is required!");
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync();
  return pickerResult.uri;
};
