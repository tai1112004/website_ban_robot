export type PersonalityType =
  "CHEERFUL" | "SERIOUS" | "CALM" | "DIRECT" | "CUSTOM";
export type PersonalitySettings = {
  type: PersonalityType;
  responseLength: "SHORT" | "BALANCED" | "DETAILED";
  humorLevel: number;
  formalityLevel: number;
};
export type MemorySettings = {
  enabled: boolean;
  profileMemory: boolean;
  preferenceMemory: boolean;
  conversationMemory: boolean;
};
export type VoiceSettings = {
  profile: "DEFAULT" | "WARM" | "CLEAR" | "ENERGETIC";
  language: "VI" | "EN";
  volume: number;
  speed: number;
};
export type RobotExpression = "NORMAL" | "HAPPY" | "CURIOUS" | "SLEEPY";
export type DisplaySettings = {
  expression: RobotExpression;
  brightness: number;
};
export type KnowledgePack = {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  category: string;
};
export type RobotAction =
  "WAVE" | "NOD" | "TURN_LEFT" | "TURN_RIGHT" | "IDLE" | "STOP";
export type RobotConfig = {
  personality: PersonalitySettings;
  memory: MemorySettings;
  voice: VoiceSettings;
  display: DisplaySettings;
  installedPackIds: string[];
};
export type SettingKey = "personality" | "memory" | "voice" | "display";
export type UpdatePersonalityRequest = PersonalitySettings;
export type UpdateMemoryRequest = MemorySettings;
export type UpdateVoiceRequest = VoiceSettings;
export type UpdateDisplayRequest = DisplaySettings;
export type UpdateRobotConfigRequest = RobotConfig;
export type ExecuteRobotActionRequest = { action: RobotAction };
export type ActionReceipt = { status: "SENT"; simulated: boolean };
export type PersonalityProfile = {
  type: PersonalityType;
  description: string;
  traits: string;
  preview: string;
};
