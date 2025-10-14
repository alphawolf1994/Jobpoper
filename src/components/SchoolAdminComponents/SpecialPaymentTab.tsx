import { Text } from "@react-navigation/elements";
import { StaticScreenProps, useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View, RefreshControl,
  Linking,
  Share,
  TextInput
} from "react-native";
import { Header, HeaderMain } from "../../components";
import { Colors, heightToDp, widthToDp } from "../../utils";

import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader";
import { useEffect, useRef, useState } from "react";

import React, { useMemo } from "react";
import { MainStyles } from "../../assets/styles";
import Toast from "react-native-toast-message";
import {  getSpecialPayments } from "../../redux/slices/ERPDashboardSlice";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";

type Props = StaticScreenProps<{
  user: string;
}>;
const PAGE_SIZE = 10;

export function SpecialPaymentTab() {
   const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const dispatch = useDispatch<AppDispatch>();
  const enrollBottomSheetRef = useRef<any>(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { specialPayments, loading, errors } = useSelector(
    (state: RootState) => state.ERPDashboardSlice
  );
//   const { groupId,toDate,fromDate } = route.params as { groupId: string,toDate: any, fromDate: any };
  const [search, setSearch] = useState("");

 const fetchData = async () => {
      try {
        await dispatch(getSpecialPayments()).unwrap();

      } catch (err) {

        console.error("Failed to fetch sub admins:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: typeof err === 'string' ? err : "Failed to load data",
        });
      }
    };
    useEffect(() => {
      fetchData();
    }, []);
     useEffect(() => {
    console.log("Report companyName Updated:", specialPayments);
    }, [specialPayments]);
    
 const DummyData = [
  {
    "refNo": "101PMTH252320022",
    "txnType": "Special Payment HD",
    "companyName": "ORACLE FINANCIAL SERVICES SOFTWARE B.V.",
    "ccy": "USD",
    "invAmount": "6571,846.27",
    "comments": "TESTING",
    "statusDesc": "Pending with Manager Finance",
    "maker": "TESTUSER005",
    "makerDtStamp": "20-AUG-2025",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "101PMTH252320021",
    "txnType": "Special Payment HD",
    "companyName": "ORACLE FINANCIAL SERVICES SOFTWARE B.V.",
    "ccy": "USD",
    "invAmount": "1511,680.01",
    "comments": "TESTING",
    "statusDesc": "Pending with Manager Finance",
    "maker": "TESTUSER005",
    "makerDtStamp": "20-AUG-2025",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "101PMTH252270008",
    "txnType": "Special Payment HD",
    "companyName": "ORACLE FINANCIAL SERVICES SOFTWARE B.V.",
    "ccy": "USD",
    "invAmount": "4789,375.00",
    "comments": "A request to test special payment HD local",
    "statusDesc": "Pending with Manager Finance",
    "maker": "SYAM.CHINTA",
    "makerDtStamp": "15-AUG-2025",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "101PMTH252270007",
    "txnType": "Special Payment HD",
    "companyName": "ORACLE FINANCIAL SERVICES SOFTWARE B.V.",
    "ccy": "USD",
    "invAmount": "5747,250.00",
    "comments": "request to test special payment HD internal",
    "statusDesc": "Pending with Manager Finance",
    "maker": "SYAM.CHINTA",
    "makerDtStamp": "15-AUG-2025",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "101PMTH252270005",
    "txnType": "Special Payment HD",
    "companyName": "VERTICAL TECHNOLOGY SERVICES",
    "ccy": "USD",
    "invAmount": "7683,000.00",
    "comments": "testing the special payment",
    "statusDesc": "Pending with Manager Finance",
    "maker": "TESTUSER001",
    "makerDtStamp": "15-AUG-2025",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "992PMTH21270118",
    "txnType": "Special Payment HD",
    "companyName": "NO VENDOR FOUND",
    "ccy": "USD",
    "invAmount": "300.00",
    "comments": "Testing",
    "statusDesc": "Pending with Manager Finance",
    "maker": "OFFICER.FINANCE",
    "makerDtStamp": "09-OCT-2021",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "992PMTH212701182",
    "txnType": "Special Payment HD",
    "companyName": "NO VENDOR FOUND",
    "ccy": "USD",
    "invAmount": "300.00",
    "comments": "testing narration",
    "statusDesc": "Pending with Manager Finance",
    "maker": "OFFICER.FINANCE",
    "makerDtStamp": "04-OCT-2021",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "992PMTH212701184",
    "txnType": "Special Payment HD",
    "companyName": "NO VENDOR FOUND",
    "ccy": "USD",
    "invAmount": "17,000.00",
    "comments": "Testing vendor-ccy and trn-ccy",
    "statusDesc": "Pending with Manager Finance",
    "maker": "OFFICER.FINANCE",
    "makerDtStamp": "30-SEP-2021",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "992PMTH212701163",
    "txnType": "Special Payment HD",
    "companyName": "NO VENDOR FOUND",
    "ccy": "ZMW",
    "invAmount": "2,000.00",
    "comments": "Testing narration",
    "statusDesc": "Pending with Manager Finance",
    "maker": "OFFICER.FINANCE",
    "makerDtStamp": "30-SEP-2021",
    "checker": "",
    "checkerDtStamp": ""
  },
  {
    "refNo": "PMTH212701161",
    "txnType": "Special Payment HD",
    "companyName": "NO VENDOR FOUND",
    "ccy": "ZMW",
    "invAmount": "1,750.00",
    "comments": "Testing HQ Payment",
    "statusDesc": "Pending with Manager Finance",
    "maker": "OFFICER.FINANCE",
    "makerDtStamp": "27-SEP-2021",
    "checker": "",
    "checkerDtStamp": ""
  }
];

  // Filtered data
   const filteredData = useMemo(() => {
       if (!specialPayments || !Array.isArray(specialPayments)) return [];
       if (!search.trim()) return specialPayments;
       return specialPayments.filter(
         (item: any) =>
           (item.Type && item.Type.includes(search)) ||
           (item.Details && item.Details.toLowerCase().includes(search.toLowerCase()))
       );
     }, [search, specialPayments]);

  // Table header columns
  const columns = [
    { key: "refNo", label: "Reference No", width: 100 },
    { key: "txnType", label: "Type", width: 100 },
    { key: "companyName", label: "Details", width: 160 },
    { key: "ccy", label: "CCY", width: 80 },
    { key: "invAmount", label: "Value", width: 100 },
    { key: "comments", label: "Description", width: 160 },
    { key: "statusDesc", label: "Status", width: 100 },
    { key: "maker", label: "Maker", width: 100 },
    { key: "makerDtStamp", label: "Maker date ", width: 100 },
    { key: "checker", label: "Checker", width: 100 },
    { key: "checkerDtStamp", label: "Checker Date ", width: 100 },

  ];

  return (
    <View style={styles.container}>

     
          <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}   nestedScrollEnabled={true}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Type or Details"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
            }}
            placeholderTextColor={Colors.gray}
          />
        </View>

        {/* Table with horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              {columns.map((col) => (
                <View key={col.key} style={[styles.headerCell, { width: col.width }]}>
                  <Text style={styles.headerText}>{col.label}</Text>
                </View>
              ))}
            </View>

            {/* Table Rows */}
            {filteredData.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No data found.</Text>
              </View>
            ) : (
               filteredData.map((item: any, idx: number) => (
                <View key={item.refNo + idx} style={styles.tableRow}>
                  <View style={[styles.cell, { width: columns[0].width }]}>
                    <Text style={styles.cellText}>{item.refNo}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[1].width }]}>
                    <Text style={styles.cellText}>{item.txnType}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[2].width }]}>
                    <Text style={styles.cellText}>{item.companyName}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[3].width }]}>
                    <Text style={styles.cellText}>{item.ccy}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[4].width }]}>
                    <Text style={styles.cellText}>{item.invAmount}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[5].width }]}>
                    <Text style={styles.cellText}>{item.comments}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[6].width }]}>
                    <Text style={styles.cellText}>{item.statusDesc}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[7].width }]}>
                    <Text style={styles.cellText}>{item.maker}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[8].width }]}>
                    <Text style={styles.cellText}>{item.makerDtStamp}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[9].width }]}>
                    <Text style={styles.cellText}>{item.checker}</Text>
                  </View>
                  <View style={[styles.cell, { width: columns[10].width }]}>
                    <Text style={styles.cellText}>{item.Checker_Date_Stamp}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
  
        </KeyboardAvoidingScrollView>
                 {loading && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,

  },
  formContainer: {
    flex: 1,
    zIndex: 0,
    backgroundColor: Colors.white,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    height: heightToDp(85),
    width: widthToDp(100),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginVertical: 15,
    flexWrap: 'wrap'

  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginVertical: 10,

  },
  infoText: {
    fontSize: 18,
    color: Colors.gray,
    marginLeft: 5,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: Colors.lightGray, // Adjust the background color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  schoolImage: {
    marginTop: 10,
    width: "100%",
    height: widthToDp(90),
    borderRadius: 20
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayShade1,
    marginVertical: 30,
  },
  enrollButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    

  },
  enrollText: {
    color: "white",
    fontWeight: "bold",
    fontSize:16
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayShade1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fafbfc",
    color: Colors.black,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.grayShade1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 8,
    marginBottom: 2,
  },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 13,
    color: Colors.primary,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayShade1,
    minHeight: 38,
    alignItems: "center",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  cellText: {
    fontSize: 13,
    color: Colors.black,
  },
  emptyRow: {
    padding: 20,
    // alignItems: "center",
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
  },
});
