import { Component, html } from "@youneed/dom";
import { ShadCard, ShadInput, ShadSelect, ShadOption } from "@youneed/dom-ui-shad";
import { localization } from "../../settings/index.ts";

void ShadCard;
void ShadInput;
void ShadSelect;
void ShadOption;

const languages = ["en", "ru", "de", "fr", "es", "zh"];
const timeFormats: Array<"12h" | "24h"> = ["12h", "24h"];

@Component.define()
export class LocalizationPanel extends Component("localization-panel") {
  @Component.prop() language = "en";
  @Component.prop() timezone = "UTC";
  @Component.prop() dateFormat = "YYYY-MM-DD";
  @Component.prop() timeFormat: "12h" | "24h" = "24h";

  connectedCallback() {
    super.connectedCallback();
    localization.watchLanguage((v) => (this.language = v));
    localization.watchTimezone((v) => (this.timezone = v));
    localization.watchDateFormat((v) => (this.dateFormat = v));
    localization.watchTimeFormat((v) => (this.timeFormat = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Localization</h2>
        <p slot="description">Language, time zone and format preferences.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Language</label>
            <shad-select
              value=${this.language}
              @change=${(e: CustomEvent<string>) =>
                localization.setLanguage(e.detail)}
              class="w-40"
            >
              ${languages.map(
                (l) => html`<shad-option value=${l}>${l.toUpperCase()}</shad-option>`,
              )}
            </shad-select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Timezone</label>
            <shad-input
              class="w-64"
              .value=${this.timezone}
              @input=${(e: CustomEvent<string>) =>
                localization.setTimezone(e.detail)}
              placeholder="UTC"
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Date format</label>
            <shad-input
              class="w-64"
              .value=${this.dateFormat}
              @input=${(e: CustomEvent<string>) =>
                localization.setDateFormat(e.detail)}
              placeholder="YYYY-MM-DD"
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Time format</label>
            <shad-select
              value=${this.timeFormat}
              @change=${(e: CustomEvent<"12h" | "24h">) =>
                localization.setTimeFormat(e.detail)}
              class="w-40"
            >
              ${timeFormats.map(
                (f) => html`<shad-option value=${f}>${f}</shad-option>`,
              )}
            </shad-select>
          </div>
        </div>
      </shad-card>
    `;
  }
}
