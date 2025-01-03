import { randomString } from "../Random";
import Guid from "../../../src/factories/Guid";
import ISubCategory from "../../../src/models/ISubCategory";

export default class SubCategoryBuilder {
  private readonly subCategory: ISubCategory;

  constructor(parentId: string) {
    this.subCategory = {
      id: Guid.newGuid(),
      parentId: parentId,
      name: randomString(),
      feedback: randomString(),
    };
  }

  withId(id: string): this {
    this.subCategory.id = id;
    return this;
  }

  withName(name: string): this {
    this.subCategory.name = name;
    return this;
  }

  withFeedback(feedback: string): this {
    this.subCategory.feedback = feedback;
    return this;
  }

  build(): ISubCategory {
    return this.subCategory;
  }
}
