import ISubCategory from "../models/ISubCategory";

export interface ISubCategoryData {
  id: string;
  parentId: string;
  name: string;
  feedback: string;
}

export default interface ISubCategoryFactory {
  create(data: ISubCategoryData): ISubCategory;
}
