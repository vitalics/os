import { Component, html } from "@youneed/dom";
import { ShadCard, ShadInput, ShadSwitch, ShadButton } from "@youneed/dom-ui-shad";
import { storage } from "../../settings/index.ts";

void ShadCard;
void ShadInput;
void ShadSwitch;
void ShadButton;

@Component.define()
export class StoragePanel extends Component("storage-panel") {
  @Component.prop() cacheSizeMb = 256;
  @Component.prop() autoCleanup = true;

  connectedCallback() {
    super.connectedCallback();
    storage.watchCacheSizeMb((v) => (this.cacheSizeMb = v));
    storage.watchAutoCleanup((v) => (this.autoCleanup = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Storage</h2>
        <p slot="description">Cache limits and cleanup preferences.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Cache size (MB)</label>
            <shad-input
              type="number"
              class="w-24"
              .value=${String(this.cacheSizeMb)}
              @input=${(e: CustomEvent<string>) =>
                storage.setCacheSizeMb(parseInt(e.detail, 10) || 0)}
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Auto cleanup</label>
            <shad-switch
              .checked=${this.autoCleanup}
              @change=${(e: CustomEvent<boolean>) =>
                storage.setAutoCleanup(e.detail)}
            ></shad-switch>
          </div>

          <div class="pt-2">
            <shad-button variant="outline" @click=${this.clearCache}>
              Clear cache now
            </shad-button>
          </div>
        </div>
      </shad-card>
    `;
  }

  private clearCache() {
    console.log("clear cache requested");
  }
}
