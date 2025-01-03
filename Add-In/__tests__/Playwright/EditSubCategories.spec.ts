import { test, expect } from "playwright-test-coverage";
import {
  randomSubSubCategories,
  randomCategories,
  randomString,
  randomSubCategories,
  randomInt
} from "../helper/Random";
import IPreferences from "../../src/models/IPreferences";
import PreferencesBuilder from "../helper/builder/PreferencesBuilder";
import ICategory from "../../src/models/ICategory";
import ISubCategory from "../../src/models/ISubCategory";
import { cleanLocalStorage, saveAllToLocalStorage } from "../helper/LocalStorage";

let mockCategories: ICategory[];
let mockSubCategories: ISubCategory[];
let mockPreferences: IPreferences;

test.describe("Edit subCategories", () => {
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

  test(" edit subcategory name and feedback names should display new name and feedback", async ({ page }) => {
    const randomNumber = randomInt(0, mockCategories.length - 1);
    const mockCategory = mockCategories[randomNumber];
    const mockSubCategory = mockSubCategories.find((sub) => sub.parentId === mockCategory.id);
    const editName = randomString();
    const editFeedback = randomString();

    await page.getByTestId("toggle-editable").click();

    await page.getByTestId(mockCategory.id).click();
    await page.getByTestId(mockSubCategory.id).click();

    await page.getByTestId("edit-sub-category-name").fill(editName);
    await page.getByTestId("edit-sub-category-feedback").fill(editFeedback);
    await page.getByTestId("save-edit-sub-category").click();

    await page.getByTestId("toggle-editable").click();

    await expect(page.getByRole("button", { name: editName })).toBeVisible();
  });
});
