import { Component, html } from "@youneed/dom";
import { ShadCard, ShadInput, ShadSwitch } from "@youneed/dom-ui-shad";
import { network } from "../../settings/index.ts";

void ShadCard;
void ShadInput;
void ShadSwitch;

@Component.define()
export class NetworkPanel extends Component("network-panel") {
  @Component.prop() proxyEnabled = false;
  @Component.prop() proxyHost = "";
  @Component.prop() proxyPort = 8080;
  @Component.prop() metered = false;

  connectedCallback() {
    super.connectedCallback();
    network.watchProxyEnabled((v) => (this.proxyEnabled = v));
    network.watchProxyHost((v) => (this.proxyHost = v));
    network.watchProxyPort((v) => (this.proxyPort = v));
    network.watchMetered((v) => (this.metered = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Network</h2>
        <p slot="description">Proxy and connection preferences.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Use proxy</label>
            <shad-switch
              .checked=${this.proxyEnabled}
              @change=${(e: CustomEvent<boolean>) =>
                network.setProxyEnabled(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Proxy host</label>
            <shad-input
              class="w-64"
              .value=${this.proxyHost}
              @input=${(e: CustomEvent<string>) =>
                network.setProxyHost(e.detail)}
              placeholder="proxy.example.com"
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Proxy port</label>
            <shad-input
              type="number"
              class="w-24"
              .value=${String(this.proxyPort)}
              @input=${(e: CustomEvent<string>) =>
                network.setProxyPort(parseInt(e.detail, 10) || 0)}
            ></shad-input>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Metered connection</label>
            <shad-switch
              .checked=${this.metered}
              @change=${(e: CustomEvent<boolean>) =>
                network.setMetered(e.detail)}
            ></shad-switch>
          </div>
        </div>
      </shad-card>
    `;
  }
}
