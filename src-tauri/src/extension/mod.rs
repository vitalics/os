pub struct Extension {
    settings: ExtensionSettings,
}

pub struct ExtensionSettings {
    port: u16,
    host: String,
    name: String,
}
