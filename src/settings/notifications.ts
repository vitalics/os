import { settings } from "./core.ts";
import type { NotificationsSettings } from "./schema.ts";

export const notifications = {
  get: () => settings.get("notifications"),
  set: (value: NotificationsSettings) => settings.set("notifications", value),
  watch: (cb: (value: NotificationsSettings) => void) =>
    settings.watch("notifications", cb),

  getDoNotDisturb: () => settings.get("notifications.doNotDisturb"),
  setDoNotDisturb: (value: boolean) =>
    settings.set("notifications.doNotDisturb", value),
  watchDoNotDisturb: (cb: (value: boolean) => void) =>
    settings.watch("notifications.doNotDisturb", cb),

  getSounds: () => settings.get("notifications.sounds"),
  setSounds: (value: boolean) => settings.set("notifications.sounds", value),
  watchSounds: (cb: (value: boolean) => void) =>
    settings.watch("notifications.sounds", cb),

  getBadges: () => settings.get("notifications.badges"),
  setBadges: (value: boolean) => settings.set("notifications.badges", value),
  watchBadges: (cb: (value: boolean) => void) =>
    settings.watch("notifications.badges", cb),

  getPreview: () => settings.get("notifications.preview"),
  setPreview: (value: NotificationsSettings["preview"]) =>
    settings.set("notifications.preview", value),
  watchPreview: (cb: (value: NotificationsSettings["preview"]) => void) =>
    settings.watch("notifications.preview", cb),
};
