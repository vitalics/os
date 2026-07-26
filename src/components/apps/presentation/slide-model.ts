export type SlideElementType = "heading" | "text" | "image";

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export interface SlideElement {
  id: string;
  type: SlideElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fontSize: number;
  color?: string;
  bg?: string;
}

export interface PresentationSlide {
  id: string;
  elements: SlideElement[];
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function createSlide(id = uid()): PresentationSlide {
  return { id, elements: [] };
}

export function createElement(
  type: SlideElementType,
  overrides: Partial<SlideElement> = {},
): SlideElement {
  return {
    id: uid(),
    type,
    x: 40,
    y: 40,
    w: type === "heading" ? 640 : type === "image" ? 200 : 300,
    h: type === "heading" ? 60 : type === "image" ? 200 : 80,
    text: type === "image" ? "" : type === "heading" ? "Heading" : "Text",
    fontSize: type === "heading" ? 32 : 16,
    ...overrides,
  };
}

export function addSlide(slides: PresentationSlide[]): PresentationSlide[] {
  return [...slides, createSlide()];
}

export function deleteSlide(
  slides: PresentationSlide[],
  index: number,
): { slides: PresentationSlide[]; nextIndex: number } {
  if (slides.length <= 1) return { slides, nextIndex: index };
  const next = slides.filter((_, i) => i !== index);
  return { slides: next, nextIndex: Math.min(index, next.length - 1) };
}

export function addElement(
  slide: PresentationSlide,
  type: SlideElementType,
): PresentationSlide {
  return {
    ...slide,
    elements: [...slide.elements, createElement(type)],
  };
}

export function deleteElement(
  slide: PresentationSlide,
  elementId: string,
): PresentationSlide {
  return {
    ...slide,
    elements: slide.elements.filter((e) => e.id !== elementId),
  };
}

export function updateElement(
  slide: PresentationSlide,
  elementId: string,
  patch: Partial<SlideElement>,
): PresentationSlide {
  return {
    ...slide,
    elements: slide.elements.map((e) =>
      e.id === elementId ? { ...e, ...patch } : e,
    ),
  };
}

export function moveElement(
  slide: PresentationSlide,
  elementId: string,
  dx: number,
  dy: number,
  canvasW: number,
  canvasH: number,
): PresentationSlide {
  return {
    ...slide,
    elements: slide.elements.map((e) => {
      if (e.id !== elementId) return e;
      return {
        ...e,
        x: Math.max(0, Math.min(canvasW - e.w, e.x + dx)),
        y: Math.max(0, Math.min(canvasH - e.h, e.y + dy)),
      };
    }),
  };
}

export function resizeElement(
  slide: PresentationSlide,
  elementId: string,
  handle: ResizeHandle,
  dx: number,
  dy: number,
  minW: number,
  minH: number,
  canvasW: number,
  canvasH: number,
): PresentationSlide {
  return {
    ...slide,
    elements: slide.elements.map((e) => {
      if (e.id !== elementId) return e;
      let { x, y, w, h } = e;
      const right = x + w;
      const bottom = y + h;

      if (handle.includes("e")) {
        const newRight = Math.min(canvasW, Math.max(x + minW, right + dx));
        w = newRight - x;
      }
      if (handle.includes("w")) {
        const newLeft = Math.max(0, Math.min(right - minW, x + dx));
        x = newLeft;
        w = right - newLeft;
      }
      if (handle.includes("s")) {
        const newBottom = Math.min(canvasH, Math.max(y + minH, bottom + dy));
        h = newBottom - y;
      }
      if (handle.includes("n")) {
        const newTop = Math.max(0, Math.min(bottom - minH, y + dy));
        y = newTop;
        h = bottom - newTop;
      }

      return { ...e, x, y, w, h };
    }),
  };
}
