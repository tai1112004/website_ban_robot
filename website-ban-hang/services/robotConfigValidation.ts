import type {
  RobotConfig,
  SettingKey,
  KnowledgePack,
} from "../types/robotConfig";
import { ApiError } from "../lib/apiClient";
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function choice(value: unknown, options: string[]) {
  return typeof value === "string" && options.includes(value);
}
function range(value: unknown, min: number, max: number) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}
export function validateSetting<K extends SettingKey>(
  key: K,
  value: unknown,
): RobotConfig[K] {
  const v = object(value);
  const valid =
    key === "personality"
      ? choice(v.type, ["CHEERFUL", "SERIOUS", "CALM", "DIRECT", "CUSTOM"]) &&
        choice(v.responseLength, ["SHORT", "BALANCED", "DETAILED"]) &&
        range(v.humorLevel, 0, 100) &&
        range(v.formalityLevel, 0, 100)
      : key === "memory"
        ? [
            "enabled",
            "profileMemory",
            "preferenceMemory",
            "conversationMemory",
          ].every((k) => typeof v[k] === "boolean")
        : key === "voice"
          ? choice(v.profile, ["DEFAULT", "WARM", "CLEAR", "ENERGETIC"]) &&
            choice(v.language, ["VI", "EN"]) &&
            range(v.volume, 0, 100) &&
            range(v.speed, 0.5, 1.5)
          : choice(v.expression, ["NORMAL", "HAPPY", "CURIOUS", "SLEEPY"]) &&
            range(v.brightness, 0, 100);
  if (!valid) throw new ApiError("INVALID_CONFIG", "Configuration is invalid.");
  return value as RobotConfig[K];
}
export function validateConfig(value: unknown): RobotConfig {
  const v = object(value);
  if (
    !Array.isArray(v.installedPackIds) ||
    !v.installedPackIds.every(
      (id) => typeof id === "string" && id.length > 0,
    ) ||
    new Set(v.installedPackIds).size !== v.installedPackIds.length
  )
    throw new ApiError("INVALID_CONFIG", "Invalid knowledge configuration.");
  return {
    personality: validateSetting("personality", v.personality),
    memory: validateSetting("memory", v.memory),
    voice: validateSetting("voice", v.voice),
    display: validateSetting("display", v.display),
    installedPackIds: v.installedPackIds,
  };
}
export function validatePacks(value: unknown): KnowledgePack[] {
  if (
    !Array.isArray(value) ||
    !value.every((pack) => {
      const p = object(pack);
      return (
        ["id", "name", "description", "category"].every(
          (k) => typeof p[k] === "string",
        ) && typeof p.installed === "boolean"
      );
    }) ||
    new Set(value.map((p) => p.id)).size !== value.length
  )
    throw new ApiError("INVALID_CONFIG", "Invalid knowledge packs.");
  return value as KnowledgePack[];
}
