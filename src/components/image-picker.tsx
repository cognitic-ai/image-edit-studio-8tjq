import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as AC from "@bacons/apple-colors";

interface ImagePickerComponentProps {
  onImageSelected?: (uri: string) => void;
  compact?: boolean;
}

export default function ImagePickerComponent({
  onImageSelected,
  compact = false,
}: ImagePickerComponentProps) {
  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Required", "Enable photo library access to select images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) onImageSelected?.(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Required", "Enable camera access to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) onImageSelected?.(result.assets[0].uri);
  };

  const showOptions = () => {
    Alert.alert("Choose Photo", undefined, [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (compact) {
    return (
      <View
        style={{
          backgroundColor: AC.secondarySystemGroupedBackground as any,
          borderRadius: 12,
          borderCurve: "continuous" as any,
          overflow: "hidden",
        }}
      >
        <Pressable
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 13,
            paddingHorizontal: 16,
            gap: 12,
            opacity: pressed ? 0.6 : 1,
          })}
          onPress={takePhoto}
        >
          <Image
            source="sf:camera"
            style={{ width: 22, height: 22, tintColor: AC.systemBlue as any } as any}
          />
          <Text style={{ flex: 1, color: AC.label as any, fontSize: 16 }}>Take Photo</Text>
          <Image
            source="sf:chevron.right"
            style={{ width: 12, height: 16, tintColor: AC.systemGray3 as any } as any}
          />
        </Pressable>
        <View style={{ height: 0.5, backgroundColor: AC.separator as any, marginLeft: 50 }} />
        <Pressable
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 13,
            paddingHorizontal: 16,
            gap: 12,
            opacity: pressed ? 0.6 : 1,
          })}
          onPress={pickImage}
        >
          <Image
            source="sf:photo.on.rectangle"
            style={{ width: 22, height: 22, tintColor: AC.systemBlue as any } as any}
          />
          <Text style={{ flex: 1, color: AC.label as any, fontSize: 16 }}>Choose from Library</Text>
          <Image
            source="sf:chevron.right"
            style={{ width: 12, height: 16, tintColor: AC.systemGray3 as any } as any}
          />
        </Pressable>
      </View>
    );
  }

  // Empty state — full placeholder
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: AC.secondarySystemGroupedBackground as any,
        borderRadius: 16,
        borderCurve: "continuous" as any,
        paddingVertical: 52,
        alignItems: "center",
        gap: 12,
        opacity: pressed ? 0.7 : 1,
      })}
      onPress={showOptions}
    >
      <Image
        source="sf:photo.badge.plus"
        style={{ width: 52, height: 52, tintColor: AC.systemBlue as any } as any}
      />
      <Text style={{ color: AC.label as any, fontSize: 17, fontWeight: "600" }}>
        Select a Photo
      </Text>
      <Text style={{ color: AC.secondaryLabel as any, fontSize: 14 }}>
        Tap to choose from your library or camera
      </Text>
    </Pressable>
  );
}
