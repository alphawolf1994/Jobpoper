import { StyleSheet, View } from "react-native";
import { Button, Text } from "@react-navigation/elements";

export function Updates() {
  return (
    <View style={styles.container}>
      <Text>Updates Screen</Text>
      <Button screen="Profile" params={{ user: "jane" }}>
        Go to Profile
      </Button>
      <Button screen="Settings">Go to Settings</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
