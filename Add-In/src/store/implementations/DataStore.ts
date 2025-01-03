import { injectable } from "inversify";

import IDataStore from "../IDataStore";
import ICategory from "../../models/ICategory";
import ISubCategory from "../../models/ISubCategory";
import IPreferences from "../../models/IPreferences";
import IObserver from "../../patterns/IObserver";

import AbstractImportStrategy, { ImportStrategyEnum } from "../../patterns/AbstractImportStrategy";
import ImportInitialDataFromJson from "../../patterns/ImportStrategy/ImportInitialDataFromJson";
import ImportFromLocalStorage from "../../patterns/ImportStrategy/ImportFromLocalStorage";
import ImportFromJson from "../../patterns/ImportStrategy/ImportFromJson";

import IExportStrategy, { ExportStrategyEnum } from "../../patterns/IExportStrategy";
import ExportToLocalStorage from "../../patterns/ExportStrategy/ExportToLocalStorage";
import ExportToJson from "../../patterns/ExportStrategy/ExportToJson";

@injectable()
export default class DataStore implements IDataStore {
  private categories: ICategory[] = [];
  private subCategories: ISubCategory[] = [];
  private preferences: IPreferences;
  private importStrategy: AbstractImportStrategy;
  private exportStrategy: IExportStrategy;
  private observers: IObserver[] = [];

  constructor() {}

  initialize = async (): Promise<void> => {
    // Importeert de data uit de local storage als deze niet leeg is,
    // Zoniet importeert het de vaste structuur van de applicatie.
    if (!this.isLocalStorageEmpty()) {
      this.pickImportStrategy(ImportStrategyEnum.LOCAL_STORAGE);
      await this.import();
    } else {
      this.pickImportStrategy(ImportStrategyEnum.JSON_INITIAL);
      await this.import();
      this.pickExportStrategy(ExportStrategyEnum.LOCAL_STORAGE);
      await this.export();
    }
  };

  private isLocalStorageEmpty = () => {
    return localStorage.getItem("categories") === null;
  };

  pickImportStrategy = (strategy: ImportStrategyEnum = ImportStrategyEnum.LOCAL_STORAGE): void => {
    switch (strategy) {
      case ImportStrategyEnum.JSON_INITIAL:
        this.importStrategy = new ImportInitialDataFromJson();
        break;
      case ImportStrategyEnum.JSON_IMPORT:
        this.importStrategy = new ImportFromJson();
        break;
      case ImportStrategyEnum.JSON_IMPORT_TEAM1:
        // TODO Implement JSON_IMPORT_TEAM1
        break;
      case ImportStrategyEnum.JSON_IMPORT_TEAM2:
        // TODO Implement JSON_IMPORT_TEAM2
        break;
      case ImportStrategyEnum.LOCAL_STORAGE:
      default:
        this.importStrategy = new ImportFromLocalStorage();
    }
  };

  import = async (optionalData?: any): Promise<boolean> => {
    try {
      const { categories, subCategories, preferences } = await this.importStrategy.import(
        {
          categories: this.categories,
          subCategories: this.subCategories,
          preferences: this.preferences
        },
        optionalData
      );

      this.categories = categories;
      this.subCategories = subCategories;
      this.preferences = preferences;
      this.notifyObservers();
      return true;
    } catch (error) {
      console.error("Import failed", error);
      return false;
    }
  };

  pickExportStrategy = (strategy: ExportStrategyEnum = ExportStrategyEnum.LOCAL_STORAGE): void => {
    switch (strategy) {
      case ExportStrategyEnum.JSON:
        this.exportStrategy = new ExportToJson();
        break;
      case ExportStrategyEnum.BACKUP:
        // TODO Implement BACKUP
        break;
      case ExportStrategyEnum.LOCAL_STORAGE:
      default:
        this.exportStrategy = new ExportToLocalStorage();
    }
  };

  export = async (): Promise<boolean> => {
    try {
      await this.exportStrategy.export({
        categories: this.categories,
        subCategories: this.subCategories,
        preferences: this.preferences
      });
      return true;
    } catch (error) {
      console.error("Import failed", error);
      return false;
    }
  };

  getCategories = (): ICategory[] => {
    return this.categories;
  };

  getCategoryById = (id: string): ICategory => {
    return this.categories.find((category) => category.id === id);
  };

  getSubCategoriesByParentId = (parentId: string): ISubCategory[] => {
    return this.subCategories.filter((subCategory) => subCategory.parentId === parentId);
  };

  addSubCategory = async (newSubCategory: ISubCategory): Promise<boolean> => {
    if (
      !this.categories.some((category: ICategory) => category.id === newSubCategory.parentId) &&
      !this.subCategories.some((subCategory: ISubCategory) => subCategory.id === newSubCategory.parentId)
    ) {
      return false;
    }

    this.subCategories.push(newSubCategory);
    await this.save();

    return true;
  };

  editSubCategory = async (id: string, updatedSubCategory: ISubCategory): Promise<void> => {
    const index = this.subCategories.findIndex((subCategory) => subCategory.id === id);
    this.subCategories[index] = updatedSubCategory;

    await this.save();
  };

  deleteSubCategory = async (id: string): Promise<void> => {
    const index = this.subCategories.findIndex((subCategory) => subCategory.id === id);
    this.subCategories.splice(index, 1);

    await this.save();
  };

  save = async (): Promise<void> => {
    this.pickExportStrategy(ExportStrategyEnum.LOCAL_STORAGE);
    await this.export();

    this.notifyObservers();
  };

  registerObserver = (observer: IObserver): void => {
    this.observers.push(observer);
    // console.log("Observer registered");
  };

  removeObserver = (observer: IObserver): void => {
    this.observers.splice(
      this.observers.findIndex((o) => o === observer),
      1
    );
    // console.log("Observer removed");
  };

  notifyObservers = () => {
    for (const observer of this.observers) {
      observer.update();
    }
    // console.log("Observers notified");
  };

  // Niet in interface, enkel voor testen
  setImportStrategy(strategy: AbstractImportStrategy): void {
    this.importStrategy = strategy;
  }
}
