import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { randomHex, randomString } from "../../helper/Random";
import SubCategoryBuilder from "../../helper/builder/SubCategoryBuilder";
import UtilityService from "../../../src/services/implementations/UtilityService";
import ISubCategory from "../../../src/models/ISubCategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import EditableSubCategoryHeader from "../../../src/components/list/EditableSubCategoryHeader";

let mockAppInterfaces: Partial<IAppInterfaces>;
let mockSubCategory: ISubCategory;

const renderComponent = (subCategory: ISubCategory, color: string) => {
  return render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <EditableSubCategoryHeader subCategory={subCategory} color={color} />
    </AppProvider>
  );
};

describe("EditableSubCategoryHeader", () => {
  beforeEach(() => {
    mockAppInterfaces = {
      utilityService: new UtilityService()
    };

    mockSubCategory = new SubCategoryBuilder(randomString()).build();
  });

  it("renders the subcategory name", () => {
    renderComponent(mockSubCategory, randomHex());
    expect(screen.getByTestId("edit-sub-category-header-name")).toHaveTextContent(mockSubCategory.name);
  });

  it("applies the correct styles on hover", () => {
    renderComponent(mockSubCategory, randomHex());
    const button = screen.getByTestId("edit-sub-category-header-name");

    fireEvent.mouseEnter(button);
    const defaultStyle = window.getComputedStyle(button);

    fireEvent.mouseLeave(button);
    let style = window.getComputedStyle(button);
    expect(style).not.toBe(defaultStyle);
  });
});
