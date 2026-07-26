use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use serde_json::Value;
use std::{
    fs,
    path::PathBuf,
    sync::{Mutex, RwLock},
};
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct AppearanceSettings {
    pub theme: String,
    pub accent_color: String,
    pub wallpaper: String,
    pub reduce_transparency: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct LocalizationSettings {
    pub language: String,
    pub timezone: String,
    pub date_format: String,
    pub time_format: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct NotificationsSettings {
    pub do_not_disturb: bool,
    pub sounds: bool,
    pub badges: bool,
    pub preview: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct PrivacySettings {
    pub telemetry: bool,
    pub crash_reports: bool,
    pub location: bool,
    pub microphone: bool,
    pub camera: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct NetworkSettings {
    pub proxy_enabled: bool,
    pub proxy_host: String,
    pub proxy_port: u16,
    pub metered: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct StorageSettings {
    pub cache_size_mb: u32,
    pub auto_cleanup: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct AccessibilitySettings {
    pub reduce_motion: bool,
    pub high_contrast: bool,
    pub font_scale: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct AccountSettings {
    pub username: String,
    pub avatar: String,
    pub auto_login: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct Settings {
    pub appearance: AppearanceSettings,
    pub localization: LocalizationSettings,
    pub notifications: NotificationsSettings,
    pub privacy: PrivacySettings,
    pub network: NetworkSettings,
    pub storage: StorageSettings,
    pub accessibility: AccessibilitySettings,
    pub accounts: AccountSettings,
}

impl Settings {
    fn default_settings() -> Self {
        Self {
            appearance: AppearanceSettings {
                theme: "system".to_string(),
                accent_color: "blue".to_string(),
                wallpaper: "".to_string(),
                reduce_transparency: false,
            },
            localization: LocalizationSettings {
                language: "en".to_string(),
                timezone: "UTC".to_string(),
                date_format: "YYYY-MM-DD".to_string(),
                time_format: "24h".to_string(),
            },
            notifications: NotificationsSettings {
                do_not_disturb: false,
                sounds: true,
                badges: true,
                preview: "whenUnlocked".to_string(),
            },
            privacy: PrivacySettings {
                telemetry: false,
                crash_reports: true,
                location: false,
                microphone: false,
                camera: false,
            },
            network: NetworkSettings {
                proxy_enabled: false,
                proxy_host: "".to_string(),
                proxy_port: 8080,
                metered: false,
            },
            storage: StorageSettings {
                cache_size_mb: 256,
                auto_cleanup: true,
            },
            accessibility: AccessibilitySettings {
                reduce_motion: false,
                high_contrast: false,
                font_scale: 1.0,
            },
            accounts: AccountSettings {
                username: "".to_string(),
                avatar: "".to_string(),
                auto_login: false,
            },
        }
    }
}

pub struct SettingsManager {
    settings: RwLock<Settings>,
    path: Mutex<PathBuf>,
}

impl SettingsManager {
    pub fn new(app_handle: &AppHandle) -> Result<Self, String> {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .map_err(|e| e.to_string())?;
        fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
        let path = app_dir.join("settings.json");

        let settings = if path.exists() {
            let contents = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let mut parsed: Value = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
            Self::merge_with_defaults(&mut parsed);
            serde_json::from_value(parsed).map_err(|e| e.to_string())?
        } else {
            Settings::default_settings()
        };

        Ok(Self {
            settings: RwLock::new(settings),
            path: Mutex::new(path),
        })
    }

    fn merge_with_defaults(value: &mut Value) {
        let defaults = serde_json::to_value(Settings::default_settings()).unwrap_or_default();
        if let (Value::Object(map), Value::Object(default_map)) = (value, defaults) {
            for (key, default_val) in default_map {
                if !map.contains_key(&key) {
                    map.insert(key, default_val);
                } else if let (Value::Object(existing), Value::Object(def_obj)) =
                    (map.get_mut(&key).unwrap(), default_val)
                {
                    for (sub_key, sub_default) in def_obj {
                        if !existing.contains_key(&sub_key) {
                            existing.insert(sub_key, sub_default);
                        }
                    }
                }
            }
        }
    }

    pub fn get(&self, key: Option<String>) -> Result<Value, String> {
        let settings = self.settings.read().map_err(|e| e.to_string())?;
        let value = serde_json::to_value(&*settings).map_err(|e| e.to_string())?;
        match key {
            Some(k) => Self::get_by_path(&value, &k),
            None => Ok(value),
        }
    }

    pub fn set(&self, key: String, value: Value) -> Result<(), String> {
        {
            let mut settings = self.settings.write().map_err(|e| e.to_string())?;
            let mut current = serde_json::to_value(&*settings).map_err(|e| e.to_string())?;
            Self::set_by_path(&mut current, &key, value)?;
            *settings = serde_json::from_value(current).map_err(|e| e.to_string())?;
        }
        self.save()
    }

    pub fn reset(&self, domain: Option<String>) -> Result<(), String> {
        {
            let mut settings = self.settings.write().map_err(|e| e.to_string())?;
            let defaults = Settings::default_settings();
            let mut current = serde_json::to_value(&*settings).map_err(|e| e.to_string())?;
            let default_value = serde_json::to_value(&defaults).map_err(|e| e.to_string())?;

            match domain {
                Some(domain_key) => {
                    if let (Value::Object(map), Value::Object(def_map)) = (&mut current, default_value)
                    {
                        if let Some(default_domain) = def_map.get(&domain_key) {
                            map.insert(domain_key, default_domain.clone());
                        }
                    }
                }
                None => current = default_value,
            }

            *settings = serde_json::from_value(current).map_err(|e| e.to_string())?;
        }
        self.save()
    }

    fn save(&self) -> Result<(), String> {
        let settings = self.settings.read().map_err(|e| e.to_string())?;
        let json = serde_json::to_string_pretty(&*settings).map_err(|e| e.to_string())?;
        let path = self.path.lock().map_err(|e| e.to_string())?;
        fs::write(&*path, json).map_err(|e| e.to_string())
    }

    fn get_by_path(value: &Value, path: &str) -> Result<Value, String> {
        let mut current = value;
        for part in path.split('.') {
            current = current
                .get(part)
                .ok_or_else(|| format!("setting path not found: {}", path))?;
        }
        Ok(current.clone())
    }

    fn set_by_path(value: &mut Value, path: &str, new_value: Value) -> Result<(), String> {
        let parts: Vec<&str> = path.split('.').collect();
        if parts.is_empty() {
            return Err("empty setting path".to_string());
        }

        let mut current = value;
        for (i, part) in parts.iter().enumerate() {
            if i == parts.len() - 1 {
                let map = current
                    .as_object_mut()
                    .ok_or_else(|| format!("cannot set on non-object path: {}", path))?;
                map.insert(part.to_string(), new_value);
                return Ok(());
            }
            current = current
                .get_mut(part)
                .ok_or_else(|| format!("setting path not found: {}", path))?;
        }
        Ok(())
    }
}

#[tauri::command]
pub fn settings_get(
    state: tauri::State<'_, SettingsManager>,
    key: Option<String>,
) -> Result<Value, String> {
    state.get(key)
}

#[tauri::command]
pub fn settings_set(
    state: tauri::State<'_, SettingsManager>,
    key: String,
    value: Value,
) -> Result<(), String> {
    state.set(key, value)
}

#[tauri::command]
pub fn settings_reset(
    state: tauri::State<'_, SettingsManager>,
    domain: Option<String>,
) -> Result<(), String> {
    state.reset(domain)
}
