import type {
  KnowledgePack,
  PersonalityProfile,
  RobotConfig,
} from "../types/robotConfig";
export function createDefaultConfig(): RobotConfig {
  return {
    personality: {
      type: "CHEERFUL",
      responseLength: "BALANCED",
      humorLevel: 50,
      formalityLevel: 30,
    },
    memory: {
      enabled: false,
      profileMemory: false,
      preferenceMemory: false,
      conversationMemory: false,
    },
    voice: { profile: "DEFAULT", language: "VI", volume: 60, speed: 1 },
    display: { expression: "NORMAL", brightness: 70 },
    installedPackIds: [],
  };
}
export const knowledgeCatalog: Omit<KnowledgePack, "installed">[] = [
  {
    id: "general",
    name: "GENERAL ASSISTANT",
    description: "Everyday questions, ideas and practical help.",
    category: "Everyday",
  },
  {
    id: "education",
    name: "EDUCATION",
    description: "Explore subjects and learn at your own pace.",
    category: "Learning",
  },
  {
    id: "english",
    name: "ENGLISH PRACTICE",
    description: "A space to build confidence with English.",
    category: "Language",
  },
  {
    id: "kids",
    name: "KIDS",
    description: "Age-appropriate learning concepts for curious minds.",
    category: "Learning",
  },
  {
    id: "museum",
    name: "MUSEUM GUIDE",
    description: "Bring context to collections and exhibitions.",
    category: "Culture",
  },
  {
    id: "business",
    name: "BUSINESS",
    description: "Professional knowledge for everyday work.",
    category: "Work",
  },
  {
    id: "custom",
    name: "CUSTOM",
    description: "A future place for knowledge tailored to you.",
    category: "Personal",
  },
  {
    id: "hat-sac-bua",
    name: "HÁT SẮC BÙA",
    description: "Explore the songs, stories and traditions of Hát Sắc Bùa.",
    category: "Culture",
  },
];
export async function getPersonalityProfiles(): Promise<PersonalityProfile[]> {
  return [
    {
      type: "CHEERFUL",
      description: "A little warmth in every exchange.",
      traits: "Warm · Friendly · Light humor",
      preview: "Ready when you are. What should we do next?",
    },
    {
      type: "SERIOUS",
      description: "Stay focused on what matters.",
      traits: "Focused · Professional · Concise",
      preview: "I'm ready. What would you like to work on?",
    },
    {
      type: "CALM",
      description: "Make room to think at your own pace.",
      traits: "Gentle · Patient · Balanced",
      preview: "Take your time. We can work through it together.",
    },
    {
      type: "DIRECT",
      description: "Get straight to the point.",
      traits: "Straightforward · Short · Minimal small talk",
      preview: "What's next?",
    },
    {
      type: "CUSTOM",
      description: "Fine-tune Robo yourself.",
      traits: "Your pace · Your tone · Your choice",
      preview: "Let's find a way that works for you.",
    },
  ];
}
