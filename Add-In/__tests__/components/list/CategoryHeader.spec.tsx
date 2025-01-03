import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryBuilder from "../../helper/builder/CategoryBuilder";
import ICategory from "../../../src/models/ICategory";
import CategoryHeader from "../../../src/components/list/CategoryHeader";

const mockCategory: ICategory = new CategoryBuilder().build();

describe("CategoryHeader", () => {
  it("renders the correct content based on props", () => {
    render(<CategoryHeader category={mockCategory} />);

    expect(screen.getByTestId("category-header-name")).toHaveTextContent(mockCategory.name);
  });
});
