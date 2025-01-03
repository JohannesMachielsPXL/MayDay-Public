import { test, expect } from "playwright-test-coverage";
import { randomSubSubCategories, randomCategories, randomSubCategories } from "../helper/Random";
import IPreferences from "../../src/models/IPreferences";
import PreferencesBuilder from "../helper/builder/PreferencesBuilder";
import ICategory from "../../src/models/ICategory";
import ISubCategory from "../../src/models/ISubCategory";
import { cleanLocalStorage, saveAllToLocalStorage } from "../helper/LocalStorage";
import SubCategoryBuilder from "../helper/builder/SubCategoryBuilder";

let mockCategories: ICategory[];
let mockSubCategories: ISubCategory[];
let mockPreferences: IPreferences;

test.describe("Add subCategories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:3000/taskpane.html");

    mockCategories = randomCategories();
    mockSubCategories = randomSubSubCategories(randomSubCategories(mockCategories));
    mockPreferences = new PreferencesBuilder().build();

    await saveAllToLocalStorage(page, mockCategories, mockSubCategories, mockPreferences);
    await page.reload();
  });

  test.afterEach(async ({ page }) => {
    await cleanLocalStorage(page);
  });

  test("add button only available for categories and subcategories, not for subsubcategories", async ({ page }) => {
    await page.getByTestId("toggle-editable").click();

    for (const mockCategory of mockCategories) {
      await page.getByTestId(mockCategory.id).click();
      const categoryButton = page.locator(`[data-testid="create-subcategory-from-category-${mockCategory.id}"]`);
      await expect(categoryButton).toBeVisible();

      const mockParentSubCategories = mockSubCategories.filter(
        (subCategory) => subCategory.parentId === mockCategory.id
      );
      for (const mockSubCategory of mockParentSubCategories) {
        const subCategoryButton = page.locator(
          `[data-testid="create-subcategory-from-subcategory-${mockSubCategory.id}"]`
        );
        await expect(subCategoryButton).toBeVisible();

        const mockSubSubCategories = mockParentSubCategories.filter(
          (subSubCategory) => subSubCategory.parentId === mockSubCategory.id
        );
        for (const mockSubSubCategory of mockSubSubCategories) {
          const subSubCategoryButton = page.locator(
            `[data-testid="create-subcategory-from-subcategory-${mockSubSubCategory.id}"]`
          );
          await expect(subSubCategoryButton).not.toBeVisible();
        }
      }
    }
  });

  test("should add subcategory when add button is clicked", async ({ page }) => {
    await page.getByTestId("toggle-editable").click();

    for (const mockCategory of mockCategories) {
      const categoryAccordionItem = page.getByTestId(mockCategory.id);
      await categoryAccordionItem.click();
      const addButton = page.getByTestId(`create-subcategory-from-category-${mockCategory.id}`);
      await addButton.click();

      // Verify that a new subcategory is added
      const newSubCategory = categoryAccordionItem.locator("..").locator("..").locator(`.sub-category:has-text("...")`);
      await expect(newSubCategory).toBeVisible();

      // Verify that the data-testid of the new subcategory is not in mockSubCategories
      const newSubCategoryTestId = await newSubCategory.getAttribute("data-testid");
      expect(mockSubCategories.some((subCategory) => subCategory.id === newSubCategoryTestId)).toBe(false);
      // Add to mockSubCategories for next asserts
      mockSubCategories.push(new SubCategoryBuilder(mockCategory.id).withId(newSubCategoryTestId).build());
    }
  });
});
