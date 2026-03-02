import React from "react";
import { View, Text, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import * as AC from "@bacons/apple-colors";

interface Settings {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
}

interface EditingControlsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onApplyEdits: () => void;
  isProcessing: boolean;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontSize: 13,
        color: AC.secondaryLabel as any,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 6,
      }}
    >
      {title}
    </Text>
  );
}

function SliderRow({
  icon,
  label,
  value,
  min,
  max,
  onChange,
}: {
  icon: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 12 }}>
      <Image
        source={`sf:${icon}`}
        style={{ width: 22, height: 22, tintColor: AC.systemBlue as any } as any}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ color: AC.label as any, fontSize: 15 }}>{label}</Text>
          <Text style={{ color: AC.secondaryLabel as any, fontSize: 13, fontVariant: ["tabular-nums"] as any }}>
            {value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)}
          </Text>
        </View>
        <Slider
          value={value}
          minimumValue={min}
          maximumValue={max}
          step={0.05}
          onValueChange={onChange}
          minimumTrackTintColor={AC.systemBlue as any}
          maximumTrackTintColor={AC.systemGray4 as any}
          thumbTintColor={process.env.EXPO_OS === "android" ? (AC.systemBlue as any) : undefined}
          style={{ height: 28 }}
        />
      </View>
    </View>
  );
}

export default function EditingControls({
  settings,
  onSettingsChange,
}: EditingControlsProps) {
  const update = (key: keyof Settings) => (value: number) =>
    onSettingsChange({ ...settings, [key]: value });

  const rotate = (deg: number) =>
    onSettingsChange({ ...settings, rotation: (settings.rotation + deg + 360) % 360 });

  return (
    <View style={{ marginTop: 8 }}>
      <SectionHeader title="Adjustments" />
      <View
        style={{
          backgroundColor: AC.secondarySystemGroupedBackground as any,
          borderRadius: 12,
          borderCurve: "continuous" as any,
          marginHorizontal: 16,
          overflow: "hidden",
        }}
      >
        <SliderRow icon="sun.max" label="Brightness" value={settings.brightness} min={-1} max={1} onChange={update("brightness")} />
        <View style={{ height: 0.5, backgroundColor: AC.separator as any, marginLeft: 50 }} />
        <SliderRow icon="circle.lefthalf.filled" label="Contrast" value={settings.contrast} min={-1} max={1} onChange={update("contrast")} />
        <View style={{ height: 0.5, backgroundColor: AC.separator as any, marginLeft: 50 }} />
        <SliderRow icon="drop" label="Saturation" value={settings.saturation} min={-1} max={1} onChange={update("saturation")} />
      </View>

      <SectionHeader title="Rotate" />
      <View
        style={{
          backgroundColor: AC.secondarySystemGroupedBackground as any,
          borderRadius: 12,
          borderCurve: "continuous" as any,
          marginHorizontal: 16,
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <Pressable
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 14,
            opacity: pressed ? 0.6 : 1,
          })}
          onPress={() => rotate(-90)}
        >
          <Image source="sf:rotate.left" style={{ width: 20, height: 20, tintColor: AC.systemBlue as any } as any} />
          <Text style={{ color: AC.systemBlue as any, fontSize: 15, fontWeight: "500" }}>Rotate Left</Text>
        </Pressable>
        <View style={{ width: 0.5, backgroundColor: AC.separator as any }} />
        <Pressable
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 14,
            opacity: pressed ? 0.6 : 1,
          })}
          onPress={() => rotate(90)}
        >
          <Image source="sf:rotate.right" style={{ width: 20, height: 20, tintColor: AC.systemBlue as any } as any} />
          <Text style={{ color: AC.systemBlue as any, fontSize: 15, fontWeight: "500" }}>Rotate Right</Text>
        </Pressable>
      </View>

      {settings.rotation !== 0 && (
        <Text style={{ color: AC.secondaryLabel as any, fontSize: 12, textAlign: "center", marginTop: 6 }}>
          {settings.rotation}° rotation will be applied
        </Text>
      )}
    </View>
  );
}
