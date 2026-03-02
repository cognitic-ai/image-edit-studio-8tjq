import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import * as AC from "@bacons/apple-colors";
import ImagePickerComponent from "./image-picker";
import EditingControls from "./editing-controls";

export default function ImageEditor() {
  const { width } = useWindowDimensions();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editSettings, setEditSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
  });

  const handleImageSelected = (uri: string) => {
    setOriginalImage(uri);
    setEditedImage(uri);
    setEditSettings({ brightness: 0, contrast: 0, saturation: 0, rotation: 0 });
  };

  const applyEdits = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    try {
      const actions: ImageManipulator.Action[] = [];
      if (editSettings.rotation !== 0) {
        actions.push({ rotate: editSettings.rotation });
      }
      if (actions.length > 0) {
        const result = await ImageManipulator.manipulateAsync(
          originalImage,
          actions,
          { compress: 0.92, format: ImageManipulator.SaveFormat.JPEG }
        );
        setEditedImage(result.uri);
      }
    } catch {
      Alert.alert("Error", "Failed to apply edits");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetEdits = () => {
    setEditSettings({ brightness: 0, contrast: 0, saturation: 0, rotation: 0 });
    setEditedImage(originalImage);
  };

  const saveImage = async () => {
    if (!editedImage) return;
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Allow access to save photos.");
        return;
      }
      const asset = await MediaLibrary.createAssetAsync(editedImage);
      await MediaLibrary.createAlbumAsync("Edited Photos", asset, false);
      Alert.alert("Saved", "Image saved to your library.");
    } catch {
      Alert.alert("Error", "Failed to save image");
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: AC.systemGroupedBackground as any }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Image preview */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {editedImage ? (
          <View
            style={{
              borderRadius: 16,
              borderCurve: "continuous" as any,
              overflow: "hidden",
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          >
            <Image
              source={{ uri: editedImage }}
              style={{ width: "100%", height: width - 32 }}
              contentFit="cover"
            />
          </View>
        ) : (
          <ImagePickerComponent onImageSelected={handleImageSelected} />
        )}
      </View>

      {/* Change / pick photo row */}
      {editedImage && (
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <ImagePickerComponent
            onImageSelected={handleImageSelected}
            compact
          />
        </View>
      )}

      {/* Editing controls */}
      {originalImage && (
        <EditingControls
          settings={editSettings}
          onSettingsChange={setEditSettings}
          onApplyEdits={applyEdits}
          isProcessing={isProcessing}
        />
      )}

      {/* Action buttons */}
      {originalImage && (
        <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 8 }}>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: AC.systemBlue as any,
              paddingVertical: 15,
              borderRadius: 14,
              borderCurve: "continuous" as any,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
            onPress={applyEdits}
            disabled={isProcessing}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
              {isProcessing ? "Applying…" : "Apply Edits"}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: AC.systemGreen as any,
              paddingVertical: 15,
              borderRadius: 14,
              borderCurve: "continuous" as any,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
            onPress={saveImage}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
              Save to Photos
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              paddingVertical: 15,
              borderRadius: 14,
              borderCurve: "continuous" as any,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
            onPress={resetEdits}
          >
            <Text style={{ color: AC.systemRed as any, fontWeight: "600", fontSize: 17 }}>
              Reset
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
