import { apiClient } from "../lib/apiClient";
import { USE_MOCK_API } from "./robotService";
import { readConfig, changeConfig } from "./robotConfigRepository";
import { validateConfig, validateSetting } from "./robotConfigValidation";
import type {
  RobotConfig,
  SettingKey,
  UpdateRobotConfigRequest,
  UpdatePersonalityRequest,
  UpdateMemoryRequest,
  UpdateVoiceRequest,
  UpdateDisplayRequest,
} from "../types/robotConfig";
const path = (id: string, section: string) =>
  `/api/devices/${encodeURIComponent(id)}/${section}`;
export async function getRobotConfig(id: string): Promise<RobotConfig> {
  return USE_MOCK_API
    ? readConfig(id)
    : validateConfig(await apiClient(path(id, "config")));
}
export async function updateRobotConfig(
  id: string,
  payload: UpdateRobotConfigRequest,
): Promise<RobotConfig> {
  const next = validateConfig(payload);
  return USE_MOCK_API
    ? changeConfig(id, () => next)
    : validateConfig(
        await apiClient(path(id, "config"), {
          method: "PUT",
          body: JSON.stringify(next),
        }),
      );
}
async function getSetting<K extends SettingKey>(
  id: string,
  section: K,
): Promise<RobotConfig[K]> {
  return USE_MOCK_API
    ? (await readConfig(id))[section]
    : validateSetting(section, await apiClient(path(id, section)));
}
async function updateSetting<K extends SettingKey>(
  id: string,
  section: K,
  payload: RobotConfig[K],
): Promise<RobotConfig[K]> {
  const next = validateSetting(section, payload);
  return USE_MOCK_API
    ? (await changeConfig(id, (current) => ({ ...current, [section]: next })))[
        section
      ]
    : validateSetting(
        section,
        await apiClient(path(id, section), {
          method: "PUT",
          body: JSON.stringify(next),
        }),
      );
}
export async function getPersonality(id: string) {
  return getSetting(id, "personality");
}
export async function updatePersonality(
  id: string,
  payload: UpdatePersonalityRequest,
) {
  return updateSetting(id, "personality", payload);
}
export async function getMemorySettings(id: string) {
  return getSetting(id, "memory");
}
export async function updateMemorySettings(
  id: string,
  payload: UpdateMemoryRequest,
) {
  return updateSetting(id, "memory", payload);
}
export async function getVoiceSettings(id: string) {
  return getSetting(id, "voice");
}
export async function updateVoiceSettings(
  id: string,
  payload: UpdateVoiceRequest,
) {
  return updateSetting(id, "voice", payload);
}
export async function getDisplaySettings(id: string) {
  return getSetting(id, "display");
}
export async function updateDisplaySettings(
  id: string,
  payload: UpdateDisplayRequest,
) {
  return updateSetting(id, "display", payload);
}
export async function clearMemory(id: string) {
  if (USE_MOCK_API)
    return updateMemorySettings(id, {
      enabled: false,
      profileMemory: false,
      preferenceMemory: false,
      conversationMemory: false,
    });
  await apiClient(path(id, "memory"), { method: "DELETE" });
  return getMemorySettings(id);
}
