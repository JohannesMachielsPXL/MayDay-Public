import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { randomString } from "../../helper/Random";
import SubCategoryBuilder from "../../helper/builder/SubCategoryBuilder";
import IDataStore from "../../../src/store/IDataStore";
import ISubCategory from "../../../src/models/ISubCategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import EditableSubCategoryPanel from "../../../src/components/list/EditableSubCategoryPanel";

let subCategory: ISubCategory;
let editedName: string;
let editedFeedback: string;
let mockDataStore: Partial<IDataStore>;
let mockAppInterfaces: Partial<IAppInterfaces>;

function renderComponent(subCategory: ISubCategory, canDelete: boolean = true) {
  render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <EditableSubCategoryPanel subCategory={subCategory} canDelete={canDelete} />
    </AppProvider>
  );
}

describe("EditableSubCategoryPanel", () => {
  beforeEach(() => {
    subCategory = new SubCategoryBuilder(randomString()).build();
    editedName = randomString();
    editedFeedback = randomString();

    mockDataStore = {
      editSubCategory: jest.fn(),
      deleteSubCategory: jest.fn()
    };

    mockAppInterfaces = {
      dataStore: mockDataStore as IDataStore
    };
  });

  it("renders correctly with initial values", () => {
    renderComponent(subCategory);

    expect((screen.getByTestId("edit-sub-category-name") as HTMLInputElement).value).toBe(subCategory.name);
    expect((screen.getByTestId("edit-sub-category-feedback") as HTMLInputElement).value).toBe(subCategory.feedback);
  });

  it("disables delete button when canDelete is false", () => {
    renderComponent(subCategory, false);

    expect(screen.getByTestId("delete-sub-category")).toBeDisabled();
  });

  it("calls deleteSubCategory on save", () => {
    renderComponent(subCategory);

    fireEvent.click(screen.getByTestId("delete-sub-category"));

    expect(mockDataStore.deleteSubCategory).toHaveBeenCalledWith(subCategory.id);
  });

  it("calls editSubCategory on save", () => {
    renderComponent(subCategory);

    fireEvent.change(screen.getByTestId("edit-sub-category-name"), {
      target: { value: editedName }
    });
    fireEvent.change(screen.getByTestId("edit-sub-category-feedback"), { target: { value: editedFeedback } });

    fireEvent.click(screen.getByTestId("save-edit-sub-category"));

    expect((screen.getByTestId("edit-sub-category-name") as HTMLInputElement).value).toBe(editedName);
    expect((screen.getByTestId("edit-sub-category-feedback") as HTMLInputElement).value).toBe(editedFeedback);

    expect(mockDataStore.editSubCategory).toHaveBeenCalledWith(subCategory.id, {
      ...subCategory,
      name: editedName,
      feedback: editedFeedback
    });
  });

  it("resets state on cancel", () => {
    renderComponent(subCategory);

    fireEvent.change(screen.getByTestId("edit-sub-category-name"), { target: { value: editedName } });
    fireEvent.change(screen.getByTestId("edit-sub-category-feedback"), { target: { value: editedFeedback } });

    fireEvent.click(screen.getByTestId("cancel-edit-sub-category"));

    expect((screen.getByTestId("edit-sub-category-name") as HTMLInputElement).value).toBe(subCategory.name);
    expect((screen.getByTestId("edit-sub-category-feedback") as HTMLTextAreaElement).value).toBe(subCategory.feedback);
  });
});
