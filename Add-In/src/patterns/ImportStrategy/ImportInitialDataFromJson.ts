import AbstractImportStrategy, { IApplicationSettings } from "../AbstractImportStrategy";
import ICategory from "../../models/ICategory";
import { ICategoryData } from "../../factories/ICategoryFactory";
import IPreferences from "../../models/IPreferences";
import initialData from "../../../assets/data/initialData.json";

export default class ImportInitialDataFromJson extends AbstractImportStrategy {
  constructor() {
    super();
  }

  import = async (state: IApplicationSettings): Promise<IApplicationSettings> => {
    state.categories = await this.loadCategoriesFromJSON();
    state.subCategories = [];
    state.preferences = this.loadPreferencesFromJSON();

    return state;
  };

  loadCategoriesFromJSON = async (): Promise<ICategory[]> => {
    const categories: ICategory[] = [];

    initialData.categories.map((data: ICategoryData) => {
      const category: ICategory = this.categoryFactory.create(data);
      categories.push(category);
    });

    return Promise.resolve(categories);
  };

  loadPreferencesFromJSON = (): IPreferences => {
    return {
      backgroundColor: initialData.preferences.backgroundColor,
      backupFolderPath: initialData.preferences.backupFolderPath
    };
  };
}
