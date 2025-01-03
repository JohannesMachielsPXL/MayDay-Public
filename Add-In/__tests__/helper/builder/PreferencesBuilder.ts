import { randomString } from "../Random";
import IPreferences from "../../../src/models/IPreferences";

export default class PreferencesBuilder {
  private readonly preferences: IPreferences;

  constructor() {
    this.preferences = {
      backgroundColor: randomString(),
      backupFolderPath: randomString()
    };
  }

  withBackgroundColor(backgroundColor: string): this {
    this.preferences.backgroundColor = backgroundColor;
    return this;
  }

  withBackupFolderPath(backupFolderPath: string): this {
    this.preferences.backupFolderPath = backupFolderPath;
    return this;
  }

  build(): IPreferences {
    return this.preferences;
  }
}
