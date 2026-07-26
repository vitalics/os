import { Component, html } from "@youneed/dom";
import { ShadButton, ShadInput } from "@youneed/dom-ui-shad";
import { invoke } from "@tauri-apps/api/core";

// Imports register the shad custom elements as a side effect.
void ShadButton;
void ShadInput;

@Component.define()
export class OsGreetForm extends Component("os-greet-form") {
  @Component.prop() name = "";
  @Component.prop() message = "";

  @Component.event()
  async greet() {
    this.message = await invoke("greet", { name: this.name });
  }

  render() {
    return html`
      <div class="flex items-center justify-center gap-2 mt-4">
        <shad-input
          class="w-64"
          .value=${this.name}
          @input=${(e: CustomEvent<string>) => (this.name = e.detail)}
          placeholder="Enter a name..."
        ></shad-input>
        <shad-button @click=${this.greet}>Greet</shad-button>
      </div>
      <p class="text-center text-muted-foreground min-h-[1.5em] mt-2">
        ${this.message}
      </p>
    `;
  }
}
