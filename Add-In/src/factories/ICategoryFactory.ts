import ICategory from "../models/ICategory";

export interface ICategoryData {
  id: string;
  ref: string;
  name: string;
  color: string;
}

export default interface ICategoryFactory {
  create(data: ICategoryData): ICategory;
}
