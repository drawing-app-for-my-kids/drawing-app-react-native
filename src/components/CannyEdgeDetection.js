import React from "react";
import { StyleSheet } from "react-native";
import { ColorConv, CvInvoke, CvImage } from "react-native-opencv3";

const CannyEdgeDetection = ({
  processedImageUri,
  lowThreshold,
  highThreshold,
}) => {
  console.log("canny canny!");

  return (
    <CvInvoke func="bitwise_not" params={{ p1: "dstMat", p2: "dstMat" }}>
      <CvInvoke
        func="Canny"
        params={{
          p1: "srcMat",
          p2: "dstMat",
          p3: lowThreshold,
          p4: highThreshold,
          p5: 3,
        }}>
        <CvInvoke
          func="cvtColor"
          params={{
            p1: "srcMat",
            p2: "dstMat",
            p3: ColorConv.COLOR_BGR2GRAY,
          }}>
          <CvImage style={styles.preview} source={{ uri: processedImageUri }} />
        </CvInvoke>
      </CvInvoke>
    </CvInvoke>
  );
};

export default CannyEdgeDetection;

const styles = StyleSheet.create({
  preview: {
    width: 580,
    height: 580,
    transform: [{ scale: 0.95 }],
  },
});
