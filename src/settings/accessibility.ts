import { settings } from "./core.ts";
import type { AccessibilitySettings } from "./schema.ts";

export const accessibility = {
  get: () => settings.get("accessibility"),
  set: (value: AccessibilitySettings) => settings.set("accessibility", value),
  watch: (cb: (value: AccessibilitySettings) => void) =>
    settings.watch("accessibility", cb),

  getReduceMotion: () => settings.get("accessibility.reduceMotion"),
  setReduceMotion: (value: boolean) =>
    settings.set("accessibility.reduceMotion", value),
  watchReduceMotion: (cb: (value: boolean) => void) =>
    settings.watch("accessibility.reduceMotion", cb),

  getHighContrast: () => settings.get("accessibility.highContrast"),
  setHighContrast: (value: boolean) =>
    settings.set("accessibility.highContrast", value),
  watchHighContrast: (cb: (value: boolean) => void) =>
    settings.watch("accessibility.highContrast", cb),

  getFontScale: () => settings.get("accessibility.fontScale"),
  setFontScale: (scale: number) =>
    settings.set("accessibility.fontScale", scale),
  watchFontScale: (cb: (scale: number) => void) =>
    settings.watch("accessibility.fontScale", cb),
};
