import { Component, html } from "@youneed/dom";
import { ShadCard, ShadInput, ShadSwitch } from "@youneed/dom-ui-shad";
import { accounts } from "../../settings/index.ts";

void ShadCard;
void ShadInput;
void ShadSwitch;

@Component.define()
export class AccountsPanel extends Component("accounts-panel") {
  @Component.prop() username = "";
  @Component.prop() avatar = "";
  @Component.prop() autoLogin = false;

  connectedCallback() {
    super.connectedCallback();
    accounts.watchUsername((v) => (this.username = v));
    accounts.watchAvatar((v) => (this.avatar = v));
    accounts.watchAutoLogin((v) => (this.autoLogin = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Accounts</h2>
        <p slot="description">Current user profile and login preferences.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Username</label>
            <shad-input
              class="w-64"
              .value=${this.username}
              @input=${(e: CustomEvent<string>) =>
                accounts.setUsername(e.detail)}
              placeholder="Username"
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Avatar URL</label>
            <shad-input
              class="w-64"
              .value=${this.avatar}
              @input=${(e: CustomEvent<string>) => accounts.setAvatar(e.detail)}
              placeholder="/avatars/default.png"
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Auto login</label>
            <shad-switch
              .checked=${this.autoLogin}
              @change=${(e: CustomEvent<boolean>) =>
                accounts.setAutoLogin(e.detail)}
            ></shad-switch>
          </div>
        </div>
      </shad-card>
    `;
  }
}
