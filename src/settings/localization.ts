import { settings } from "./core.ts";
import type { LocalizationSettings } from "./schema.ts";

export const localization = {
  get: () => settings.get("localization"),
  set: (value: LocalizationSettings) => settings.set("localization", value),
  watch: (cb: (value: LocalizationSettings) => void) =>
    settings.watch("localization", cb),

  getLanguage: () => settings.get("localization.language"),
  setLanguage: (language: string) =>
    settings.set("localization.language", language),
  watchLanguage: (cb: (language: string) => void) =>
    settings.watch("localization.language", cb),

  getTimezone: () => settings.get("localization.timezone"),
  setTimezone: (timezone: string) =>
    settings.set("localization.timezone", timezone),
  watchTimezone: (cb: (timezone: string) => void) =>
    settings.watch("localization.timezone", cb),

  getDateFormat: () => settings.get("localization.dateFormat"),
  setDateFormat: (format: string) =>
    settings.set("localization.dateFormat", format),
  watchDateFormat: (cb: (format: string) => void) =>
    settings.watch("localization.dateFormat", cb),

  getTimeFormat: () => settings.get("localization.timeFormat"),
  setTimeFormat: (format: "12h" | "24h") =>
    settings.set("localization.timeFormat", format),
  watchTimeFormat: (cb: (format: "12h" | "24h") => void) =>
    settings.watch("localization.timeFormat", cb),
};
