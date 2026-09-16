"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRobot, subscribeRobots } from "@/services/robotService";
import type { RobotDevice } from "@/types/robot";
export default function useRobot(id: string) {
  const [robot, setRobot] = useState<RobotDevice | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++sequence.current;
    setLoading(true);
    try {
      const data = await getRobot(id);
      if (request === sequence.current) {
        setRobot(data);
        setError(false);
      }
    } catch {
      if (request === sequence.current) setError(true);
    } finally {
      if (request === sequence.current) setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    void refresh();
    const unsubscribe = subscribeRobots(refresh);
    return () => {
      ++sequence.current;
      unsubscribe();
    };
  }, [refresh]);
  return { robot, isLoading, error, refresh };
}
