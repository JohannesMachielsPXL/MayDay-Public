export default interface IAnalysisService {
  printInfo(): Promise<void>;

  downloadXML(): Promise<void>;
}
