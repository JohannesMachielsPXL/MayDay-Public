import { injectable } from "inversify";
import IToastService from "../IToastService";
import IObserver from "../../patterns/IObserver";
import { ToastIntent } from "@fluentui/react-components";

@injectable()
export default class ToastService implements IToastService {
  private observers: IObserver[] = [];
  private message: string = "";
  private intent: ToastIntent;

  constructor() {}

  toast = (message: string, intent: ToastIntent = "success"): void => {
    this.message = message;
    this.intent = intent;
    this.notifyObservers();
  };

  getMessage = (): string => {
    return this.message;
  };

  getIntent = (): ToastIntent => {
    return this.intent;
  };

  registerObserver = (observer: IObserver): void => {
    this.observers.push(observer);
  };

  removeObserver = (observer: IObserver): void => {
    this.observers = this.observers.filter((o) => o !== observer);
  };

  notifyObservers = () => {
    for (const observer of this.observers) {
      observer.update();
    }
  };
}
