import { Component, html } from "@youneed/dom";
import { ShadCard, ShadSwitch } from "@youneed/dom-ui-shad";
import { privacy } from "../../settings/index.ts";

void ShadCard;
void ShadSwitch;

@Component.define()
export class PrivacyPanel extends Component("privacy-panel") {
  @Component.prop() telemetry = false;
  @Component.prop() crashReports = true;
  @Component.prop() location = false;
  @Component.prop() microphone = false;
  @Component.prop() camera = false;

  connectedCallback() {
    super.connectedCallback();
    privacy.watchTelemetry((v) => (this.telemetry = v));
    privacy.watchCrashReports((v) => (this.crashReports = v));
    privacy.watchLocation((v) => (this.location = v));
    privacy.watchMicrophone((v) => (this.microphone = v));
    privacy.watchCamera((v) => (this.camera = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Privacy</h2>
        <p slot="description">Manage permissions and data sharing.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Telemetry</label>
            <shad-switch
              .checked=${this.telemetry}
              @change=${(e: CustomEvent<boolean>) =>
                privacy.setTelemetry(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Crash reports</label>
            <shad-switch
              .checked=${this.crashReports}
              @change=${(e: CustomEvent<boolean>) =>
                privacy.setCrashReports(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Location access</label>
            <shad-switch
              .checked=${this.location}
              @change=${(e: CustomEvent<boolean>) =>
                privacy.setLocation(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Microphone access</label>
            <shad-switch
              .checked=${this.microphone}
              @change=${(e: CustomEvent<boolean>) =>
                privacy.setMicrophone(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Camera access</label>
            <shad-switch
              .checked=${this.camera}
              @change=${(e: CustomEvent<boolean>) =>
                privacy.setCamera(e.detail)}
            ></shad-switch>
          </div>
        </div>
      </shad-card>
    `;
  }
}
