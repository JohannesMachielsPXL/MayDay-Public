import { test, expect } from "playwright-test-coverage";
import { hexToRgb } from "../helper/Color";
import initialData from "../../assets/data/initialData.json";
import importData1 from "../sample_data/importData1.json";
import { randomCategories, randomSubCategories, randomSubSubCategories } from "../helper/Random";
import PreferencesBuilder from "../helper/builder/PreferencesBuilder";
import { cleanLocalStorage, saveAllToLocalStorage } from "../helper/LocalStorage";
import ICategory from "../../src/models/ICategory";
import ISubCategory from "../../src/models/ISubCategory";
import IPreferences from "../../src/models/IPreferences";

let mockCategories: ICategory[];
let mockSubCategories: ISubCategory[];
let mockPreferences: IPreferences;

test.describe("Import/Export strategies", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:3000/taskpane.html");

    mockCategories = randomCategories();
    mockSubCategories = randomSubSubCategories(randomSubCategories(mockCategories));
    mockPreferences = new PreferencesBuilder().build();
  });

  test.afterEach(async ({ page }) => {
    await cleanLocalStorage(page);
  });

  test("should display initial categories names and colors on first load", async ({ page }) => {
    const accordionHeaders = page.locator(".accordion-header");
    const count = await accordionHeaders.count();

    for (let i = 0; i < count; i++) {
      await accordionHeaders.nth(i).click();
      const categoryName = initialData.categories[i].name;
      await expect(page.locator(`h2:has-text("${categoryName}")`)).toBeVisible();
    }
  });

  test("should load categories names and colors from localStorage on refresh", async ({ page }) => {
    await saveAllToLocalStorage(page, mockCategories, mockSubCategories, mockPreferences);
    await page.reload();

    for (const category of mockCategories) {
      await expect(page.locator(`h2:has-text("${category.name}")`)).toBeVisible();

      const header = page.locator(`h2[data-testid="category-header-name"]:has-text("${category.name}")`).locator("..");
      const expectedColor = category.color;
      const rgbColor = expectedColor.startsWith("#") ? hexToRgb(expectedColor) : expectedColor;
      await expect(header).toHaveCSS("background-color", rgbColor, { timeout: 10000 });
    }
  });

  test("should display imported data and reset to factory settings", async ({ page }) => {
    // Import data
    await page.getByRole("tab").nth(2).click();
    await page.getByRole("button", { name: "Importeer instellingen" }).click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("__tests__/sample_data/importData1.json");

    // Check list of categories
    await page.getByTestId("home-tab").click();
    for (const initialCategory of initialData.categories) {
      const importedCategory = importData1.categories.find((category) => category.id === initialCategory.id);
      if (importedCategory) {
        const header = page
          .locator(`h2[data-testid="category-header-name"]:has-text("${initialCategory.name}")`)
          .locator("..");
        const expectedColor = importedCategory.color;
        const rgbColor = expectedColor.startsWith("#") ? hexToRgb(expectedColor) : expectedColor;
        await expect(header).toHaveCSS("background-color", rgbColor);
      }
    }

    // Reset to factory settings
    await page.getByRole("tab").nth(2).click();
    await page.getByRole("button", { name: "Fabrieks-instellingen" }).click();
    await page.getByRole("tab").first().click();

    // Check list of categories
    for (const category of initialData.categories) {
      await expect(page.locator(`h2:has-text("${category.name}")`)).toBeVisible();

      const header = page.locator(`h2[data-testid="category-header-name"]:has-text("${category.name}")`).locator("..");
      const expectedColor = category.color;
      const rgbColor = expectedColor.startsWith("#") ? hexToRgb(expectedColor) : expectedColor;
      await expect(header).toHaveCSS("background-color", rgbColor);
    }
  });

  test("should download settings", async ({ page }) => {
    await saveAllToLocalStorage(page, mockCategories, mockSubCategories, mockPreferences);
    await page.reload();

    await page.getByRole("tab").nth(2).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download instellingen" }).click();
    await downloadPromise;

    // TODO Verify the content of the downloaded file
  });
});
