import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Colors } from "../../utils";
import { Button, MyTextInput } from "../../components";

type DepartmenntFormData = {
  name: string;
  status: string;
};

type AddDriverFormProps = {
  onSubmit: (data: DepartmenntFormData) => void;
  initialValues?: DepartmenntFormData | null;
};

const AddDepartmentForm: React.FC<AddDriverFormProps> = ({ onSubmit, initialValues }) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [status, setStatus] = useState(initialValues?.status === "active");

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    setName(initialValues?.name || "");
    setStatus(initialValues?.status === "active");
  }, [initialValues]);

  const handleFormSubmit = () => {
    let valid = true;
    let newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Department name is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      onSubmit({
        name,
        status: status ? "active" : "inactive",
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <MyTextInput
          label="Department Name"
          placeholder="Enter department name"
          value={name}
          error={errors.name}
          onChange={setName}
        />

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
          <Checkbox
            value={status}
            onValueChange={setStatus}
            color={status ? Colors.primary : undefined}
          />
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Active</Text>
        </View>

        <View style={styles.footerContainer}>
          <Button label="Submit" onPress={handleFormSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
  },
});

export default AddDepartmentForm;
