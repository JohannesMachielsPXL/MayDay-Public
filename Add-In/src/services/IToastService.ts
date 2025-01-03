import IObservable from "../patterns/IObservable";
import { ToastIntent } from "@fluentui/react-components";

export default interface IToastService extends IObservable {
  toast(message: string): void;

  getMessage(): string;
  getIntent(): ToastIntent;
}
