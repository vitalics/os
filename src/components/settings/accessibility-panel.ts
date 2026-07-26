import { Component, html } from "@youneed/dom";
import { ShadCard, ShadSwitch, ShadSlider } from "@youneed/dom-ui-shad";
import { accessibility } from "../../settings/index.ts";

void ShadCard;
void ShadSwitch;
void ShadSlider;

@Component.define()
export class AccessibilityPanel extends Component("accessibility-panel") {
  @Component.prop() reduceMotion = false;
  @Component.prop() highContrast = false;
  @Component.prop() fontScale = 1;

  connectedCallback() {
    super.connectedCallback();
    accessibility.watchReduceMotion((v) => (this.reduceMotion = v));
    accessibility.watchHighContrast((v) => (this.highContrast = v));
    accessibility.watchFontScale((v) => (this.fontScale = v));
  }

  render() {
    return html`
      <shad-card>
        <h2 slot="title" class="text-xl font-semibold">Accessibility</h2>
        <p slot="description">Motion, contrast and text size.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Reduce motion</label>
            <shad-switch
              .checked=${this.reduceMotion}
              @change=${(e: CustomEvent<boolean>) =>
                accessibility.setReduceMotion(e.detail)}
            ></shad-switch>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">High contrast</label>
            <shad-switch
              .checked=${this.highContrast}
              @change=${(e: CustomEvent<boolean>) =>
                accessibility.setHighContrast(e.detail)}
            ></shad-switch>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm font-medium">
              <label>Font scale</label>
              <span>${this.fontScale.toFixed(1)}x</span>
            </div>
            <shad-slider
              .value=${this.fontScale * 100}
              @change=${(e: CustomEvent<number>) =>
                accessibility.setFontScale(Math.round(e.detail) / 100)}
            ></shad-slider>
          </div>
        </div>
      </shad-card>
    `;
  }
}
