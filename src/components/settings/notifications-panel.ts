import { Component, html } from "@youneed/dom";
import { ShadCard, ShadSwitch, ShadSelect, ShadOption } from "@youneed/dom-ui-shad";
import { notifications, type NotificationsSettings } from "../../settings/index.ts";

void ShadCard;
void ShadSwitch;
void ShadSelect;
void ShadOption;

const previews: NotificationsSettings["preview"][] = [
  "always",
  "whenUnlocked",
  "never",
];

@Component.define()
export class NotificationsPanel extends Component("notifications-panel") {
  @Component.prop() doNotDisturb = false;
  @Component.prop() sounds = true;
  @Component.prop() badges = true;
  @Component.prop() preview: NotificationsSettings["preview"] = "whenUnlocked";

  connectedCallback() {
    super.connectedCallback();
    notifications.watchDoNotDisturb((v) => (this.doNotDisturb = v));
    notifications.watchSounds((v) => (this.sounds = v));
    notifications.watchBadges((v) => (this.badges = v));
    notifications.watchPreview((v) => (this.preview = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Notifications</h2>
        <p slot="description">Control alerts, sounds and previews.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Do not disturb</label>
            <shad-switch
              .checked=${this.doNotDisturb}
              @change=${(e: CustomEvent<boolean>) =>
                notifications.setDoNotDisturb(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Sounds</label>
            <shad-switch
              .checked=${this.sounds}
              @change=${(e: CustomEvent<boolean>) =>
                notifications.setSounds(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Badges</label>
            <shad-switch
              .checked=${this.badges}
              @change=${(e: CustomEvent<boolean>) =>
                notifications.setBadges(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Preview</label>
            <shad-select
              value=${this.preview}
              @change=${(e: CustomEvent<NotificationsSettings["preview"]>) =>
                notifications.setPreview(e.detail)}
              class="w-48"
            >
              ${previews.map(
                (p) =>
                  html`<shad-option value=${p}>${this.label(p)}</shad-option>`,
              )}
            </shad-select>
          </div>
        </div>
      </shad-card>
    `;
  }

  private label(value: string) {
    return value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  }
}
