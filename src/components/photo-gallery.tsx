import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as AC from '@bacons/apple-colors';
import { Link } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_SIZE = (screenWidth - 48) / 3; // 3 columns with padding

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestPermissionAndLoadPhotos();
  }, []);

  const requestPermissionAndLoadPhotos = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        await loadPhotos();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 50,
        sortBy: ['creationTime'],
      });
      setPhotos(assets);
    } catch (error) {
      Alert.alert('Error', 'Failed to load photos');
    }
  };

  const renderPhoto = ({ item }: { item: MediaLibrary.Asset }) => (
    <Pressable
      style={{
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        margin: 2,
        borderRadius: 8,
        borderCurve: 'continuous' as any,
        overflow: 'hidden',
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
      />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: AC.systemBackground as any,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: AC.label as any,
          fontSize: 16,
        }}>
          Loading photos...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: AC.systemBackground as any,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: AC.label as any,
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          Photo Access Required
        </Text>
        <Text style={{
          color: AC.secondaryLabel as any,
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 22,
        }}>
          This app needs access to your photos to display your gallery. You can grant permission in your device settings.
        </Text>
        <Pressable
          style={{
            backgroundColor: AC.systemBlue as any,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            borderCurve: 'continuous' as any,
          }}
          onPress={requestPermissionAndLoadPhotos}
        >
          <Text style={{
            color: 'white',
            fontWeight: '600',
          }}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: AC.systemBackground as any,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ padding: 16 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: AC.label as any,
          }}>
            Photo Gallery
          </Text>
          <Link href="/editor" asChild>
            <Pressable
              style={{
                backgroundColor: AC.systemBlue as any,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                borderCurve: 'continuous' as any,
              }}
            >
              <Text style={{
                color: 'white',
                fontWeight: '600',
              }}>
                Edit Photos
              </Text>
            </Pressable>
          </Link>
        </View>

        {photos.length === 0 ? (
          <View style={{
            alignItems: 'center',
            marginTop: 60,
          }}>
            <Text style={{
              fontSize: 48,
              marginBottom: 12,
            }}>
              📷
            </Text>
            <Text style={{
              color: AC.secondaryLabel as any,
              fontSize: 16,
              textAlign: 'center',
            }}>
              No photos found
            </Text>
          </View>
        ) : (
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={{
              alignItems: 'center',
            }}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}