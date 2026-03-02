import { ThemeProvider } from "@/components/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <TabsLayout />
    </ThemeProvider>
  );
}

function TabsLayout() {
  if (process.env.EXPO_OS === "web") {
    return <WebTabsLayout />;
  }
  return <NativeTabsLayout />;
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : { tabBarPosition: "bottom" }),
      }}
    >
      <WebTabs.Screen
        name="index"
        options={{
          title: "Gallery",
          tabBarIcon: (props) => <MaterialIcons {...props} name="photo-library" />,
        }}
      />
      <WebTabs.Screen
        name="editor"
        options={{
          title: "Editor",
          tabBarIcon: (props) => <MaterialIcons {...props} name="tune" />,
        }}
      />
      <WebTabs.Screen
        name="info"
        options={{
          title: "Info",
          tabBarIcon: (props) => <MaterialIcons {...props} name="info" />,
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Gallery</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "photo.on.rectangle", selected: "photo.fill.on.rectangle.fill" } },
            default: { src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="photo-library" /> },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="editor">
        <NativeTabs.Trigger.Label>Editor</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "slider.horizontal.3", selected: "slider.horizontal.3" } },
            default: { src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="tune" /> },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="info">
        <NativeTabs.Trigger.Label>Info</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "info.circle", selected: "info.circle.fill" } },
            default: { src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="info" /> },
          })}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
