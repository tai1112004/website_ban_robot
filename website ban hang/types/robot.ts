export type RobotConnectionStatus =
  "ONLINE" | "OFFLINE" | "PAIRING" | "UNKNOWN";
export type RobotCapability =
  "VOICE" | "MEMORY" | "KNOWLEDGE" | "DISPLAY" | "MOTION";
export type RobotDevice = {
  id: string;
  deviceId: string;
  serialNumber: string;
  name: string;
  model: "BASIC" | "PLUS" | "CUSTOM";
  status: RobotConnectionStatus;
  firmwareVersion?: string;
  pairedAt?: string;
  image?: string;
  capabilities?: RobotCapability[];
};
export type UpdateRobotRequest = { name: string };
export type PairRobotRequest = { deviceId: string; activationCode: string };
