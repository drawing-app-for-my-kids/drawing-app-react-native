import React, { useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import styled from "styled-components/native";
import { openImagePickerAsync } from "../utils/imagePickerHelper";
import ViewShot from "react-native-view-shot";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import {
  copyPhotoAlbumImageFileToCacheDirectory,
  downloadTemporaryImageToCacheDirectory,
  temporaryPictureUri,
  copyTemporaryImageFileToDocumentDirectory,
  filePathMaker,
  deleteTemporaryImage,
  copyProcessImageFileToCacheDirectory,
} from "../utils/fileSystemHelper";

import { addPictureToNotebook } from "../store/actions/noteBookActions";
import { dispatchNotes } from "../store";

import CannyEdgeDetection from "../components/CannyEdgeDetection";
import { ImageSlider } from "../components/slider";
import ControlButton from "../components/buttons/ControlButton";

const ImageProcessingScreen = ({ route, navigation }) => {
  const [originalImageUri, setOriginalImageUri] = useState(null);
  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);
  const [onInputUrlModal, setInputUrlModal] = useState(false);
  const [currentInputUrl, setInputUrl] = useState(null);
  const [imageSource, setImageSource] = useState(null);
  const [sigma, setSigma] = useState(1.3);
  const [lowThreshold, setLowThreshold] = useState(30);
  const [highThreshold, setHighThreshold] = useState(70);
  const [edgeDetectionOption, setEdgeDetectionOption] = useState(null);
  const captureRef = useRef(null);

  const { notebookId } = route.params;

  const loadImagefromImagePicker = async () => {
    const imageUri = await openImagePickerAsync();

    setOriginalImageUri(imageUri);
    setImageSource("photoAlbum");
  };

  const captureProcessedImage = async () => {
    const caputureImgUri = await captureRef.current.capture();
    await copyProcessImageFileToCacheDirectory("file://" + caputureImgUri);
  };

  return (
    <Contatiner>
      <LeftMainView>
        <ProcessedImageView
          collapsable={false}
          ref={captureRef}
          options={{ format: "png", quality: 1 }}>
          {originalImageUri ? (
            edgeDetectionOption ? (
              <CannyEdgeDetection
                sigma={sigma}
                lowThreshold={lowThreshold}
                highThreshold={highThreshold}
                processedImageUri={processedImageUri}
              />
            ) : (
              <Image
                source={{ uri: processedImageUri }}
                style={styles.preview}
              />
            )
          ) : (
            <Text style={{ fontSize: 40 }}>???????????? ????????????.</Text>
          )}
        </ProcessedImageView>
      </LeftMainView>
      <RightControlView>
        <ButtonsView>
          <ControlButton
            text="????????????"
            onPress={() => {
              setCurrentModal("imageLoadModal");
            }}
          />
          <ControlButton
            text="????????????"
            onPress={async () => {
              if (originalImageUri) {
                setProcessedImageUri(null);
                setProcessedImageUri(temporaryPictureUri);
                setEdgeDetectionOption({ lowThreshold, highThreshold });
              } else {
                Alert.alert("?????? ???????????? ???????????????.");
              }
            }}
          />
          <ControlButton
            text="??????"
            onPress={async () => {
              if (processedImageUri) {
                await captureProcessedImage();

                const newDate = new Date();
                const pictureId = "picture" + newDate.getTime();
                const filePath = filePathMaker(notebookId, pictureId);

                const newPictureInfo = {
                  _id: pictureId,
                  createdAt: newDate,
                  updatedAt: newDate,
                  filePath,
                };

                await dispatchNotes(
                  addPictureToNotebook(notebookId, newPictureInfo),
                );
                await copyTemporaryImageFileToDocumentDirectory(filePath);
                await deleteTemporaryImage();

                navigation.navigate(route.params.previousScreen, {
                  noteBookTitle: route.params.previousTitle,
                  _id: route.params.previousId,
                });
              } else {
                Alert.alert("????????? ????????? ????????????.");
              }
            }}
          />
          <ControlButton
            text="?????????"
            onPress={() => {
              setOriginalImageUri(null);
              setProcessedImageUri(null);
              setImageSource(null);
              setSigma(1.3);
              setLowThreshold(30);
              setHighThreshold(70);
              setEdgeDetectionOption(null);
            }}
          />
        </ButtonsView>
        <SliderView>
          {originalImageUri && (
            <Sliders>
              <SliderItem>
                {ImageSlider(sigma, 0.1, 0, 2, (sliderValue) =>
                  setSigma(sliderValue),
                )}
                <SliderStatus>
                  <SLiderLabel>Sigma :</SLiderLabel>
                  <SliderValue>{Math.floor(sigma * 10) / 10}</SliderValue>
                </SliderStatus>
              </SliderItem>
              <SliderItem>
                {ImageSlider(lowThreshold, 1, 0, 100, (sliderValue) => {
                  setLowThreshold(sliderValue);
                })}
                <SliderStatus>
                  <SLiderLabel>Low Threshold :</SLiderLabel>
                  <SliderValue>{lowThreshold}</SliderValue>
                </SliderStatus>
              </SliderItem>
              <SliderItem>
                {ImageSlider(highThreshold, 1, 0, 100, (sliderValue) => {
                  setHighThreshold(sliderValue);
                })}
                <SliderStatus>
                  <SLiderLabel>High Threshold :</SLiderLabel>
                  <SliderValue>{highThreshold}</SliderValue>
                </SliderStatus>
              </SliderItem>
            </Sliders>
          )}
        </SliderView>
        <InfoButton onPress={() => setCurrentModal("infoModal")}>
          <FontAwesome5 name="info-circle" size={50} color="black" />
        </InfoButton>
      </RightControlView>
      <ImageLoadModal
        animationType="slide"
        transparent={true}
        visible={currentModal === "imageLoadModal"}
        onRequestClose={() => {
          setCurrentModal(null);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.loadModalView}>
            <ModalView>
              <ModalButtonView>
                <ModalButton
                  onPress={() => {
                    setOriginalImageUri(null);
                    setProcessedImageUri(null);
                    setCurrentModal(null);
                    setImageSource(null);
                  }}>
                  <ModalButtonText>??????</ModalButtonText>
                </ModalButton>
                <ModalButton
                  onPress={async () => {
                    if (imageSource === "photoAlbum") {
                      if (processedImageUri) {
                        setProcessedImageUri(null);
                      }
                      await copyPhotoAlbumImageFileToCacheDirectory(
                        originalImageUri,
                      );
                      setProcessedImageUri(temporaryPictureUri);
                      setImageSource("fileSystem");
                      setEdgeDetectionOption(null);
                      setCurrentModal(null);
                    } else if (imageSource === "url") {
                      if (processedImageUri) {
                        setProcessedImageUri(null);
                      }
                      await downloadTemporaryImageToCacheDirectory(
                        originalImageUri,
                      );
                      setProcessedImageUri(temporaryPictureUri);
                      setImageSource("fileSystem");
                      setEdgeDetectionOption(null);
                      setCurrentModal(null);
                    }
                  }}>
                  <ModalButtonText>??????</ModalButtonText>
                </ModalButton>
              </ModalButtonView>
              <ModalMainView>
                <ModalMainButton onPress={loadImagefromImagePicker}>
                  <ModalMainButtonText>??????????????? ????????????</ModalMainButtonText>
                </ModalMainButton>
                <ModalMainButton
                  onPress={() => {
                    setCurrentModal(null);
                    setInputUrl(null);
                    setInputUrlModal(!onInputUrlModal);
                  }}>
                  <ModalMainButtonText>URL ???????????? </ModalMainButtonText>
                </ModalMainButton>
              </ModalMainView>
            </ModalView>
          </View>
        </View>
      </ImageLoadModal>
      <ImageUrlInputModal
        animationType="fade"
        transparent={true}
        visible={onInputUrlModal}
        onRequestClose={() => {
          setInputUrlModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.urlInputModalView}>
            <ModalView>
              <ModalButtonView>
                <ModalButton
                  onPress={() => {
                    setInputUrlModal(!onInputUrlModal);
                    setInputUrl(null);
                  }}>
                  <ModalButtonText>??????</ModalButtonText>
                </ModalButton>
              </ModalButtonView>
              <ModalMainView>
                <Text
                  style={{
                    marginBottom: 20,
                    fontSize: 30,
                  }}>
                  URL ?????????
                </Text>
                <ImageUrlTextInput
                  placeholder="????????? URL??? ???????????????"
                  value={currentInputUrl}
                  onChangeText={(URL) => setInputUrl(URL)}
                />
                <ImageUrlSaveButton
                  onPress={() => {
                    setOriginalImageUri(currentInputUrl);
                    setInputUrlModal(!onInputUrlModal);
                    setCurrentModal("imageLoadModal");
                    setImageSource("url");
                  }}>
                  <ImageUrlSaveButtonText>??????</ImageUrlSaveButtonText>
                </ImageUrlSaveButton>
              </ModalMainView>
            </ModalView>
          </View>
        </View>
      </ImageUrlInputModal>
      <InfoModal
        animationType="slide"
        transparent={true}
        visible={currentModal === "infoModal"}
        onRequestClose={() => {
          setCurrentModal(null);
        }}>
        <View style={styles.infoModalCenteredView}>
          <View style={styles.infoModalView}>
            <InfoModalTitle>{`?????? ?????? ?????? ??????`}</InfoModalTitle>
            <InfoModalSmallTitle>{"??? Sigma "}</InfoModalSmallTitle>
            <InfoModalText>
              {"??? Gaussian Blur ????????? ???????????? ?????????."}
            </InfoModalText>
            <InfoModalText>
              {"??? Blur????????? ?????? ???????????? ???????????? ????????????."}
            </InfoModalText>
            <InfoModalText>
              {"??? Sigma ?????? ???????????? ?????? ????????? ??????????????????."}
            </InfoModalText>
            <InfoModalText>{}</InfoModalText>
            <InfoModalSmallTitle>
              {"??? Low Threshold & High Threshold"}
            </InfoModalSmallTitle>
            <InfoModalText>
              {"??? ?????? ?????????????????? ????????? ????????? ?????????"}
            </InfoModalText>
            <InfoModalText>
              {"??? ?????? ?????????????????? ?????? ?????? ????????? ????????? ?????????. "}
            </InfoModalText>
            <InfoModalText>
              {"??? ?????????????????? ???????????? ???????????? ????????? ?????????. "}
            </InfoModalText>
            <InfoModalText>
              {"??? ?????? ???????????? ????????? ???????????? ?????? ????????? ?????????."}
            </InfoModalText>
            <InfoModalText>
              {"??? Low Threshold??? ????????? ???????????? ?????? ????????? "}
            </InfoModalText>
            <InfoModalText>
              {"??? High Threshold??? ????????? ???????????? ????????? ????????????. "}
            </InfoModalText>
            <InfoModalText>{}</InfoModalText>
            <InfoModalSmallTitle>
              {"??? Canny Edge Detection"}
            </InfoModalSmallTitle>
            <InfoModalText>
              {"??? ?????? ?????? ????????? ????????? ?????? ?????? ????????? ????????????"}
            </InfoModalText>
            <InfoModalText>
              {"??? Gaussian Blur????????? ?????? ???????????? ????????? ??????"}
            </InfoModalText>
            <InfoModalText>
              {"????????? ?????????????????? ?????? ????????? ????????????."}
            </InfoModalText>
            <InfoModalCloseButton onPress={() => setCurrentModal(null)}>
              <Feather name="x-circle" size={24} color="black" />
            </InfoModalCloseButton>
          </View>
        </View>
      </InfoModal>
    </Contatiner>
  );
};

export default ImageProcessingScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 195,
    marginRight: 10,
  },
  infoModalCenteredView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 145,
  },
  loadModalView: {
    width: 300,
    height: 560,
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  urlInputModalView: {
    width: 580,
    height: 560,
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  infoModalView: {
    width: "50%",
    height: "91.1%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 50,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  controlButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  preview: {
    width: 1051,
    height: 759,
    resizeMode: "contain",
  },
});

