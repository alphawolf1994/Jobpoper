import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Colors } from '../../utils';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import RBSheet from 'react-native-raw-bottom-sheet';
import RNPickerSelect from 'react-native-picker-select';
import { Switch } from 'react-native-switch';
import DropDownPicker from 'react-native-dropdown-picker';


type valueProps = {
  value: string;
  label: string;
};

export const currencyOptions: valueProps[] = [
  { value: "ZAR", label: "South African Rand" },
  { value: "RON", label: "Romanian Leu" },
  { value: "TZS", label: "Tanzanian Shilling" },
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
  { value: "INR", label: "Indian Rupee" },
  { value: "JPY", label: "Japanese Yen" },
  { value: "PKR", label: "Pakistani Rupee" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "AUD", label: "Australian Dollar" },
  { value: "CNY", label: "Chinese Yuan" },
  { value: "SGD", label: "Singapore Dollar" },
  { value: "AED", label: "United Arab Emirates Dirham" },
  { value: "SAR", label: "Saudi Riyal" },
  { value: "CHF", label: "Swiss Franc" },
  { value: "MYR", label: "Malaysian Ringgit" },
  { value: "THB", label: "Thai Baht" },
];

export const casteCategoriesOptions: valueProps[] = [
  { value: "BC", label: "Backward Class" },
  { value: "OC", label: "Open Category" },
  { value: "Other", label: "Other" },
];

type SchoolInfo = {
  currencyAccepted: string[];
  operationalCurrency: string;
  from: string;
  to: string;
  multipleLocations: boolean;
  multipleShifts: boolean;
  reminder: string;
  casteCategories: string[];
};

type SchoolAttributesDisplayProps = {
  school: SchoolInfo;
  onSave: (updatedInfo: SchoolInfo) => void;
};

