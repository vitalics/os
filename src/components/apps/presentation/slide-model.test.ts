import { describe, it, expect } from "vitest";
import {
  createSlide,
  createElement,
  addSlide,
  deleteSlide,
  addElement,
  deleteElement,
  updateElement,
  moveElement,
  resizeElement,
  uid,
} from "./slide-model";

describe("slide-model", () => {
  describe("uid", () => {
    it("returns a non-empty string", () => {
      const id = uid();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns unique values", () => {
      const ids = new Set(Array.from({ length: 100 }, uid));
      expect(ids.size).toBe(100);
    });
  });

  describe("createSlide", () => {
    it("creates a slide with empty elements", () => {
      const slide = createSlide("s1");
      expect(slide.id).toBe("s1");
      expect(slide.elements).toEqual([]);
    });

    it("generates an id when not provided", () => {
      const slide = createSlide();
      expect(slide.id).toBeTruthy();
      expect(slide.elements).toEqual([]);
    });
  });

  describe("createElement", () => {
    it("creates a heading element with defaults", () => {
      const el = createElement("heading");
      expect(el.type).toBe("heading");
      expect(el.w).toBe(640);
      expect(el.h).toBe(60);
      expect(el.text).toBe("Heading");
      expect(el.fontSize).toBe(32);
    });

    it("creates a text element with defaults", () => {
      const el = createElement("text");
      expect(el.type).toBe("text");
      expect(el.w).toBe(300);
      expect(el.h).toBe(80);
      expect(el.text).toBe("Text");
      expect(el.fontSize).toBe(16);
    });

    it("creates an image element with defaults", () => {
      const el = createElement("image");
      expect(el.type).toBe("image");
      expect(el.w).toBe(200);
      expect(el.h).toBe(200);
      expect(el.text).toBe("");
    });

    it("applies overrides", () => {
      const el = createElement("text", { text: "Hello", x: 100, fontSize: 24 });
      expect(el.text).toBe("Hello");
      expect(el.x).toBe(100);
      expect(el.fontSize).toBe(24);
      expect(el.type).toBe("text");
    });
  });

  describe("addSlide", () => {
    it("appends a new slide", () => {
      const slides = [createSlide("s1")];
      const next = addSlide(slides);
      expect(next.length).toBe(2);
      expect(next[0].id).toBe("s1");
      expect(next[1].elements).toEqual([]);
    });

    it("does not mutate the original array", () => {
      const slides = [createSlide("s1")];
      const next = addSlide(slides);
      expect(next).not.toBe(slides);
      expect(slides.length).toBe(1);
    });
  });

  describe("deleteSlide", () => {
    it("removes the slide at the given index", () => {
      const slides = [createSlide("s1"), createSlide("s2"), createSlide("s3")];
      const { slides: next, nextIndex } = deleteSlide(slides, 1);
      expect(next.map((s) => s.id)).toEqual(["s1", "s3"]);
      expect(nextIndex).toBe(1);
    });

    it("adjusts the index when deleting the last slide", () => {
      const slides = [createSlide("s1"), createSlide("s2")];
      const { slides: next, nextIndex } = deleteSlide(slides, 1);
      expect(next.map((s) => s.id)).toEqual(["s1"]);
      expect(nextIndex).toBe(0);
    });

    it("refuses to delete the only remaining slide", () => {
      const slides = [createSlide("s1")];
      const { slides: next, nextIndex } = deleteSlide(slides, 0);
      expect(next.map((s) => s.id)).toEqual(["s1"]);
      expect(nextIndex).toBe(0);
    });

    it("does not mutate the original array", () => {
      const slides = [createSlide("s1"), createSlide("s2")];
      const { slides: next } = deleteSlide(slides, 0);
      expect(next).not.toBe(slides);
      expect(slides.length).toBe(2);
    });
  });

  describe("addElement", () => {
    it("appends an element to the slide", () => {
      const slide = createSlide("s1");
      const next = addElement(slide, "heading");
      expect(next.elements.length).toBe(1);
      expect(next.elements[0].type).toBe("heading");
    });

    it("does not mutate the original slide", () => {
      const slide = createSlide("s1");
      const next = addElement(slide, "text");
      expect(next).not.toBe(slide);
      expect(next.elements).not.toBe(slide.elements);
      expect(slide.elements.length).toBe(0);
    });
  });

  describe("deleteElement", () => {
    it("removes the element with the given id", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [
          createElement("heading", { id: "h1" }),
          createElement("text", { id: "t1" }),
        ],
      };
      const next = deleteElement(slide, "h1");
      expect(next.elements.map((e) => e.id)).toEqual(["t1"]);
    });

    it("returns the same slide when id is not found", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("heading", { id: "h1" })],
      };
      const next = deleteElement(slide, "missing");
      expect(next.elements.length).toBe(1);
    });
  });

  describe("updateElement", () => {
    it("patches the target element", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [
          createElement("heading", { id: "h1", text: "Old" }),
          createElement("text", { id: "t1" }),
        ],
      };
      const next = updateElement(slide, "h1", { text: "New" });
      expect(next.elements[0].text).toBe("New");
      expect(next.elements[1]).toEqual(slide.elements[1]);
    });

    it("does not mutate other elements", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [
          createElement("heading", { id: "h1" }),
          createElement("text", { id: "t1" }),
        ],
      };
      const next = updateElement(slide, "h1", { x: 999 });
      expect(next.elements[1]).toEqual(slide.elements[1]);
      expect(next.elements[0]).not.toBe(slide.elements[0]);
    });
  });

  describe("moveElement", () => {
    it("adds the delta to the element position", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = moveElement(slide, "t1", 30, 20, 500, 500);
      expect(next.elements[0].x).toBe(80);
      expect(next.elements[0].y).toBe(70);
    });

    it("clamps to the canvas bounds", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = moveElement(slide, "t1", -1000, -1000, 500, 500);
      expect(next.elements[0].x).toBe(0);
      expect(next.elements[0].y).toBe(0);
    });

    it("clamps to the bottom-right corner", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = moveElement(slide, "t1", 1000, 1000, 500, 500);
      expect(next.elements[0].x).toBe(400);
      expect(next.elements[0].y).toBe(450);
    });

    it("does not move other elements", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [
          createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 }),
          createElement("heading", { id: "h1", x: 10, y: 10, w: 100, h: 50 }),
        ],
      };
      const next = moveElement(slide, "t1", 10, 10, 500, 500);
      expect(next.elements[1].x).toBe(10);
      expect(next.elements[1].y).toBe(10);
    });
  });
  describe("resizeElement", () => {
    it("resizes from the east handle", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "e", 40, 0, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 50, y: 50, w: 140, h: 50 });
    });

    it("resizes from the west handle and moves x", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 100, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "w", 40, 0, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 140, y: 50, w: 60, h: 50 });
    });

    it("resizes from the south handle", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "s", 0, 30, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 50, y: 50, w: 100, h: 80 });
    });

    it("resizes from the north handle and moves y", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 100, w: 100, h: 80 })],
      };
      const next = resizeElement(slide, "t1", "n", 0, 40, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 50, y: 140, w: 100, h: 40 });
    });

    it("resizes from the south-east corner", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "se", 30, 40, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 50, y: 50, w: 130, h: 90 });
    });

    it("resizes from the north-west corner and moves x/y", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 100, y: 100, w: 100, h: 80 })],
      };
      const next = resizeElement(slide, "t1", "nw", 40, 30, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 140, y: 130, w: 60, h: 50 });
    });

    it("enforces minimum size", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "e", -1000, 0, 30, 30, 500, 500);
      expect(next.elements[0].w).toBe(30);
    });

    it("clamps to canvas bounds", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "e", 1000, 0, 20, 20, 200, 200);
      expect(next.elements[0]).toMatchObject({ x: 50, y: 50, w: 150, h: 50 });
    });

    it("clamps west resize to zero", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 })],
      };
      const next = resizeElement(slide, "t1", "w", -1000, 0, 20, 20, 500, 500);
      expect(next.elements[0]).toMatchObject({ x: 0, y: 50, w: 150, h: 50 });
    });

    it("does not resize other elements", () => {
      const slide = {
        ...createSlide("s1"),
        elements: [
          createElement("text", { id: "t1", x: 50, y: 50, w: 100, h: 50 }),
          createElement("heading", { id: "h1", x: 10, y: 10, w: 100, h: 50 }),
        ],
      };
      const next = resizeElement(slide, "t1", "e", 40, 0, 20, 20, 500, 500);
      expect(next.elements[1]).toEqual(slide.elements[1]);
    });
  });
});
