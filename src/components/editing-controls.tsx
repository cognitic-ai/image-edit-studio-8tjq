import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as AC from '@bacons/apple-colors';
import Slider from './slider';

interface EditingControlsProps {
  settings: {
    brightness: number;
    contrast: number;
    saturation: number;
    rotation: number;
  };
  onSettingsChange: (settings: any) => void;
  onApplyEdits: () => void;
  onResetEdits: () => void;
  isProcessing: boolean;
}

export default function EditingControls({
  settings,
  onSettingsChange,
  onApplyEdits,
  onResetEdits,
  isProcessing,
}: EditingControlsProps) {

  const updateSetting = (key: string, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const rotateImage = (degrees: number) => {
    const newRotation = (settings.rotation + degrees) % 360;
    updateSetting('rotation', newRotation);
  };

  return (
    <View style={{
      backgroundColor: AC.secondarySystemBackground as any,
      borderRadius: 16,
      borderCurve: 'continuous' as any,
      padding: 20,
      marginVertical: 20,
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: '600',
        color: AC.label as any,
        marginBottom: 20,
        textAlign: 'center',
      }}>
        Editing Tools
      </Text>

      {/* Brightness Control */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: AC.label as any,
          marginBottom: 8,
        }}>
          Brightness: {settings.brightness.toFixed(1)}
        </Text>
        <Slider
          value={settings.brightness}
          minimumValue={-1}
          maximumValue={1}
          step={0.1}
          onValueChange={(value) => updateSetting('brightness', value)}
        />
      </View>

      {/* Contrast Control */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: AC.label as any,
          marginBottom: 8,
        }}>
          Contrast: {settings.contrast.toFixed(1)}
        </Text>
        <Slider
          value={settings.contrast}
          minimumValue={-1}
          maximumValue={1}
          step={0.1}
          onValueChange={(value) => updateSetting('contrast', value)}
        />
      </View>

      {/* Saturation Control */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: AC.label as any,
          marginBottom: 8,
        }}>
          Saturation: {settings.saturation.toFixed(1)}
        </Text>
        <Slider
          value={settings.saturation}
          minimumValue={-1}
          maximumValue={1}
          step={0.1}
          onValueChange={(value) => updateSetting('saturation', value)}
        />
      </View>

      {/* Rotation Controls */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: AC.label as any,
          marginBottom: 12,
        }}>
          Rotation: {settings.rotation}°
        </Text>
        <View style={{
          flexDirection: 'row',
          gap: 12,
          justifyContent: 'center',
        }}>
          <Pressable
            style={{
              backgroundColor: AC.systemBlue as any,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderCurve: 'continuous' as any,
            }}
            onPress={() => rotateImage(-90)}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>↺ 90°</Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: AC.systemBlue as any,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderCurve: 'continuous' as any,
            }}
            onPress={() => rotateImage(90)}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>↻ 90°</Text>
          </Pressable>
        </View>
      </View>

      {/* Apply Edits Button */}
      <Pressable
        style={{
          backgroundColor: isProcessing ? AC.systemGray3 as any : AC.systemOrange as any,
          paddingVertical: 14,
          borderRadius: 12,
          borderCurve: 'continuous' as any,
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={onApplyEdits}
        disabled={isProcessing}
      >
        <Text style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 16,
        }}>
          {isProcessing ? 'Processing...' : 'Apply Edits'}
        </Text>
      </Pressable>
    </View>
  );
}