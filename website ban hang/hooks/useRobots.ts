"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRobots, subscribeRobots } from "@/services/robotService";
import type { RobotDevice } from "@/types/robot";
export default function useRobots() {
  const [robots, setRobots] = useState<RobotDevice[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++sequence.current;
    setLoading(true);
    try {
      const data = await getRobots();
      if (request === sequence.current) {
        setRobots(data);
        setError(false);
      }
    } catch {
      if (request === sequence.current) setError(true);
    } finally {
      if (request === sequence.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const unsubscribe = subscribeRobots(refresh);
    return () => {
      ++sequence.current;
      unsubscribe();
    };
  }, [refresh]);
  return { robots, isLoading, error, refresh };
}
