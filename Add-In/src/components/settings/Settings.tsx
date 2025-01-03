import * as React from "react";
import { useContext } from "react";
import { Button, Card } from "@fluentui/react-components";
import { ArrowImportRegular, BuildingFactoryRegular, SaveRegular } from "@fluentui/react-icons";
import { AppContext, IAppInterfaces } from "../AppProvider";
import { ImportStrategyEnum } from "../../patterns/AbstractImportStrategy";
import { ExportStrategyEnum } from "../../patterns/IExportStrategy";
import ImportSettings from "./ImportSettings";

const Settings: React.FC = () => {
  const { dataStore, toastService }: IAppInterfaces = useContext(AppContext);

  const backToFactorySettingsButtonClick = async () => {
    dataStore.pickImportStrategy(ImportStrategyEnum.JSON_INITIAL);
    const importSuccess = await dataStore.import();
    if (importSuccess) {
      dataStore.pickExportStrategy(ExportStrategyEnum.LOCAL_STORAGE);
      await dataStore.export();
      toastService.toast("Settings successfully reset to factory defaults");
    } else {
      toastService.toast("Failed to reset settings to factory defaults");
    }
  };

  const importSettingsButtonClick = () => {
    const fileInputRef = document.querySelector<HTMLInputElement>("input[type=\"file\"]");
    fileInputRef?.click();
  };

  const downloadSettingsButtonClick = async () => {
    dataStore.pickExportStrategy(ExportStrategyEnum.JSON);
    await dataStore.export();
  };

  return (
    <>
      <Card size={"large"}>
        <div className={"horizontal-buttons"}>
          <Button
            className="vertical-button"
            size={"small"}
            appearance={"subtle"}
            icon={<BuildingFactoryRegular />}
            onClick={backToFactorySettingsButtonClick}
          >
            Fabrieks-instellingen
          </Button>

          <ImportSettings />
          <Button
            data-testid="import-settings-button"
            className="vertical-button"
            size={"small"}
            appearance={"subtle"}
            icon={<ArrowImportRegular />}
            onClick={importSettingsButtonClick}
          >
            Importeer instellingen
          </Button>

          <Button
            className="vertical-button"
            size={"small"}
            appearance={"subtle"}
            icon={<SaveRegular />}
            onClick={downloadSettingsButtonClick}
          >
            Download instellingen
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Settings;
