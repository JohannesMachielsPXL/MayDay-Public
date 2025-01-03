import { IApplicationSettings } from "./AbstractImportStrategy";

export enum ExportStrategyEnum {
  LOCAL_STORAGE,
  JSON,
  BACKUP
}

export default interface IExportStrategy {
  export(state: IApplicationSettings): Promise<void>;
}
