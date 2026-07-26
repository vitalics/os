import { settings } from "./core.ts";
import type { AccountSettings } from "./schema.ts";

export const accounts = {
  get: () => settings.get("accounts"),
  set: (value: AccountSettings) => settings.set("accounts", value),
  watch: (cb: (value: AccountSettings) => void) =>
    settings.watch("accounts", cb),

  getUsername: () => settings.get("accounts.username"),
  setUsername: (username: string) =>
    settings.set("accounts.username", username),
  watchUsername: (cb: (username: string) => void) =>
    settings.watch("accounts.username", cb),

  getAvatar: () => settings.get("accounts.avatar"),
  setAvatar: (avatar: string) => settings.set("accounts.avatar", avatar),
  watchAvatar: (cb: (avatar: string) => void) =>
    settings.watch("accounts.avatar", cb),

  getAutoLogin: () => settings.get("accounts.autoLogin"),
  setAutoLogin: (value: boolean) => settings.set("accounts.autoLogin", value),
  watchAutoLogin: (cb: (value: boolean) => void) =>
    settings.watch("accounts.autoLogin", cb),
};
