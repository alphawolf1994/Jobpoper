// JobPoper Authentication Interfaces
export interface JobPoperUser {
  id: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  role: 'user' | 'admin';
  profile?: UserProfile;
  lastLogin?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  location?: string;
  dateOfBirth?: string;
  profileImage?: string;
  isProfileComplete: boolean;
}

export interface PhoneVerification {
  phoneNumber: string;
  verificationCode: string;
  isVerified: boolean;
  attempts: number;
  expiresAt: string;
  twilioSid?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    token?: string;
    user?: JobPoperUser;
    phoneNumber?: string;
    isVerified?: boolean;
    twilioSid?: string;
  };
}

export interface Address {
    street: string;
    area: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
  export interface User {
    _id: string;
    name: string;
    profileImage: string;
}

export interface Review {
    _id: string;
    comment: string;
    rating: number;
    likes: number;
    dislikes: number;
    schoolId: string;
    userId: string;
    reviewDate: string; // ISO date string format
    __v: number;
    user: User;
}
  export interface FeeStructure {
    grade: string;
    fee: number;
  }
  
  export interface NearbyAmenity {
    amenity: string;
    distance: string;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: "super admin" | "admin" | "parent";
    profileImage: string;
    myFavorites: any[];
    enrolledSchools: any[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EnrolledSchool {
    schoolId: string;
    enrolledDate: string;
    status: "pending" | "approved" | "rejected";
  }
  
  export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    BANNED = "banned",
  }
  
  export interface AdminObjectModal {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    enrolledSchools?: EnrolledSchool[];
    status: UserStatus;
  }
  
  export interface AdminModal {
    admins: AdminObjectModal[] | null;
    loading: boolean;
    errors: string | null;
  }
  
  export interface School {
    _id: string;
    owner: string; // User ID
    processedBy?: string; // Admin User ID (optional)
    status: "pending" | "approved" | "rejected";
    fullName: string;
    registrationNumber: string;
    establishmentYear: number;
    schoolWebsiteUrl: string;
    description: string;
    address: Address;
    location: string;
    contactName: string;
    emailID: string;
    primaryPhoneNumber: string;
    alternatePhoneNumber?: string; // Optional
    schoolType: string;
    startingGrade: string;
    endingGrade: string;
    gender: string;
    language: string;
    avgClassStrength: number;
    minimumAge: number;
    maximumAge: number;
    schoolCategories: string[];
    schoolAmenities: string[];
    feeStructure: FeeStructure[];
    nearbyAmenities: NearbyAmenity[];
    videoURL?: string; // Optional
    schoolBrochure: string;
    schoolApplicationForm: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    city?:string;
    state?:string;
    logo?:string;
    currencies?:string
    operationalCurrency?:string
    rating?: { $numberDecimal: string };
    workingHours?: { from: string,to:string };
    multipleLocations?:string;
    multipleShifts?:string;
    invoiceReminder?:string;
    acceptedCategories?:string
  }
  
  type paymentStatus = "unpaid" | "paid";
  type applicationStatus = "approved" | "rejected" | "pending";
  interface schoolIdIfPopulated {
      _id: string;
      fullName: string;
  };
  
  export interface PaginationModal {
    totalPages: number;
    currentPage: number;
    limit: number;
  }
  
  export interface enrollmentModal {
      _id: string;
      studentName: string;
      parentName: string;
      standard: string;
      phoneNumber: string;
      email: string;
      paymentStatus: paymentStatus;
      applicationStatus: applicationStatus;
      schoolId: schoolIdIfPopulated;
      userId: string;
      enrolledDate: string;
  }
  
  export interface enrollmentsListModal {
      enrollments: enrollmentModal[] | [],
      loading: boolean;
      errors: string | null;
      // lastFetched: number | null;
  }
  
  export interface enrolledSchools {
    schoolId: string;
    enrolledDate: any;
    status: "pending" | "approved" | "rejected";
  }
  
  export interface ParentModal {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    enrolledSchools: enrolledSchools[];
    createdAt: string;
  };
  
  export interface myFavorites {
    _id: string;
  }
  
  interface userWithName {
    _id: string;
    name: string;
  }
  
  export interface LoanDetails {
    _id: string;
    loanAmount: number;
    downPayment: number;
    amortizationPeriod: number;
    interestRate: { $numberDecimal: string };
    monthlyPayment: { $numberDecimal: string };
    loanCalculatedDate: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    userId: userWithName | string;
    schoolId: string;
  }
  
  export interface parentDetailsModal {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: Address | null;
    role: "super admin" | "admin" | "parent";
    profileImage?: string;
    myFavorites?: myFavorites[] | null;
    status: "active" | "inactive" | "suspended" | "banned";
    enrolledSchools: enrolledSchools[];
    createdAt: string;
    updatedAt: string;
  }
  
  // Blogs
  
  export interface Blog {
    _id: string;
    title: string;
    content: string;
    categories?: string[];
    coverImage?: string;
    isPublic: boolean;
    publishedAt: string; 
    createdAt: string;
    updatedAt: string;
  };
  
