import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSchool,getAllSchools, getSchoolFeeSummary, getSchoolFeeSats, getSchoolLocation, getSchoolClasses, getSchoolClassRooms, getSchoolSubjects, getSchoolInviteProposals, getSchoolFeeMaster, getSchoolHostel, getSchoolAssignFee, getSchoolTransportPickupPoints, getSchoolTransportRoutes, getSchoolTransportVehicle, getSchoolTransportVehicleDriver, getSchoolTransportAssignment, getSchoolParents, getFeeDetailApi, getTimeTableApi, getAllEnrollments, getSubAdminsApi } from "../../api/schoolApis";
import { RootState } from "../store";
import { School,PaginationModal, schoolLocation, schoolClassromms, schoolClasses, schoolSubjects, inviteProposal, FeeMaster, FeeAssign, Hostel, PickupPoint, TransportRoute, TransportVehicle, VehicleDriver, AssignVehicle, SchoolParent, enrollmentModal } from "../../interface/interfaces";
import { fetchFilteredSchools } from "./filterSchoolSlice";

interface SchoolsStateModal {
    schools: School[];
    pagination: PaginationModal | null;
    loading: boolean;
    errors: string | null;
    schoolFeeSummary:string[];
    schoolFeeStats:any;
    schoolLocation:schoolLocation[];
    schoolClassrooms:schoolClassromms[];
    schoolClasses:schoolClasses[];
    schoolSubjects:schoolSubjects[];
    inviteProposals:inviteProposal[];
    schoolFeeMasterList:FeeMaster[];
    schoolFeeAssignList:FeeAssign[];
    schoolHostelList:Hostel[];
    schoolTransportPickupPoints:PickupPoint[];
    schoolTransportRoutes:TransportRoute[];
    schoolTransportVehicles:TransportVehicle[];
    schoolTransportVehicleDrivers:VehicleDriver[];
    schoolTransportAssignment:AssignVehicle[];
schoolTimeTable:any | null
    schoolParents:SchoolParent[];
    classFeeDetails:any | null;
    enrollments:enrollmentModal[];
    subAdminns:any[];
  }
  
  const initialState: SchoolsStateModal = {
    schools: [],
    pagination: null,
    loading: false,
    errors: null,
    schoolFeeSummary:[],
    schoolFeeStats:'',
    schoolLocation:[],
    schoolClassrooms:[],
    schoolClasses:[],
    schoolSubjects:[],
    inviteProposals:[],
    schoolFeeMasterList:[],
    schoolFeeAssignList:[],
    schoolHostelList:[],
    schoolTransportPickupPoints:[],
    schoolTransportRoutes:[],
    schoolTransportVehicles:[],
    schoolTransportVehicleDrivers:[],
    schoolTransportAssignment:[],
    schoolParents:[],
    classFeeDetails:null,
    schoolTimeTable:null,
    enrollments:[],
    subAdminns:[],

  };

// Fetch School by ID
export const fetchSchools = createAsyncThunk(
    "school/fetchSchools",
    async (
      { page, limit }: { page: number; limit: number },
      { getState, rejectWithValue }
    ) => {
      const state = getState() as RootState;
  
      const isDataPresent =
        state.schoolsSlice.schools.length > 0 &&
        state.schoolsSlice.pagination?.currentPage === page &&
        state.schoolsSlice.pagination?.limit === limit;
  
      // if (isDataPresent) {
      //   return {
      //     schools: state.schoolsSlice.schools,
      //     pagination: state.schoolsSlice.pagination,
      //   };
      // }
  
      try {
        const response = await getAllSchools({ page, limit });

        return response;
      } catch (error: any) {
        return rejectWithValue(error?.message);
      }
    }
  );

  export const fetchSchoolDetail = createAsyncThunk(
    "schoolDetail/fetchSchoolDetail",
    async (schoolId:string, { rejectWithValue }) => {
        try {
            const response = await getSchool(schoolId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch school details");
        }
    }
);
//  fetch the school fee summary
export const fetchSchoolFeeSummary = createAsyncThunk(
  "schoolDetail/fetchSchoolFeeSummary",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolFeeSummary();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school fee summary");
      }
  }
);
// fetch the school fee stats
export const fetchSchoolFeeStats = createAsyncThunk(
  "schoolDetail/fetchSchoolFeeStats",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolFeeSats();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school fee stats");
      }
  }
);
// fetch the school Location
export const fetchSchoolLocation = createAsyncThunk(
  "schoolDetail/fetchSchoolLocation",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolLocation();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school location");
      }
  }
);
// fetch the school Classes
export const fetchSchoolClassess = createAsyncThunk(
  "schoolDetail/fetchSchoolClassess",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolClasses();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch classes");
      }
  }
);

