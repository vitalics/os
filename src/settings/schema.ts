import type {
  AppearanceSettings as GeneratedAppearanceSettings,
  LocalizationSettings as GeneratedLocalizationSettings,
  NotificationsSettings as GeneratedNotificationsSettings,
  PrivacySettings as GeneratedPrivacySettings,
  NetworkSettings as GeneratedNetworkSettings,
  StorageSettings as GeneratedStorageSettings,
  AccessibilitySettings as GeneratedAccessibilitySettings,
  AccountSettings as GeneratedAccountSettings,
} from "./generated.ts";

export type Theme = "light" | "dark" | "system";
export type AccentColor =
  | "slate"
  | "red"
  | "orange"
  | "amber"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

export interface AppearanceSettings extends GeneratedAppearanceSettings {
  theme: Theme;
  accentColor: AccentColor;
}

export interface LocalizationSettings extends GeneratedLocalizationSettings {
  timeFormat: "12h" | "24h";
}

export interface NotificationsSettings extends GeneratedNotificationsSettings {
  preview: "always" | "whenUnlocked" | "never";
}

export type PrivacySettings = GeneratedPrivacySettings;
export type NetworkSettings = GeneratedNetworkSettings;
export type StorageSettings = GeneratedStorageSettings;
export type AccessibilitySettings = GeneratedAccessibilitySettings;
export type AccountSettings = GeneratedAccountSettings;

export interface SettingsSchema {
  appearance: AppearanceSettings;
  localization: LocalizationSettings;
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  network: NetworkSettings;
  storage: StorageSettings;
  accessibility: AccessibilitySettings;
  accounts: AccountSettings;
}

export type SettingsDomain = keyof SettingsSchema;

export const defaultSettings: SettingsSchema = {
  appearance: {
    theme: "system",
    accentColor: "blue",
    wallpaper: "",
    reduceTransparency: false,
  },
  localization: {
    language: "en",
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
  },
  notifications: {
    doNotDisturb: false,
    sounds: true,
    badges: true,
    preview: "whenUnlocked",
  },
  privacy: {
    telemetry: false,
    crashReports: true,
    location: false,
    microphone: false,
    camera: false,
  },
  network: {
    proxyEnabled: false,
    proxyHost: "",
    proxyPort: 8080,
    metered: false,
  },
  storage: {
    cacheSizeMb: 256,
    autoCleanup: true,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    fontScale: 1,
  },
  accounts: {
    username: "",
    avatar: "",
    autoLogin: false,
  },
};

export type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type SettingsPath = {
  [K in SettingsDomain]: K |
    `${K}.${keyof SettingsSchema[K] & string}`;
}[SettingsDomain];
