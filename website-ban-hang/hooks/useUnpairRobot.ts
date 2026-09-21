"use client";
import { useRef, useState } from "react";
import { unpairRobot } from "@/services/robotService";
export default function useUnpairRobot() {
  const [isUnpairing, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  async function unpair(id: string) {
    if (busy.current) return false;
    busy.current = true;
    setBusy(true);
    setError(null);
    try {
      await unpairRobot(id);
      return true;
    } catch {
      setError(
        "Unable to unpair this Robo. Your devices have not been removed. Please try again.",
      );
      return false;
    } finally {
      busy.current = false;
      setBusy(false);
    }
  }
  return { unpair, isUnpairing, error, reset: () => setError(null) };
}
