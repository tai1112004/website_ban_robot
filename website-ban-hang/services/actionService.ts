import { apiClient, ApiError } from "../lib/apiClient";
import { USE_MOCK_API } from "./robotService";
import { requireRobot } from "./robotConfigRepository";
import type {
  ActionReceipt,
  ExecuteRobotActionRequest,
} from "../types/robotConfig";
export async function executeAction(
  id: string,
  payload: ExecuteRobotActionRequest,
): Promise<ActionReceipt> {
  if (
    !["WAVE", "NOD", "TURN_LEFT", "TURN_RIGHT", "IDLE", "STOP"].includes(
      payload.action,
    )
  )
    throw new ApiError("ACTION_NOT_SUPPORTED", "Unknown command.");
  const robot = await requireRobot(id);
  if (!robot.capabilities?.includes("MOTION"))
    throw new ApiError("ACTION_NOT_SUPPORTED", "Motion is not supported.");
  if (robot.status !== "ONLINE")
    throw new ApiError("ROBOT_OFFLINE", "Robo is not online.");
  if (!USE_MOCK_API) {
    await apiClient(`/api/devices/${encodeURIComponent(id)}/actions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { status: "SENT", simulated: false };
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Recheck after the delay in case another tab unpaired or changed the device.
  const current = await requireRobot(id);
  if (current.status !== "ONLINE")
    throw new ApiError("ROBOT_OFFLINE", "Robo is not online.");
  if (!current.capabilities?.includes("MOTION"))
    throw new ApiError("ACTION_NOT_SUPPORTED", "Motion is not supported.");
  return { status: "SENT", simulated: true };
}
