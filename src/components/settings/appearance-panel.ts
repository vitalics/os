import { Component, html } from "@youneed/dom";
import { ShadCard, ShadInput, ShadSelect, ShadOption, ShadSwitch } from "@youneed/dom-ui-shad";
import { appearance, type Theme, type AccentColor } from "../../settings/index.ts";

void ShadCard;
void ShadInput;
void ShadSelect;
void ShadOption;
void ShadSwitch;

const themes: Theme[] = ["light", "dark", "system"];
const accents: AccentColor[] = [
  "slate", "red", "orange", "amber", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet",
  "purple", "fuchsia", "pink", "rose",
];

@Component.define()
export class AppearancePanel extends Component("appearance-panel") {
  @Component.prop() theme: Theme = "system";
  @Component.prop() accentColor: AccentColor = "blue";
  @Component.prop() wallpaper = "";
  @Component.prop() reduceTransparency = false;

  connectedCallback() {
    super.connectedCallback();
    appearance.watchTheme((theme) => (this.theme = theme));
    appearance.watchAccentColor((color) => (this.accentColor = color));
    appearance.watchWallpaper((wallpaper) => (this.wallpaper = wallpaper));
    appearance.watchReduceTransparency(
      (value) => (this.reduceTransparency = value),
    );
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Appearance</h2>
        <p slot="description">Customize the look and feel of your OS.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Theme</label>
            <shad-select
              value=${this.theme}
              @change=${(e: CustomEvent<Theme>) =>
                appearance.setTheme(e.detail)}
              class="w-40"
            >
              ${themes.map(
                (t) =>
                  html`<shad-option value=${t}>${this.capitalize(t)}</shad-option>`,
              )}
            </shad-select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Accent color</label>
            <shad-select
              value=${this.accentColor}
              @change=${(e: CustomEvent<AccentColor>) =>
                appearance.setAccentColor(e.detail)}
              class="w-40"
            >
              ${accents.map(
                (a) =>
                  html`<shad-option value=${a}>${this.capitalize(a)}</shad-option>`,
              )}
            </shad-select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Wallpaper URL</label>
            <shad-input
              class="w-64"
              .value=${this.wallpaper}
              @input=${(e: CustomEvent<string>) =>
                appearance.setWallpaper(e.detail)}
              placeholder="/wallpapers/default.jpg"
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Reduce transparency</label>
            <shad-switch
              .checked=${this.reduceTransparency}
              @change=${(e: CustomEvent<boolean>) =>
                appearance.setReduceTransparency(e.detail)}
            ></shad-switch>
          </div>
        </div>
      </shad-card>
    `;
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
