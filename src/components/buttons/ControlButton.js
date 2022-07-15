import React from "react";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

const ControlButton = ({ text, onPress }) => (
  <Button style={styles.button} onPress={onPress}>
    <ButtonText>{text}</ButtonText>
  </Button>
);

export default ControlButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

const Button = styled.Pressable`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid black;
  width: 120px;
  height: 55px;
  margin-bottom: 25px;
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  font-size: 23px;
`;
