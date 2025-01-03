import { randomHex, randomString } from "../Random";
import Guid from "../../../src/factories/Guid";
import ICategory from "../../../src/models/ICategory";

export default class CategoryBuilder {
  private readonly category: ICategory;

  constructor() {
    this.category = {
      id: Guid.newGuid(),
      ref: randomString(),
      name: randomString(),
      color: randomHex()
    };
  }

  withId(id: string): this {
    this.category.id = id;
    return this;
  }

  withRef(ref: string): this {
    this.category.ref = ref;
    return this;
  }

  withName(name: string): this {
    this.category.name = name;
    return this;
  }

  withColor(color: string): this {
    this.category.color = color;
    return this;
  }

  build(): ICategory {
    return this.category;
  }
}
