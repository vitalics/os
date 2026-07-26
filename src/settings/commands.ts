import { invoke } from "@tauri-apps/api/core";

export async function getSettings(key?: string): Promise<unknown> {
  return invoke("settings_get", { key });
}

export async function setSettings(key: string, value: unknown): Promise<void> {
  return invoke("settings_set", { key, value });
}

export async function resetSettings(domain?: string): Promise<void> {
  return invoke("settings_reset", { domain });
}
