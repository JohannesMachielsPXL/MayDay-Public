import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ICategory from "../../src/models/ICategory";
import CategoryHeader from "../../src/components/list/CategoryHeader";

describe("CategoryHeader", () => {
  it("renders the correct content based on props", () => {
    //Arrange
    const mockCategory: ICategory = {
      id: "C001",
      name: "Spelling",
      color: "#ff5959",
      ref: "SP"
    };

    //Act
    render(<CategoryHeader category={mockCategory} />);

    //Assert
    expect(screen.getByText("Spelling")).toBeInTheDocument();
  });
});
