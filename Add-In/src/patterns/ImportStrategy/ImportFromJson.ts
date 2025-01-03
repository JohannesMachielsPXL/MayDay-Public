import AbstractImportStrategy, { IApplicationSettings } from "../AbstractImportStrategy";
import ICategory from "../../models/ICategory";
import ISubCategory from "../../models/ISubCategory";
import { ISubCategoryData } from "../../factories/ISubCategoryFactory";
import IToastService from "../../services/IToastService";
import container, { TYPES } from "../../DIContainer";

export default class ImportFromJson extends AbstractImportStrategy {
  constructor(private toastService: IToastService = container.get<IToastService>(TYPES.IToastService)) {
    super();
  }

  import = async (state: IApplicationSettings, optionalData: any): Promise<IApplicationSettings> => {
    state.categories = await this.loadCategoryColorsFromJSON(state.categories, optionalData.categories);
    state.subCategories = await this.loadSubCategoriesFromJSON(optionalData.subCategories);
    return state;
  };

  loadCategoryColorsFromJSON = async (categories: ICategory[], importCategories: ICategory[]): Promise<ICategory[]> => {
    await Promise.all(
      categories.map(async (category) => {
        const importCategory = importCategories.find((importCategory) => importCategory.id === category.id);
        if (importCategory) {
          category.color = importCategory.color;
        }
      })
    );

    return categories;
  };

  loadSubCategoriesFromJSON = async (importSubCategories: ISubCategory[]): Promise<ISubCategory[]> => {
    const subCategories: ISubCategory[] = [];

    await Promise.all(
      importSubCategories.map(async (data: ISubCategoryData) => {
        const subCategory = await this.subCategoryFactory.create(data);
        subCategories.push(subCategory);
      })
    );

    return subCategories;
  };
}