// fetch the school classroom
export const fetchSchoolClassrooms = createAsyncThunk(
  "schoolDetail/fetchSchoolClassrooms",
  async (schoolId:string, { rejectWithValue }) => {
      try {
          const response = await getSchoolClassRooms(schoolId);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch classrooms");
      }
  }
);

// fetch the school subjects
export const fetchSchoolSubjects = createAsyncThunk(
  "schoolDetail/fetchSchoolSubjects",
  async (schoolId:string, { rejectWithValue }) => {
      try {
          const response = await getSchoolSubjects(schoolId);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch subjects");
      }
  }
);
// fetch the school invite proposal
export const fetchSchoolInviteProposals = createAsyncThunk(
  "schoolDetail/fetchSchoolInviteProposals",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolInviteProposals();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch invite proposals");
      }
  }
);
// fetch the school Fee Master
export const fetchSchoolFeeMaster = createAsyncThunk(
  "schoolDetail/fetchSchoolFeeMaster",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolFeeMaster();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch master fee");
      }
  }
);

// fetch the school Fee Assign
export const fetchSchoolFeeAssign = createAsyncThunk(
  "schoolDetail/fetchSchoolFeeAssign",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolAssignFee();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch assign fee");
      }
  }
);
// fetch the school Hostel
export const fetchSchoolHostel = createAsyncThunk(
  "schoolDetail/fetchSchoolHostel",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolHostel();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school hostel");
      }
  }
);
// fetch the school Transport pickup points
export const fetchSchoolTransportPickupPoints = createAsyncThunk(
  "schoolDetail/fetchSchoolTransportPickupPoints",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolTransportPickupPoints();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch pickup points");
      }
  }
);
// fetch the school transport routes
export const fetchSchoolTransportRoutes = createAsyncThunk(
  "schoolDetail/fetchSchoolTransportRoutes",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolTransportRoutes();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch routes");
      }
  }
);
// fetch the school transport vehicle
export const fetchSchoolTransportVehicle = createAsyncThunk(
  "schoolDetail/fetchSchoolTransportVehicle",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolTransportVehicle();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch vehicles");
      }
  }
);
// fetch the school transport driver
export const fetchSchoolTransportDriver = createAsyncThunk(
  "schoolDetail/fetchSchoolTransportDriver",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolTransportVehicleDriver();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch drivers");
      }
  }
);
// fetch the school transport vehicle assign
export const fetchSchoolTransportVehicleAssign = createAsyncThunk(
  "schoolDetail/fetchSchoolTransportVehicleAssign",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolTransportAssignment();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch assign vehicles");
      }
  }
);





// fetch the school parents
export const fetchSchoolParents = createAsyncThunk(
  "schoolDetail/fetchSchoolParent",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolParents();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch parents");
      }
  }
);

// fetch the fee details of class
export const fetchSchoolFeeDetails = createAsyncThunk(
  "schoolDetail/fetchSchoolFeeDetails",
  async (
    params: { className: string; sectionName: string },
    { rejectWithValue }
  ) => {
    try {
      const { className, sectionName } = params;
      const response = await getFeeDetailApi(className, sectionName);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch subjects");
    }
  }
);

// fetch the timetable of school
export const fetchSchoolTimeTable = createAsyncThunk(
  "schoolDetail/fetchSchoolTimeTable",
  async (
    params: { classId: any; sectionId: any },
    { rejectWithValue }
  ) => {
    try {
      const { classId, sectionId } = params;
      const response = await getTimeTableApi(classId, sectionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch timetable");
    }
  }
);

// fetch the school enrollments
export const fetchSchoolEnrollments = createAsyncThunk(
  "schoolDetail/fetchSchoolEnrollments",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getAllEnrollments();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch enrollments");
      }
  }
);

