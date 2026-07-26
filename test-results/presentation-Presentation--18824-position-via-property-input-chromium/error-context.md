# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: presentation.spec.ts >> Presentation app >> updates element position via property input
- Location: e2e/presentation.spec.ts:71:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.properties shad-input').nth(3)
    - locator resolved to <shad-input type="number"></shad-input>
    - fill("200")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    56 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - button "📁 Files" [ref=e6] [cursor=pointer]:
        - generic [ref=e7]: 📁
        - generic [ref=e8]: Files
      - button "🌐 Browser" [ref=e9] [cursor=pointer]:
        - generic [ref=e10]: 🌐
        - generic [ref=e11]: Browser
      - button "⌨️ Terminal" [ref=e12] [cursor=pointer]:
        - generic [ref=e13]: ⌨️
        - generic [ref=e14]: Terminal
      - button "📅 Calendar" [ref=e15] [cursor=pointer]:
        - generic [ref=e16]: 📅
        - generic [ref=e17]: Calendar
      - button "🎵 Music" [ref=e18] [cursor=pointer]:
        - generic [ref=e19]: 🎵
        - generic [ref=e20]: Music
      - button "🖼️ Photos" [ref=e21] [cursor=pointer]:
        - generic [ref=e22]: 🖼️
        - generic [ref=e23]: Photos
      - button "📊 Slides" [ref=e24] [cursor=pointer]:
        - generic [ref=e25]: 📊
        - generic [ref=e26]: Slides
    - button "⚙️ Settings" [ref=e28] [cursor=pointer]:
      - generic [ref=e29]: ⚙️
      - generic [ref=e30]: Settings
  - main [ref=e31]:
    - generic [ref=e32]:
      - heading "Presentations" [level=2] [ref=e33]
      - generic [ref=e34]: ← Home
    - generic [ref=e36]:
      - generic [ref=e37]:
        - heading "Presentations" [level=2] [ref=e38]
        - generic [ref=e39]: New slide
        - generic [ref=e40]: Delete slide
        - generic [ref=e42]: + Heading
        - generic [ref=e43]: + Text
        - generic [ref=e44]: + Image
        - generic [ref=e45]: Remove
        - generic [ref=e47]: ↩ Undo
        - generic [ref=e48]: ↪ Redo
        - generic [ref=e50]: Export PPTX
      - generic [ref=e51]:
        - generic [ref=e53] [cursor=pointer]:
          - generic [ref=e54]: Slide 1
          - generic [ref=e55]: 2 elements
        - generic [ref=e57]:
          - textbox [ref=e59]: Presentation Title
          - textbox [ref=e69]: Click elements to edit and drag to move
        - complementary [ref=e70]:
          - heading "Properties" [level=3] [ref=e71]
          - generic [ref=e72]:
            - generic [ref=e73]: Type
            - generic [ref=e74]: heading
          - generic [ref=e75]: Text
          - generic [ref=e77]: Font size
          - generic [ref=e79]: Width
          - generic [ref=e81]: Height
          - generic [ref=e83]: X
          - generic [ref=e85]: "Y"
      - generic [ref=e87]:
        - generic [ref=e88]: ← Prev
        - generic [ref=e89]: Slide 1 of 1
        - generic [ref=e90]: Next →
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Presentation app", () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   | 
  6   |     const errors: string[] = [];
  7   |     page.on("pageerror", (err) => errors.push(err.message));
  8   |     page.on("console", (msg) => {
  9   |       if (msg.type() === "error") errors.push(msg.text());
  10  |     });
  11  |     (page as any).__presentationErrors = errors;
  12  | 
  13  |     await page.goto("/");
  14  |     await page.locator("os-sidebar .app-button", { hasText: "Slides" }).click();
  15  |     await expect(page.locator("presentation-app")).toBeVisible();
  16  |   });
  17  | 
  18  |   test("loads the default slide with two elements", async ({ page }) => {
  19  | 
  20  |     const templateErrors = ((page as any).__presentationErrors as string[]).filter(
  21  |       (msg) => msg.includes("InvalidCharacterError") || msg.includes("?")
  22  |     );
  23  |     expect(templateErrors).toHaveLength(0);
  24  | 
  25  |     await expect(page.locator(".slide-canvas .element")).toHaveCount(2);
  26  |     await expect(page.locator(".properties")).toContainText(
  27  |       "Select an element to edit",
  28  |     );
  29  |   });
  30  | 
  31  |   test("selects an element and shows its properties", async ({ page }) => {
  32  |     const firstElement = page.locator(".slide-canvas .element").first();
  33  |     await firstElement.click();
  34  |     await expect(firstElement).toHaveClass(/selected/);
  35  |     await expect(page.locator(".properties")).not.toContainText(
  36  |       "Select an element to edit",
  37  |     );
  38  |     await expect(page.locator(".properties")).toContainText("Type");
  39  |   });
  40  | 
  41  |   test("deselects when clicking the canvas background", async ({ page }) => {
  42  |     const firstElement = page.locator(".slide-canvas .element").first();
  43  |     await firstElement.click();
  44  |     await expect(firstElement).toHaveClass(/selected/);
  45  | 
  46  |     // Click the canvas background, not the element.
  47  |     const canvas = page.locator(".slide-canvas");
  48  |     const box = await canvas.boundingBox();
  49  |     expect(box).toBeTruthy();
  50  |     await page.mouse.click(box!.x + box!.width - 10, box!.y + box!.height - 10);
  51  | 
  52  |     await expect(firstElement).not.toHaveClass(/selected/);
  53  |     await expect(page.locator(".properties")).toContainText(
  54  |       "Select an element to edit",
  55  |     );
  56  |   });
  57  | 
  58  |   test("keeps selection when clicking the selected element (regression)", async ({ page }) => {
  59  |     const firstElement = page.locator(".slide-canvas .element").first();
  60  |     await firstElement.click();
  61  |     await expect(firstElement).toHaveClass(/selected/);
  62  | 
  63  |     // Re-click the same element; selection should remain.
  64  |     await firstElement.click();
  65  |     await expect(firstElement).toHaveClass(/selected/);
  66  |     await expect(page.locator(".properties")).not.toContainText(
  67  |       "Select an element to edit",
  68  |     );
  69  |   });
  70  | 
  71  |   test("updates element position via property input", async ({ page }) => {
  72  |     const element = page.locator(".slide-canvas .element").first();
  73  |     await element.click();
  74  |     await expect(element).toHaveClass(/selected/);
  75  | 
  76  |     const xInput = page.locator(".properties shad-input").nth(3);
> 77  |     await xInput.fill("200");
      |                  ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  78  |     await xInput.evaluate((el: HTMLElement) => el.dispatchEvent(new FocusEvent("focusout", { bubbles: true })));
  79  | 
  80  |     const newBox = await element.boundingBox();
  81  |     expect(newBox).toBeTruthy();
  82  |     expect(newBox!.x).toBe(200);
  83  |   });
  84  | 
  85  |   test("adds and removes a slide", async ({ page }) => {
  86  |     await expect(page.locator(".slide-thumb")).toHaveCount(1);
  87  |     await page.locator("shad-button", { hasText: "New slide" }).click();
  88  |     await expect(page.locator(".slide-thumb")).toHaveCount(2);
  89  | 
  90  |     await page.locator("shad-button", { hasText: "Delete slide" }).click();
  91  |     await expect(page.locator(".slide-thumb")).toHaveCount(1);
  92  |   });
  93  | 
  94  |   test("adds and removes an element", async ({ page }) => {
  95  |     await page.locator("shad-button", { hasText: "+ Text" }).click();
  96  |     await expect(page.locator(".slide-canvas .element")).toHaveCount(3);
  97  | 
  98  |     const lastElement = page.locator(".slide-canvas .element").last();
  99  |     await lastElement.click();
  100 |     await expect(lastElement).toHaveClass(/selected/);
  101 | 
  102 |     await page.locator("shad-button", { hasText: "Remove" }).click();
  103 |     await expect(page.locator(".slide-canvas .element")).toHaveCount(2);
  104 |   });
  105 | 
  106 |   test("drags an element to a new position", async ({ page }) => {
  107 |     const element = page.locator(".slide-canvas .element").first();
  108 |     await element.click();
  109 |     await expect(element).toHaveClass(/selected/);
  110 | 
  111 |     const box = await element.boundingBox();
  112 |     expect(box).toBeTruthy();
  113 |     const startX = box!.x;
  114 |     const startY = box!.y;
  115 | 
  116 |     // Drag the element by its center.
  117 |     await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  118 |     await page.mouse.down();
  119 |     await page.mouse.move(box!.x + box!.width / 2 + 60, box!.y + box!.height / 2 + 40);
  120 |     await page.mouse.up();
  121 | 
  122 |     const newBox = await element.boundingBox();
  123 |     expect(newBox).toBeTruthy();
  124 |     expect(newBox!.x).toBeGreaterThan(startX);
  125 |     expect(newBox!.y).toBeGreaterThan(startY);
  126 |   });
  127 | 
  128 |   test("resizes an element via the south-east handle", async ({ page }) => {
  129 |     const element = page.locator(".slide-canvas .element").first();
  130 |     await element.click();
  131 |     await expect(element).toHaveClass(/selected/);
  132 | 
  133 |     const handle = element.locator(".resize-handle.se");
  134 |     await expect(handle).toBeVisible();
  135 | 
  136 |     const box = await element.boundingBox();
  137 |     const handleBox = await handle.boundingBox();
  138 |     expect(box).toBeTruthy();
  139 |     expect(handleBox).toBeTruthy();
  140 | 
  141 |     const startW = box!.width;
  142 |     const startH = box!.height;
  143 | 
  144 |     await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
  145 |     await page.mouse.down();
  146 |     await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 50, handleBox!.y + handleBox!.height / 2 + 30);
  147 |     await page.mouse.up();
  148 | 
  149 |     const newBox = await element.boundingBox();
  150 |     expect(newBox).toBeTruthy();
  151 |     expect(newBox!.width).toBeGreaterThan(startW);
  152 |     expect(newBox!.height).toBeGreaterThan(startH);
  153 |   });
  154 | 
  155 |   test("undoes and redoes adding a slide", async ({ page }) => {
  156 |     await expect(page.locator(".slide-thumb")).toHaveCount(1);
  157 | 
  158 |     await page.locator("shad-button", { hasText: "New slide" }).click();
  159 |     await expect(page.locator(".slide-thumb")).toHaveCount(2);
  160 | 
  161 |     await page.locator("shad-button", { hasText: "Undo" }).click();
  162 |     await expect(page.locator(".slide-thumb")).toHaveCount(1);
  163 | 
  164 |     await page.locator("shad-button", { hasText: "Redo" }).click();
  165 |     await expect(page.locator(".slide-thumb")).toHaveCount(2);
  166 |   });
  167 | 
  168 |   test("undoes deleting an element via keyboard shortcut", async ({ page }) => {
  169 |     await expect(page.locator(".slide-canvas .element")).toHaveCount(2);
  170 | 
  171 |     const firstElement = page.locator(".slide-canvas .element").first();
  172 |     await firstElement.click();
  173 |     await expect(firstElement).toHaveClass(/selected/);
  174 | 
  175 |     await page.locator("shad-button", { hasText: "Remove" }).click();
  176 |     await expect(page.locator(".slide-canvas .element")).toHaveCount(1);
  177 | 
```