import React from "react";
import AlertModal, {
  AlertModalButton,
  AlertModalType,
} from "../components/AlertModal";

interface ShowAlertOptions {
  title?: string;
  message: string;
  type?: AlertModalType;
  buttons?: AlertModalButton[];
  onClose?: () => void;
}

interface UseAlertModalResult {
  showAlert: (options: ShowAlertOptions) => void;
  hideAlert: () => void;
  AlertComponent: JSX.Element;
}

export const useAlertModal = (): UseAlertModalResult => {
  const [visible, setVisible] = React.useState(false);
  const [options, setOptions] = React.useState<ShowAlertOptions>({
    title: "Alert",
    message: "",
    type: "info",
  });

  const onCloseRef = React.useRef<(() => void) | undefined>();

  const hideAlert = React.useCallback(() => {
    setVisible(false);
    if (onCloseRef.current) {
      onCloseRef.current();
      onCloseRef.current = undefined;
    }
  }, []);

  const showAlert = React.useCallback((config: ShowAlertOptions) => {
    onCloseRef.current = config.onClose;
    setOptions({
      title: config.title ?? "Alert",
      message: config.message,
      type: config.type ?? "info",
      buttons: config.buttons,
    });
    setVisible(true);
  }, []);

  const AlertComponent = React.useMemo(
    () => (
      <AlertModal
        visible={visible}
        title={options.title}
        message={options.message}
        type={options.type}
        buttons={options.buttons}
        onClose={hideAlert}
      />
    ),
    [hideAlert, options, visible]
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

export type { AlertModalButton, AlertModalType, ShowAlertOptions };