  // User Details
  
  export interface school {
    _id: string;
    fullName: string;
    address: Address;
  };
  
  export interface childrens {
    _id: string;
    name: string;
    age: number;
    standard: string;
    enrollmentStatus: string;
    school: school | null;
  }


// classrooms interface
  export interface schoolClassromms {
    _id: string;
    schoolId: string; 
    createdBy:string;
    roomNo:string;
    capacity:string;
    status:string;
    createdAt:string;
    updatedAt:string
  }
  // subjects interface
  export interface schoolSubjects {
    _id: string;
    schoolId: string; 
    createdBy:string;
    name:string;
    subType:string;
    status:string;
    createdAt:string;
    updatedAt:string
  }
// location interface
  export interface schoolLocation {
    _id: string;
    schoolId: string; 
    branchName:string;
    address:Address;
    status:string;
    createdAt:string;
    updatedAt:string
  }

  // location interface
  export interface schoolClasses {
    _id: string;
    school: string; 
    className:string;
    sections:string[];
    maxStudents:number;
    numberOfSubjects:number;
    classroom:schoolClassromms
    status:string;
    createdAt:string;
    updatedAt:string
  }
  export interface inviteProposal {
    _id: string;
    school: string; 
    proposalName:string;
    category:string;
    description:string;
    contactName:string;
    contactDesignation:string;
    contactEmail:string;
    contactPhoneNumber:string;
    startDate:string;
    endDate:string;
    status:string;
    createdBy:string;
    createdAt:string;
    updatedAt:string
  }
  export interface Duration {
    from: string;
    to: string;
    _id: string;
  }
  
  export interface CustomDiscount {
    // Define properties based on your actual customDiscounts structure
    // Example:
    // discountName: string;
    // discountPercentage: number;
  }
  
  export interface FeeMaster {
    _id: string;
    school: string;
    feeType: string;
    fineType: string;
    fineAmount: number;
    finePercentage: number;
    duration: Duration;
    dueDate: string; // or Date if you'll convert it
    status: 'active' | 'inactive' | string; // adjust based on possible values
    discountType: 'none' | 'same' | 'custom' | string; // adjust based on possible values
    sameDiscountPercentage: number;
    customDiscounts: CustomDiscount[];
    createdAt: string; // or Date
    updatedAt: string; // or Date
    __v: number;
  }

  interface Class {
    _id: string;
    className: string;
  }
  
  interface Section {
    _id: string;
    section: string;
  }
  
  export interface FeeAssign {
    _id: string;
    school: string;
    feeMasters: FeeMaster;  // Linking to FeeMaster interface
    classes: Class;
    sections: Section;
    amount: number;
    gender: 'Male' | 'Female' | 'Both' | string;
    category: string;
    status: 'Pending' | 'Approved' | 'Rejected' | string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface Hostel {
    _id: string;
    school: string;
    hostelName: string;
    hostelType: 'boys' | 'girls' | 'both' | string; // Add other possible types if needed
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    address: string;
    inTake: number;
    description: string;
    createdAt: string | Date; // Can be Date if you parse it
    updatedAt: string | Date; // Can be Date if you parse it
    __v: number;
  }
  export interface PickupPoint {
    _id: string;
    schoolId: string;
    pickupPointName: string;
    address: string;
    createdBy: string;
    status: 'active' | 'inactive' | string; // Add other possible statuses if needed
    isAuthorized: boolean;
    createdAt: string | Date; // Can be Date if you parse it
    updatedAt: string | Date; // Can be Date if you parse it
    __v: number;
    authorizedBy: string;
  }
  interface PickupPointWithRate {
    name: string;
    fee: number;
    measurement: 'kilometers' | 'miles' | string;
    distance: number;
    _id: string;
  }
  
  export interface TransportRoute {
    _id: string;
    routeName: string;
    schoolId: string;
    pickupPoints: PickupPointWithRate[];
    createdBy: string;
    status: 'active' | 'inactive' | 'pending' | string;
    isAssigned: boolean;
    isAuthorized: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    __v: number;
    authorizedBy: string;
  }
  export interface TransportVehicle {
    _id: string;
    vehicleNo: string;
    vehicleModal: string;
    yearOfManufacture: string;
    chassisNo: string;
    fuelType: 'Diesel' | 'Petrol' | 'Electric' | 'Hybrid' | string;
    capacity: number;
    schoolId: string;
    createdBy: string;
    status: 'active' | 'inactive' | 'maintenance' | string;
    isAssigned: boolean;
    isAuthorized: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    __v: number;
    authorizedBy: string;
  }

