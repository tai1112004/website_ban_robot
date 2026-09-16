"use client";
import { useRef, useState } from "react";
import { pairRobot as pair } from "@/services/robotService";
import { ApiError } from "@/lib/apiClient";
import type { PairRobotRequest } from "@/types/robot";
const messages: Record<string, string> = {
  DEVICE_ALREADY_PAIRED: "THIS ROBO IS ALREADY CONNECTED.",
  INVALID_DEVICE_INFORMATION:
    "INVALID DEVICE INFORMATION. Check both fields and try again.",
  INVALID_ACTIVATION_CODE:
    "The activation code is invalid. Check it and try again.",
  DEVICE_NOT_FOUND: "We couldn't find that Device ID.",
  FORBIDDEN: "You don't have permission to connect this Robo.",
  STORAGE_UNAVAILABLE:
    "Unable to save your Robo. Allow browser storage and try again.",
  INVALID_DATA:
    "Saved device data couldn't be read. Your existing data has not been changed.",
};
export default function usePairRobot() {
  const [isPairing, setPairing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  async function pairRobot(payload: PairRobotRequest) {
    if (busy.current) return null;
    busy.current = true;
    setPairing(true);
    setError(null);
    try {
      return await pair(payload);
    } catch (error) {
      setError(
        error instanceof ApiError
          ? (messages[error.code] ??
              "UNABLE TO CONNECT ROBO. Please try again.")
          : "UNABLE TO CONNECT ROBO. Please try again.",
      );
      return null;
    } finally {
      busy.current = false;
      setPairing(false);
    }
  }
  return { pairRobot, isPairing, error, reset: () => setError(null) };
}
