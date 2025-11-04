import { Audio } from "expo-av";
import { Platform } from "react-native";

export type RecHandle = {
  stopAndGetUri: () => Promise<string | null>;
  encoding: "LINEAR16" | "AMR_WB";
};

export async function recordWavStart(): Promise<RecHandle> {
  const perm = await Audio.requestPermissionsAsync();
  if (!perm.granted) throw new Error("mic denied");

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    staysActiveInBackground: false,
  });

  const rec = new Audio.Recording();

  const options: Audio.RecordingOptions = {
    ios: {
      extension: ".wav",
      outputFormat: Audio.IOSOutputFormat.LINEARPCM,
      audioQuality: Audio.IOSAudioQuality.MAX,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 256000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    android: {
      extension: ".3gp",
      outputFormat: Audio.AndroidOutputFormat.AMR_WB,
      audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 16000,
    },
    web: {
      mimeType: "audio/webm;codecs=opus",
      bitsPerSecond: 128000,
    },
  };

  await rec.prepareToRecordAsync(options);
  await rec.startAsync();

  const encoding: "LINEAR16" | "AMR_WB" =
    Platform.OS === "ios" ? "LINEAR16" : "AMR_WB";

  return {
    stopAndGetUri: async () => {
      try {
        await rec.stopAndUnloadAsync();
        return rec.getURI() ?? null;
      } catch {
        return null;
      }
    },
    encoding,
  };
}
