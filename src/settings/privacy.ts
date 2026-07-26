import { settings } from "./core.ts";
import type { PrivacySettings } from "./schema.ts";

export const privacy = {
  get: () => settings.get("privacy"),
  set: (value: PrivacySettings) => settings.set("privacy", value),
  watch: (cb: (value: PrivacySettings) => void) =>
    settings.watch("privacy", cb),

  getTelemetry: () => settings.get("privacy.telemetry"),
  setTelemetry: (value: boolean) => settings.set("privacy.telemetry", value),
  watchTelemetry: (cb: (value: boolean) => void) =>
    settings.watch("privacy.telemetry", cb),

  getCrashReports: () => settings.get("privacy.crashReports"),
  setCrashReports: (value: boolean) =>
    settings.set("privacy.crashReports", value),
  watchCrashReports: (cb: (value: boolean) => void) =>
    settings.watch("privacy.crashReports", cb),

  getLocation: () => settings.get("privacy.location"),
  setLocation: (value: boolean) => settings.set("privacy.location", value),
  watchLocation: (cb: (value: boolean) => void) =>
    settings.watch("privacy.location", cb),

  getMicrophone: () => settings.get("privacy.microphone"),
  setMicrophone: (value: boolean) =>
    settings.set("privacy.microphone", value),
  watchMicrophone: (cb: (value: boolean) => void) =>
    settings.watch("privacy.microphone", cb),

  getCamera: () => settings.get("privacy.camera"),
  setCamera: (value: boolean) => settings.set("privacy.camera", value),
  watchCamera: (cb: (value: boolean) => void) =>
    settings.watch("privacy.camera", cb),
};
