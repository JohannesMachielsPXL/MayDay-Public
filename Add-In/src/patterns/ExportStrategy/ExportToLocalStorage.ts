import IExportStrategy from "../IExportStrategy";
import { IApplicationSettings } from "../AbstractImportStrategy";

export default class ExportToLocalStorage implements IExportStrategy {
  export = async (data: IApplicationSettings): Promise<void> => {
    localStorage.setItem("categories", JSON.stringify(data.categories));
    localStorage.setItem("subCategories", JSON.stringify(data.subCategories));
    localStorage.setItem("preferences", JSON.stringify(data.preferences));
  }
}
