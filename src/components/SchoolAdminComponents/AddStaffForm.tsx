import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../../utils";
import { Button, MyTextInput } from "../../components";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSchoolDepartment } from "../../redux/slices/DepartmentSlice";

type StaffFormData = {
  name: string;
  role: string;
  department: string;
  gender: string;
  contactNumber: string;
  email: string;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  dateOfJoining: string;
  qualification: string;
  workExperience: string;
  note: string;
  address: string;
  epfNo: string;
  basicSalary: string;
  contractType: string;
  workShift: string;
  image?: string;
  hostelEnabled?: boolean;
  hostel?: string;
  roomNo?: string;
  transportEnabled?: boolean;
  route?: string;
  vehicleNumber?: string;
  pickupPoint?: string;
  password?: string;
  confirmPassword?: string;
};

type AddStaffFormProps = {
  onSubmit: (data: StaffFormData) => void;
  initialValues?: StaffFormData | null;
};

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSubmit, initialValues }) => {
  // State for all fields
  const dispatch = useDispatch<AppDispatch>();

   const { schoolDepartment, loading, } = useSelector(
    (state: RootState) => state.DepartmentSlice
  );
  const [image, setImage] = useState<string | null>(initialValues?.image || null);
  const [name, setName] = useState(initialValues?.name || "");
  const [role, setRole] = useState(initialValues?.role || "");
  const [department, setDepartment] = useState(initialValues?.department || "");
  const [gender, setGender] = useState(initialValues?.gender || "");
  const [contactNumber, setContactNumber] = useState(initialValues?.contactNumber || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [maritalStatus, setMaritalStatus] = useState(initialValues?.maritalStatus || "");
  const [fatherName, setFatherName] = useState(initialValues?.fatherName || "");
  const [motherName, setMotherName] = useState(initialValues?.motherName || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialValues?.dateOfBirth || "");
  const [dateOfJoining, setDateOfJoining] = useState(initialValues?.dateOfJoining || "");
  const [qualification, setQualification] = useState(initialValues?.qualification || "");
  const [workExperience, setWorkExperience] = useState(initialValues?.workExperience || "");
  const [note, setNote] = useState(initialValues?.note || "");
  const [address, setAddress] = useState(initialValues?.address || "");
  const [epfNo, setEpfNo] = useState(initialValues?.epfNo || "");
  const [basicSalary, setBasicSalary] = useState(initialValues?.basicSalary || "");
  const [contractType, setContractType] = useState(initialValues?.contractType || "");
  const [workShift, setWorkShift] = useState(initialValues?.workShift || "");
  // Hostel Info
  const [hostelEnabled, setHostelEnabled] = useState(false);
  const [hostel, setHostel] = useState("");
  const [roomNo, setRoomNo] = useState("");
  // Transport Info
  const [transportEnabled, setTransportEnabled] = useState(false);
  const [route, setRoute] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  // Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dropdown states
  const [openRole, setOpenRole] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { value: "Accountant", label: "Accountant" },
  { value: "Librarian", label: "Librarian" },
  ]);

  const [openDepartment, setOpenDepartment] = useState(false);
  const [departmentItems, setDepartmentItems] = useState([
    { label: "Science", value: "Science" },
    { label: "Math", value: "Math" },
    { label: "Arts", value: "Arts" },
  ]);

  const [openGender, setOpenGender] = useState(false);
  const [genderItems, setGenderItems] = useState([
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  ]);

  const [openMarital, setOpenMarital] = useState(false);
  const [maritalItems, setMaritalItems] = useState([
     { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  ]);

  const [openContract, setOpenContract] = useState(false);
  const [contractItems, setContractItems] = useState([
    { value: "Permanent", label: "Permanent" },
  { value: "Temporary", label: "Temporary" },
  ]);

  const [openWorkShift, setOpenWorkShift] = useState(false);
  const [workShiftItems, setWorkShiftItems] = useState([
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  ]);

  // Add these states for hostel/room/route/vehicle/pickup dropdowns
  const [openHostel, setOpenHostel] = useState(false);
  const [hostelItems, setHostelItems] = useState([
    { label: "Hostel A", value: "Hostel A" },
    { label: "Hostel B", value: "Hostel B" },
    { label: "Hostel C", value: "Hostel C" },
  ]);

  const [openRoomNo, setOpenRoomNo] = useState(false);
  const [roomNoItems, setRoomNoItems] = useState([
    { label: "101", value: "101" },
    { label: "102", value: "102" },
    { label: "201", value: "201" },
  ]);

  const [openRoute, setOpenRoute] = useState(false);
  const [routeItems, setRouteItems] = useState([
    { label: "Route 1", value: "Route 1" },
    { label: "Route 2", value: "Route 2" },
    { label: "Route 3", value: "Route 3" },
  ]);

  const [openVehicleNumber, setOpenVehicleNumber] = useState(false);
  const [vehicleNumberItems, setVehicleNumberItems] = useState([
    { label: "Bus 1", value: "Bus 1" },
    { label: "Bus 2", value: "Bus 2" },
    { label: "Van 1", value: "Van 1" },
  ]);

  const [openPickupPoint, setOpenPickupPoint] = useState(false);
  const [pickupPointItems, setPickupPointItems] = useState([
    { label: "Stop A", value: "Stop A" },
    { label: "Stop B", value: "Stop B" },
    { label: "Stop C", value: "Stop C" },
  ]);

  // Example: You can add validation errors state if needed
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Date pickers state
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [showDOJPicker, setShowDOJPicker] = useState(false);
  const dobSheetRef = React.useRef<RBSheet>(null);
  const dojSheetRef = React.useRef<RBSheet>(null);

  // Helper to get today (for maxDate)
  const today = new Date();
 useEffect(() => {
     dispatch(fetchSchoolDepartment());
  }, [dispatch]);
  useEffect(() => {
    if (initialValues) {
      setImage(initialValues.image || null);
      setName(initialValues.name || "");
      setRole(initialValues.role || "");
      setDepartment(initialValues.department || "");
      setGender(initialValues.gender || "");
      setContactNumber(initialValues.contactNumber || "");
      setEmail(initialValues.email || "");
      setMaritalStatus(initialValues.maritalStatus || "");
      setFatherName(initialValues.fatherName || "");
      setMotherName(initialValues.motherName || "");
      setDateOfBirth(initialValues.dateOfBirth || "");
      setDateOfJoining(initialValues.dateOfJoining || "");
      setQualification(initialValues.qualification || "");
      setWorkExperience(initialValues.workExperience || "");
      setNote(initialValues.note || "");
      setAddress(initialValues.address || "");
      setEpfNo(initialValues.epfNo || "");
      setBasicSalary(initialValues.basicSalary || "");
      setContractType(initialValues.contractType || "");
      setWorkShift(initialValues.workShift || "");
      setHostelEnabled(initialValues.hostelEnabled || false);
      setHostel(initialValues.hostel || "");
      setRoomNo(initialValues.roomNo || "");
      setTransportEnabled(initialValues.transportEnabled || false);
      setRoute(initialValues.route || "");
      setVehicleNumber(initialValues.vehicleNumber || "");
      setPickupPoint(initialValues.pickupPoint || "");
    }
  }, [initialValues]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFormSubmit = () => {
    let newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!role) newErrors.role = "Role is required";
    if (!department) newErrors.department = "Department is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!basicSalary.trim()) newErrors.basicSalary = "Basic salary is required";
    if (!contractType) newErrors.contractType = "Contract type is required";
    if (!workShift) newErrors.workShift = "Work shift is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      name,
      role,
      department,
      gender,
      contactNumber,
      email,
      maritalStatus,
      fatherName,
      motherName,
      dateOfBirth,
      dateOfJoining,
      qualification,
      workExperience,
      note,
      address,
      epfNo,
      basicSalary,
      contractType,
      workShift,
      hostelEnabled,
      hostel: hostelEnabled ? hostel : "",
      roomNo: hostelEnabled ? roomNo : "",
      transportEnabled,
      route: transportEnabled ? route : "",
      vehicleNumber: transportEnabled ? vehicleNumber : "",
      pickupPoint: transportEnabled ? pickupPoint : "",
      password,
      confirmPassword,
      image: image || "",
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 150, height: 150, borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 150,
                height: 150,
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: Colors.primary }}>Tap to select image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <Text style={styles.sectionTitle}>Personal Information</Text>
    <MyTextInput label="Name" value={name} onChange={setName} placeholder="Enter Name" />
    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

    <Text style={styles.label}>Role</Text>
    <DropDownPicker
      open={openRole}
      value={role}
      items={roleItems}
      setOpen={setOpenRole}
      setValue={setRole}
      setItems={setRoleItems}
      placeholder="Select Role"
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2000}
                    zIndexInverse={1000}
    />
    {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

    <Text style={styles.label}>Department</Text>
    <DropDownPicker
      open={openDepartment}
      value={department}
      items={
        schoolDepartment && Array.isArray(schoolDepartment)
          ? schoolDepartment.map((dept: any) => ({
              label: dept.name,
              value: dept._id,
            }))
          : []
      }
      setOpen={setOpenDepartment}
      setValue={setDepartment}
      setItems={() => {}} // Items are controlled by API, so no-op
      placeholder="Select Department"
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
      zIndex={1900}
      zIndexInverse={1000}
    />
    {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}

    <Text style={styles.label}>Gender</Text>
    <DropDownPicker
      open={openGender}
      value={gender}
      items={genderItems}
      setOpen={setOpenGender}
      setValue={setGender}
      setItems={setGenderItems}
      placeholder="Select Gender"
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1800}
                    zIndexInverse={1000}
    />
    {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

    <MyTextInput label="Contact Number" value={contactNumber} onChange={setContactNumber} placeholder="Enter Contact Number" keyboardType="phone-pad" />
    {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

    <MyTextInput label="Email Address" value={email} onChange={setEmail} placeholder="Enter Email" keyboardType="email-address" />
    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
<Text style={styles.label}>Marital Status</Text>
<DropDownPicker
  open={openMarital}
  value={maritalStatus}
  items={maritalItems}
  setOpen={setOpenMarital}
  setValue={setMaritalStatus}
  setItems={setMaritalItems}
  placeholder="Select Marital Status"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownContainer}
  zIndex={1700}
  zIndexInverse={1000}
/>
{errors.maritalStatus && <Text style={styles.errorText}>{errors.maritalStatus}</Text>}
    <MyTextInput label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="Enter Father's Name" />
    <MyTextInput label="Mother's Name" value={motherName} onChange={setMotherName} placeholder="Enter Mother's Name" />

    {/* Date of Birth */}
    <View>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === "ios") {
            dobSheetRef.current?.open();
          } else {
            setShowDOBPicker(true);
          }
        }}
        style={[styles.dropdown, { justifyContent: "center", height: 50 }]}
      >
        <Text style={{ color: dateOfBirth ? Colors.black : Colors.gray }}>
          {dateOfBirth ? dateOfBirth : "dd/mm/yyyy"}
        </Text>
      </TouchableOpacity>
      {/* Android Picker */}
      {showDOBPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : today}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={(_, selectedDate) => {
            setShowDOBPicker(false);
            if (selectedDate) {
              setDateOfBirth(selectedDate.toISOString().split("T")[0]);
            }
          }}
        />
      )}
      {/* iOS Bottom Sheet Picker */}
      <RBSheet
        ref={dobSheetRef}
        height={320}
        openDuration={250}
        customStyles={{
          container: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
        }}
        
        closeOnPressMask
      >
        <View style={{ padding: 16 }}>
          <DateTimePicker
            value={dateOfBirth ? new Date(dateOfBirth) : today}
            mode="date"
            display="spinner"
            maximumDate={today}
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setDateOfBirth(selectedDate.toISOString().split("T")[0]);
              }
            }}
            style={{ width: "100%" }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => dobSheetRef.current?.close()}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dobSheetRef.current?.close()}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </View>

    {/* Date of Joining */}
    <View>
      <Text style={styles.label}>Date of Joining</Text>
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === "ios") {
            dojSheetRef.current?.open();
          } else {
            setShowDOJPicker(true);
          }
        }}
        style={[styles.dropdown, { justifyContent: "center", height: 50 }]}
      >
        <Text style={{ color: dateOfJoining ? Colors.black : Colors.gray }}>
          {dateOfJoining ? dateOfJoining : "dd/mm/yyyy"}
        </Text>
      </TouchableOpacity>
      {/* Android Picker */}
      {showDOJPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={dateOfJoining ? new Date(dateOfJoining) : today}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={(_, selectedDate) => {
            setShowDOJPicker(false);
            if (selectedDate) {
              setDateOfJoining(selectedDate.toISOString().split("T")[0]);
            }
          }}
        />
      )}
      {/* iOS Bottom Sheet Picker */}
      <RBSheet
        ref={dojSheetRef}
        height={320}
        openDuration={250}
        customStyles={{
          container: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
        }}
        
        closeOnPressMask
      >
        <View style={{ padding: 16 }}>
          <DateTimePicker
            value={dateOfJoining ? new Date(dateOfJoining) : today}
            mode="date"
            display="spinner"
            maximumDate={today}
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setDateOfJoining(selectedDate.toISOString().split("T")[0]);
              }
            }}
            style={{ width: "100%" }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => dojSheetRef.current?.close()}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dojSheetRef.current?.close()}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </View>

    <MyTextInput label="Qualification" value={qualification} onChange={setQualification} placeholder="Enter Qualification" />
    <MyTextInput label="Work Experience" value={workExperience} onChange={setWorkExperience} placeholder="Enter Work Experience" />
    <MyTextInput label="Note" value={note} onChange={setNote} placeholder="Enter Note" />
    <MyTextInput label="Address" value={address} onChange={setAddress} placeholder="Enter Address" />
    {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

    {/* Payroll */}
      <Text style={styles.sectionTitle}>Payroll</Text>
    <MyTextInput label="EPF No" value={epfNo} onChange={setEpfNo} placeholder="Enter EPF No" />
    <MyTextInput label="Basic Salary" value={basicSalary} onChange={setBasicSalary} keyboardType="numeric" placeholder="Enter Basic Salary" />
    {errors.basicSalary && <Text style={styles.errorText}>{errors.basicSalary}</Text>}

    <Text style={styles.label}>Contract Type</Text>
    <DropDownPicker
      open={openContract}
      value={contractType}
      items={contractItems}
      setOpen={setOpenContract}
      setValue={setContractType}
      setItems={setContractItems}
      placeholder="Select Contract Type"
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1600}
                    zIndexInverse={1000}
    />
    {errors.contractType && <Text style={styles.errorText}>{errors.contractType}</Text>}

    <Text style={styles.label}>Work Shift</Text>
    <DropDownPicker
      open={openWorkShift}
      value={workShift}
      items={workShiftItems}
      setOpen={setOpenWorkShift}
      setValue={setWorkShift}
      setItems={setWorkShiftItems}
      placeholder="Select Work Shift"
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1500}
                    zIndexInverse={1000}
    />
    {errors.workShift && <Text style={styles.errorText}>{errors.workShift}</Text>}

      {/* Hostel Information */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hostel Information</Text>
        <Switch
          value={hostelEnabled}
          onValueChange={setHostelEnabled}
          trackColor={{ false: "#ccc", true: Colors.primary }}
          thumbColor={hostelEnabled ? Colors.primary : "#f4f3f4"}
        />
      </View>
      {hostelEnabled && (
        <View style={styles.row}>
          <View style={{ flex: 1, }}>
            <Text style={styles.label}>Hostel</Text>
            <DropDownPicker
              open={openHostel}
              value={hostel}
              items={hostelItems}
              setOpen={setOpenHostel}
              setValue={setHostel}
              setItems={setHostelItems}
              placeholder="Select Hostel"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1400}
              zIndexInverse={1000}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Room No</Text>
            <DropDownPicker
              open={openRoomNo}
              value={roomNo}
              items={roomNoItems}
              setOpen={setOpenRoomNo}
              setValue={setRoomNo}
              setItems={setRoomNoItems}
              placeholder="Select Room No"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1300}
              zIndexInverse={1000}
            />
          </View>
        </View>
      )}

      {/* Transport Information */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transport Information</Text>
        <Switch
          value={transportEnabled}
          onValueChange={setTransportEnabled}
          trackColor={{ false: "#ccc", true: Colors.primary }}
          thumbColor={transportEnabled ? Colors.primary : "#f4f3f4"}
        />
      </View>
      {transportEnabled && (
        <View style={styles.row}>
          <View style={{ flex: 1, }}>
            <Text style={styles.label}>Route</Text>
            <DropDownPicker
              open={openRoute}
              value={route}
              items={routeItems}
              setOpen={setOpenRoute}
              setValue={setRoute}
              setItems={setRouteItems}
              placeholder="Select Route"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1200}
              zIndexInverse={1000}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Vehicle Number</Text>
            <DropDownPicker
              open={openVehicleNumber}
              value={vehicleNumber}
              items={vehicleNumberItems}
              setOpen={setOpenVehicleNumber}
              setValue={setVehicleNumber}
              setItems={setVehicleNumberItems}
              placeholder="Select Vehicle Number"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1100}
              zIndexInverse={1000}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Pickup Point</Text>
            <DropDownPicker
              open={openPickupPoint}
              value={pickupPoint}
              items={pickupPointItems}
              setOpen={setOpenPickupPoint}
              setValue={setPickupPoint}
              setItems={setPickupPointItems}
              placeholder="Select Pickup Point"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1000}
              zIndexInverse={900}
            />
          </View>
        </View>
      )}

      {/* Password */}
      <Text style={styles.sectionTitle}>Password</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <MyTextInput label="New Password" value={password} onChange={setPassword} placeholder="Enter New Password" secureTextEntry />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <MyTextInput label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm Password" secureTextEntry />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Button label="Submit" onPress={handleFormSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: Colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#f2f4fa",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  row: {
    // flexDirection: "row",
    marginBottom: 10,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  dropdown: {
    // marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.gray,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
    color: Colors.black,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
});

export default AddStaffForm;
