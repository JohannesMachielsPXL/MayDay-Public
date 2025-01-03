import IExportStrategy from "../IExportStrategy";
import { IApplicationSettings } from "../AbstractImportStrategy";

export default class ExportToJson implements IExportStrategy {
  export = async (state: IApplicationSettings): Promise<void> => {
      const { categories, subCategories } = state;

      const json = JSON.stringify({
        categories: categories.map((category) => {
          return { id: category.id, color: category.color };
        }),
        subCategories,
        preferences: {},
      });

      this.downloadFile(json, "data.json", "application/json");
  };

  downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}
