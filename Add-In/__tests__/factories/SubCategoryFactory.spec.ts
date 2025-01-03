import { randomString } from "../helper/Random";
import Guid from "../../src/factories/Guid";
import SubCategoryFactory from "../../src/factories/implementations/SubCategoryFactory";
import { ISubCategoryData } from "../../src/factories/ISubCategoryFactory";
import ISubCategory from "../../src/models/ISubCategory";

describe("SubCategoryFactory", () => {
  it("should create a subcategory with the given data", () => {
    const factory = new SubCategoryFactory();
    const data: ISubCategoryData = {
      id: Guid.newGuid(),
      parentId: randomString(),
      name: randomString(),
      feedback: randomString()
    };

    const subCategory: ISubCategory = factory.create(data);

    expect(subCategory).toEqual({
      id: data.id,
      parentId: data.parentId,
      name: data.name,
      feedback: data.feedback
    });
  });
});
