import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Platform,
} from "react-native";

import { Colors, } from "../../utils";
import { Button, ErrorText, MyTextInput } from "../../components";
import { Controller, useForm } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
type DriverFormData = {
    schoolName: string;
    schoolContact: string;
    routeName: string;
    driverName: string;
    vehicleName: string;
    bookingPrice: string;


};

type AddDriverFormProps = {
    onSubmit: () => void;
    initialValues?: DriverFormData | null;
};

const AddBookingForm: React.FC<AddDriverFormProps> = ({ onSubmit, initialValues }) => {
    const addTimingBottomSheetRef = useRef<any>(null);
    const [schoolName, setSchoolName] = useState('');
    const [schoolContact, setschoolContact] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [routeName, setRouteName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedField, setSelectedField] = useState<"pickupTime" | "dropTime" | null>(null);
    const [tempTime, setTempTime] = useState<Date>(new Date());

    const [stepNumber, setStepNumber] = useState(1);
    const [openDrivers, setOpenDrivers] = useState(false);
    const [openVehicles, setOpenVehicles] = useState(false);
    const [pickupPoints, setPickupPoints] = useState([{ name: '', address: '',pickupTime:'',dropTime:'' }]);
   
    const [driverList, setDriverList] = useState([
        { label: "Aditya", value: "Aditya" },
        { label: "Jagadeesh", value: "Jagadeesh" },
        { label: "Hamid Raza", value: "hamid raza" },
        { label: "Rayan", value: "rayan" },
    ]);
    const [vehicleList, setVehicleList] = useState([
        { label: "Benz Bus", value: "Benz Bus" },
        { label: "Toyota Bus", value: "Toyota Bus" },
        { label: "Skyline", value: "Skyline" },
    ]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});





    const validateStepOne = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!schoolName.trim()) tempErrors.schoolName = "School name is required";
        if (!contactPerson.trim()) tempErrors.contactPerson = "Contact person name is required";
        if (!schoolContact.trim()) tempErrors.schoolContact = "Contact number is required";

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };
    const validateStepTwo = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!routeName.trim()) tempErrors.routeName = "Route name is required";
        if (!vehicleName.trim()) tempErrors.vehicleName = "Vehicle name is required";
        if (!driverName.trim()) tempErrors.driverName = "Driver name is required";

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const secondStep = () => {
        if (validateStepOne()) {
            setStepNumber(2);
        }
    };
    const backToFirstStep = () => {
        setStepNumber(1);
    };
    const thirdStep = () => {
        if (validateStepTwo()) {
            setStepNumber(3);
        }
    };
    const backTosecondStep = () => {
        setStepNumber(2);
    };
    const addNewPickupPoint = () => {
        setPickupPoints([...pickupPoints, { name: '', address: '',pickupTime:'',dropTime:'' }]);
    };
    const handlePickerChange = (
        _event: any,
        selectedDate?: Date,
        index?: number,
        field?: "pickupTime" | "dropTime"
      ) => {
        if (selectedDate && index !== undefined && field) {
          setTempTime(selectedDate);
      
          const newPoints = [...pickupPoints];
          const formattedTime = selectedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          newPoints[index][field] = formattedTime;
          setPickupPoints(newPoints);
        }
      };
      
      const handlePickerChange1 = (_event: any, selectedDate?: Date) => {
        if (selectedDate) {
          setTempTime(selectedDate);
         
        
        }
      };
      const confirmTimeSelection = () => {
        if (selectedIndex !== null && selectedField) {
          const newPoints = [...pickupPoints];
          
          const formattedTime = tempTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          newPoints[selectedIndex][selectedField] = formattedTime;
          setPickupPoints(newPoints);
        }
        addTimingBottomSheetRef.current?.close();
     
      };
      const openTimePicker = (index:any, field:any) => {
        setSelectedIndex(index);
        setSelectedField(field);
   
  
        if (Platform.OS === "android") {
         
                DateTimePickerAndroid.open({
                    value: new Date(),
                    mode: "time",
                    is24Hour: false,
                 onChange: (_event, selectedDate) => {
                handlePickerChange(_event, selectedDate, index, field);
            },
                  });
         
        
        } else {
          addTimingBottomSheetRef.current?.open();
        }
      };
    return (

        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pass the form as a child */}

            <View>
                {stepNumber == 1 && <View>
                    <MyTextInput
                        label="School Name"
                        placeholder="Enter school name"
                        value={schoolName}
                        error={errors.schoolName}
                        onChange={setSchoolName}
                    />


                    <MyTextInput
                        label="Contact Person Name"
                        value={contactPerson}
                        error={errors.contactPerson}
                        placeholder="Enter contact person"
                        onChange={setContactPerson}
                    />
                    <MyTextInput
                        label="Contact No"
                        value={schoolContact}
                        error={errors.schoolContact}
                        placeholder="Enter contact No"
                        keyboardType="numeric"
                        onChange={setschoolContact}
                    />
                    <View style={styles.footerContainer}>
                        <Button label="Next" onPress={() => { secondStep() }} style={{ width: '100%' }} />
                    </View>
                </View>}

                {stepNumber == 2 && <View>
                    <MyTextInput
                        label="Route Name"
                        placeholder="Enter route name"
                        value={routeName}
                        error={errors.routeName}
                        onChange={setRouteName}
                    />
                  
                    <Text style={styles.label}>Select Vehicle</Text>

                    <DropDownPicker
                        open={openVehicles}
                        value={vehicleName}
                        items={vehicleList}
                        setOpen={setOpenVehicles}
                        setValue={(value) => { setVehicleName(value) }}
                        setItems={setVehicleList}
                        placeholder="Select vehicle"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={200}
                        zIndexInverse={1000}
                    />
                    {errors.vehicleName && <ErrorText error={errors.vehicleName} />}
                    <Text style={styles.label}>Select Driver</Text>

                    <DropDownPicker
                        open={openDrivers}
                        value={driverName}
                        items={driverList}
                        setOpen={setOpenDrivers}
                        setValue={(value) => { setDriverName(value) }}
                        setItems={setDriverList}
                        placeholder="Select driver"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={100}
                        zIndexInverse={1000}
                    />
                    {errors.driverName && <ErrorText error={errors.driverName} />}

                    <View style={styles.footerContainer}>
                        <Button label="Back" onPress={() => { backToFirstStep() }} style={styles.backBtn} />
                        <Button label="Next" onPress={() => { thirdStep() }} style={styles.nextBtn} />
                    </View>
                </View>}


                {stepNumber == 3 && <View>
                    <TouchableOpacity style={styles.paidFeeContainer} onPress={addNewPickupPoint}>
        <Text style={[styles.feeText]}>Add New Pickup Point</Text>
    </TouchableOpacity>

    {pickupPoints.map((point, index) => (
        <View key={index}>
            <Text style={styles.pickupTitle}>Pickup Point {index + 1}</Text>
            <MyTextInput
                label="Pickup Point Name"
                placeholder="Enter pickup point name"
                value={point.name}
                onChange={(text) => {
                    const newPoints = [...pickupPoints];
                    newPoints[index].name = text;
                    setPickupPoints(newPoints);
                }}
            />
            <MyTextInput
                label="Address"
                placeholder="Enter address"
                value={point.address}
                onChange={(text) => {
                    const newPoints = [...pickupPoints];
                    newPoints[index].address = text;
                    setPickupPoints(newPoints);
                }}
            />
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
           {/* Pickup Time Input */}
           <TouchableOpacity  onPress={() => openTimePicker(index, "pickupTime")} style={{width:'45%'}}>
           <View pointerEvents="none">
  <MyTextInput
    label="Pickup Time"
    placeholder="Select Time"
    value={point.pickupTime}
    editable={false}
  />
  </View>
</TouchableOpacity>

<TouchableOpacity  onPress={() => openTimePicker(index, "dropTime")} style={{width:'45%'}}>
<View pointerEvents="none">
  <MyTextInput
    label="Drop Time"
    placeholder="Select Time"
    value={point.dropTime}
    editable={false}
  />
  </View>
</TouchableOpacity>
</View>
{/* Bottom sheet only needed on iOS */}
{Platform.OS === "ios" && (
        <RBSheet
          ref={addTimingBottomSheetRef}
          height={350}
          openDuration={250}
          customStyles={{
            container: { padding: 20 },
          }}
        >
          <View style={{ width: "100%" }}>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="spinner"
              onChange={handlePickerChange1}
            />
            <Button label="OK" onPress={() => confirmTimeSelection()} />
          </View>
        </RBSheet>
      )}


  
  

 
        </View>
    ))}
  

                    <View style={styles.footerContainer}>

                      
                        <Button label="Back" onPress={() => { backTosecondStep() }} style={styles.backBtn} />
                        <Button label="submit" onPress={() => { onSubmit() }} style={styles.nextBtn} />
                    </View>
                </View>}

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
        justifyContent: "space-between",
        flexDirection: 'row'
    },
    dropdown: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.gray,

    },
    dropdownContainer: {
        position: "absolute",
        top: 50,

    },
    backBtn: {
        width: '45%',
        backgroundColor: Colors.gray
    },
    nextBtn: {
        width: '45%',
        // backgroundColor:Colors.gray
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 20,
        color: Colors.black,
    },
    pickupTitle: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 20,
        color: Colors.primary,
        textAlign:'center'
    },
    paidFeeContainer:{
     flex:1,
     width:'50%',
    alignSelf:'flex-end',
        alignItems: "center",
        backgroundColor:Colors.primary,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:10
      },
     
      feeText:{
        marginLeft: 8,
        fontSize: 16, 
        fontWeight:'bold',
        color:Colors.white
      },
      bottomSheetContainer: {
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
});

export default AddBookingForm;
