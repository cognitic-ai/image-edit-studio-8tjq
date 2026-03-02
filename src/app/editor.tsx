import ImageEditor from "@/components/image-editor";
import { Stack } from "expo-router/stack";

export default function EditorRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Editor",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: { backgroundColor: "transparent" },
        }}
      />
      <ImageEditor />
    </>
  );
}
