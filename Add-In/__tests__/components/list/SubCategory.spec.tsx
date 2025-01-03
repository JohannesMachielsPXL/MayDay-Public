import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { randomHex, randomString } from "../../helper/Random";
import SubCategoryBuilder from "../../helper/builder/SubCategoryBuilder";
import UtilityService from "../../../src/services/implementations/UtilityService";
import ISubCategory from "../../../src/models/ISubCategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import SubCategory from "../../../src/components/list/SubCategory";

let mockAppInterfaces: Partial<IAppInterfaces>;
let mockSubCategory: ISubCategory;

const renderComponent = (subCategory: ISubCategory, color: string) => {
  return render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <SubCategory subCategory={subCategory} color={color} />
    </AppProvider>
  );
};

describe("SubCategory Component", () => {
  beforeEach(() => {
    mockAppInterfaces = {
      utilityService: new UtilityService()
    };

    mockSubCategory = new SubCategoryBuilder(randomString()).build();
  });

  test("renders subcategory name", () => {
    renderComponent(mockSubCategory, randomHex());
    expect(screen.getByTestId("sub-category-name")).toHaveTextContent(mockSubCategory.name);
  });

  test("displays tooltip on hover", async () => {
    renderComponent(mockSubCategory, randomHex());
    const button = screen.getByTestId("sub-category-name");

    fireEvent.mouseOver(button);
    await waitFor(() => expect(screen.getByTestId("sub-category-tooltip-name")).toBeInTheDocument(), { timeout: 3000 });
  });

  test("applies hover styles", () => {
    renderComponent(mockSubCategory, randomHex());
    const button = screen.getByTestId("sub-category-name");

    const defaultStyle = window.getComputedStyle(button);

    fireEvent.mouseEnter(button);
    let style = window.getComputedStyle(button);
    expect(style.backgroundColor).not.toBe(defaultStyle.backgroundColor);
    expect(style.border).not.toBe(defaultStyle.border);

    fireEvent.mouseLeave(button);
    style = window.getComputedStyle(button);
    expect(style.backgroundColor).toBe(defaultStyle.backgroundColor);
    expect(style.border).toBe(defaultStyle.border);
  });
});
