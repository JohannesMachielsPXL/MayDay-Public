import ICategory from "../../src/models/ICategory";
import CategoryBuilder from "./builder/CategoryBuilder";
import SubCategoryBuilder from "./builder/SubCategoryBuilder";
import ISubCategory from "../../src/models/ISubCategory";

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomString(length: number = 10): string {
  let result = "";
  while (result.length < length) {
    result += Math.random().toString(36).substring(2);
  }
  return result.substring(0, length);
}

export function randomHex(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function randomRgb(): string {
  return `${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}`;
}

export function randomRgba(): string {
  return `rgba(${randomRgb()}, ${Math.random()})`;
}

export function randomCategories(maxNumber: number = 10): ICategory[] {
  const categories: ICategory[] = [];

  const number = randomInt(1, maxNumber);
  for (let i = 0; i < number; i++) {
    categories.push(new CategoryBuilder().build());
  }

  return categories;
}

export function randomSubCategories(categories: ICategory[], maxNumber: number = 10): ISubCategory[] {
  const subCategories: ISubCategory[] = [];

  for (let i = 0; i < categories.length; i++) {
    const moreSubCategories = randomSubCategoriesByParentId(categories[i].id, maxNumber);
    subCategories.push(...moreSubCategories);
  }

  return subCategories;
}

export function randomSubCategoriesByParentId(parentId: string, maxNumber: number = 10): ISubCategory[] {
  const subCategories: ISubCategory[] = [];

  const number = randomInt(1, maxNumber);
  for (let j = 0; j < number; j++) {
    subCategories.push(new SubCategoryBuilder(parentId).build());
  }

  return subCategories;
}

export function randomSubSubCategories(subCategories: ISubCategory[], maxNumber: number = 5): ISubCategory[] {
  const subSubCategories: ISubCategory[] = [];

  for (let i = 0; i < subCategories.length; i++) {
    subSubCategories.push(subCategories[i]);

    const number = randomInt(1, maxNumber);
    for (let j = 0; j < number; j++) {
      subSubCategories.push(new SubCategoryBuilder(subCategories[i].id).build());
    }
  }
  return subSubCategories;
}
