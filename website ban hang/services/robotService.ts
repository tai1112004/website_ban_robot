import { apiClient, ApiError } from "../lib/apiClient";
import type {
  PairRobotRequest,
  RobotDevice,
  UpdateRobotRequest,
} from "../types/robot";

const STORAGE_KEY = "robo-ai-devices";
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
const CHANGED = "robo-devices-changed";

function isRobot(value: unknown): value is RobotDevice {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    ["id", "deviceId", "name"].every(
      (k) => typeof r[k] === "string" && (r[k] as string).trim().length > 0,
    ) &&
    typeof r.serialNumber === "string" &&
    typeof r.model === "string" &&
    ["BASIC", "PLUS", "CUSTOM"].includes(r.model) &&
    typeof r.status === "string" &&
    ["ONLINE", "OFFLINE", "PAIRING", "UNKNOWN"].includes(r.status) &&
    (r.capabilities === undefined ||
      (Array.isArray(r.capabilities) &&
        r.capabilities.every(
          (c) =>
            typeof c === "string" &&
            ["VOICE", "MEMORY", "KNOWLEDGE", "DISPLAY", "MOTION"].includes(c),
        ))) &&
    ["firmwareVersion", "image"].every(
      (k) => r[k] === undefined || typeof r[k] === "string",
    ) &&
    (r.pairedAt === undefined ||
      (typeof r.pairedAt === "string" &&
        Number.isFinite(Date.parse(r.pairedAt))))
  );
}
function validateList(data: unknown): RobotDevice[] {
  if (!Array.isArray(data) || !data.every(isRobot))
    throw new ApiError("INVALID_DATA", "Device data is invalid.");
  if (
    new Set(data.map((r) => r.id)).size !== data.length ||
    new Set(data.map((r) => r.deviceId.trim().toUpperCase())).size !==
      data.length
  )
    throw new ApiError("INVALID_DATA", "Duplicate device records.");
  return data;
}
function read(): RobotDevice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? [] : validateList(JSON.parse(raw));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof SyntaxError ? "INVALID_DATA" : "STORAGE_UNAVAILABLE",
      "Device storage is unavailable.",
    );
  }
}
function write(robots: RobotDevice[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(robots));
  } catch {
    throw new ApiError("STORAGE_UNAVAILABLE", "Unable to save devices.");
  }
  window.dispatchEvent(new Event(CHANGED));
}
// A browser lock keeps concurrent tabs from overwriting one another's pairing changes.
async function mutate<T>(operation: () => T): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.locks)
    return navigator.locks.request(STORAGE_KEY, operation);
  return operation();
}
export async function getRobots(): Promise<RobotDevice[]> {
  return USE_MOCK_API ? read() : validateList(await apiClient("/api/devices"));
}
export async function getRobot(id: string): Promise<RobotDevice | null> {
  if (USE_MOCK_API) return read().find((robot) => robot.id === id) ?? null;
  try {
    const data = await apiClient(`/api/devices/${encodeURIComponent(id)}`);
    if (!isRobot(data))
      throw new ApiError("INVALID_DATA", "Invalid device response.");
    return data;
  } catch (error) {
    if (
      error instanceof ApiError &&
      ["DEVICE_NOT_FOUND", "HTTP_404"].includes(error.code)
    )
      return null;
    throw error;
  }
}
export async function pairRobot(
  payload: PairRobotRequest,
): Promise<RobotDevice> {
  const deviceId = payload.deviceId.trim().toUpperCase();
  const activationCode = payload.activationCode.trim();
  if (
    !/^[A-Z0-9-]{5,64}$/.test(deviceId) ||
    activationCode.length < 6 ||
    activationCode.length > 128
  )
    throw new ApiError(
      "INVALID_DEVICE_INFORMATION",
      "Invalid device information.",
    );
  if (!USE_MOCK_API) {
    const data = await apiClient("/api/devices/pair", {
      method: "POST",
      body: JSON.stringify({ deviceId, activationCode }),
    });
    if (!isRobot(data))
      throw new ApiError("INVALID_DATA", "Invalid device response.");
    window.dispatchEvent(new Event(CHANGED));
    return data;
  }
  await new Promise((resolve) => setTimeout(resolve, 650));
  return mutate(() => {
    const robots = read();
    if (robots.some((r) => r.deviceId.trim().toUpperCase() === deviceId))
      throw new ApiError(
        "DEVICE_ALREADY_PAIRED",
        "This Robo is already connected.",
      );
    const robot: RobotDevice = {
      id: crypto.randomUUID(),
      deviceId,
      serialNumber: "",
      name: "My Robo",
      model: "BASIC",
      status: "UNKNOWN",
      pairedAt: new Date().toISOString(),
      image: "/images/product_render_chinh_dien.png",
      capabilities: ["VOICE", "MEMORY", "KNOWLEDGE", "DISPLAY"],
    };
    // Activation codes are transient and must never be persisted.
    write([...robots, robot]);
    return robot;
  });
}
export async function unpairRobot(id: string): Promise<void> {
  if (USE_MOCK_API)
    await mutate(() => write(read().filter((robot) => robot.id !== id)));
  else {
    await apiClient(`/api/devices/${encodeURIComponent(id)}/pair`, {
      method: "DELETE",
    });
    window.dispatchEvent(new Event(CHANGED));
  }
}
export async function updateRobot(
  id: string,
  payload: UpdateRobotRequest,
): Promise<RobotDevice> {
  const name = payload.name.trim();
  if (!name || name.length > 60)
    throw new ApiError("INVALID_CONFIG", "Name must contain 1–60 characters.");
  if (!USE_MOCK_API) {
    const data = await apiClient(`/api/devices/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    if (!isRobot(data))
      throw new ApiError("INVALID_DATA", "Invalid device response.");
    window.dispatchEvent(new Event(CHANGED));
    return data;
  }
  return mutate(() => {
    const robots = read();
    const robot = robots.find((r) => r.id === id);
    if (!robot) throw new ApiError("ROBOT_NOT_FOUND", "Robo not found.");
    const updated = { ...robot, name };
    write(robots.map((r) => (r.id === id ? updated : r)));
    return updated;
  });
}
// Subscription is a service concern; hooks do not depend on storage keys.
export function subscribeRobots(listener: () => void): () => void {
  const storage = (event: StorageEvent) => {
    if (USE_MOCK_API && (event.key === STORAGE_KEY || event.key === null))
      listener();
  };
  window.addEventListener(CHANGED, listener);
  window.addEventListener("storage", storage);
  window.addEventListener("focus", listener);
  return () => {
    window.removeEventListener(CHANGED, listener);
    window.removeEventListener("storage", storage);
    window.removeEventListener("focus", listener);
  };
}