// fetch the Sub Adminns
export const fetchSubAdmins = createAsyncThunk(
  "schoolDetail/fetchSubAdmins",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSubAdminsApi();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch sub admins");
      }
  }
);
const schoolSlice = createSlice({
    name: "schools",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSchools.pending, (state) => {
          state.loading = true;
          state.errors = null;
        })
        .addCase(fetchSchools.rejected, (state, action) => {
          state.errors = action.payload as string;
          state.loading = false;
        })
        .addCase(fetchSchools.fulfilled, (state, action) => {
          if (action.payload?.data) {
            const { schools, pagination } = action.payload.data;
            if (pagination.currentPage === 1) {
              // If fetching the first page, replace the existing data
              state.schools = schools;
            }
            else
            {
            state.schools = state.pagination?.currentPage === pagination.currentPage
            ? [...state.schools] // Keep existing data if on the same page
            : [...state.schools, ...schools]; // Append new data
            }
            state.pagination = pagination;
            state.loading = false;
          } else {
            state.loading = false;
          }
          state.errors = null;
        })
        .addCase(fetchFilteredSchools.fulfilled, (state, action) => {
          state.schools = action.payload; // Updating schools with filtered data
      })
      .addCase(fetchSchoolFeeSummary.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeSummary.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolFeeSummary.fulfilled, (state, action) => {
        state.schoolFeeSummary = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeStats.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeStats.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolFeeStats.fulfilled, (state, action) => {
        state.schoolFeeStats = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolLocation.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolLocation.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolLocation.fulfilled, (state, action) => {
        state.schoolLocation = action.payload.data.schoolLocations;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolClassrooms.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolClassrooms.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolClassrooms.fulfilled, (state, action) => {
        state.schoolClassrooms = action.payload.data.classRooms;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolClassess.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolClassess.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolClassess.fulfilled, (state, action) => {
        state.schoolClasses = action.payload.data.classes;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolSubjects.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolSubjects.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolSubjects.fulfilled, (state, action) => {
        state.schoolSubjects = action.payload.data.subjects;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolInviteProposals.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolInviteProposals.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolInviteProposals.fulfilled, (state, action) => {
        state.inviteProposals = action.payload.data.inviteProposals;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeMaster.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeMaster.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolFeeMaster.fulfilled, (state, action) => {
        state.schoolFeeMasterList = action.payload.data.feeMasters;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeAssign.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeAssign.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolFeeAssign.fulfilled, (state, action) => {
        state.schoolFeeAssignList = action.payload.data.feeAssigns;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolHostel.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolHostel.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolHostel.fulfilled, (state, action) => {
        state.schoolHostelList = action.payload.data.hostels;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportPickupPoints.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportPickupPoints.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTransportPickupPoints.fulfilled, (state, action) => {
        state.schoolTransportPickupPoints = action.payload.data.pickupPoints;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportRoutes.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportRoutes.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTransportRoutes.fulfilled, (state, action) => {
        state.schoolTransportRoutes = action.payload.data.transportRoutes;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportVehicle.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportVehicle.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTransportVehicle.fulfilled, (state, action) => {
        state.schoolTransportVehicles = action.payload.data.transportVehicles;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportDriver.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportDriver.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTransportDriver.fulfilled, (state, action) => {
        state.schoolTransportVehicleDrivers = action.payload.data.vehicleDrivers;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportVehicleAssign.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolTransportVehicleAssign.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTransportVehicleAssign.fulfilled, (state, action) => {
        state.schoolTransportAssignment = action.payload.data.assignments;
        state.loading = false;
        state.errors = null;
      })
     
      .addCase(fetchSchoolParents.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolParents.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolParents.fulfilled, (state, action) => {
        state.schoolParents = action.payload.data.parents;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolFeeDetails.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.classFeeDetails=null;
      })
      .addCase(fetchSchoolFeeDetails.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolFeeDetails.fulfilled, (state, action) => {
        state.classFeeDetails = action.payload.data.students;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolTimeTable.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.schoolTimeTable=null;
      })
      .addCase(fetchSchoolTimeTable.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTimeTable.fulfilled, (state, action) => {
        state.schoolTimeTable = action.payload.data.days;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchSchoolEnrollments.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.enrollments=[];
      })
      .addCase(fetchSchoolEnrollments.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolEnrollments.fulfilled, (state, action) => {
        state.enrollments = action.payload.data.enrollments;
        state.loading = false;
        state.errors = null;
      })
        .addCase(fetchSubAdmins.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.subAdminns=[];
      })
      .addCase(fetchSubAdmins.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSubAdmins.fulfilled, (state, action) => {
        state.subAdminns = action.payload.data.subAdmins;
        state.loading = false;
        state.errors = null;
      })
    },
  });

export default schoolSlice.reducer;
