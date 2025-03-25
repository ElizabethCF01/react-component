/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";
import { hexToRgb} from "../src/utils/colorUtils";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Color Palette Generator/);
  await expect(page.getByRole("heading")).toHaveText(/Color Palette Generator/);
});

test.describe("Color Palette Generator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should generate a color palette", async ({ page }) => {
    const initialColors = page.$$eval('[data-testid^="color-box-"]', (divs) =>
      divs.map((div) => div.style.backgroundColor)
    );

    await page.getByRole("button", { name: "Generate" }).click();

    const newColors = await page.$$eval('[data-testid^="color-box-"]', (divs) =>
      divs.map((div) => div.style.backgroundColor)
    );

    expect(newColors).not.toEqual(initialColors);
  });

  test("should copy a color", async ({ page }) => {
    await page.goto("/");

    // Mock `navigator.clipboard.writeText`
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: (text) =>
            Promise.resolve(((window as any).__mockClipboardText = text)),
          readText: () =>
            Promise.resolve((window as any).__mockClipboardText || ""),
        },
      });
    });

    // find all copy buttons
    const copyButtons = await page
      .locator('[data-testid^="copy-button-"]')
      .all();

    const firstCopyButton = copyButtons[0];

    // Get the test id
    const buttonTestId = await firstCopyButton.getAttribute("data-testid");

    if (!buttonTestId)
      throw new Error("No se encontró el atributo data-testid");

    // Get color id
    const colorId = buttonTestId.replace("copy-button-", "");

    const colorBox = page.locator(`[data-testid="color-box-${colorId}"]`);

    // Get the bg color
    const colorText = await colorBox.evaluate(
      (box) => window.getComputedStyle(box).backgroundColor
    );

    await firstCopyButton.click();

    // Verify that the color was copied
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    expect(hexToRgb(clipboardText)).toBe(colorText);
  });
});
