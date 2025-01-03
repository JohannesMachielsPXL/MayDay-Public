import AbstractImportStrategy, { IApplicationSettings } from "../AbstractImportStrategy";
import ICategory from "../../models/ICategory";
import ISubCategory from "../../models/ISubCategory";
import IPreferences from "../../models/IPreferences";

export default class ImportFromLocalStorage extends AbstractImportStrategy {
  constructor() {
    super();
  }

  import = async (state: IApplicationSettings): Promise<IApplicationSettings> => {
    state.categories = JSON.parse(localStorage.getItem("categories")) as ICategory[];
    state.subCategories = JSON.parse(localStorage.getItem("subCategories")) as ISubCategory[];
    state.preferences = JSON.parse(localStorage.getItem("preferences")) as IPreferences;

    return Promise.resolve(state);
  };
}
