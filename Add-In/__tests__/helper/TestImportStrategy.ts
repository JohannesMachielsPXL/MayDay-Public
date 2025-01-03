import AbstractImportStrategy, { IApplicationSettings } from "../../src/patterns/AbstractImportStrategy";
import ICategory from "../../src/models/ICategory";
import ISubCategory from "../../src/models/ISubCategory";
import IPreferences from "../../src/models/IPreferences";

export default class TestImportStrategy extends AbstractImportStrategy {
  constructor(
    private categories: ICategory[] = [],
    private subCategories: ISubCategory[] = [],
    private preferences: IPreferences
  ) {
    super();
  }

  async import(state: IApplicationSettings): Promise<IApplicationSettings> {
    state.categories = this.categories;
    state.subCategories = this.subCategories;
    state.preferences = this.preferences;

    return Promise.resolve(state);
  }
}
