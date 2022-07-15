import React, { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import NotebookScreen from "./src/screens/NotebookScreen";
import PainterScreen from "./src/screens/PainterScreen";
import ImageProcessingScreen from "./src/screens/ImageProcessingScreen";

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    try {
      setTimeout(() => {
        SplashScreen.hide();
      }, 5000);
    } catch (error) {
      console.warn("에러발생");
      console.warn(error);
    }
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "홈",
            headerStyle: {
              backgroundColor: "silver",
            },
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="Notebook"
          component={NotebookScreen}
          options={({ route }) => ({
            title: `${route.params.noteBookTitle} 노트북`,
            headerStyle: {
              backgroundColor: "silver",
            },
            headerTintColor: "black",
          })}
        />
        <Stack.Screen
          name="Painter"
          component={PainterScreen}
          options={{
            title: "그림판",
            headerStyle: {
              backgroundColor: "silver",
            },
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="LoadImage"
          component={ImageProcessingScreen}
          options={{
            title: "이미지 편집하기",
            headerStyle: {
              backgroundColor: "silver",
            },
            headerTintColor: "black",
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
