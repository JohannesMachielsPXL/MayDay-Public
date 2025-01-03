import * as React from "react";
import {
  useId,
  Link,
  Toaster,
  useToastController,
  ToastTitle,
  ToastTrigger,
  Toast,
  ToastIntent
} from "@fluentui/react-components";
import { AppContext, IAppInterfaces } from "./AppProvider";
import { useContext, useEffect } from "react";
import IObserver from "../patterns/IObserver";

export const CloseableToast = () => {
  const { toastService }: IAppInterfaces = useContext(AppContext);

  useEffect(() => {
    const observer: IObserver = {
      update: () => {
        const message = toastService.getMessage();
        const intent = toastService.getIntent();
        notify(message, intent);
      }
    };

    toastService.registerObserver(observer);

    // Cleanup function to remove observer when component unmounts
    return () => {
      toastService.removeObserver(observer);
    };
  }, [toastService]);

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = (message: string, intent: ToastIntent) =>
    dispatchToast(
      <Toast>
        <ToastTitle
          action={
            <ToastTrigger>
              <Link>Sluit</Link>
            </ToastTrigger>
          }
        >
          {message}
        </ToastTitle>
      </Toast>,
      { position: "bottom", timeout: 1500, intent: intent }
    );

  return (
    <>
      <Toaster toasterId={toasterId} />
    </>
  );
};
