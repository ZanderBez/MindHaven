import { Audio } from "expo-av";

export async function startRecording() {
  const perm = await Audio.requestPermissionsAsync();
  if (!perm.granted) throw new Error("Microphone permission not granted");
  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  const rec = new Audio.Recording();
  await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await rec.startAsync();
  return rec;
}

export async function stopRecordingGetUri(rec: Audio.Recording) {
  try {
    await rec.stopAndUnloadAsync();
    const uri = rec.getURI() || "";
    return uri;
  } catch {
    return "";
  }
}

export async function transcribeWhisper(uri: string, apiKey: string) {
  const file = { uri, name: "audio.m4a", type: "audio/m4a" } as any;
  const body = new FormData();
  body.append("file", file);
  body.append("model", "whisper-1");
  body.append("response_format", "json");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Transcribe failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return String(json.text || "");
}
