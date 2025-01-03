import { test, expect } from "playwright-test-coverage";
import initialData from "../../assets/data/initialData.json";

test.describe("Show subCategories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:3000/taskpane.html");
  });

  test("should display all category names", async ({ page }) => {
    for (const category of initialData.categories) {
      await expect(page.locator(`h2:has-text("${category.name}")`)).toBeVisible();
    }
  });
});
