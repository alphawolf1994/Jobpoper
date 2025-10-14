import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Colors, heightToDp, widthToDp } from "../utils";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProfileImageHeader from "./ProfileImageHeader";
import { MainStyles } from "../assets/styles";
import ImagePath from "../assets/images/ImagePath";
import { AppDispatch,RootState, persistor } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface ModalNavigationProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalNavigation = ({
  modalVisible,
  setModalVisible,
}: ModalNavigationProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, selectedRole } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Get user role with proper fallback logic
  let userRole = 'User';
  if (user?.email === 'driver@gmail.com') {
    userRole = 'Driver';
  } else {
    userRole = selectedRole || user?.role || 'User';
  }
 

  
  const navigationBtns = [
    {
      name: "Dashboard",
      image: ImagePath.HomeIcon,
      navigation: () => navigation.navigate("HomeTabs"),
    },
    {
      name: "MyChildren",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("ChildrenScreen"),
    },
    {
      name: "Homework",
      image: ImagePath.HomeworkIcon,
      navigation: () => navigation.navigate("HomeworkScreen"),
    },
    {
      name: "Schools",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolsScreen"),
    },
    {
      name: "Attendance",
      image: ImagePath.attendanceIcon,
      navigation: () => navigation.navigate("AttendanceScreen"),
    },
    {
      name: "Fee Details",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("FeeDetailsScreen"),
    },
    {
      name: "Examination",
      image: ImagePath.ExamIcon,
      navigation: () => navigation.navigate("ExaminationScreen"),
    },
    {
      name: "Report Cards",
      image: ImagePath.ReportCardsIcon,
      navigation: () => navigation.navigate("ReportsScreen"),
    },
    {
      name: "Events",
      image: ImagePath.CalendarIcon,
      navigation: () => navigation.navigate("EventsScreen"),
    },
    {
      name: "Teachers",
      image: ImagePath.NoticeBoardIcon,
      navigation: () => navigation.navigate("TeachersScreen"),
    },
    {
      name: "Hostel",
      image: ImagePath.hostelIcon,
      navigation: () => navigation.navigate("HostelScreen"),
    },
    {
      name: "Wallet",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("WalletScreen"),
    },
    {
      name: "Chat",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("ChatList"),
    },
    {
      name: "Loan Management",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("LoanManagementScreen"),
    },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("MainProfileScreen"),
    },
     {
      name: "Payment Methods",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("PaymentMethodsScreen"),
    },
  ];
  const navigationTransportBtns = [
    {
      name: "Bookings Management",
      image: ImagePath.bookingManagementIcon,
      navigation: () => navigation.navigate("BookingManagementScreen"),
    },
    {
      name: "Driver Management",
      image: ImagePath.driverManagementIcon,
      navigation: () => navigation.navigate("DriverManagementScreen"),
    },
    {
      name: "Vehicle Management",
      image: ImagePath.vehicleManagementIcon,
      navigation: () => navigation.navigate("VehicleManagementScreen"),
    },
    // {
    //   name: "Earnings & Payouts",
    //   image: ImagePath.transactionIcon,
    //   navigation: () => navigation.navigate("AttendanceScreen"),
    // },
    {
      name: "Route Optimization",
      image: ImagePath.routeManagementIcon,
      navigation: () => navigation.navigate("RouteManagementScreen"),
    },
    // {
    //   name: "Customer Support & Complaints",
    //   image: ImagePath.customerSupportIcon,
    //   navigation: () => navigation.navigate("ExaminationScreen"),
    // },
    {
      name: "Pricing Plans",
      image: ImagePath.subscriptIcon,
      navigation: () => navigation.navigate("PricingPlanScreen"),
    },
    {
      name: "Loan Management",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("LoanManagementScreen"),
    },
    // {
    //   name: "Reports & Analytics",
    //   image: ImagePath.reportsIcon,
    //   navigation: () => navigation.navigate("EventsScreen"),
    // },
    {
      name: "Propsals",
      image: ImagePath.propsalIcon,
      navigation: () => navigation.navigate("SchoolProposalsScreen"),
    },
    {
      name: "Schools",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolsScreen"),
    },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("DriverProfileScreen"),
    },
  ];
  const navigationMicroBankBtns = [
    {
      name: "Loan Management",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("LoanManagementsScreen"),
    },
    {
      name: "Customer Profiles",
      image: ImagePath.customerProfileIcon,
      navigation: () => navigation.navigate("CustomersScreen"),
    },
    {
      name: "Payment Collections",
      image: ImagePath.paymenntCollectionIcon,
      navigation: () => navigation.navigate("PaymentCollectionScreen"),
    },
    {
      name: "Interest Rate Management",
      image: ImagePath.interestIcon,
      navigation: () => navigation.navigate("InterestRateManagementsScreen"),
    },
    // {
    //   name: "Savings & Deposits",
    //   image: ImagePath.savingIcon,
    //   navigation: () => navigation.navigate("SavingDepositScreen"),
    // },
    // {
    //   name: "Regulatory Compliance",
    //   image: ImagePath.complianceIcon,
    //   navigation: () => navigation.navigate("RegulatoryComplianceScreen"),
    // },
    {
      name: "Services",
      image: ImagePath.serviceIcon,
      navigation: () => navigation.navigate("ServicesScreen"),
    },
    {
      name: "Schools",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolsScreen"),
    },
    // {
    //   name: "Risk Management",
    //   image: ImagePath.riskIcon,
    //   // navigation: () => navigation.navigate("ReportsScreen"),
    // },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("DriverProfileScreen"),
    },
  ];
  const navigationUniformSallerBtns = [
    {
      name: "Product & Inventory",
      image: ImagePath.catelogIcon,
      navigation: () => navigation.navigate("ProductInventoryScreen"),
    },
    {
      name: "Order Management",
      image: ImagePath.orderManagementIcon,
      navigation: () => navigation.navigate("OrderSaleScreen"),
    },
    {
      name: "Bills",
      image: ImagePath.bookingManagementIcon,
      navigation: () => navigation.navigate("BillsRevenueScreen"),
    },
    {
      name: "Loan Management",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("LoanManagementScreen"),
    },
    {
      name: "Propsals",
      image: ImagePath.propsalIcon,
      navigation: () => navigation.navigate("UniformProposalsScreen"),
    },
    {
      name: "Schools",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolsScreen"),
    },
    // {
    //   name: "Customer Management",
    //   image: ImagePath.customerManagementIcon,
    //   navigation: () => navigation.navigate("SchoolsScreen"),
    // },
    // {
    //   name: "Inventory Tracking",
    //   image: ImagePath.trackingIcon,
    //   navigation: () => navigation.navigate("AttendanceScreen"),
    // },
    // {
    //   name: "Discount & Offers",
    //   image: ImagePath.discountIcon,
    //   navigation: () => navigation.navigate("FeeDetailsScreen"),
    // },
    // {
    //   name: "Payments & Transactions",
    //   image: ImagePath.transactionIcon,
    //   navigation: () => navigation.navigate("ExaminationScreen"),
    // },
    // {
    //   name: "Reports & Insights",
    //   image: ImagePath.reportsIcon,
    //   navigation: () => navigation.navigate("ReportsScreen"),
    // },
   
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("DriverProfileScreen"),
    },
  ];
  const navigationStationarySallerBtns = [
    {
      name: "Product Management",
      image: ImagePath.productManagementIcon,
      navigation: () => navigation.navigate("ProductManagementScreen"),
    },
    {
      name: "Order Fulfillment",
      image: ImagePath.orderFulfillmentIcon,
      navigation: () => navigation.navigate("OrderManagementScreen"),
    },
    {
      name: "Stock Management",
      image: ImagePath.inventoryIcon,
      navigation: () => navigation.navigate("StockManagementScreen"),
    },
    {
      name: "Bills",
      image: ImagePath.bookingManagementIcon,
      navigation: () => navigation.navigate("BillsScreen"),
    },
    {
      name: "Customer Database",
      image: ImagePath.customerDatabaseIcon,
      navigation: () => navigation.navigate("CustomerDatabaseScreen"),
    },
    {
      name: "Offers & Bulk Discounts",
      image: ImagePath.discountIcon,
      navigation: () => navigation.navigate("OffersDiscountScreen"),
    },
    {
      name: "Payments & Transactions",
      image: ImagePath.transactionIcon,
      navigation: () => navigation.navigate("PaymentTransactionScreen"),
    },
    {
      name: "Business Reports",
      image: ImagePath.ReportCardsIcon,
      navigation: () => navigation.navigate("BusinessReportScreen"),
    },
    {
      name: "Loan Management",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("LoanManagementScreen"),
    },
    {
      name: "Propsals",
      image: ImagePath.propsalIcon,
      navigation: () => navigation.navigate("StationaryProposalsScreen"),
    },
    {
      name: "Schools",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolsScreen"),
    },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("DriverProfileScreen"),
    },
  ];
  const navigationDriverBtns = [
   
   
    {
      name: "Buses Management",
      image: ImagePath.vehicleManagementIcon,
      navigation: () => navigation.navigate("BusesManagementScreen"),
    },
    {
      name: "Students Managements",
      image: ImagePath.transactionIcon,
      navigation: () => navigation.navigate("DriverStudentsScreen"),
    },
    {
      name: "Route Management",
      image: ImagePath.routeManagementIcon,
      navigation: () => navigation.navigate("DriverRouteScreen"),
    },
    {
      name: "Schools",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolsScreen"),
    },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("DriverProfileScreen"),
    },
  ];
  const navigationSchoolAdminBtns = [
   
    {
      name: "School Profile",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolProfile"),
    },
    {
      name: "School Attributes",
      image: ImagePath.catelogIcon,
      navigation: () => navigation.navigate("SchoolAttributes"),
    },
    {
      name: "School Settings",
      image: ImagePath.bookingManagementIcon,
      navigation: () => navigation.navigate("SchoolSettingsScreen"),
    },
     {
      name: "Sub Admins",
      image: ImagePath.SubAdminIocn,
      navigation: () => navigation.navigate("SubAdminsScreen"),
    },
    {
      name: "Enrollments",
      image: ImagePath.attendanceIcon,
      navigation: () => navigation.navigate("EnrollmentsScreen"),
    },
    {
      name: "Business Vendors",
      image: ImagePath.serviceIcon,
      navigation: () => navigation.navigate("BusinessVendorsScreen"),
    },
    {
      name: "Invite Proposals",
      image: ImagePath.propsalIcon,
      navigation: () => navigation.navigate("InviteProposalsScreen"),
    },
    //  {
    //   name: "Profile",
    //   image: ImagePath.ProfileIcon,
    //   navigation: () => navigation.navigate("SchoolFinanceProfileScreen"),
    // },
    {
      name: "Fee Master",
      image: ImagePath.AccountingIcon,
      navigation: () => navigation.navigate("FeeCollectionScreen"),
    },
    {
      name: "Fee Management",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("FeeManagementScreen"),
    },
   
   
    {
      name: "Hostel",
      image: ImagePath.hostelIcon,
      navigation: () => navigation.navigate("SchoolHostelsScreen"),
    },
    
    {
      name: "Transport",
      image: ImagePath.vehicleManagementIcon,
      navigation: () => navigation.navigate("TransortScreen"),
    },
    {
      name: "Peoples",
      image: ImagePath.customerDatabaseIcon,
      navigation: () => navigation.navigate("SchoolPeoplesScreen"),
    },
    {
      name: "Academic",
      image: ImagePath.ReportCardsIcon,
       navigation: () => navigation.navigate("AcadamicScreen"),
    },
    {
      name: "Library",
      image: ImagePath.libraryIcon,
      navigation: () => navigation.navigate("LibraryScreen"),
    },
    {
      name: "HRM",
      image: ImagePath.HRMIcon,
      navigation: () => navigation.navigate("HRMScreen"),
    },
    {
      name: "Accounts",
      image: ImagePath.AccountingIcon,
      navigation: () => navigation.navigate("SchoolAccountsScreen"),
    },
   
   
   
  ];
  const navigationSchoolTeacherBtns = [
   
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("TeacherProfileScreen"),
    },
    {
      name: "Loan Management",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("LoanManagementScreen"),
    },
    {
      name: "My Salary",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("TeacherSalaryScreen"),
    },
    {
      name: "My TimeTable",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("TeacherTimeTableScreen"),
    },
    {
      name: "My Classes",
      image: ImagePath.loanIcon,
      navigation: () => navigation.navigate("TeacherClassesScreen"),
    },
  {
      name: "Payment Methods",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("PaymentMethodsScreen"),
    },
   
   
  ];
   const navigationCreatorAdminBtns = [
   
    {
      name: "School Profile",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolProfile"),
    },
    {
      name: "School Attributes",
      image: ImagePath.catelogIcon,
      navigation: () => navigation.navigate("SchoolAttributes"),
    },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("SubAdminProfileScreen"),
    },
     {
      name: "Staff Roles",
      image: ImagePath.customerDatabaseIcon,
      navigation: () => navigation.navigate("StaffRolesListScreen"),
    },
     {
      name: "Staffs",
      image: ImagePath.HRMIcon,
      navigation: () => navigation.navigate("StaffListScreen"),
    },
    {
      name: "Departments",
      image: ImagePath.ReportCardsIcon,
       navigation: () => navigation.navigate("DepartmentsListScreen"),
    },
   
   
  ];
    const navigationReviewerAdminBtns = [
   
    {
      name: "School Profile",
      image: ImagePath.FeeDetailsIcon,
      navigation: () => navigation.navigate("SchoolProfile"),
    },
    {
      name: "School Attributes",
      image: ImagePath.catelogIcon,
      navigation: () => navigation.navigate("SchoolAttributes"),
    },
    {
      name: "Profile",
      image: ImagePath.ProfileIcon,
      navigation: () => navigation.navigate("SubAdminProfileScreen"),
    },
     {
      name: "Staff Roles",
      image: ImagePath.customerDatabaseIcon,
      navigation: () => navigation.navigate("StaffRolesListScreen"),
    },
  
   
   
  ];
  const roleKeyMap:any= {
    parent: "parent",
    transport: "transporter", 
    microfinancer: "micro_financer",
    uniformSeller: "uniform_supplier",
    stationarySeller: "stationery_seller",
    driver: "driver",
    admin: "school",
    teacher: "teacher",
    createrAdmin: "creater_admin",
    reviewerAdmin: "reviewer_admin"
  };
  
  const roleBasedButtons:any = {
    parent: navigationBtns,
    transport: navigationTransportBtns,
    microfinancer: navigationMicroBankBtns,
    uniformSeller: navigationUniformSallerBtns,
    stationarySeller: navigationStationarySallerBtns,
    driver:navigationDriverBtns,
    admin:navigationSchoolAdminBtns,
    teacher:navigationSchoolTeacherBtns,
    createrAdmin:navigationCreatorAdminBtns,
    reviewerAdmin:navigationReviewerAdminBtns
  };
  
