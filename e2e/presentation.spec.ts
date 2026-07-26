import { test, expect } from "@playwright/test";

test.describe("Presentation app", () => {
  test.beforeEach(async ({ page }) => {

    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    (page as any).__presentationErrors = errors;

    await page.goto("/");
    await page.locator("os-sidebar .app-button", { hasText: "Slides" }).click();
    await expect(page.locator("presentation-app")).toBeVisible();
  });

  test("loads the default slide with two elements", async ({ page }) => {

    const templateErrors = ((page as any).__presentationErrors as string[]).filter(
      (msg) => msg.includes("InvalidCharacterError") || msg.includes("?")
    );
    expect(templateErrors).toHaveLength(0);

    await expect(page.locator(".slide-canvas .element")).toHaveCount(2);
    await expect(page.locator(".properties")).toContainText(
      "Select an element to edit",
    );
  });

  test("selects an element and shows its properties", async ({ page }) => {
    const firstElement = page.locator(".slide-canvas .element").first();
    await firstElement.click();
    await expect(firstElement).toHaveClass(/selected/);
    await expect(page.locator(".properties")).not.toContainText(
      "Select an element to edit",
    );
    await expect(page.locator(".properties")).toContainText("Type");
  });

  test("deselects when clicking the canvas background", async ({ page }) => {
    const firstElement = page.locator(".slide-canvas .element").first();
    await firstElement.click();
    await expect(firstElement).toHaveClass(/selected/);

    // Click the canvas background, not the element.
    const canvas = page.locator(".slide-canvas");
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.click(box!.x + box!.width - 10, box!.y + box!.height - 10);

    await expect(firstElement).not.toHaveClass(/selected/);
    await expect(page.locator(".properties")).toContainText(
      "Select an element to edit",
    );
  });

  test("keeps selection when clicking the selected element (regression)", async ({ page }) => {
    const firstElement = page.locator(".slide-canvas .element").first();
    await firstElement.click();
    await expect(firstElement).toHaveClass(/selected/);

    // Re-click the same element; selection should remain.
    await firstElement.click();
    await expect(firstElement).toHaveClass(/selected/);
    await expect(page.locator(".properties")).not.toContainText(
      "Select an element to edit",
    );
  });

  test("updates element position via property input", async ({ page }) => {
    const element = page.locator(".slide-canvas .element").first();
    await element.click();
    await expect(element).toHaveClass(/selected/);

    const xInput = page.locator(".properties shad-input").nth(3);
    await xInput.fill("200");
    await xInput.evaluate((el: HTMLElement) => el.dispatchEvent(new FocusEvent("focusout", { bubbles: true })));

    const newBox = await element.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.x).toBe(200);
  });

  test("adds and removes a slide", async ({ page }) => {
    await expect(page.locator(".slide-thumb")).toHaveCount(1);
    await page.locator("shad-button", { hasText: "New slide" }).click();
    await expect(page.locator(".slide-thumb")).toHaveCount(2);

    await page.locator("shad-button", { hasText: "Delete slide" }).click();
    await expect(page.locator(".slide-thumb")).toHaveCount(1);
  });

  test("adds and removes an element", async ({ page }) => {
    await page.locator("shad-button", { hasText: "+ Text" }).click();
    await expect(page.locator(".slide-canvas .element")).toHaveCount(3);

    const lastElement = page.locator(".slide-canvas .element").last();
    await lastElement.click();
    await expect(lastElement).toHaveClass(/selected/);

    await page.locator("shad-button", { hasText: "Remove" }).click();
    await expect(page.locator(".slide-canvas .element")).toHaveCount(2);
  });

  test("drags an element to a new position", async ({ page }) => {
    const element = page.locator(".slide-canvas .element").first();
    await element.click();
    await expect(element).toHaveClass(/selected/);

    const box = await element.boundingBox();
    expect(box).toBeTruthy();
    const startX = box!.x;
    const startY = box!.y;

    // Drag the element by its center.
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 60, box!.y + box!.height / 2 + 40);
    await page.mouse.up();

    const newBox = await element.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.x).toBeGreaterThan(startX);
    expect(newBox!.y).toBeGreaterThan(startY);
  });

  test("resizes an element via the south-east handle", async ({ page }) => {
    const element = page.locator(".slide-canvas .element").first();
    await element.click();
    await expect(element).toHaveClass(/selected/);

    const handle = element.locator(".resize-handle.se");
    await expect(handle).toBeVisible();

    const box = await element.boundingBox();
    const handleBox = await handle.boundingBox();
    expect(box).toBeTruthy();
    expect(handleBox).toBeTruthy();

    const startW = box!.width;
    const startH = box!.height;

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 50, handleBox!.y + handleBox!.height / 2 + 30);
    await page.mouse.up();

    const newBox = await element.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.width).toBeGreaterThan(startW);
    expect(newBox!.height).toBeGreaterThan(startH);
  });

  test("undoes and redoes adding a slide", async ({ page }) => {
    await expect(page.locator(".slide-thumb")).toHaveCount(1);

    await page.locator("shad-button", { hasText: "New slide" }).click();
    await expect(page.locator(".slide-thumb")).toHaveCount(2);

    await page.locator("shad-button", { hasText: "Undo" }).click();
    await expect(page.locator(".slide-thumb")).toHaveCount(1);

    await page.locator("shad-button", { hasText: "Redo" }).click();
    await expect(page.locator(".slide-thumb")).toHaveCount(2);
  });

  test("undoes deleting an element via keyboard shortcut", async ({ page }) => {
    await expect(page.locator(".slide-canvas .element")).toHaveCount(2);

    const firstElement = page.locator(".slide-canvas .element").first();
    await firstElement.click();
    await expect(firstElement).toHaveClass(/selected/);

    await page.locator("shad-button", { hasText: "Remove" }).click();
    await expect(page.locator(".slide-canvas .element")).toHaveCount(1);

    await page.keyboard.press("Control+z");
    await expect(page.locator(".slide-canvas .element")).toHaveCount(2);
  });
});
