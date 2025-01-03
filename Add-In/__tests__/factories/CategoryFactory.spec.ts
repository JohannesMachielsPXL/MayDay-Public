import { randomString } from "../helper/Random";
import Guid from "../../src/factories/Guid";
import CategoryFactory from '../../src/factories/implementations/CategoryFactory';
import { ICategoryData } from '../../src/factories/ICategoryFactory';
import ICategory from '../../src/models/ICategory';

describe('CategoryFactory', () => {
  it('should create a category with the given data', () => {
    const factory = new CategoryFactory();
    const data: ICategoryData = {
      id: Guid.newGuid(),
      ref: randomString(),
      name: randomString(),
      color: randomString()
    };

    const category: ICategory = factory.create(data);

    expect(category).toEqual({
      id: data.id,
      ref: data.ref,
      name: data.name,
      color: data.color
    });
  });
});
