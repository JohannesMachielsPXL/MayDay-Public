import IObservable from "../patterns/IObservable";
import ICategory from "../models/ICategory";
import ISubCategory from "../models/ISubCategory";
import { ImportStrategyEnum } from "../patterns/AbstractImportStrategy";
import { ExportStrategyEnum } from "../patterns/IExportStrategy";

export default interface IDataStore extends IObservable {
  initialize(): Promise<void>;

  pickImportStrategy(strategy: ImportStrategyEnum): void;

  import(optionalData?: any): Promise<boolean>;

  pickExportStrategy(strategy: ExportStrategyEnum): void;

  export(): Promise<boolean>;

  getCategories(): ICategory[];

  getCategoryById(categoryId: string): ICategory;

  getSubCategoriesByParentId(categoryId: string): ISubCategory[];

  addSubCategory(newSubCategory: ISubCategory): Promise<boolean>;

  editSubCategory(id: string, updatedSubCategory: ISubCategory): Promise<void>;

  deleteSubCategory(id: string): Promise<void>;
}
