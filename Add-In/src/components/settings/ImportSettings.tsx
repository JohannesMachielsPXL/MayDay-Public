import React, { useContext, useRef } from "react";
import { AppContext } from "../AppProvider";
import { ImportStrategyEnum } from "../../patterns/AbstractImportStrategy";
import { ExportStrategyEnum } from "../../patterns/IExportStrategy";

const ImportSettings: React.FC = () => {
  const { dataStore, toastService } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);

          dataStore.pickImportStrategy(ImportStrategyEnum.JSON_IMPORT);
          const importSuccess = await dataStore.import(json);
          if (importSuccess) {
            dataStore.pickExportStrategy(ExportStrategyEnum.LOCAL_STORAGE);
            await dataStore.export();
            toastService.toast("Instellingen succesvol geïmporteerd");
          } else {
            toastService.toast("Importeren van instellingen mislukt", "error");
          }
        } catch (error) {
          toastService.toast("Fout bij het uitlezen van de instellingen", "error");
        } finally {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <input
        data-testid="import-settings-file-input"
        type="file"
        accept=".json"
        onChange={handleJsonFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </>
  );
};

export default ImportSettings;
