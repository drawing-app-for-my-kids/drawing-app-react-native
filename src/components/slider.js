import React from "react";
import Slider from "@react-native-community/slider";

export const ImageSlider = (
  initialValue,
  step,
  minimumValue,
  maximumValue,
  onValueChangeHandler,
) => (
  <Slider
    style={{ width: 135, height: 40 }}
    step={step}
    minimumValue={minimumValue}
    maximumValue={maximumValue}
    minimumTrackTintColor="#FFFFFF"
    maximumTrackTintColor="#000000"
    onValueChange={onValueChangeHandler}
    value={initialValue}
  />
);
