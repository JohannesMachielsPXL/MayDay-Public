import IObserver from "./IObserver";

export default interface IObservable {
  registerObserver(observer: IObserver): void;

  removeObserver(observer: IObserver): void;

  notifyObservers(): void;
}
