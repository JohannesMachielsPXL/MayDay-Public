import React from "react";
import { fireEvent, render, RenderResult, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { randomSubSubCategories, randomSubCategoriesByParentId } from "../../helper/Random";
import CategoryBuilder from "../../helper/builder/CategoryBuilder";
import IDataStore from "../../../src/store/IDataStore";
import UtilityService from "../../../src/services/implementations/UtilityService";
import ICategory from "../../../src/models/ICategory";
import ISubCategory from "../../../src/models/ISubCategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import EditableCategoryPanel from "../../../src/components/list/EditableCategoryPanel";
import SubCategoryBuilder from "../../helper/builder/SubCategoryBuilder";
import ISubCategoryFactory from "../../../src/factories/ISubCategoryFactory";

let mockCategory: ICategory;
let mockSubCategories: ISubCategory[];
let mockNewSubCategory: ISubCategory;
let mockDataStore: Partial<IDataStore>;
let mockSubCategoryFactory: Partial<ISubCategoryFactory>;
let mockAppInterfaces: Partial<IAppInterfaces>;

function renderComponent(category: ICategory): RenderResult {
  return render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <EditableCategoryPanel category={category} />
    </AppProvider>
  );
}

describe("EditableCategoryPanel", () => {
  beforeEach(() => {
    mockCategory = new CategoryBuilder().build();
    mockSubCategories = randomSubSubCategories(randomSubCategoriesByParentId(mockCategory.id));
    mockNewSubCategory = new SubCategoryBuilder(mockCategory.id).build();

    mockDataStore = {
      getSubCategoriesByParentId: jest.fn((parentId: string) => mockSubCategories.filter(subCategory => subCategory.parentId === parentId)),
      addSubCategory: jest.fn((newSubCategory: ISubCategory) => {
        mockSubCategories.push(newSubCategory);
        return Promise.resolve(true);
      })
    };

    mockSubCategoryFactory = {
      create: jest.fn().mockReturnValue(mockNewSubCategory)
    };

    mockAppInterfaces = {
      dataStore: mockDataStore as IDataStore,
      subCategoryFactory: mockSubCategoryFactory as ISubCategoryFactory,
      utilityService: new UtilityService()
    };
  });

  it("renders the EditableCategoryPanel component", () => {
    renderComponent(mockCategory);
    expect(screen.getByTestId("editable-category-panel")).toBeInTheDocument();
  });

  it("renders the subcategories correctly", () => {
    renderComponent(mockCategory);
    mockSubCategories.forEach(subCategory => {
      expect(screen.getByTestId(subCategory.id)).toBeInTheDocument();
    });
  });

  it("sets openItemId when a subcategory is added", async () => {
    const { rerender } = renderComponent(mockCategory);

    const count = mockDataStore.getSubCategoriesByParentId(mockCategory.id).length;

    fireEvent.click(screen.getByTestId(`create-subcategory-from-category-${mockCategory.id}`));
    expect(mockDataStore.addSubCategory).toHaveBeenCalledWith(expect.objectContaining({ parentId: mockCategory.id }));
    expect(mockDataStore.getSubCategoriesByParentId(mockCategory.id)).toHaveLength(count + 1);

    rerender(
      <AppProvider value={mockAppInterfaces as IAppInterfaces}>
        <EditableCategoryPanel category={mockCategory} />
      </AppProvider>
    );

    await waitFor(() => {
      const newSubCategoryButton = screen.getByTestId(mockNewSubCategory.id).querySelector("button");
      expect(newSubCategoryButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("toggles openItemId correctly", () => {
    renderComponent(mockCategory);

    const subCategory = mockSubCategories[0];

    fireEvent.click(screen.getByTestId(subCategory.id).querySelector("button"));
    expect(screen.getByTestId(subCategory.id).querySelector("button")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByTestId(subCategory.id).querySelector("button"));
    expect(screen.getByTestId(subCategory.id).querySelector("button")).toHaveAttribute("aria-expanded", "false");
  });
});