// Reverse lookup: find the key in roleKeyMap where the value matches userRole
const normalizedRole:any = Object.keys(roleKeyMap).find(
  (key) => {
    const roleValue = roleKeyMap[key].toLowerCase();
    const userRoleLower = userRole.toLowerCase();
    // Handle both underscore and space formats
    return roleValue === userRoleLower || 
           roleValue.replace('_', ' ') === userRoleLower ||
           roleValue === userRoleLower.replace(' ', '_');
  }
);

  const selectedButtons = roleBasedButtons[normalizedRole] || [];
  const logOut = async() => {
    try {
      setModalVisible(false);
      
      // Call logout API before clearing state
      const resultAction = await dispatch(logoutUser());
      
      if (logoutUser.fulfilled.match(resultAction)) {
        console.log("Logout successful");
      } else {
        console.log("Logout API failed, but continuing with local logout");
      }
      
      // Clear persisted Redux state
      await persistor.purge();
      
      // Navigate to login
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout API fails, still clear local state and navigate to login
      await persistor.purge();
      navigation.navigate("Login");
    }
  };
  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
       
        <ScrollView >
        <View style={styles.headerContainer}>
         
         <Pressable
           style={styles.closeButton}
           onPress={() => setModalVisible(false)}
         >
           <AntDesign name="close" size={30} color={Colors.white} />
         </Pressable>
       </View>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonGrid}>
            {selectedButtons.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setModalVisible(false);
                  item.navigation?.();
                }}
                style={styles.buttonContainer}
              >
                <View style={styles.btnContainer}>
                  <Image source={item.image} style={styles.btnIcon} />
                </View>
                <Text style={styles.modalText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </ScrollView>
        <TouchableOpacity
        style={{marginTop:10}}
          onPress={() => {
          
            logOut()
            // navigation.navigate("Login");
          }}
        >
          <Text
            style={{
              color: Colors.Red,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ModalNavigation;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: heightToDp(5),
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: widthToDp(5),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    marginRight: widthToDp(3),
    width: widthToDp(9),
    height: heightToDp(4.5),
  },
  profileTextContainer: {
    marginTop: heightToDp(7),
  },
  closeButton: {
    position: "absolute",
    top: heightToDp(7),
    right: widthToDp(7),
  },
  buttonWrapper: {
    // flex: 1,
    marginTop:100,
  
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent:'space-between'
    
  },
  buttonContainer: {
    alignItems: "center",
    width:widthToDp(27),
    margin: widthToDp(3),
   
  },
  btnContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    width: widthToDp(18),
    height: widthToDp(18),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: widthToDp(30),
  },
  btnIcon: {
    width: widthToDp(10),
    height: widthToDp(10),
    resizeMode: "cover",
  },
  modalText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});
