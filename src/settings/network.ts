import { settings } from "./core.ts";
import type { NetworkSettings } from "./schema.ts";

export const network = {
  get: () => settings.get("network"),
  set: (value: NetworkSettings) => settings.set("network", value),
  watch: (cb: (value: NetworkSettings) => void) =>
    settings.watch("network", cb),

  getProxyEnabled: () => settings.get("network.proxyEnabled"),
  setProxyEnabled: (value: boolean) =>
    settings.set("network.proxyEnabled", value),
  watchProxyEnabled: (cb: (value: boolean) => void) =>
    settings.watch("network.proxyEnabled", cb),

  getProxyHost: () => settings.get("network.proxyHost"),
  setProxyHost: (host: string) => settings.set("network.proxyHost", host),
  watchProxyHost: (cb: (host: string) => void) =>
    settings.watch("network.proxyHost", cb),

  getProxyPort: () => settings.get("network.proxyPort"),
  setProxyPort: (port: number) => settings.set("network.proxyPort", port),
  watchProxyPort: (cb: (port: number) => void) =>
    settings.watch("network.proxyPort", cb),

  getMetered: () => settings.get("network.metered"),
  setMetered: (value: boolean) => settings.set("network.metered", value),
  watchMetered: (cb: (value: boolean) => void) =>
    settings.watch("network.metered", cb),
};
