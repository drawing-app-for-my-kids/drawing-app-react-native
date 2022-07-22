import React, { useState, useRef, useLayoutEffect } from "react";
import styled from "styled-components/native";
import { View, StyleSheet, Pressable, FlatList, Modal } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import ColorButtonItem from "../components/buttons/ColorButton";
import { colorList } from "../constants/painterOptions";
import SketchCanvas from "../components/SketchCanvas";

import {
  makeImageFile,
  deletePathFromDocumentDirectory,
  filePathMaker,
} from "../utils/fileSystemHelper";
import { saveFileToCameraRoll } from "../utils/cameraRollHelper";
import {
  deletePictureFromNotebook,
  addPictureToNotebook,
  updatePicture,
} from "../store/actions/noteBookActions";
import { dispatchNotes } from "../store/index";

const PainterScreen = ({ route, navigation }) => {
  const [currentModal, setCurrentModal] = useState(null);
  const [currentMode, setCurrentMode] = useState("draw");
  const [currentPenType, setCurrentPenType] = useState("grease-pencil");
  const [currentPenColor, setCurrentPenColor] = useState("black");
  const canvasRef = useRef(null);

  const filePath = route.params.item ? route.params.item.filePath : null;
  const pictureId = route.params.item ? route.params.item._id : null;
  const notebookId = route.params.notebookId;

  const handleSave = async () => {
    const imageBase64 = canvasRef.current.toBase64();
    if (imageBase64) {
      if (filePath === null) {
        const newDate = new Date();
        const newPictureId = "picture" + newDate.getTime();
        const newFilePath = filePathMaker(notebookId, newPictureId);

        const newPictureInfo = {
          _id: pictureId,
          createdAt: newDate,
          updatedAt: newDate,
          filePath: newFilePath,
        };
        await dispatchNotes(addPictureToNotebook(notebookId, newPictureInfo));
        await makeImageFile(newFilePath, imageBase64);
      } else {
        await dispatchNotes(updatePicture(notebookId, pictureId));
        await makeImageFile(filePath, imageBase64);
      }
    }
  };

  const handleSaveToCameraRoll = async () => {
    const imageBase64 = canvasRef.current.toBase64();
    if (imageBase64) {
      await makeImageFile(filePath, imageBase64);
      await saveFileToCameraRoll(filePath);
    }
  };

  const handleDeletePicture = async () => {
    if (filePath) {
      await dispatchNotes(deletePictureFromNotebook(notebookId, pictureId));
      await deletePathFromDocumentDirectory(filePath);
    }
  };

  useLayoutEffect(() => {
    canvasRef.current.reset();
  }, []);

  return (
    <Contatiner>
      <LeftMainView>
        <SketchCanvas
          filePath={filePath}
          currentMode={currentMode}
          currentPenColor={currentPenColor}
          currentPenType={currentPenType}
          ref={canvasRef}
        />
      </LeftMainView>
      <RightControlView>
        <ButtonsView>
          <SaveFileButton
            onPress={async () => {
              await handleSave();
              if (canvasRef.current) {
                canvasRef.current.reset();
              }
              navigation.goBack();
            }}>
            <MaterialIcons name="save" size={72} color="black" />
          </SaveFileButton>
          <SaveCameraRollButton
            onPress={async () => {
              await handleSaveToCameraRoll();
              navigation.goBack();
            }}>
            <MaterialCommunityIcons name="camera" size={72} color="black" />
          </SaveCameraRollButton>
          <PenPickerButton
            onPress={() => {
              setCurrentMode(() => "draw");
              !currentModal
                ? setCurrentModal(() => "penModal")
                : setCurrentModal(null);
            }}>
            <MaterialCommunityIcons
              name={currentPenType}
              size={72}
              color="black"
            />
            {currentMode === "draw" && (
              <SelectedMark>
                <FontAwesome5 name="check-circle" size={22} color="black" />
              </SelectedMark>
            )}
          </PenPickerButton>
          <ColorPickerButton
            onPress={() => {
              !currentModal
                ? setCurrentModal(() => "colorModal")
                : setCurrentModal(null);
            }}>
            <MaterialIcons name="color-lens" size={72} color="black" />
            <CurrentColorPreview
              style={{
                backgroundColor: currentPenColor,
                overflow: "hidden",
              }}
            />
          </ColorPickerButton>
          <UndoButton
            onPress={() => {
              canvasRef.current.undo();
            }}>
            <MaterialCommunityIcons
              name="undo-variant"
              size={72}
              color="black"
            />
          </UndoButton>
          <RedoButton
            onPress={() => {
              canvasRef.current.redo();
            }}>
            <MaterialCommunityIcons
              name="redo-variant"
              size={72}
              color="black"
            />
          </RedoButton>
          <DeleteButton
            onPress={() => {
              setCurrentModal("deletePictureModal");
            }}>
            <MaterialCommunityIcons
              name="delete-empty"
              size={72}
              color="black"
            />
          </DeleteButton>
        </ButtonsView>
        <PenModal
          animationType="fade"
          transparent={true}
          visible={currentModal === "penModal"}
          onRequestClose={() => {
            setCurrentModal(null);
          }}>
          <View style={styles.penCenteredView}>
            <View style={styles.penModalView}>
              <PenModalView>
                <PenModalTextBox
                  onPress={() => {
                    setCurrentModal(null);
                    setCurrentPenType(() => "lead-pencil");
                  }}>
                  <MaterialCommunityIcons
                    name="lead-pencil"
                    size={80}
                    color="black"
                  />
                </PenModalTextBox>
                <PenModalTextBox
                  onPress={() => {
                    setCurrentModal(null);
                    setCurrentPenType("grease-pencil");
                  }}>
                  <MaterialCommunityIcons
                    name="grease-pencil"
                    size={80}
                    color="black"
                  />
                </PenModalTextBox>
                <PenModalTextBox
                  onPress={() => {
                    setCurrentModal(null);
                    setCurrentPenType("brush");
                  }}>
                  <MaterialCommunityIcons
                    name="brush"
                    size={80}
                    color="black"
                  />
                </PenModalTextBox>
                <PenModalTextBox
                  onPress={() => {
                    setCurrentModal(null);
                    setCurrentPenType("format-paint");
                  }}>
                  <MaterialCommunityIcons
                    name="format-paint"
                    size={80}
                    color="black"
                  />
                </PenModalTextBox>
                <PenModalTextBox
                  onPress={() => {
                    setCurrentModal(null);
                    setCurrentPenType("spray");
                  }}>
                  <MaterialCommunityIcons
                    name="spray"
                    size={80}
                    color="black"
                  />
                </PenModalTextBox>
              </PenModalView>
              <ModalCloseButton onPress={() => setCurrentModal(null)}>
                <Feather name="x-circle" size={22} color="black" />
              </ModalCloseButton>
            </View>
          </View>
        </PenModal>
        <ColorModal
          animationType="fade"
          transparent={true}
          visible={currentModal === "colorModal"}
          onRequestClose={() => {
            setCurrentModal(null);
          }}>
          <View style={styles.colorCenteredView}>
            <View style={styles.colorModalView}>
              <FlatList
                data={colorList}
                renderItem={({ item }) => (
                  <ColorButtonItem
                    color={item}
                    PressHandler={(color) => {
                      setCurrentPenColor(color);
                      setCurrentModal(null);
                    }}
                  />
                )}
                keyExtractor={(item, index) => item + index}
                numColumns={7}
                style={{ width: 400, height: 400 }}
              />
              <ModalCloseButton onPress={() => setCurrentModal(null)}>
                <Feather name="x-circle" size={24} color="black" />
              </ModalCloseButton>
            </View>
          </View>
        </ColorModal>
        <DeletePictureModal
          animationType="slide"
          transparent={true}
          visible={currentModal === "deletePictureModal"}
          onRequestClose={() => {
            setCurrentModal(null);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ModalView>
                <ModalCautionView>
                  <ModalCautionText>그림을 삭제 하시겠습니까?</ModalCautionText>
                </ModalCautionView>
                <ModalButtonView>
                  <ModalButton onPress={() => setCurrentModal(null)}>
                    <ModalButtonText>취소</ModalButtonText>
                  </ModalButton>
                  <ModalButton
                    onPress={async () => {
                      await handleDeletePicture();
                      navigation.goBack();
                    }}>
                    <ModalButtonText>삭제</ModalButtonText>
                  </ModalButton>
                </ModalButtonView>
              </ModalView>
            </View>
          </View>
        </DeletePictureModal>
      </RightControlView>
    </Contatiner>
  );
};

export default PainterScreen;

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 150,
    marginBottom: 20,
  },
  modalView: {
    width: 300,
    height: 200,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  penCenteredView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 150,
  },
  colorCenteredView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 150,
  },
  penModalView: {
    width: "12%",
    height: "70%",
    backgroundColor: "silver",
    borderRadius: 20,
    paddingTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  colorModalView: {
    width: 287,
    height: 769,
    paddingLeft: 12,
    backgroundColor: "silver",
    borderRadius: 20,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  height: 100%;
  display: flex;
`;

const RightControlView = styled.View`
  width: 12%;
  background-color: white;
  padding-top: 25px;
  padding-bottom: 30px;

  display: flex;
  align-items: center;
`;

const ButtonsView = styled.View`
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const SaveFileButton = styled.Pressable``;
const SaveCameraRollButton = styled.Pressable``;

const PenPickerButton = styled.Pressable`
  position: relative;
`;
const ColorPickerButton = styled.Pressable``;

const SelectedMark = styled.Text`
  position: absolute;
  bottom: -8px;
  right: -8px;
`;

const UndoButton = styled.Pressable``;
const RedoButton = styled.Pressable``;

const DeleteButton = styled.Pressable``;

const PenModal = styled.Modal``;
const ColorModal = styled.Modal``;

const PenModalView = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const PenModalTextBox = styled.Pressable`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalCloseButton = styled(Pressable)`
  align-self: flex-end;
  position: absolute;
  border-radius: 20px;
  padding: 10px;
`;

const CurrentColorPreview = styled.Text`
  position: absolute;
  right: -8px;
  bottom: -8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 2px solid white;
`;

const DeletePictureModal = styled(Modal)``;
const ModalView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCautionView = styled.View`
  width: 250px;
  height: 50px;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const ModalCautionText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: red;
`;

const ModalButtonView = styled.View`
  display: flex;
  flex-direction: row;
`;

const ModalButton = styled.Pressable`
  border: 2px solid black;
  border-radius: 5px;
  width: 100px;
  height: 35px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: black;
`;
