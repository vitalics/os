import { Component, html, css } from "@youneed/dom";
import {
  ShadButton,
  ShadInput,
  ShadTextarea,
} from "@youneed/dom-ui-shad";
import PptxGenJS from "pptxgenjs";
import {
  type SlideElement,
  type PresentationSlide,
  type SlideElementType,
  type ResizeHandle,
  addSlide,
  deleteSlide,
  addElement,
  deleteElement,
  updateElement,
  moveElement,
  resizeElement,
  createElement,
} from "./slide-model";

void ShadButton;
void ShadInput;
void ShadTextarea;

const CANVAS_W = 720;
const CANVAS_H = 405;
const MIN_EL_W = 20;
const MIN_EL_H = 20;
const HANDLE_SIZE = 8;
const MAX_HISTORY = 100;

const RESIZE_HANDLES: ResizeHandle[] = [
  "nw", "n", "ne",
  "w",        "e",
  "sw", "s", "se",
];

function deepCloneSlides(slides: PresentationSlide[]): PresentationSlide[] {
  return JSON.parse(JSON.stringify(slides));
}

@Component.define()
export class PresentationApp extends Component("presentation-app") {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
    }

    .toolbar h2 {
      margin: 0;
      margin-right: auto;
      font-size: 1rem;
      font-weight: 600;
    }

    .toolbar .spacer {
      width: 1px;
      height: 1.25rem;
      background-color: hsl(var(--border));
      margin: 0 0.25rem;
    }

    .workspace {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .slides-panel {
      width: 180px;
      border-right: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
      padding: 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .slide-thumb {
      aspect-ratio: 16 / 9;
      border-radius: 0.375rem;
      border: 1px solid hsl(var(--border));
      background-color: hsl(var(--background));
      padding: 0.5rem;
      cursor: pointer;
      transition: border-color 0.15s;
      overflow: hidden;
      position: relative;
    }

    .slide-thumb:hover {
      border-color: hsl(var(--primary));
    }

    .slide-thumb.active {
      border-color: hsl(var(--primary));
      box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
    }

    .slide-thumb-number {
      font-size: 0.65rem;
      color: hsl(var(--muted-foreground));
      margin-bottom: 0.25rem;
    }

    .editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 1.5rem;
      gap: 1rem;
      overflow-y: auto;
    }

    .slide-canvas {
      width: 720px;
      height: 405px;
      background-color: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      position: relative;
      overflow: hidden;
      user-select: none;
    }

    .element {
      position: absolute;
      border: 1px solid transparent;
      padding: 0.25rem;
      cursor: grab;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
    }

    .element:hover {
      border-color: hsl(var(--primary) / 0.4);
    }

    .element.selected {
      border-color: hsl(var(--primary));
      cursor: grabbing;
    }

    .element-text {
      width: 100%;
      height: 100%;
      outline: none;
      background: transparent;
      border: none;
      color: inherit;
      font: inherit;
      resize: none;
      padding: 0;
    }

    .resize-handle {
      position: absolute;
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;
      background-color: hsl(var(--primary));
      border: 1px solid hsl(var(--background));
      border-radius: 9999px;
      z-index: 1;
    }

    .resize-handle.nw { top: -4px; left: -4px; cursor: nw-resize; }
    .resize-handle.n { top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.ne { top: -4px; right: -4px; cursor: ne-resize; }
    .resize-handle.e { top: 50%; right: -4px; transform: translateY(-50%); cursor: e-resize; }
    .resize-handle.se { bottom: -4px; right: -4px; cursor: se-resize; }
    .resize-handle.s { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.sw { bottom: -4px; left: -4px; cursor: sw-resize; }
    .resize-handle.w { top: 50%; left: -4px; transform: translateY(-50%); cursor: w-resize; }

    .properties {
      width: 220px;
      border-left: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
    }

    .properties h3 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .property-row {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .property-row label {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-top: 1px solid hsl(var(--border));
      background-color: hsl(var(--card));
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    }

    .empty-state {
      color: hsl(var(--muted-foreground));
      text-align: center;
      padding: 2rem;
    }
  `;

  @Component.prop() slides: PresentationSlide[] = [
    {
      id: "slide-1",
      elements: [
        createElement("heading", {
          x: 40,
          y: 120,
          w: 640,
          h: 60,
          text: "Presentation Title",
          fontSize: 44,
        }),
        createElement("text", {
          x: 40,
          y: 200,
          w: 640,
          h: 40,
          text: "Click elements to edit and drag to move",
          fontSize: 18,
        }),
      ],
    },
  ];
  @Component.prop() activeIndex = 0;
  @Component.prop() selectedElementId = "";

  private dragStart = { x: 0, y: 0, elX: 0, elY: 0 };
  private resizeStart = { x: 0, y: 0, element: null as SlideElement | null, handle: "" as ResizeHandle };
  private history: PresentationSlide[][] = [];
  private historyIndex = -1;

  connectedCallback() {
    super.connectedCallback();
    this.pushHistory();
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
      }
    };
    document.addEventListener("keydown", onKeyDown);
  }

  private get activeSlide(): PresentationSlide {
    return this.slides[this.activeIndex] ?? this.slides[0];
  }

  private get selectedElement(): SlideElement | undefined {
    return this.activeSlide.elements.find((e) => e.id === this.selectedElementId);
  }

  private get canUndo(): boolean {
    return this.historyIndex > 0;
  }

  private get canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  private pushHistory() {
    // Remove any redo states after the current index.
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(deepCloneSlides(this.slides));
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  private undo() {
    if (!this.canUndo) return;
    this.historyIndex--;
    this.slides = deepCloneSlides(this.history[this.historyIndex]);
    this.activeIndex = Math.min(this.activeIndex, this.slides.length - 1);
    this.selectedElementId = "";
  }

  private redo() {
    if (!this.canRedo) return;
    this.historyIndex++;
    this.slides = deepCloneSlides(this.history[this.historyIndex]);
    this.activeIndex = Math.min(this.activeIndex, this.slides.length - 1);
    this.selectedElementId = "";
  }

  private addSlide() {
    this.slides = addSlide(this.slides);
    this.activeIndex = this.slides.length - 1;
    this.selectedElementId = "";
    this.pushHistory();
  }

  private deleteSlide() {
    const { slides, nextIndex } = deleteSlide(this.slides, this.activeIndex);
    this.slides = slides;
    this.activeIndex = nextIndex;
    this.selectedElementId = "";
    this.pushHistory();
  }

  private addElement(type: SlideElementType) {
    const updated = addElement(this.activeSlide, type);
    this.slides = this.slides.map((slide, i) =>
      i === this.activeIndex ? updated : slide,
    );
    this.selectedElementId = updated.elements[updated.elements.length - 1].id;
    this.pushHistory();
  }

  private deleteElement() {
    if (!this.selectedElementId) return;
    this.slides = this.slides.map((slide, i) =>
      i === this.activeIndex
        ? deleteElement(slide, this.selectedElementId)
        : slide,
    );
    this.selectedElementId = "";
    this.pushHistory();
  }

  private updateActiveSlide(slide: PresentationSlide) {
    this.slides = this.slides.map((s, i) =>
      i === this.activeIndex ? slide : s,
    );
  }

  private updateElement(id: string, patch: Partial<SlideElement>) {
    this.updateActiveSlide(updateElement(this.activeSlide, id, patch));
    this.pushHistory();
  }

  private onElementPointerDown(e: PointerEvent, element: SlideElement) {
    e.preventDefault();
    this.selectedElementId = element.id;
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
    };
    const elNode = e.currentTarget as HTMLElement | null;
    if (elNode) elNode.style.willChange = "transform";
    let dx = 0;
    let dy = 0;

    const onMove = (ev: PointerEvent) => {
      dx = ev.clientX - this.dragStart.x;
      dy = ev.clientY - this.dragStart.y;
      if (elNode) {
        elNode.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    };

    const onUp = () => {
      if (elNode) {
        elNode.style.transform = "";
        elNode.style.willChange = "";
      }
      if (dx !== 0 || dy !== 0) {
        this.updateActiveSlide(
          moveElement(this.activeSlide, element.id, dx, dy, CANVAS_W, CANVAS_H),
        );
        this.pushHistory();
      }
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  }

  private onResizePointerDown(e: PointerEvent, element: SlideElement, handle: ResizeHandle) {
    e.preventDefault();
    e.stopPropagation();
    this.selectedElementId = element.id;
    this.resizeStart = {
      x: e.clientX,
      y: e.clientY,
      element,
      handle,
    };
    const handleNode = e.currentTarget as HTMLElement | null;
    const elNode = handleNode?.closest(".element") as HTMLElement | null;
    if (elNode) elNode.style.willChange = "width, height, transform";

    const onMove = (ev: PointerEvent) => {
      if (!this.resizeStart.element || !elNode) return;
      const dx = ev.clientX - this.resizeStart.x;
      const dy = ev.clientY - this.resizeStart.y;
      const updatedSlide = resizeElement(
        this.activeSlide,
        this.resizeStart.element.id,
        this.resizeStart.handle,
        dx,
        dy,
        MIN_EL_W,
        MIN_EL_H,
        CANVAS_W,
        CANVAS_H,
      );
      const updated = updatedSlide.elements.find((el) => el.id === element.id);
      if (updated) {
        elNode.style.left = `${updated.x}px`;
        elNode.style.top = `${updated.y}px`;
        elNode.style.width = `${updated.w}px`;
        elNode.style.height = `${updated.h}px`;
      }
    };

    const onUp = () => {
      this.resizeStart = { x: 0, y: 0, element: null, handle: "" as ResizeHandle };
      if (elNode) elNode.style.willChange = "";
      this.pushHistory();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  }

  private exportPptx() {
    const pptx = new PptxGenJS();
    for (const slide of this.slides) {
      const s = pptx.addSlide();
      for (const el of slide.elements) {
        if (el.type === "image") {
          if (el.text) {
            s.addImage({ path: el.text, x: el.x / 96, y: el.y / 96, w: el.w / 96, h: el.h / 96 });
          }
        } else {
          s.addText(el.text, {
            x: el.x / 96,
            y: el.y / 96,
            w: el.w / 96,
            h: el.h / 96,
            fontSize: el.fontSize,
            color: el.color ? el.color.replace("#", "") : undefined,
            bold: el.type === "heading",
          });
        }
      }
    }
    pptx.writeFile({ fileName: "presentation.pptx" });
  }

  private previous() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
    this.selectedElementId = "";
  }

  private next() {
    this.activeIndex = Math.min(this.slides.length - 1, this.activeIndex + 1);
    this.selectedElementId = "";
  }

  render() {
    const slide = this.activeSlide;
    const selected = this.selectedElement;

    return html`
      <div class="toolbar">
        <h2>Presentations</h2>
        <shad-button size="sm" @click=${() => this.addSlide()}>New slide</shad-button>
        <shad-button variant="outline" size="sm" @click=${() => this.deleteSlide()}>
          Delete slide
        </shad-button>
        <div class="spacer"></div>
        <shad-button variant="outline" size="sm" @click=${() => this.addElement("heading")}>
          + Heading
        </shad-button>
        <shad-button variant="outline" size="sm" @click=${() => this.addElement("text")}>
          + Text
        </shad-button>
        <shad-button variant="outline" size="sm" @click=${() => this.addElement("image")}>
          + Image
        </shad-button>
        <shad-button variant="outline" size="sm" @click=${() => this.deleteElement()}>
          Remove
        </shad-button>
        <div class="spacer"></div>
        <shad-button variant="outline" size="sm" @click=${() => this.undo()} .disabled=${!this.canUndo}>
          ↩ Undo
        </shad-button>
        <shad-button variant="outline" size="sm" @click=${() => this.redo()} .disabled=${!this.canRedo}>
          ↪ Redo
        </shad-button>
        <div class="spacer"></div>
        <shad-button variant="outline" size="sm" @click=${() => this.exportPptx()}>
          Export PPTX
        </shad-button>
      </div>

      <div class="workspace">
        <div class="slides-panel">
          ${this.slides.map(
            (s, i) => html`
              <div
                class=${"slide-thumb " + (i === this.activeIndex ? "active" : "")}
                @click=${() => {
                  this.activeIndex = i;
                  this.selectedElementId = "";
                }}
              >
                <div class="slide-thumb-number">Slide ${i + 1}</div>
                <div>${s.elements.length} element${s.elements.length === 1 ? "" : "s"}</div>
              </div>
            `,
          )}
        </div>

        <div class="editor">
          <div class="slide-canvas" @click=${(e: Event) => { if (e.target === e.currentTarget) this.selectedElementId = ""; }}>
            ${slide.elements.map((el) => this.renderElement(el))}
          </div>
        </div>

        <aside class="properties">
          <h3>Properties</h3>
          ${selected
            ? html`
                <div class="property-row">
                  <label>Type</label>
                  <span>${selected.type}</span>
                </div>
                <div class="property-row">
                  <label>Text</label>
                  <shad-textarea
                    .value=${selected.text}
                    @focusout=${(e: FocusEvent) => {
                      const target = e.currentTarget as HTMLTextAreaElement;
                      this.updateElement(selected.id, { text: target.value });
                    }}
                  ></shad-textarea>
                </div>
                ${selected.type !== "image"
                  ? html`
                      <div class="property-row">
                        <label>Font size</label>
                        <shad-input
                          type="number"
                          .value=${String(selected.fontSize)}
                          @focusout=${(e: FocusEvent) => {
                            const target = e.currentTarget as HTMLInputElement;
                            this.updateElement(selected.id, {
                              fontSize: parseInt(target.value, 10) || 16,
                            });
                          }}
                        ></shad-input>
                      </div>
                    `
                  : ""}
                <div class="property-row">
                  <label>Width</label>
                  <shad-input
                    type="number"
                    .value=${String(selected.w)}
                    @focusout=${(e: FocusEvent) => {
                      const target = e.currentTarget as HTMLInputElement;
                      this.updateElement(selected.id, { w: parseInt(target.value, 10) || 100 });
                    }}
                  ></shad-input>
                </div>
                <div class="property-row">
                  <label>Height</label>
                  <shad-input
                    type="number"
                    .value=${String(selected.h)}
                    @focusout=${(e: FocusEvent) => {
                      const target = e.currentTarget as HTMLInputElement;
                      this.updateElement(selected.id, { h: parseInt(target.value, 10) || 100 });
                    }}
                  ></shad-input>
                </div>
                <div class="property-row">
                  <label>X</label>
                  <shad-input
                    type="number"
                    .value=${String(selected.x)}
                    @focusout=${(e: FocusEvent) => {
                      const target = e.currentTarget as HTMLInputElement;
                      this.updateElement(selected.id, { x: parseInt(target.value, 10) || 0 });
                    }}
                  ></shad-input>
                </div>
                <div class="property-row">
                  <label>Y</label>
                  <shad-input
                    type="number"
                    .value=${String(selected.y)}
                    @focusout=${(e: FocusEvent) => {
                      const target = e.currentTarget as HTMLInputElement;
                      this.updateElement(selected.id, { y: parseInt(target.value, 10) || 0 });
                    }}
                  ></shad-input>
                </div>
              `
            : html`<div class="empty-state">Select an element to edit</div>`}
        </aside>
      </div>

      <div class="controls">
        <shad-button variant="outline" size="sm" @click=${() => this.previous()}>
          ← Prev
        </shad-button>
        <span>Slide ${this.activeIndex + 1} of ${this.slides.length}</span>
        <shad-button variant="outline" size="sm" @click=${() => this.next()}>
          Next →
        </shad-button>
      </div>
    `;
  }

  private renderElement(el: SlideElement) {
    const isImage = el.type === "image";
    const isSelected = el.id === this.selectedElementId;
    const style = {
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${el.w}px`,
      height: `${el.h}px`,
      fontSize: isImage ? undefined : `${el.fontSize}px`,
      color: el.color,
      backgroundColor: el.bg,
    };

    return html`
      <div
        class=${"element " + (isSelected ? "selected" : "")}
        style=${Object.entries(style)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${k}:${v}`)
          .join(";")}
        @pointerdown=${(e: PointerEvent) => this.onElementPointerDown(e, el)}
        @click=${(e: Event) => { this.selectedElementId = el.id; e.stopPropagation(); }}
      >
        ${isImage
          ? el.text
            ? html`<img src=${el.text} style="width:100%;height:100%;object-fit:cover;" />`
            : html`<div class="empty-state">Image URL</div>`
          : html`<textarea
              class="element-text"
              .value=${el.text}
              @change=${(e: Event) =>
                this.updateElement(el.id, {
                  text: (e.target as HTMLTextAreaElement).value,
                })}
            ></textarea>`}
        ${isSelected ? RESIZE_HANDLES.map((h) => html`<div class=${"resize-handle " + h} @pointerdown=${(e: PointerEvent) => this.onResizePointerDown(e, el, h)}></div>`) : ""}
      </div>
    `;
  }
}
