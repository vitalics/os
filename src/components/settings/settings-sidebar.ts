import { Component, html, css } from "@youneed/dom";

export type SettingsSection =
  | "appearance"
  | "localization"
  | "notifications"
  | "privacy"
  | "network"
  | "storage"
  | "accessibility"
  | "accounts";

const sections: { id: SettingsSection; label: string; icon: string }[] = [
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "localization", label: "Localization", icon: "🌐" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "privacy", label: "Privacy", icon: "🔒" },
  { id: "network", label: "Network", icon: "🌐" },
  { id: "storage", label: "Storage", icon: "💾" },
  { id: "accessibility", label: "Accessibility", icon: "♿" },
  { id: "accounts", label: "Accounts", icon: "👤" },
];

@Component.define()
export class SettingsSidebar extends Component("settings-sidebar") {
  static styles = css`
    :host {
      display: block;
      width: 220px;
      border-right: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      border: none;
      background: transparent;
      color: hsl(var(--card-foreground));
      font-size: 0.875rem;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.15s;
    }

    button:hover {
      background-color: hsl(var(--accent));
    }

    button[active] {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
      font-weight: 500;
    }
  `;

  @Component.prop({ attribute: true }) active: SettingsSection = "appearance";
  @Component.event() onSelect!: (section: SettingsSection) => void;

  render() {
    return html`
      <nav>
        ${sections.map(
          (s) => html`
            <button
              ?active=${s.id === this.active}
              @click=${() => this.onSelect(s.id)}
            >
              <span>${s.icon}</span>
              <span>${s.label}</span>
            </button>
          `,
        )}
      </nav>
    `;
  }
}
