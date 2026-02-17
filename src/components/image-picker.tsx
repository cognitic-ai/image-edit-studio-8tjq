import React, { useState } from 'react';
import { Alert, Pressable, Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as AC from '@bacons/apple-colors';

interface ImagePickerComponentProps {
  onImageSelected?: (uri: string) => void;
  selectedImage?: string;
}

export default function ImagePickerComponent({
  onImageSelected,
  selectedImage
}: ImagePickerComponentProps) {
  const [image, setImage] = useState<string | null>(selectedImage || null);

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to enable permission to access photos.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      onImageSelected?.(imageUri);
    }
  };

  const takePhoto = async () => {
    // Request camera permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to enable camera access to take photos.");
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      onImageSelected?.(imageUri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose how you'd like to select an image",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Photo Library",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="cover"
          />
          <Pressable
            style={styles.changeButton}
            onPress={showImageOptions}
          >
            <Text style={styles.changeButtonText}>Change Photo</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.placeholderContainer}
          onPress={showImageOptions}
        >
          <Text style={styles.placeholderText}>📷</Text>
          <Text style={styles.placeholderSubtext}>Tap to select a photo</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    borderCurve: 'continuous' as any,
  },
  changeButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: AC.systemBlue as any,
    borderRadius: 8,
    borderCurve: 'continuous' as any,
  },
  changeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  placeholderContainer: {
    width: 300,
    height: 300,
    borderRadius: 12,
    borderCurve: 'continuous' as any,
    borderWidth: 2,
    borderColor: AC.systemGray3 as any,
    borderStyle: 'dashed',
    backgroundColor: AC.systemGray6 as any,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: AC.secondaryLabel as any,
    fontSize: 16,
  },
});