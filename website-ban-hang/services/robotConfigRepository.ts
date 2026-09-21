import { ApiError } from "../lib/apiClient";
import type { RobotConfig } from "../types/robotConfig";
import { getRobot } from "./robotService";
import { createDefaultConfig } from "./managementCatalog";
import { validateConfig } from "./robotConfigValidation";
const key = (id: string) => `robo-ai-config:${id}`;
export async function requireRobot(id: string) {
  const robot = await getRobot(id);
  if (!robot) throw new ApiError("ROBOT_NOT_FOUND", "Robo not found.");
  return robot;
}
export async function readConfig(id: string): Promise<RobotConfig> {
  await requireRobot(id);
  try {
    const raw = localStorage.getItem(key(id));
    return raw === null
      ? createDefaultConfig()
      : validateConfig(JSON.parse(raw));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof SyntaxError ? "INVALID_CONFIG" : "STORAGE_UNAVAILABLE",
      "Unable to read configuration.",
    );
  }
}
export async function changeConfig(
  id: string,
  update: (config: RobotConfig) => RobotConfig,
): Promise<RobotConfig> {
  const operation = async () => {
    const next = validateConfig(update(await readConfig(id)));
    try {
      localStorage.setItem(key(id), JSON.stringify(next));
    } catch {
      throw new ApiError(
        "STORAGE_UNAVAILABLE",
        "Unable to save configuration.",
      );
    }
    return next;
  };
  await new Promise((resolve) => setTimeout(resolve, 350));
  return navigator.locks
    ? navigator.locks.request(key(id), operation)
    : operation();
}
