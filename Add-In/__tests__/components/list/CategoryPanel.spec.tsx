import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { randomSubSubCategories, randomHex, randomInt, randomSubCategoriesByParentId } from "../../helper/Random";
import CategoryBuilder from "../../helper/builder/CategoryBuilder";
import IDataStore from "../../../src/store/IDataStore";
import IUtilityService from "../../../src/services/IUtilityService";
import ICategory from "../../../src/models/ICategory";
import ISubCategory from "../../../src/models/ISubCategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import CategoryPanel from "../../../src/components/list/CategoryPanel";

let mockCategory: ICategory;
let mockSubCategories: ISubCategory[];
let mockDataStore: Partial<IDataStore>;
let mockUtilityService: Partial<IUtilityService>;
let mockAppInterfaces: Partial<IAppInterfaces>;

function renderComponent(category: ICategory) {
  render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <CategoryPanel category={category} />
    </AppProvider>
  );
}

describe("CategoryPanel", () => {
  beforeEach(() => {
    mockCategory = new CategoryBuilder().build();

    mockSubCategories = randomSubSubCategories(randomSubCategoriesByParentId(mockCategory.id, 10), 5);

    mockDataStore = {
      getSubCategoriesByParentId: jest.fn((parentId: string) => mockSubCategories.filter(subCategory => subCategory.parentId === parentId))
    };

    mockUtilityService = {
      hexToRgba: jest.fn().mockReturnValue(() => randomHex())
    };

    mockAppInterfaces = {
      dataStore: mockDataStore as IDataStore,
      utilityService: mockUtilityService as IUtilityService
    };
  });

  it("renders subcategories and subsubcategories correctly", () => {
    renderComponent(mockCategory);

    const randomPick = randomInt(0, mockSubCategories.length - 1);
    const randomlyPickedSubCategory = mockSubCategories[randomPick];
    expect(screen.getByTestId(randomlyPickedSubCategory.id)).toHaveTextContent(randomlyPickedSubCategory.name);

    expect(screen.getAllByTestId("sub-category-name").length).toBe(mockSubCategories.length);
  });
});
