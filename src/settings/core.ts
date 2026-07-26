import { signal, computed, effect, batch } from "@youneed/dom";
import type {
  SettingsSchema,
  SettingsDomain,
  SettingsPath,
  PathValue,
} from "./schema.ts";
import { defaultSettings } from "./schema.ts";
import { getSettings, setSettings, resetSettings } from "./commands.ts";

function getByPath<T>(obj: T, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function setByPath<T>(obj: T, path: string, value: unknown): T {
  const parts = path.split(".");
  const next = structuredClone(obj) as Record<string, unknown>;
  let current: Record<string, unknown> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = structuredClone(current[part]) as Record<string, unknown>;
    current = current[part] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
  return next as T;
}

function mergeDefaults(partial: Partial<SettingsSchema>): SettingsSchema {
  const merged = structuredClone(defaultSettings);
  for (const domain of Object.keys(defaultSettings) as SettingsDomain[]) {
    const incoming = partial[domain];
    if (incoming && typeof incoming === "object") {
      (merged[domain] as unknown as Record<string, unknown>) = {
        ...(merged[domain] as unknown as Record<string, unknown>),
        ...structuredClone(incoming),
      };
    }
  }
  return merged;
}

class SettingsClient {
  #state = signal<SettingsSchema>(structuredClone(defaultSettings));
  #loaded = signal(false);

  readonly state = this.#state;
  readonly loaded = this.#loaded;

  async load(): Promise<void> {
    const raw = (await getSettings()) as Partial<SettingsSchema> | undefined;
    const next = raw ? mergeDefaults(raw) : structuredClone(defaultSettings);
    batch(() => {
      this.#state.set(next as unknown as SettingsSchema);
      this.#loaded.set(true);
    });
  }

  get<K extends SettingsPath>(path: K): PathValue<SettingsSchema, K> {
    return getByPath(this.#state.value, path) as PathValue<SettingsSchema, K>;
  }

  async set<K extends SettingsPath>(
    path: K,
    value: PathValue<SettingsSchema, K>,
  ): Promise<void> {
    await setSettings(path, value);
    batch(() => {
      this.#state.set(setByPath(this.#state.value, path, value));
    });
  }

  async reset(domain?: SettingsDomain): Promise<void> {
    await resetSettings(domain);
    if (domain) {
      const next = structuredClone(this.#state.value) as unknown as Record<string, unknown>;
      next[domain] = structuredClone(
        defaultSettings[domain],
      );
      this.#state.set(next as unknown as SettingsSchema);
    } else {
      this.#state.set(structuredClone(defaultSettings));
    }
  }

  watch<K extends SettingsPath>(
    path: K,
    cb: (value: PathValue<SettingsSchema, K>) => void,
  ): () => void {
    const derived = computed(() => getByPath(this.#state.value, path));
    return effect(() => cb(derived.value as PathValue<SettingsSchema, K>));
  }

  watchDomain<D extends SettingsDomain>(
    domain: D,
    cb: (value: SettingsSchema[D]) => void,
  ): () => void {
    return this.watch(domain, cb as (value: PathValue<SettingsSchema, D>) => void);
  }
}

export const settings = new SettingsClient();
