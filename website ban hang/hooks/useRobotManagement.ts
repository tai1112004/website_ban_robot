"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as configService from "@/services/robotConfigService";
import {
  getKnowledgePacks,
  installKnowledgePack,
  removeKnowledgePack,
} from "@/services/knowledgeService";
import { getPersonalityProfiles } from "@/services/managementCatalog";
import { executeAction } from "@/services/actionService";
import { updateRobot, unpairRobot } from "@/services/robotService";
import { ApiError } from "@/lib/apiClient";
import type {
  RobotConfig,
  SettingKey,
  KnowledgePack,
  PersonalityProfile,
  RobotAction,
} from "@/types/robotConfig";
const updaters: {
  [K in SettingKey]: (
    id: string,
    payload: RobotConfig[K],
  ) => Promise<RobotConfig[K]>;
} = {
  personality: configService.updatePersonality,
  memory: configService.updateMemorySettings,
  voice: configService.updateVoiceSettings,
  display: configService.updateDisplaySettings,
};
const success = {
  personality: "PERSONALITY UPDATED",
  memory: "MEMORY SETTINGS SAVED",
  voice: "VOICE SETTINGS UPDATED",
  display: "EXPRESSION APPLIED",
};
function errorMessage(error: unknown) {
  const messages: Record<string, string> = {
    ROBOT_NOT_FOUND: "This Robo is no longer connected. Return to My Robots.",
    DEVICE_NOT_FOUND: "This Robo is no longer connected.",
    ROBOT_OFFLINE:
      "Robo is not online. Actions are unavailable until it reconnects.",
    FORBIDDEN: "You don't have permission to change this Robo.",
    INVALID_CONFIG:
      "The configuration couldn't be read or saved. Check your values and try again. Existing data has not been overwritten.",
    ACTION_NOT_SUPPORTED: "This action is not available on this model.",
    STORAGE_UNAVAILABLE:
      "Browser storage is unavailable. Your changes are still in the form; allow storage and try again.",
    NETWORK_ERROR: "The service could not be reached. Please try again.",
  };
  return error instanceof ApiError
    ? (messages[error.code] ??
        "Unable to complete this request. Please try again.")
    : "Unable to complete this request. Please try again.";
}
export default function useRobotManagement(id: string) {
  const [config, setConfig] = useState<RobotConfig | null>(null);
  const [draft, setDraft] = useState<RobotConfig | null>(null);
  const [packs, setPacks] = useState<KnowledgePack[]>([]);
  const [profiles, setProfiles] = useState<PersonalityProfile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    area: string;
    error: boolean;
    message: string;
  } | null>(null);
  const generation = useRef(0);
  const busy = useRef(false);
  const reload = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setLoadError(null);
    try {
      const [config, packs, profiles] = await Promise.all([
        configService.getRobotConfig(id),
        getKnowledgePacks(id),
        getPersonalityProfiles(),
      ]);
      if (request !== generation.current) return;
      setConfig(config);
      setDraft(config);
      setPacks(packs);
      setProfiles(profiles);
    } catch (error) {
      if (request === generation.current) setLoadError(errorMessage(error));
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    void reload();
    return () => {
      ++generation.current;
    };
  }, [reload]);
  const dirty = (key: SettingKey) =>
    !!config &&
    !!draft &&
    JSON.stringify(config[key]) !== JSON.stringify(draft[key]);
  const hasUnsavedChanges =
    config && draft && JSON.stringify(config) !== JSON.stringify(draft);
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsavedChanges]);
  function edit<K extends SettingKey>(key: K, value: RobotConfig[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setFeedback(null);
  }
  function accept<K extends SettingKey>(key: K, value: RobotConfig[K]) {
    setConfig((current) => (current ? { ...current, [key]: value } : current));
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }
  async function run<T>(
    area: string,
    operation: () => Promise<T>,
    onSuccess: (value: T) => void,
    message: string | ((value: T) => string),
  ): Promise<boolean> {
    if (busy.current) return false;
    const current = generation.current;
    busy.current = true;
    setPending(area);
    setFeedback(null);
    try {
      const value = await operation();
      if (current !== generation.current) return false;
      onSuccess(value);
      setFeedback({
        area,
        error: false,
        message: typeof message === "function" ? message(value) : message,
      });
      return true;
    } catch (error) {
      if (current === generation.current)
        setFeedback({ area, error: true, message: errorMessage(error) });
      return false;
    } finally {
      busy.current = false;
      if (current === generation.current) setPending(null);
    }
  }
  async function save<K extends SettingKey>(key: K) {
    if (!draft) return false;
    const payload = { ...draft[key] };
    return run(
      key,
      () => updaters[key](id, payload),
      (value) => accept(key, value),
      success[key],
    );
  }
  async function changePack(pack: KnowledgePack) {
    return run(
      "knowledge",
      () =>
        pack.installed
          ? removeKnowledgePack(id, pack.id)
          : installKnowledgePack(id, pack.id),
      (next) => {
        setPacks(next);
        const installedPackIds = next
          .filter((p) => p.installed)
          .map((p) => p.id);
        setConfig((current) =>
          current ? { ...current, installedPackIds } : current,
        );
        setDraft((current) =>
          current ? { ...current, installedPackIds } : current,
        );
      },
      pack.installed ? "KNOWLEDGE PACK REMOVED" : "KNOWLEDGE PACK INSTALLED",
    );
  }
  return {
    config,
    draft,
    packs,
    profiles,
    isLoading,
    loadError,
    pending,
    feedback,
    reload,
    dirty,
    edit,
    save,
    changePack,
    clearMemory: () =>
      run(
        "memory",
        () => configService.clearMemory(id),
        (value) => accept("memory", value),
        "MEMORY CLEARED",
      ),
    sendAction: (action: RobotAction) =>
      run(
        "actions",
        () => executeAction(id, { action }),
        () => {},
        (receipt) =>
          receipt.simulated
            ? "COMMAND SENT · DEMO ONLY. No physical movement has been confirmed."
            : "COMMAND SENT. Awaiting device acknowledgement.",
      ),
    rename: (name: string) =>
      run(
        "device",
        () => updateRobot(id, { name }),
        () => {},
        "ROBO RENAMED",
      ),
    unpair: () =>
      run(
        "device",
        () => unpairRobot(id),
        () => {},
        "ROBO UNPAIRED",
      ),
  };
}
export type RobotManagementState = ReturnType<typeof useRobotManagement>;
