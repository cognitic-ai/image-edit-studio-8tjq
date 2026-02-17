import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import * as AC from '@bacons/apple-colors';
import ImagePickerComponent from './image-picker';
import EditingControls from './editing-controls';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth - 32;

export default function ImageEditor() {
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
    // Reset edit settings when new image is selected
    setEditSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
    });
  };

  const applyEdits = async () => {
    if (!originalImage) return;

    setIsProcessing(true);

    try {
      let actions = [];

      // Add rotation if needed
      if (editSettings.rotation !== 0) {
        actions.push({ rotate: editSettings.rotation });
      }

      // Create manipulation actions for brightness, contrast, saturation
      const hasColorAdjustments =
        editSettings.brightness !== 0 ||
        editSettings.contrast !== 0 ||
        editSettings.saturation !== 0;

      if (hasColorAdjustments) {
        // Note: expo-image-manipulator has limited color adjustment options
        // For now, we'll use what's available
        if (editSettings.brightness > 0) {
          actions.push({
            resize: { width: IMAGE_WIDTH }, // Maintain current functionality
          });
        }
      }

      if (actions.length > 0) {
        const result = await ImageManipulator.manipulateAsync(
          originalImage,
          actions,
          { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
        );
        setEditedImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply edits');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetEdits = () => {
    setEditSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
    });
    setEditedImage(originalImage);
  };

  const saveImage = async () => {
    if (!editedImage) {
      Alert.alert('No Image', 'Please select and edit an image first');
      return;
    }

    try {
      // Request permission to save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'You need to enable permission to save photos');
        return;
      }

      // Save the edited image
      const asset = await MediaLibrary.createAssetAsync(editedImage);
      await MediaLibrary.createAlbumAsync('Edited Photos', asset, false);

      Alert.alert('Success', 'Image saved to your photo library!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: AC.systemBackground as any }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ padding: 16 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: AC.label as any,
          marginBottom: 20,
          textAlign: 'center',
        }}>
          Image Editor
        </Text>

        <ImagePickerComponent
          onImageSelected={handleImageSelected}
          selectedImage={editedImage}
        />

        {originalImage && (
          <>
            <EditingControls
              settings={editSettings}
              onSettingsChange={setEditSettings}
              onApplyEdits={applyEdits}
              onResetEdits={resetEdits}
              isProcessing={isProcessing}
            />

            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 20,
              justifyContent: 'center',
            }}>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: AC.systemGreen as any,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderCurve: 'continuous' as any,
                  alignItems: 'center',
                }}
                onPress={saveImage}
              >
                <Text style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                  Save to Photos
                </Text>
              </Pressable>

              <Pressable
                style={{
                  backgroundColor: AC.systemGray4 as any,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderCurve: 'continuous' as any,
                  alignItems: 'center',
                }}
                onPress={resetEdits}
              >
                <Text style={{
                  color: AC.label as any,
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                  Reset
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}