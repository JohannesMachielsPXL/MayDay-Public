import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { randomCategories, randomInt } from "../../helper/Random";
import IDataStore from "../../../src/store/IDataStore";
import ICategory from "../../../src/models/ICategory";
import { AppProvider, IAppInterfaces } from "../../../src/components/AppProvider";
import CategoryList from "../../../src/components/list/CategoryList";

let mockCategories: ICategory[];
let mockDataStore: Partial<IDataStore>;
let mockAppInterfaces: Partial<IAppInterfaces>;

function renderComponent() {
  render(
    <AppProvider value={mockAppInterfaces as IAppInterfaces}>
      <CategoryList />
    </AppProvider>
  );
}

describe("CategoryList", () => {
  beforeEach(() => {
    mockCategories = randomCategories(randomInt(3, 10));

    mockDataStore = {
      getCategories: jest.fn().mockReturnValue(mockCategories),
      registerObserver: jest.fn(),
      removeObserver: jest.fn()
    };
    mockAppInterfaces = {
      dataStore: mockDataStore as IDataStore
    };
  });

  it("renders the correct content based on props", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getAllByTestId("category-header-name")).toHaveLength(mockCategories.length);
    });
  });

  it("updates categories on update", () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getAllByTestId("category-header")).toHaveLength(mockCategories.length);
    });

    mockCategories = randomCategories(randomInt(3, 10));

    const registeredObserver = (mockDataStore.registerObserver as jest.Mock).mock.calls[0][0];
    registeredObserver.update();

    waitFor(() => {
      expect(screen.getAllByTestId("category-header")).toHaveLength(mockCategories.length);
    });
  });

  it("toggles edit mode when the toggle button is clicked", () => {
    renderComponent();
    const toggleButton = screen.getByTestId("toggle-editable");

    expect(screen.queryAllByTestId('editable-category-panel')).toHaveLength(0);

    // Click to toggle edit mode
    fireEvent.click(toggleButton);
     waitFor(() => {
      expect(screen.getAllByTestId("category-header")).toHaveLength(mockCategories.length);
    });

    // Click again to toggle back
    fireEvent.click(toggleButton);
    expect(screen.queryAllByTestId("editable-category-panel")).toHaveLength(0);
  });
});
