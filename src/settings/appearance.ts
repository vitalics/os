import { settings } from "./core.ts";
import type { Theme, AccentColor } from "./schema.ts";

export const appearance = {
  getTheme: () => settings.get("appearance.theme"),
  setTheme: (theme: Theme) => settings.set("appearance.theme", theme),
  watchTheme: (cb: (theme: Theme) => void) =>
    settings.watch("appearance.theme", cb),

  getAccentColor: () => settings.get("appearance.accentColor"),
  setAccentColor: (color: AccentColor) =>
    settings.set("appearance.accentColor", color),
  watchAccentColor: (cb: (color: AccentColor) => void) =>
    settings.watch("appearance.accentColor", cb),

  getWallpaper: () => settings.get("appearance.wallpaper"),
  setWallpaper: (wallpaper: string) =>
    settings.set("appearance.wallpaper", wallpaper),
  watchWallpaper: (cb: (wallpaper: string) => void) =>
    settings.watch("appearance.wallpaper", cb),

  getReduceTransparency: () => settings.get("appearance.reduceTransparency"),
  setReduceTransparency: (value: boolean) =>
    settings.set("appearance.reduceTransparency", value),
  watchReduceTransparency: (cb: (value: boolean) => void) =>
    settings.watch("appearance.reduceTransparency", cb),
};
