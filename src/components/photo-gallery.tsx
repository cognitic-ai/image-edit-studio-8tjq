import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import * as AC from "@bacons/apple-colors";

const NUM_COLUMNS = 3;
const GAP = 2;

export default function PhotoGallery() {
  const { width } = useWindowDimensions();
  const itemSize = (width - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestPermissionAndLoadPhotos();
  }, []);

  const requestPermissionAndLoadPhotos = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (status === "granted") await loadPhotos();
    } catch {
      Alert.alert("Error", "Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 60,
        sortBy: ["creationTime"],
      });
      setPhotos(assets);
    } catch {
      Alert.alert("Error", "Failed to load photos");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: AC.systemBackground as any, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: AC.secondaryLabel as any, fontSize: 15 }}>Loading…</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, backgroundColor: AC.systemGroupedBackground as any, padding: 32, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Image source="sf:photo.badge.exclamationmark" style={{ width: 56, height: 56, tintColor: AC.systemGray as any } as any} />
        <Text style={{ color: AC.label as any, fontSize: 17, fontWeight: "600", textAlign: "center" }}>
          No Photo Access
        </Text>
        <Text style={{ color: AC.secondaryLabel as any, fontSize: 15, textAlign: "center", lineHeight: 20 }}>
          Allow access to your photos to browse your library.
        </Text>
        <Pressable
          style={{ marginTop: 8, backgroundColor: AC.systemBlue as any, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderCurve: "continuous" as any }}
          onPress={requestPermissionAndLoadPhotos}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>Allow Access</Text>
        </Pressable>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: AC.systemBackground as any, justifyContent: "center", alignItems: "center", gap: 8 }}>
        <Image source="sf:photo.on.rectangle" style={{ width: 56, height: 56, tintColor: AC.systemGray as any } as any} />
        <Text style={{ color: AC.secondaryLabel as any, fontSize: 15 }}>No photos found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => ({
            width: itemSize,
            height: itemSize,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </Pressable>
      )}
      ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
      columnWrapperStyle={{ gap: GAP }}
      showsVerticalScrollIndicator={false}
    />
  );
}
