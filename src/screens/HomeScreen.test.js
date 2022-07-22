import "react-native";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

import HomeScreen from "../screens/HomeScreen";

let component;
let testingLib;

describe("Testing HomeScreen", () => {
  beforeEach(() => {
    component = <HomeScreen />;
    testingLib = render(component);
  });

  it("정상적으로 렌더링이 되어야 합니다.", async () => {
    const rendered = await waitFor(() => renderer.create(component).toJSON());
    expect(rendered).toMatchSnapshot();
  });
});
