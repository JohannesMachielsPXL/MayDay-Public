import container, { TYPES } from "../DIContainer";
import ICategory from "../models/ICategory";
import ISubCategory from "../models/ISubCategory";
import IPreferences from "../models/IPreferences";
import ICategoryFactory from "../factories/ICategoryFactory";
import ISubCategoryFactory from "../factories/ISubCategoryFactory";

export enum ImportStrategyEnum {
  LOCAL_STORAGE,
  JSON_INITIAL,
  JSON_IMPORT,
  JSON_IMPORT_TEAM1,
  JSON_IMPORT_TEAM2,
}

export interface IApplicationSettings {
  categories: ICategory[];
  subCategories: ISubCategory[];
  preferences: IPreferences;
}

export default abstract class AbstractImportStrategy {
  protected constructor(
    protected categoryFactory: ICategoryFactory = container.get<ICategoryFactory>(TYPES.ICategoryFactory),
    protected subCategoryFactory: ISubCategoryFactory = container.get<ISubCategoryFactory>(TYPES.ISubCategoryFactory)
  ) {}

  abstract import(state: IApplicationSettings, optionalData?: IApplicationSettings): Promise<IApplicationSettings>;
}
