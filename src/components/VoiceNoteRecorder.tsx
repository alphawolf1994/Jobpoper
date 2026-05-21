import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../utils";

const MAX_DURATION_MS = 60000; // 1 minute

interface Props {
  existingVoiceNoteUrl?: string | null;
  onVoiceNoteChange: (uri: string | null) => void;
  onRemoveExisting?: () => void;
}

type RecorderState = "idle" | "recording" | "preview";

const VoiceNoteRecorder: React.FC<Props> = ({
  existingVoiceNoteUrl,
  onVoiceNoteChange,
  onRemoveExisting,
}) => {
  const [state, setState] = useState<RecorderState>("idle");
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds elapsed while recording
  const [playbackMillis, setPlaybackMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Start pulsing animation when recording
  useEffect(() => {
    if (state === "recording") {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const startTimer = () => {
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= 60) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setState("recording");
      startTimer();
    } catch (err) {
      console.warn("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    stopTimer();
    try {
      const recording = recordingRef.current;
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      recordingRef.current = null;
      if (uri) {
        setRecordedUri(uri);
        onVoiceNoteChange(uri);
        // Load duration
        const { sound, status } = await Audio.Sound.createAsync({ uri });
        soundRef.current = sound;
        if (status.isLoaded) {
          setDurationMillis(status.durationMillis ?? 0);
        }
        setState("preview");
      } else {
        setState("idle");
      }
    } catch (err) {
      console.warn("Failed to stop recording:", err);
      setState("idle");
    }
  };

  const togglePlayback = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPlaybackMillis(status.positionMillis ?? 0);
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPlaybackMillis(0);
          sound.setPositionAsync(0);
        }
      });
    }
  };

  const handleDiscard = async () => {
    stopTimer();
    await soundRef.current?.unloadAsync().catch(() => {});
    soundRef.current = null;
    await recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    recordingRef.current = null;
    setRecordedUri(null);
    setIsPlaying(false);
    setPlaybackMillis(0);
    setDurationMillis(0);
    setElapsed(0);
    onVoiceNoteChange(null);
    setState("idle");
  };

  const formatSeconds = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatMillis = (ms: number) => formatSeconds(Math.floor(ms / 1000));

  const progressPercent =
    durationMillis > 0 ? (playbackMillis / durationMillis) * 100 : 0;

  // Show existing voice note from backend (edit mode)
  if (existingVoiceNoteUrl && state === "idle" && !recordedUri) {
    return (
      <ExistingVoiceNote
        onReRecord={() => {
          onRemoveExisting?.();
        }}
        onRemove={() => {
          onRemoveExisting?.();
          onVoiceNoteChange(null);
        }}
        url={existingVoiceNoteUrl}
      />
    );
  }

  return (
    <View style={styles.container}>
      {state === "idle" && (
        <TouchableOpacity style={styles.recordBtn} onPress={startRecording} activeOpacity={0.8}>
          <Ionicons name="mic-outline" size={20} color={Colors.white} />
          <Text style={styles.recordBtnText}>Record Voice Note</Text>
        </TouchableOpacity>
      )}

      {state === "recording" && (
        <View style={styles.recordingRow}>
          <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.elapsedText}>{formatSeconds(elapsed)} / 01:00</Text>
          <TouchableOpacity style={styles.stopBtn} onPress={stopRecording} activeOpacity={0.8}>
            <Ionicons name="stop" size={18} color={Colors.white} />
            <Text style={styles.stopBtnText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === "preview" && (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Ionicons name="mic" size={18} color={Colors.primary} />
            <Text style={styles.previewTitle}>Voice Note</Text>
            <Text style={styles.previewDuration}>{formatMillis(durationMillis)}</Text>
          </View>
          <View style={styles.progressRow}>
            <TouchableOpacity onPress={togglePlayback} activeOpacity={0.8} style={styles.playBtn}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.positionText}>{formatMillis(playbackMillis)}</Text>
          </View>
          <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={15} color={"#e74c3c"} />
            <Text style={styles.discardText}>Remove & Re-record</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Sub-component to show an existing saved voice note in edit mode
const ExistingVoiceNote: React.FC<{
  url: string;
  onReRecord: () => void;
  onRemove: () => void;
}> = ({ url, onReRecord, onRemove }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMillis, setPlaybackMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    Audio.Sound.createAsync({ uri: url }).then(({ sound, status }) => {
      if (!mounted) return;
      soundRef.current = sound;
      if (status.isLoaded) setDurationMillis(status.durationMillis ?? 0);
      setLoaded(true);
    }).catch(() => setLoaded(true));
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [url]);

  const togglePlayback = async () => {
    const sound = soundRef.current;
    if (!sound || !loaded) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPlaybackMillis(status.positionMillis ?? 0);
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPlaybackMillis(0);
          sound.setPositionAsync(0);
        }
      });
    }
  };

  const formatMillis = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const progressPercent = durationMillis > 0 ? (playbackMillis / durationMillis) * 100 : 0;

  return (
    <View style={styles.previewCard}>
      <View style={styles.previewHeader}>
        <Ionicons name="mic" size={18} color={Colors.primary} />
        <Text style={styles.previewTitle}>Voice Note (Saved)</Text>
        <Text style={styles.previewDuration}>{formatMillis(durationMillis)}</Text>
      </View>
      <View style={styles.progressRow}>
        <TouchableOpacity onPress={togglePlayback} activeOpacity={0.8} style={styles.playBtn}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.positionText}>{formatMillis(playbackMillis)}</Text>
      </View>
      <View style={styles.existingActions}>
        <TouchableOpacity style={styles.reRecordBtn} onPress={onReRecord} activeOpacity={0.7}>
          <Ionicons name="mic-outline" size={15} color={Colors.primary} />
          <Text style={styles.reRecordText}>Re-record</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.discardBtn} onPress={onRemove} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={15} color={"#e74c3c"} />
          <Text style={styles.discardText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  recordBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  recordingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#fcc",
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e74c3c",
  },
  elapsedText: {
    flex: 1,
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "600",
  },
  stopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  stopBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  previewCard: {
    backgroundColor: "#f5f8ff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary + "40",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  previewTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.black,
  },
  previewDuration: {
    fontSize: 12,
    color: Colors.gray,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#dde3f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  positionText: {
    fontSize: 11,
    color: Colors.gray,
    minWidth: 36,
    textAlign: "right",
  },
  discardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  discardText: {
    fontSize: 12,
    color: "#e74c3c",
  },
  existingActions: {
    flexDirection: "row",
    gap: 16,
  },
  reRecordBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reRecordText: {
    fontSize: 12,
    color: Colors.primary,
  },
});

export default VoiceNoteRecorder;