  export interface VehicleDriver {
    _id: string;
    driverImage: string;
    driverName: string;
    driverContact: string;
    driverLicense: string;
    Address: string;
    schoolId: string;
    status: 'active' | 'inactive' | 'on-leave' | string;
    isAssigned: boolean;
    isAuthorized: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    __v: number;
    authorizedBy: string;
  }
  // Main Assignment interface
export interface AssignVehicle {
  _id: string;
  driverId: VehicleDriver;
  vehicleId: TransportVehicle;
  routeId: TransportRoute;
  assignedBy: string;
  schoolId: string;
  status: 'active' | 'inactive' | 'pending' | string;
  isAuthorized: boolean;
  assignedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v: number;
}

interface Parent {
  userId: string | null;
  relation: string;
}





interface ParentDetail {
  relation: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  image: string;
  _id: string;
}

interface MedicalCondition {
  // Define based on your actual medical condition structure
  condition?: string;
  severity?: string;
  notes?: string;
}

interface Medication {
  // Define based on your actual medication structure
  name?: string;
  dosage?: string;
  frequency?: string;
}

export interface Student {
  _id: string;
  schoolId: string;
  parent: Parent;
  studentImage: string;
  academicYear: string;
  admissionNumber: string;
  admissionDate: string | Date;
  rollNumber: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended' | string;
  firstName: string;
  lastName: string;
  class: Class;
  section: Section;
  gender: 'male' | 'female' | 'other' | string;
  dateOfBirth: string | Date;
  bloodGroup: string;
  religion: string;
  primaryContact: string;
  email: string;
  languages: string[];
  parents: ParentDetail[];
  currentAddress: string;
  permanentAddress: string;
  useTransport: boolean;
  useHostel: boolean;
  medicalConditions: MedicalCondition[];
  medications: Medication[];
  previousSchoolName: string;
  previousSchoolAddress: string;
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v: number;
}


interface ParentInfo {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
}

interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | string;
  studentImage: string;
  admissionNumber: string;
  rollNumber: string;
  class: string;
  section: string;
}

export interface SchoolParent {
  _id: string;
  relation: 'Father' | 'Mother' | 'Guardian' | string;
  parent: ParentInfo;
  children: Child[];
}

interface UserTeacher {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AssignedClass {
  _id: string;
  className: string;
   section?: {
    _id: string;
    section: string;
  };
  maxStudents?:number;
   classroom?: {
    _id: string;
    roomNo: string;
  };
}

interface Subject {
  _id: string;
  name: string;
}

export interface Teacher {
  _id?: string;
  user?: UserTeacher;
  school?: string;
  assignedClasses?: AssignedClass[];
  subjects?: Subject[];
  gender?: string
  fatherName?: string;
  motherName?: string;
  dateOfJoining?: string;
  maritalStatus?: string
  qualification?: string;
  basicSalary?: number;
  contractType?:string
  workShift?: string
  workExperience?: string;
  previousSchool?: string;
  idNumber?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number;
}
export interface Period  {
  _id: string;
  subject: {
    _id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  note: string;
};

export interface DaySchedule  {
  _id: string;
  day: string;
  class: {
    _id: string;
    className: string;
  };
  section: {
    _id: string;
    section: string;
  };
  periods: Period[];
};
export interface LoanApplication {
  _id?: string;
  loanProduct: {
    _id: string;
    productName: string;
  };
  applicant: string;
  name: string;
  email: string;
  applicantType: string;
  vendor: {
    _id: string;
    name: string;
    email: string;
  };
  requestedAmount: number;
  specifications: string;
  interestRateAtTime: number;
  tenureMonthsAtTime: number;
  status: 'approved' | 'pending' | 'rejected' | string; // Add other possible status values
  monthlyStatus?: MonthlyPaymentStatus[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number;
  disbursementDate?: string | Date;
  repaymentStartDate?: string | Date;
}

export interface MonthlyPaymentStatus {
  dueDate: string | Date;
  amountDue: number;
  amountPaid: number;
  status: 'pending' | 'paid' | 'overdue' | string; // Add other possible status values
  _id: string;
}
export interface PaymentMethod {
   _id: string;
    method: 'mobile' | 'card' | 'bank' | 'paypal';
    createdAt: string | Date;
    mobile?: { number: string; vendor: string };
    card?: { cardHolder: string; cardNumber: string; ccv: string; expiryDate: string };
    bank?: { accountName: string; accountNumber: string; bankName: string };
    paypal?: { account: string };
}

// JobPoper Job Interfaces
export interface Job {
  _id: string;
  title: string;
  description: string;
  cost: string;
  location: string;
  urgency: 'Urgent' | 'Normal';
  scheduledDate: string;
  scheduledTime: string;
  attachments?: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  jobType?: string;
  postedBy: {
    profile: {
      email: string;
      fullName: string;
    };
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    job?: Job;
    jobs?: Job[];
  };
}

// Location types for job creation
export interface SavedLocation {
  id: string;
  name: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  addressDetails?: string;
  createdAt: number;
}

export interface PickupLocations {
  source: SavedLocation;
  destination: SavedLocation;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  cost: string;
  jobType: 'OnSite' | 'Pickup';
  location: SavedLocation | PickupLocations;
  urgency: string;
  scheduledDate: string;
  scheduledTime: string;
  attachments?: string[];
}

export interface HotJobsResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    jobs: Job[];
    location: string;
    urgency: string;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalJobs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface ListedJobsResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    jobs: Job[];
    location: string;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalJobs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
  

  