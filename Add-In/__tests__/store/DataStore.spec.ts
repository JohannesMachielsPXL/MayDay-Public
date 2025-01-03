import DataStore from "../../src/store/implementations/DataStore";
import ISubCategory from "../../src/models/ISubCategory";
import ICategory from "../../src/models/ICategory";
import IPreferences from "../../src/models/IPreferences";
import { randomCategories, randomInt, randomSubCategories, randomSubSubCategories } from "../helper/Random";
import PreferencesBuilder from "../helper/builder/PreferencesBuilder";
import TestImportStrategy from "../helper/TestImportStrategy";
import SubCategoryBuilder from "../helper/builder/SubCategoryBuilder";
import Guid from "../../src/factories/Guid";

describe("DataStore", () => {
  let dataStore: DataStore;
  let mockCategories: ICategory[];
  let mockSubCategories: ISubCategory[];
  let mockPreferences: IPreferences;

  beforeEach(async () => {
    dataStore = new DataStore();

    mockCategories = randomCategories();
    mockSubCategories = randomSubSubCategories(randomSubCategories(mockCategories));
    mockPreferences = new PreferencesBuilder().build();

    dataStore.setImportStrategy(new TestImportStrategy(mockCategories, mockSubCategories, mockPreferences));
    await dataStore.import();
  });

  it("should get categories", () => {
    expect(dataStore.getCategories()).toHaveLength(mockCategories.length);
  });

  it("should get subCategories", () => {
    const mockCategory = mockCategories[randomInt(0, mockCategories.length - 1)];
    const mockFilteredSubCategories = mockSubCategories.filter((sub) => sub.parentId === mockCategory.id);

    expect(dataStore.getSubCategoriesByParentId(mockCategory.id)).toHaveLength(mockFilteredSubCategories.length);
  });

  it("should add a subcategory", async () => {
    const existingCategoryId: string = mockCategories[0].id;
    const newSubCategory: ISubCategory = new SubCategoryBuilder(existingCategoryId).build();

    const result = await dataStore.addSubCategory(newSubCategory);
    expect(result).toBe(true);
    expect(dataStore.getSubCategoriesByParentId(newSubCategory.parentId)).toContainEqual(newSubCategory);
  });

  it("should not add a subcategory with invalid parentId", async () => {
    const nonExistingCategoryId: string = Guid.newGuid();
    const newSubCategory: ISubCategory = new SubCategoryBuilder(nonExistingCategoryId).build();

    const result = await dataStore.addSubCategory(newSubCategory);
    expect(result).toBe(false);
    expect(dataStore.getSubCategoriesByParentId(newSubCategory.parentId)).not.toContainEqual(newSubCategory);
  });

  it("should edit a subcategory", async () => {
    const mockSubCategory = mockSubCategories[randomInt(0, mockSubCategories.length - 1)];
    const updatedSubCategory: ISubCategory = { ...mockSubCategory, name: "Updated SubCategory" };

    await dataStore.editSubCategory(mockSubCategory.id, updatedSubCategory);
    expect(dataStore.getSubCategoriesByParentId(mockSubCategory.parentId)).toContainEqual(updatedSubCategory);
  });

  it("should delete a subcategory", async () => {
    const mockSubCategory = mockSubCategories[randomInt(0, mockSubCategories.length - 1)];
    const count = dataStore.getSubCategoriesByParentId(mockSubCategory.parentId).length;

    await dataStore.deleteSubCategory(mockSubCategory.id);
    expect(dataStore.getSubCategoriesByParentId(mockSubCategory.parentId)).toHaveLength(count - 1);
  });
});
