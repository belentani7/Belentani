import { describe, expect, it } from "vitest";

const tokens = {
  background: "#000000",
  foreground: "#efeee8",
  card: "#1b1b19",
  cardForeground: "#f7f5ef",
  primary: "#efeee8",
  primaryForeground: "#000000",
  secondary: "#121211",
  secondaryForeground: "#c8c4ba",
  mutedForeground: "#aaa69d",
  accent: "#282724",
  accentForeground: "#f7f5ef",
} as const;

function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const value = hex.slice(1);
  const rgb = [0, 2, 4].map(offset =>
    Number.parseInt(value.slice(offset, offset + 2), 16)
  );
  return (
    0.2126 * channel(rgb[0] ?? 0) +
    0.7152 * channel(rgb[1] ?? 0) +
    0.0722 * channel(rgb[2] ?? 0)
  );
}

function contrast(foreground: string, background: string) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("NOIACORE contrast tokens", () => {
  it("keeps normal-size text pairs at WCAG AA contrast", () => {
    const pairs = [
      [tokens.foreground, tokens.background],
      [tokens.mutedForeground, tokens.background],
      [tokens.cardForeground, tokens.card],
      [tokens.primaryForeground, tokens.primary],
      [tokens.secondaryForeground, tokens.secondary],
      [tokens.accentForeground, tokens.accent],
    ] as const;

    for (const [foreground, background] of pairs) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
