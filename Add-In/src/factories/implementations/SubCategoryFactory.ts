import { injectable } from "inversify";
import ISubCategoryFactory, { ISubCategoryData } from "../ISubCategoryFactory";
import ISubCategory from "../../models/ISubCategory";

@injectable()
export default class SubCategoryFactory implements ISubCategoryFactory {
  create(data: ISubCategoryData): ISubCategory {
    return {
      id: data.id,
      parentId: data.parentId,
      name: data.name,
      feedback: data.feedback
    };
  }
}
