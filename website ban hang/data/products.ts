export type ModelId = "basic" | "plus" | "custom";
export type GalleryImage = { label: string; src: string; alt: string };
export type ProductModel = {
  id: ModelId;
  slug: string;
  name: string;
  tagline: string;
  description: string[];
  availability: string;
  price: { amount: number; currency: string } | null;
  features: string[];
  includes: string[];
  media: {
    gallery: GalleryImage[];
    turntable: string;
    expressions: string;
    cutout: string;
    exploded: string;
    lifestyle: string;
    closeup: string;
    cta: string;
  };
};

export const modelLinks: { id: ModelId; name: string; href: string }[] = [
  { id: "basic", name: "Basic", href: "/products/basic" },
  { id: "plus", name: "Plus", href: "/products/plus" },
  { id: "custom", name: "Custom", href: "/products/custom" },
];

export const roboBasic: ProductModel = {
  id: "basic",
  slug: "basic",
  name: "Robo Basic",
  tagline: "Your personal AI companion.",
  description: [
    "Real-time voice.",
    "A personality of its own.",
    "Memory that adapts to you.",
  ],
  availability: "Coming Soon",
  price: null,
  features: [
    "Voice AI",
    "Personality",
    "Personal Memory",
    "Knowledge Packs",
    "Expressive Display",
    "Integrated Audio",
  ],
  includes: [
    "Voice AI",
    "Personality",
    "Memory",
    "Knowledge Packs",
    "Expressive Display",
  ],
  media: {
    gallery: [
      {
        label: "FRONT",
        src: "/images/product_render_chinh_dien.png",
        alt: "Robo Basic front view in orange and white",
      },
      {
        label: "ANGLE",
        src: "/images/product_render_goc_nghieng.png",
        alt: "Robo Basic three-quarter view",
      },
      {
        label: "SIDE",
        src: "/images/matbenhong_robot.png",
        alt: "Side view of the supplied Robo design",
      },
      {
        label: "REAR",
        src: "/images/matsau_robot.png",
        alt: "Rear view of the supplied Robo design",
      },
      {
        label: "DETAIL",
        src: "/images/close_up.png",
        alt: "Close-up of Robo’s expressive face and orange shell",
      },
    ],
    turntable: "/videos/video_360do.mp4",
    expressions: "/videos/video_bieucam.mp4",
    cutout: "/images/robot_phongtrang.png",
    exploded: "/images/phan_ra_tung_thiet_bi.png",
    lifestyle: "/images/lifestyle.png",
    closeup: "/images/close_up.png",
    cta: "/images/CTA.png",
  },
};

export function productPrice(product: ProductModel, locale = "en-US") {
  return product.price === null
    ? "PRICE TO BE ANNOUNCED"
    : new Intl.NumberFormat(locale, {
        style: "currency",
        currency: product.price.currency,
      }).format(product.price.amount);
}

export const quickFeatures = [
  { title: "VOICE AI", text: "Natural realtime conversations." },
  { title: "PERSONALITY", text: "Choose how Robo talks and reacts." },
  { title: "MEMORY", text: "Robo remembers what you allow." },
  { title: "KNOWLEDGE", text: "Give Robo knowledge for different purposes." },
];
export const moods = [
  {
    name: "NORMAL",
    image: "/images/bieucam_binhthuong.png",
    description: "Ready for whatever comes next.",
  },
  {
    name: "CURIOUS",
    image: "/images/bieucam_khohieu.png",
    description: "Always listening. Always thinking.",
  },
  {
    name: "HAPPY",
    image: "/images/bieucam_vuive.png",
    description: "A little more personality in every interaction.",
  },
  {
    name: "SLEEPY",
    image: "/images/bieucam_chandoi.png",
    description: "Even Robo needs a quiet moment.",
  },
];
export const hardware = [
  {
    name: "AI CONTROLLER",
    text: "The core device layer responsible for voice, display and interaction.",
  },
  {
    name: "MICROPHONE",
    text: "Captures voice input for realtime interaction.",
  },
  { name: "AUDIO SYSTEM", text: "Integrated audio for Robo’s responses." },
  { name: "DISPLAY", text: "The expressive face of Robo." },
  {
    name: "MOTION SYSTEM",
    text: "Enables physical actions on supported models.",
  },
  {
    name: "POWER",
    text: "Designed around the needs of display, audio and motion hardware.",
  },
];
export const designFeatures = [
  { title: "COMPACT FORM", text: "A recognizable physical AI companion." },
  { title: "EXPRESSIVE DISPLAY", text: "A face designed for communication." },
  {
    title: "MODULAR THINKING",
    text: "Designed with maintenance and future upgrades in mind.",
  },
  { title: "PHYSICAL PRESENCE", text: "AI that exists beyond the screen." },
];
export const comparison: {
  feature: string;
  basic: boolean | string;
  plus: boolean | string;
  custom: boolean | string;
}[] = [
  { feature: "Voice AI", basic: true, plus: true, custom: true },
  { feature: "Personality", basic: true, plus: true, custom: true },
  { feature: "Memory", basic: true, plus: true, custom: true },
  { feature: "Knowledge Packs", basic: true, plus: true, custom: true },
  { feature: "Expressive Face", basic: true, plus: true, custom: true },
  {
    feature: "Physical Actions",
    basic: "Limited",
    plus: "Enhanced",
    custom: "Custom",
  },
  { feature: "Sensors", basic: false, plus: true, custom: "Optional" },
  { feature: "Custom Shell", basic: false, plus: false, custom: true },
  { feature: "Branding", basic: false, plus: false, custom: true },
  { feature: "Custom Integration", basic: false, plus: false, custom: true },
];
const developmentAnswer =
  "The product is currently in development. Final specifications and commercial details will be announced as the product moves toward release.";
export const productFAQ = [
  {
    question: "WHAT IS ROBO AI?",
    answer:
      "Robo AI is a physical AI companion designed to combine realtime voice, a personal character, selected memory and Knowledge Packs with an expressive face.",
  },
  {
    question: "WHAT CAN ROBO REMEMBER?",
    answer:
      "Robo can use information you choose to share, such as your name, preferred language and selected long-term context. It is not described as automatically saving every conversation.",
  },
  {
    question: "CAN I CHANGE ROBO'S PERSONALITY?",
    answer:
      "Personality is designed to let you choose how Robo talks and reacts. Available options and controls will be confirmed as development progresses.",
  },
  {
    question: "WHAT ARE KNOWLEDGE PACKS?",
    answer:
      "Knowledge Packs are a concept for adapting Robo to different people, places and purposes, from education and English practice to cultural knowledge or custom uses.",
  },
  {
    question: "WHAT'S THE DIFFERENCE BETWEEN BASIC AND PLUS?",
    answer:
      "Basic focuses on voice, personality, memory, knowledge, expressive display and audio. Plus is planned to add enhanced physical actions and sensors. The comparison is a preview, not a final hardware specification.",
  },
  { question: "IS THE FINAL PRICE AVAILABLE?", answer: developmentAnswer },
  { question: "WHEN WILL ROBO BE AVAILABLE?", answer: developmentAnswer },
  {
    question: "IS MY PERSONAL DATA PRIVATE?",
    answer:
      "You are intended to control what Robo remembers. Final product privacy and data-handling details have not been announced. This frontend demonstration does not store or transmit the information entered in its interest form.",
  },
];
