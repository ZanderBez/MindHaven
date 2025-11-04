import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

type SttOpts = {
  apiKey: string;
  languageCode?: string;
  encoding?: "LINEAR16" | "AMR_WB";
  sampleRateHertz?: number;
  timeoutMs?: number;
};

export async function transcribeAudio(uri: string, opts: SttOpts): Promise<string> {
  const {
    apiKey,
    languageCode = "en-ZA",
    encoding = Platform.OS === "ios" ? "LINEAR16" : "AMR_WB",
    sampleRateHertz = 16000,
    timeoutMs = 20000,
  } = opts;

  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" as any });

  const body = {
    config: {
      encoding,
      languageCode,
      sampleRateHertz,
      audioChannelCount: 1,
      enableAutomaticPunctuation: true,
    },
    audio: { content: b64 },
  };

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);

  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    }
  ).catch((e) => {
    throw new Error(`Network/timeout: ${e?.message || e}`);
  });
  clearTimeout(to);

  const json = await res.json().catch(() => ({}));

  if (!res.ok || (json as any)?.error) {
    console.log("STT error payload:", json);
    const msg = (json as any)?.error?.message || `HTTP ${res.status}`;
    throw new Error(`Google STT failed: ${msg}`);
  }

  const text =
    (json as any)?.results?.[0]?.alternatives?.[0]?.transcript?.trim?.() || "";
  return text;
}
