import PhotoGallery from "@/components/photo-gallery";
import { Stack } from "expo-router/stack";

export default function IndexRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Gallery",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: { backgroundColor: "transparent" },
        }}
      />
      <PhotoGallery />
    </>
  );
}
