import { Component, html, css } from "@youneed/dom";
import { ShadButton } from "@youneed/dom-ui-shad";

void ShadButton;

export interface OsAppItem {
  id: string;
  name: string;
  icon: string;
}

const apps: OsAppItem[] = [
  { id: "files", name: "Files", icon: "📁" },
  { id: "browser", name: "Browser", icon: "🌐" },
  { id: "terminal", name: "Terminal", icon: "⌨️" },
  { id: "calendar", name: "Calendar", icon: "📅" },
  { id: "music", name: "Music", icon: "🎵" },
  { id: "photos", name: "Photos", icon: "🖼️" },
  { id: "presentations", name: "Slides", icon: "📊" },
];

@Component.define()
export class OsSidebar extends Component("os-sidebar") {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 72px;
      height: 100%;
      background-color: hsl(var(--card));
      border-right: 1px solid hsl(var(--border));
      padding: 0.75rem 0.5rem;
      box-sizing: border-box;
    }

    .apps {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .app-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 0.75rem;
      border: none;
      background: transparent;
      color: hsl(var(--card-foreground));
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .app-button:hover {
      background-color: hsl(var(--accent));
    }

    .app-button.active {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }

    .app-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .app-name {
      font-size: 0.65rem;
      font-weight: 500;
    }

    .footer {
      margin-top: auto;
      padding-top: 0.5rem;
      border-top: 1px solid hsl(var(--border));
    }

    .settings-button {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 0.75rem;
      border: none;
      background: transparent;
      color: hsl(var(--card-foreground));
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      transition: background-color 0.15s;
    }

    .settings-button:hover {
      background-color: hsl(var(--accent));
    }
  `;

  @Component.prop({ attribute: true }) activeApp = "";
  @Component.event() onOpenApp!: (appId: string) => void;
  @Component.event() onOpenSettings!: () => void;

  render() {
    return html`
      <div class="apps">
        ${apps.map(
          (app) => html`
            <button
              class="app-button"
              class=${"app-button " + (app.id === this.activeApp ? "active" : "")}
              @click=${() => this.onOpenApp(app.id)}
            >
              <span class="app-icon">${app.icon}</span>
              <span class="app-name">${app.name}</span>
            </button>
          `,
        )}
      </div>
      <div class="footer">
        <button class="settings-button" @click=${() => this.onOpenSettings()}>
          <span class="app-icon">⚙️</span>
          <span class="app-name">Settings</span>
        </button>
      </div>
    `;
  }
}
