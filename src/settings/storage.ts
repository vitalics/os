import { settings } from "./core.ts";
import type { StorageSettings } from "./schema.ts";

export const storage = {
  get: () => settings.get("storage"),
  set: (value: StorageSettings) => settings.set("storage", value),
  watch: (cb: (value: StorageSettings) => void) =>
    settings.watch("storage", cb),

  getCacheSizeMb: () => settings.get("storage.cacheSizeMb"),
  setCacheSizeMb: (mb: number) => settings.set("storage.cacheSizeMb", mb),
  watchCacheSizeMb: (cb: (mb: number) => void) =>
    settings.watch("storage.cacheSizeMb", cb),

  getAutoCleanup: () => settings.get("storage.autoCleanup"),
  setAutoCleanup: (value: boolean) =>
    settings.set("storage.autoCleanup", value),
  watchAutoCleanup: (cb: (value: boolean) => void) =>
    settings.watch("storage.autoCleanup", cb),
};
