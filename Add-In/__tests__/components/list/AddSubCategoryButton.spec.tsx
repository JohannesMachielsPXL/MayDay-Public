import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SubCategoryBuilder from "../../helper/builder/SubCategoryBuilder";
import Guid from "../../../src/factories/Guid";
import IDataStore from "../../../src/store/IDataStore";
import ISubCategoryFactory from "../../../src/factories/ISubCategoryFactory";
import ISubCategory from "../../../src/models/ISubCategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import AddSubCategoryButton from "../../../src/components/list/AddSubCategoryButton";

let mockId: string;
let mockParentId: string;
let mockSubCategory: ISubCategory;
let mockDataStore: Partial<IDataStore>;
let mockSubCategoryFactory: Partial<ISubCategoryFactory>;
let mockAppInterfaces: Partial<IAppInterfaces>;

function renderComponent(id: string, onAdd: (newSubCategory: ISubCategory) => void, buttonType: "category" | "subCategory") {
  render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <AddSubCategoryButton id={id} onAdd={onAdd} buttonType={buttonType} />
    </AppProvider>
  );
}

describe("AddSubCategoryButton", () => {
  beforeEach(() => {
    mockParentId = Guid.newGuid();
    mockSubCategory = new SubCategoryBuilder(mockParentId).build();

    mockDataStore = {
      addSubCategory: jest.fn()
    };

    mockSubCategoryFactory = {
      create: jest.fn().mockReturnValue(mockSubCategory)
    };

    mockAppInterfaces = {
      dataStore: mockDataStore as IDataStore,
      subCategoryFactory: mockSubCategoryFactory as ISubCategoryFactory
    };
  });

  test("renders the correct button for subCategory", async () => {
    await testButtonClick("subCategory", `create-subcategory-from-subcategory-${mockParentId}`);
  });

  test("renders the correct button with for category", async () => {
    await testButtonClick("category", `create-subcategory-from-category-${mockParentId}`);
  });
});

async function testButtonClick(buttonType: "category" | "subCategory", testId: string) {
  renderComponent(mockParentId, jest.fn(), buttonType);

  const button = screen.getByTestId(testId) as HTMLButtonElement;
  expect(button).toBeVisible();

  fireEvent.click(button);
  await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations

  expect(mockDataStore.addSubCategory).toHaveBeenCalledTimes(1);
  expect(mockDataStore.addSubCategory).toHaveBeenCalledWith(expect.objectContaining({ parentId: mockParentId }));
}
