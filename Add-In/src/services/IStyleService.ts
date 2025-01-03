import ICategory from "../models/ICategory";

export default interface IStyleService {
  getStyleName(category: ICategory): Promise<string>;

  getFeedbackStyleName(): Promise<string>;
}