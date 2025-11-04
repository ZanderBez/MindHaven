import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { recordWavStart, RecHandle as RecH } from "../services/recorder";
import { transcribeAudio } from "../services/googleStt";

type Opts = {
  onTranscript: (text: string) => Promise<void> | void;
  languageCode?: string;
  sampleRateHertz?: number;
};

export function useSTTRecorder({
  onTranscript,
  languageCode = "en-ZA",
  sampleRateHertz = 16000,
}: Opts) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recRef = useRef<RecH | null>(null);
  const [recSeconds, setRecSeconds] = useState(0);
  const recIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const GOOGLE_STT_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? "";

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  function startTimer() {
    setRecSeconds(0);
    if (recIntervalRef.current) clearInterval(recIntervalRef.current);
    recIntervalRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
  }

  function stopTimer() {
    if (recIntervalRef.current) {
      clearInterval(recIntervalRef.current);
      recIntervalRef.current = null;
    }
  }

  async function onMicDown() {
    if (transcribing || recording) return;
    setRecording(true);
    startTimer();
    recRef.current = await recordWavStart();
  }

  async function onMicUp() {
    if (!recRef.current) return;
    setRecording(false);
    stopTimer();
    setTranscribing(true);
    const handle = recRef.current;
    const uri = await handle.stopAndGetUri();
    recRef.current = null;
    if (!uri || !GOOGLE_STT_KEY) {
      setTranscribing(false);
      return;
    }
    try {
      const textOut = await transcribeAudio(uri, {
        apiKey: GOOGLE_STT_KEY,
        languageCode,
        encoding: handle.encoding,
        sampleRateHertz,
        timeoutMs: 20000,
      });
      const clean = textOut.trim();
      if (clean) await onTranscript(clean);
    } finally {
      setTranscribing(false);
    }
  }

  const mm = String(Math.floor(recSeconds / 60)).padStart(2, "0");
  const ss = String(recSeconds % 60).padStart(2, "0");
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const canUseMic = !!GOOGLE_STT_KEY;

  return { recording, transcribing, onMicDown, onMicUp, mm, ss, scale, opacity, canUseMic };
}
