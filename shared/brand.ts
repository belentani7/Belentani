export const BRAND = {
  name: "Belentani Studio",
  signer: "Pedro Belentani",
  primaryDomain: "https://belentani.eu",
  relatedDomain: "https://noiacore.com",
  socialHandle: "@belentani_",
  contactEmail: "belentani7studio@proton.me",
  voice: "calmo, preciso, perceptivo y orientado a decisiones",
} as const;

export const DESIGN_TOKENS = {
  colors: {
    ink: "oklch(0.235 0.015 65)",
    paper: "oklch(1 0 0)",
    signal: "oklch(0.488 0.243 264.376)",
    mist: "oklch(0.967 0.001 286.375)",
  },
  typography: {
    display: "clamp(3rem, 8vw, 7rem)",
    body: "1rem",
    meta: "0.72rem",
    lineBody: "1.75",
    trackingMeta: "0.2em",
  },
  spacing: {
    section: "clamp(5rem, 10vw, 9rem)",
    card: "1.5rem",
    gutter: "clamp(1.5rem, 4vw, 2.5rem)",
  },
  radius: { card: "1rem", pill: "999px" },
  motion: {
    quick: "160ms",
    normal: "220ms",
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    reducedMotion: "disable non-essential motion",
  },
  motif:
    "attention-map: thin rings, coordinates, numbered principles and annotated whitespace",
} as const;
