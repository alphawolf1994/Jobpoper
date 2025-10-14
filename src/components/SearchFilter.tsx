import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors } from "../utils";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import { fetchSchoolNameSuggestions, fetchLocationSuggestions } from "../redux/slices/filterSchoolSlice";
const AMENITIES = [
    "Air Condition", "Transport", "Wi-Fi Enabled", "Computer Labs", "Science Labs",
    "Security", "Hostel Facilities", "Meals and Snacks", "Library", "Swimming Pool",
    "Indoor Sports", "Outdoor Sports", "Clubs and Activities", "Trips and Excursions",
    "Cafeteria", "Gymnasium", "Ramps for Differently Abled", "Fire Extinguishers",
    "Medical Clinic Facility", "Emergency Exit", "Strong Room Availability"
];
interface SearchFilterProps {
    onSearch: (data: {
        type: string | null;
        gender: string | null;
        grade: string | null;
        school: string | null;
        location: string | null;
        amenities: string[];
    }) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { schoolNameSuggestions, loading, error, locationSuggestions } = useSelector(
        (state: RootState) => state.filterSchoolSlice
    );
    const [school, setSchool] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [schoolSuggestions, setSchoolSuggestions] = useState<boolean>(false);
    const [showLocation, setShowLocation] = useState<boolean>(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [openType, setOpenType] = useState(false);
    const [type, setType] = useState<string | null>(null);
    const [typeItems, setTypeItems] = useState([
        { label: "All", value: "all" },
        { label: "Pre-School", value: "Pre School" },
        { label: "Primary School", value: "Primary School" },
        { label: "Secondary School", value: "Secondary School" },
    ]);

    const [openGender, setOpenGender] = useState(false);
    const [gender, setGender] = useState<string | null>(null);
    const [genderItems, setGenderItems] = useState([
        { label: "Co-Education", value: "Co-Education" },
        { label: "Girls", value: "Girls" },
        { label: "Boys", value: "Boys" },
    ]);

    const [openGrade, setOpenGrade] = useState(false);
    const [grade, setGrade] = useState<string | null>(null);
    const [gradeItems, setGradeItems] = useState([
        { label: "All", value: "All" },
        { label: "Pre-School", value: "Pre School" },
        { label: "Grade 1", value: "Grade 1" },
        { label: "Grade 2", value: "Grade 2" },
        { label: "Grade 3", value: "Grade 3" },
        { label: "Grade 4", value: "Grade 4" },
        { label: "Grade 5", value: "Grade 5" },
        { label: "Grade 6", value: "Grade 6" },
        { label: "Grade 7", value: "Grade 7" },
        { label: "Form 1", value: "Form 1" },
        { label: "Form 2", value: "Form 2" },
        { label: "Form 3", value: "Form 3" },
        { label: "Form 4", value: "Form 4" },
        { label: "Form 5", value: "Form 5" },
        { label: "Form 6", value: "Form 6" },
    ]);

    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                type,
                gender,
                grade,
                school,
                location,
                amenities: selectedAmenities,
            });

        }
    };
    const fetchSchoolSuggestions = (data: any) => {

        dispatch(fetchSchoolNameSuggestions(data));
        setSchoolSuggestions(true);

    }
    const fetchLocationSuggestionsData = (data: any) => {

        dispatch(fetchLocationSuggestions(data))
        setShowLocation(true);

    }
    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
        );
    };
   
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Filter by:</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search School"
                    value={school || ""}
                    onChangeText={(text) => {
                        setSchool(text);
                        fetchSchoolSuggestions(text);
                        setSchoolSuggestions(true); 
                    }}
                />

                {schoolSuggestions && schoolNameSuggestions.length > 0 && (
                    <View style={styles.suggestionList}>
                        <FlatList
                            data={schoolNameSuggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionItem}
                                    onPress={() => {
                                        setSchool(item);
                                        setSchoolSuggestions(false); 
                                    }}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search Location"
                    value={location || ""}
                    onChangeText={(text) => {
                        setLocation(text);
                        fetchLocationSuggestionsData(text);
                        setShowLocation(true);
                    }}
                />

               
                {showLocation && locationSuggestions.length > 0 && (
                    <View style={styles.suggestionList}>
                        <FlatList
                            data={locationSuggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionItem}
                                    onPress={() => {
                                        setLocation(item);
                                        setShowLocation(false); 
                                    }}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
            <View style={[styles.row, (openType || openGender) && { zIndex: 1000 }]}>
                <View style={[styles.dropdownWrapper, openType && styles.activeDropdown]}>
                    <DropDownPicker
                        open={openType}
                        value={type}
                        items={typeItems}
                        setOpen={setOpenType}
                        setValue={setType}
                        setItems={setTypeItems}
                        placeholder="Select Type"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        onOpen={() => {
                            setOpenGender(false);
                            setOpenGrade(false);
                        }}
                    />
                </View>

              
                <View style={[styles.dropdownWrapper, openGender && styles.activeDropdown]}>
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
                        onOpen={() => {
                            setOpenType(false);
                            setOpenGrade(false);
                        }}
                    />
                </View>
            </View>
            <View style={[styles.row, (openGrade) && { zIndex: 1000 }]}>
             
                <View style={[styles.dropdownWrapper, openGrade && styles.activeDropdown]}>
                    <DropDownPicker
                        open={openGrade}
                        value={grade}
                        items={gradeItems}
                        setOpen={setOpenGrade}
                        setValue={setGrade}
                        setItems={setGradeItems}
                        placeholder="Select Grade"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        onOpen={() => {
                            setOpenType(false);
                            setOpenGender(false);
                        }}
                    />
                </View>
            </View>

            <Text style={styles.label}>School Amenities:</Text>
            <View style={styles.amenitiesGrid}>
                {AMENITIES.map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                        <Checkbox
                            value={selectedAmenities.includes(amenity)}
                            onValueChange={() => handleAmenityChange(amenity)}
                            color={selectedAmenities.includes(amenity) ? Colors.primary : undefined}
                        />
                        <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                ))}
            </View>
        
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        position: "relative",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        zIndex: 1, 
    },
    dropdownWrapper: {
        flex: 1,
        marginRight: 10,

    },
    activeDropdown: {
       
    },
    dropdown: {
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    dropdownContainer: {
        position: "absolute",
        top: 50, 
      
    },
    searchButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20, 
        zIndex: 0, 
    },
    searchText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    inputContainer: {

        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.gray,
        padding: 12, 
        borderRadius: 10,
        width: '97%',
        height: 50, 
    },
    suggestionList: {

        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 10,
        paddingVertical: 5,
        maxHeight: 200, // Ensure it doesn't take too much space
        width: '97%'
    },
    suggestionItem: {
        padding: 10,
    },
    amenitiesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    amenityItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%", // Two columns
        paddingRight: 15,
        // marginRight:15,
        marginBottom: 10,
    },
    amenityText: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.black,
    },
});

export default SearchFilter;
