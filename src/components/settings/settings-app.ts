import { Component, html, css } from "@youneed/dom";
import { ShadButton } from "@youneed/dom-ui-shad";
import { settings } from "../../settings/index.ts";
import type { SettingsSection } from "./settings-sidebar.ts";
import "./settings-sidebar.ts";
import "./appearance-panel.ts";
import "./localization-panel.ts";
import "./notifications-panel.ts";
import "./privacy-panel.ts";
import "./network-panel.ts";
import "./storage-panel.ts";
import "./accessibility-panel.ts";
import "./accounts-panel.ts";

void ShadButton;

@Component.define()
export class SettingsApp extends Component("settings-app") {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 50;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    .layout {
      display: flex;
      height: 100%;
    }

    .content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
  `;

  @Component.prop({ attribute: true }) section: SettingsSection = "appearance";
  @Component.event() onClose!: () => void;

  connectedCallback() {
    super.connectedCallback();
    settings.load();
  }

  render() {
    return html`
      <div class="layout">
        <settings-sidebar
          .active=${this.section}
          @onSelect=${(e: CustomEvent<SettingsSection>) =>
            (this.section = e.detail)}
        ></settings-sidebar>
        <div class="content">
          <div class="header">
            <h1 class="text-2xl font-semibold">Settings</h1>
            <shad-button variant="outline" @click=${() => this.onClose()}>Close</shad-button>
          </div>
          ${this.renderPanel()}
        </div>
      </div>
    `;
  }

  private renderPanel() {
    switch (this.section) {
      case "appearance":
        return html`<appearance-panel></appearance-panel>`;
      case "localization":
        return html`<localization-panel></localization-panel>`;
      case "notifications":
        return html`<notifications-panel></notifications-panel>`;
      case "privacy":
        return html`<privacy-panel></privacy-panel>`;
      case "network":
        return html`<network-panel></network-panel>`;
      case "storage":
        return html`<storage-panel></storage-panel>`;
      case "accessibility":
        return html`<accessibility-panel></accessibility-panel>`;
      case "accounts":
        return html`<accounts-panel></accounts-panel>`;
      default:
        return html`<appearance-panel></appearance-panel>`;
    }
  }

}
