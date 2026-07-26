import { Component, html, css } from "@youneed/dom";
import { ShadCard, ShadButton } from "@youneed/dom-ui-shad";
import { appearance, accounts, settings } from "../settings/index.ts";
import "./greet-form.ts";
import "./settings/settings-app.ts";
import "./os-sidebar.ts";
import "./apps/presentation/presentation-app.ts";

void ShadCard;
void ShadButton;

@Component.define()
export class OsApp extends Component("os-app") {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    .layout {
      display: flex;
      height: 100%;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
    }

    .header h2 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1.5rem;
      overflow-y: auto;
    }

    .app-content {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .greeting {
      text-align: center;
    }

    .greeting h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0;
    }

    .greeting p {
      color: hsl(var(--muted-foreground));
      margin-top: 0.5rem;
    }

    .app-placeholder {
      text-align: center;
      color: hsl(var(--muted-foreground));
    }
  `;

  @Component.prop() settingsOpen = false;
  @Component.prop() activeApp = "";
  @Component.prop() username = "";
  @Component.prop() avatar = "";

  connectedCallback() {
    super.connectedCallback();
    settings.load();
    appearance.watchTheme((theme) => {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        root.classList.toggle("dark", prefersDark);
      }
    });
    accounts.watchUsername((v) => (this.username = v));
    accounts.watchAvatar((v) => (this.avatar = v));
  }

  render() {
    if (this.settingsOpen) {
      return html`
        <settings-app @onClose=${() => (this.settingsOpen = false)}></settings-app>
      `;
    }

    return html`
      <div class="layout">
        <os-sidebar
          .activeApp=${this.activeApp}
          @onOpenApp=${(e: CustomEvent<string>) => (this.activeApp = e.detail)}
          @onOpenSettings=${() => (this.settingsOpen = true)}
        ></os-sidebar>
        <main class="main">
          ${this.activeApp
            ? html`
                <header class="header">
                  <h2>${this.appTitle(this.activeApp)}</h2>
                  <shad-button variant="outline" size="sm" @click=${() => (this.activeApp = "")}>
                    ← Home
                  </shad-button>
                </header>
                <div class="app-content">${this.renderApp()}</div>
              `
            : html`
                <div class="content">
                  <div class="greeting">
                    <h1>Welcome, ${this.username || "User"}</h1>
                    <p>Select an app from the dock to get started.</p>
                  </div>
                  <shad-card class="w-full max-w-md">
                    <h2 slot="title" class="text-lg font-semibold">
                      Quick greeting
                    </h2>
                    <p slot="description" class="text-muted-foreground">
                      Try the Tauri integration below.
                    </p>
                    <os-greet-form></os-greet-form>
                  </shad-card>
                </div>
              `}
        </main>
      </div>
    `;
  }

  private appTitle(appId: string): string {
    const titles: Record<string, string> = {
      files: "Files",
      browser: "Browser",
      terminal: "Terminal",
      calendar: "Calendar",
      music: "Music",
      photos: "Photos",
      presentations: "Presentations",
    };
    return titles[appId] ?? appId;
  }

  private renderApp() {
    if (this.activeApp === "presentations") {
      return html`<presentation-app></presentation-app>`;
    }

    return html`
      <div class="content app-placeholder">
        <h1 class="text-3xl font-bold mb-2">${this.activeApp}</h1>
        <p>This app is not installed yet.</p>
      </div>
    `;
  }
}