const Contatiner = styled.View`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: row;
`;

const LeftMainView = styled.View`
  width: 88%;
  background-color: white;
  padding-top: 20px;
`;

const ProcessedImageView = styled(ViewShot)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightControlView = styled.View`
  width: 12%;
  background-color: white;
  padding-top: 30px;
  padding-bottom: 30px;

  display: flex;
  align-items: center;
`;

const ButtonsView = styled.View`
  width: 100%;
  height: 47%;
  display: flex;
  align-items: center;
`;

const SliderView = styled.View`
  width: 100%;
  height: 45%;
`;

const Sliders = styled.View`
  display: flex;
  align-items: center;
`;

const SliderItem = styled.View`
  display: flex;
  align-items: center;
  margin: 15px 0px;
`;

const SliderStatus = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 160px;
  padding-left: 15px;
`;

const SLiderLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  margin-right: 5px;
`;

const SliderValue = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: blue;
  width: 30px;
`;

const ImageLoadModal = styled.Modal``;

const ModalView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalButtonView = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  height: 20%;
`;

const ModalButton = styled.Pressable`
  border-radius: 10px;
  width: 100px;
  height: 35px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: blue;
`;

const ModalMainView = styled.View`
  width: 100%;
  height: 80%;
  padding: 10px;
`;

const ModalMainButton = styled.Pressable`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: silver;
`;

const ModalMainButtonText = styled.Text`
  font-size: 20px;
`;

const ImageUrlInputModal = styled.Modal``;

const ImageUrlTextInput = styled.TextInput`
  height: 40px;
  width: 200px;
  border: 1px solid black;
  padding-left: 5px;
  font-size: 20px;
  width: 100%;
  margin-bottom: 10px;
`;

const ImageUrlSaveButton = styled.Pressable`
  width: 100px;
  height: 50px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageUrlSaveButtonText = styled.Text`
  font-size: 20px;
`;

const InfoModal = styled(Modal)``;

const InfoButton = styled.Pressable``;

const InfoModalTitle = styled(Text)`
  margin-bottom: 15px;
  text-align: center;
  font-size: 42px;
`;

const InfoModalSmallTitle = styled(Text)`
  margin-bottom: 10px;
  font-size: 26px;
`;

const InfoModalText = styled(Text)`
  margin-bottom: 10px;
  font-size: 20px;
  padding-left: 20px;
`;

const InfoModalCloseButton = styled(Pressable)`
  align-self: flex-end;
  position: absolute;
  border-radius: 20px;
  padding: 10px;
`;
