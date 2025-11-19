import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../utils";

export type AlertModalType = "info" | "success" | "error" | "warning";

export interface AlertModalButton {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "destructive";
}

interface AlertModalProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: AlertModalType;
  buttons?: AlertModalButton[];
  onClose: () => void;
}

const typeConfig: Record<
  AlertModalType,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  info: { icon: "information-circle", color: Colors.primary },
  success: { icon: "checkmark-circle", color: Colors.green },
  error: { icon: "close-circle", color: Colors.red },
  warning: { icon: "warning", color: Colors.orange },
};

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title = "Alert",
  message,
  type = "info",
  buttons,
  onClose,
}) => {
  const config = typeConfig[type];

  const resolvedButtons = React.useMemo<AlertModalButton[]>(() => {
    if (buttons && buttons.length > 0) {
      return buttons;
    }
    return [
      {
        label: "OK",
        variant: "primary",
      },
    ];
  }, [buttons]);

  const handleButtonPress = React.useCallback(
    (button: AlertModalButton) => {
      onClose();
      requestAnimationFrame(() => {
        button.onPress?.();
      });
    },
    [onClose]
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Ionicons
            name={config.icon}
            size={48}
            color={config.color}
            style={styles.icon}
          />
          {!!title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsRow}>
            {resolvedButtons.map((button, index) => {
              const variant = button.variant || "primary";
              return (
                <TouchableOpacity
                  key={`${button.label}-${index}`}
                  style={[
                    styles.button,
                    variant === "secondary" && styles.secondaryButton,
                    variant === "destructive" && styles.destructiveButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      variant === "secondary" && styles.secondaryButtonText,
                    ]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  destructiveButton: {
    backgroundColor: Colors.red,
  },
});

export default AlertModal;

