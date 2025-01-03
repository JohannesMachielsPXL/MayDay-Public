import { test, expect } from "playwright-test-coverage";
import { randomSubSubCategories, randomCategories, randomSubCategories, randomInt } from "../helper/Random";
import { cleanLocalStorage, saveAllToLocalStorage } from "../helper/LocalStorage";
import IPreferences from "../../src/models/IPreferences";
import PreferencesBuilder from "../helper/builder/PreferencesBuilder";
import ICategory from "../../src/models/ICategory";
import ISubCategory from "../../src/models/ISubCategory";

let mockCategories: ICategory[];
let mockSubCategories: ISubCategory[];
let mockPreferences: IPreferences;

test.describe("Delete subCategories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:3000/taskpane.html");

    mockCategories = randomCategories();
    mockPreferences = new PreferencesBuilder().build();
  });

  test.afterEach(async ({ page }) => {
    await cleanLocalStorage(page);
  });

  test(" delete subcategory should disappear", async ({ page }) => {
    //Arrange
    // Generating subcategories without children
    mockSubCategories = randomSubCategories(mockCategories);
    await saveAllToLocalStorage(page, mockCategories, mockSubCategories, mockPreferences);
    await page.reload();

    const randomNumber = randomInt(0, mockCategories.length - 1);
    const mockCategory = mockCategories[randomNumber];
    const mockSubCategory = mockSubCategories.find((sub) => sub.parentId === mockCategory.id);

    //Act
    await page.getByTestId("toggle-editable").click();
    await page.getByTestId(mockCategory.id).click();
    await page.getByTestId(mockSubCategory.id).click();
    await page.getByTestId("delete-sub-category").click();

    //Assert
    // Expect the subcategory to be removed from the DOM
    await expect(page.getByTestId(mockSubCategory.id)).not.toBeVisible();
  });

  test(" delete button should be disabled when children", async ({ page }) => {
    //Arrange
    // Generating subcategories with children
    mockSubCategories = randomSubSubCategories(randomSubCategories(mockCategories));
    await saveAllToLocalStorage(page, mockCategories, mockSubCategories, mockPreferences);
    await page.reload();

    const randomNumber = randomInt(0, mockCategories.length - 1);
    const mockCategory = mockCategories[randomNumber];
    const mockSubCategory = mockSubCategories.find((sub) => sub.parentId === mockCategory.id);

    //Act
    await page.getByTestId("toggle-editable").click();
    await page.getByTestId(mockCategory.id).click();
    await page.getByTestId(mockSubCategory.id).click();

    //Assert
    // Expect the subcategory to be removed from the DOM
    await expect(page.getByTestId("delete-sub-category")).toBeDisabled();
  });
});