const SchoolAttributesDisplay: React.FC<SchoolAttributesDisplayProps> = ({ school, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<SchoolInfo>({ ...school });
  const [tempTime, setTempTime] = useState(new Date());
  const [selectedField, setSelectedField] = useState<'from' | 'to' | null>(null);
  const bottomSheetRef = useRef<RBSheet>(null);

  // Inside your component, add these state variables:
const [openCurrency, setOpenCurrency] = useState(false);
const [currencyValue, setCurrencyValue] = useState(school.operationalCurrency);
const [currencyItems, setCurrencyItems] = useState(
  currencyOptions.map(option => ({
    label: option.label,
    value: option.value
  }))
);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({ ...school });
    setIsEditing(false);
  };

  const handleCurrencyChange = (values: string[]) => {
    setEditedInfo(prev => ({
      ...prev,
      currencyAccepted: values
    }));
  };

  const handleOperationalCurrencyChange = (value: string) => {
    setCurrencyValue(value);
    setEditedInfo(prev => ({
      ...prev,
      operationalCurrency: value
    }));
  
  };

  const handleCasteCategoriesChange = (values: string[]) => {
    setEditedInfo(prev => ({
      ...prev,
      casteCategories: values
    }));
  };

  const handleReminderChange = (value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      reminder: value
    }));
  };

  const handleMultipleLocationsChange = (value: boolean) => {
    setEditedInfo(prev => ({
      ...prev,
      multipleLocations: value
    }));
  };

  const handleMultipleShiftsChange = (value: boolean) => {
    setEditedInfo(prev => ({
      ...prev,
      multipleShifts: value
    }));
  };

  const openTimePicker = (field: 'from' | 'to') => {
    setSelectedField(field);
    const currentTime = new Date();
    
    // Parse existing time if available
    if (editedInfo[field]) {
      const [hours, minutes, period] = editedInfo[field].split(/:| /);
      let parsedHours = parseInt(hours);
      if (period === 'PM' && parsedHours !== 12) {
        parsedHours += 12;
      } else if (period === 'AM' && parsedHours === 12) {
        parsedHours = 0;
      }
      currentTime.setHours(parsedHours);
      currentTime.setMinutes(parseInt(minutes));
    }

    setTempTime(currentTime);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: currentTime,
        mode: "time",
        is24Hour: false,
        onChange: (event, selectedDate) => {
          if (selectedDate && selectedField) {
            const formattedTime = selectedDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            setEditedInfo(prev => ({
              ...prev,
              [selectedField]: formattedTime
            }));
          }
        },
      });
    } else {
      bottomSheetRef.current?.open();
    }
  };

  const confirmTimeSelection = () => {
    if (selectedField) {
      const formattedTime = tempTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setEditedInfo(prev => ({
        ...prev,
        [selectedField]: formattedTime
      }));
    }
    bottomSheetRef.current?.close();
  };
   // Updated handler for multiple selection (we'll implement a custom solution)
   const handleCasteCategoryToggle = (value: string) => {
    setEditedInfo(prev => {
      const newCategories = prev.casteCategories.includes(value)
        ? prev.casteCategories.filter(c => c !== value)
        : [...prev.casteCategories, value];
      return {
        ...prev,
        casteCategories: newCategories
      };
    });
  };
  // Updated handler for currency selection (we'll implement a custom solution)
  const handleCurrencyToggle = (value: string) => {
    setEditedInfo(prev => {
      const newCurrencies = prev.currencyAccepted.includes(value)
        ? prev.currencyAccepted.filter(c => c !== value)
        : [...prev.currencyAccepted, value];
      return {
        ...prev,
        currencyAccepted: newCurrencies
      };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.heading}>
          <View style={styles.headingRow}>
            <View style={styles.iconRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.black} style={styles.icon} />
              <Text style={styles.sectionTitle}>Additional School Settings</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.card}>
          {isEditing ? (
            <>
              <View style={[styles.row,styles.displayChange]}>
            <Text style={styles.label}>Currency Accepted</Text>
            <View style={styles.checkboxContainer}>
              {currencyOptions.map(currency => (
                <TouchableOpacity
                  key={currency.value}
                  style={styles.checkboxRow}
                  onPress={() => handleCurrencyToggle(currency.value)}
                >
                  <View style={[
                    styles.checkbox,
                    editedInfo.currencyAccepted.includes(currency.value) && styles.checkboxSelected
                  ]}>
                    {editedInfo.currencyAccepted.includes(currency.value) && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{currency.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.row, styles.displayChange]}>
  <Text style={styles.label}>Operational Currency</Text>
  <DropDownPicker
    open={openCurrency}
    value={currencyValue}
    items={currencyItems}
    setOpen={setOpenCurrency}
    setValue={(callback) => {
      const newValue = callback(currencyValue);
      handleOperationalCurrencyChange(newValue);
    }}
    setItems={setCurrencyItems}
    placeholder="Select Currency"
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownContainer}
    zIndex={3000}
    zIndexInverse={1000}
  />
</View>

              <Text style={styles.subHeading}>Working Hours</Text>
              <View style={styles.inlineRow}>
                <TouchableOpacity 
                  style={styles.inlineItem} 
                  onPress={() => openTimePicker('from')}
                >
                  <Text style={styles.label}>From</Text>
                  <Text style={styles.value}>{editedInfo.from || 'Select time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.inlineItem} 
                  onPress={() => openTimePicker('to')}
                >
                  <Text style={styles.label}>To</Text>
                  <Text style={styles.value}>{editedInfo.to || 'Select time'}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.row,{width:'95%'}]}>
            <Text style={styles.label}>Multiple Locations</Text>
            <Switch
              value={editedInfo.multipleLocations}
              onValueChange={handleMultipleLocationsChange}
              activeText={'Yes'}
              inActiveText={'No'}
              circleSize={20}
              barHeight={25}
              circleBorderWidth={1}
              backgroundActive={Colors.primary}
              backgroundInactive={Colors.lightGray}
              circleActiveColor={Colors.white}
              circleInActiveColor={Colors.white}
              changeValueImmediately={true}
            />
          </View>

          <View style={[styles.row,{width:'95%'}]}>
            <Text style={styles.label}>Multiple Shifts</Text>
            <Switch
              value={editedInfo.multipleShifts}
              onValueChange={handleMultipleShiftsChange}
              activeText={'Yes'}
              inActiveText={'No'}
              circleSize={20}
              barHeight={25}
              circleBorderWidth={1}
              backgroundActive={Colors.primary}
              backgroundInactive={Colors.lightGray}
              circleActiveColor={Colors.white}
              circleInActiveColor={Colors.white}
              changeValueImmediately={true}
              innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
            />
          </View>

              <View style={[styles.row,styles.displayChange]}>
                <Text style={styles.label}>Invoice Reminder (By Days)</Text>
                <TextInput
                  style={styles.input}
                  value={editedInfo.reminder}
                  onChangeText={handleReminderChange}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.row,styles.displayChange]}>
            <Text style={styles.label}>Accepted Caste Categories</Text>
            <View style={styles.checkboxContainer}>
              {casteCategoriesOptions.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={styles.checkboxRow}
                  onPress={() => handleCasteCategoryToggle(category.value)}
                >
                  <View style={[
                    styles.checkbox,
                    editedInfo.casteCategories.includes(category.value) && styles.checkboxSelected
                  ]}>
                    {editedInfo.casteCategories.includes(category.value) && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

            </>
          ) : (
            <>
              <InfoRow style={styles.displayChange}  label="Currency Accepted" value={editedInfo.currencyAccepted.join(', ')} />
              <InfoRow label="Operational Currency" value={editedInfo.operationalCurrency} />

              <Text style={styles.subHeading}>Working Hours</Text>
              <View style={styles.inlineRow}>
                <View style={styles.inlineItem}>
                  <Text style={styles.label}>From</Text>
                  <Text style={styles.value}>{editedInfo.from}</Text>
                </View>
                <View style={styles.inlineItem}>
                  <Text style={styles.label}>To</Text>
                  <Text style={styles.value}>{editedInfo.to}</Text>
                </View>
              </View>

              <InfoRow 
                label="Multiple Locations" 
                value={editedInfo.multipleLocations ? 'Yes' : 'No'} 
              />
              <InfoRow 
                label="Multiple Shifts" 
                value={editedInfo.multipleShifts ? 'Yes' : 'No'} 
              />
              <InfoRow 
                label="Invoice Reminder (By Days)" 
                value={editedInfo.reminder} 
              />
              <InfoRow 
              style={styles.displayChange}
                label="Accepted Caste Categories" 
                value={editedInfo.casteCategories.join(', ')} 
              />
            </>
          )}

          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* iOS Time Picker Bottom Sheet */}
      {Platform.OS === "ios" && (
        <RBSheet
          ref={bottomSheetRef}
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
              onChange={(event, date) => {
                if (date) setTempTime(date);
              }}
            />
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, { marginTop: 20 }]} 
              onPress={confirmTimeSelection}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      )}
    </ScrollView>
  );
};

type InfoRowProps = {
  label: string;
  value: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value,style }) => (
  <View style={[styles.row,style]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  inputAndroid: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  heading: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  card: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  row: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayChange:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  label: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 120,
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    color: Colors.black,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 120,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  inlineItem: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: Colors.gray,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.black,
  },
//   dropdown: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: Colors.gray,

// },
// dropdownContainer: {
//     position: "absolute",
//     top: 50,

// },
dropdown: {
  borderWidth: 0.5,
  borderColor: Colors.gray,
  borderRadius: 6,
  minHeight: 42,
  backgroundColor: Colors.white,
},
dropdownContainer: {
  borderWidth: 0.5,
  borderColor: Colors.gray,
  borderRadius: 6,
  marginTop: 2,
},

});

export default SchoolAttributesDisplay;