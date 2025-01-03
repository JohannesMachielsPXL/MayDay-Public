import { Container } from "inversify";
import ICategoryFactory from "./factories/ICategoryFactory";
import CategoryFactory from "./factories/implementations/CategoryFactory";
import ISubCategoryFactory from "./factories/ISubCategoryFactory";
import SubCategoryFactory from "./factories/implementations/SubCategoryFactory";
import IAnnotationService from "./services/IAnnotationService";
import AnnotationService from "./services/implementations/AnnotationService";
import IAnalysisService from "./services/IAnalysisService";
import AnalysisService from "./services/implementations/AnalysisService";
import StyleService from "./services/implementations/StyleService";
import IStyleService from "./services/IStyleService";
import DataStore from "./store/implementations/DataStore";
import IDataStore from "./store/IDataStore";
import IToastService from "./services/IToastService";
import ToastService from "./services/implementations/ToastService";
import IUtilityService from "./services/IUtilityService";
import UtilityService from "./services/implementations/UtilityService";

const container = new Container();

export const TYPES = {
  IDataStore: Symbol("IDataStore"),
  ICategoryFactory: Symbol("ICategoryFactory"),
  ISubCategoryFactory: Symbol("ISubCategoryFactory"),
  IAnnotationService: Symbol("AnnotationService"),
  IAnalysisService: Symbol("IAnalysisService"),
  IStyleService: Symbol("IStyleService"),
  IToastService: Symbol("IToastService"),
  IUtilityService: Symbol("IUtilityService")
};

// Store
container.bind<IDataStore>(TYPES.IDataStore).to(DataStore).inSingletonScope();

// Factories
container.bind<ICategoryFactory>(TYPES.ICategoryFactory).to(CategoryFactory).inSingletonScope();
container.bind<ISubCategoryFactory>(TYPES.ISubCategoryFactory).to(SubCategoryFactory).inSingletonScope();

// Services
container.bind<IAnnotationService>(TYPES.IAnnotationService).to(AnnotationService).inSingletonScope();
container.bind<IAnalysisService>(TYPES.IAnalysisService).to(AnalysisService).inSingletonScope();
container.bind<IStyleService>(TYPES.IStyleService).to(StyleService).inSingletonScope();
container.bind<IToastService>(TYPES.IToastService).to(ToastService).inSingletonScope();
container.bind<IUtilityService>(TYPES.IUtilityService).to(UtilityService).inSingletonScope();

export default container;
