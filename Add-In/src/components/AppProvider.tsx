import React, { createContext } from "react";
import container, { TYPES } from "../DIContainer";
import IDataStore from "../store/IDataStore";
import IAnnotationService from "../services/IAnnotationService";
import IAnalysisService from "../services/IAnalysisService";
import IToastService from "../services/implementations/ToastService";
import IStyleService from "../services/IStyleService";
import IUtilityService from "../services/IUtilityService";
import ISubCategoryFactory from "../factories/ISubCategoryFactory";

export interface IAppInterfaces {
  dataStore: IDataStore;
  subCategoryFactory: ISubCategoryFactory;
  annotationService: IAnnotationService;
  analysisService: IAnalysisService;
  styleService: IStyleService;
  toastService: IToastService;
  utilityService: IUtilityService;
}

const AppInterfaces: IAppInterfaces = {
  dataStore: container.get<IDataStore>(TYPES.IDataStore),
  subCategoryFactory: container.get<ISubCategoryFactory>(TYPES.ISubCategoryFactory),
  annotationService: container.get<IAnnotationService>(TYPES.IAnnotationService),
  analysisService: container.get<IAnalysisService>(TYPES.IAnalysisService),
  styleService: container.get<IStyleService>(TYPES.IStyleService),
  toastService: container.get<IToastService>(TYPES.IToastService),
  utilityService: container.get<IUtilityService>(TYPES.IUtilityService)
};

export const AppContext = createContext<IAppInterfaces>(AppInterfaces);

export const AppProvider: React.FC<{ children: React.ReactNode; value?: IAppInterfaces }> = ({ children, value }) => {
  const contextValue = value || AppInterfaces;

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
