import { lazy } from "react";

export const AppLayout = lazy(() => import("./Applayout"));
export const ErrorPage = lazy(() => import("./pages/ErrorPage"));
export const Dashboard = lazy(() => import("./pages/Dashboard"));
export const User = lazy(() => import("./pages/AdminModule/User"));
export const EditUser = lazy(() => import("./pages/AdminModule/User/EditUser"));
export const AddNewUser = lazy(
  () => import("./pages/AdminModule/User/AddNewUser")
);
export const Role = lazy(() => import("./pages/AdminModule/Role"));
export const EditDepartment = lazy(
  () => import("./pages/OfficeModule/Department/EditDepartment")
);
export const Login = lazy(() => import("./pages/Login"));
export const OtpPage = lazy(() => import("./pages/Login/OtpPage"));

export const UserDetail = lazy(
  () => import("./pages/AdminModule/User/UserDetail")
);
export const UserTable = lazy(
  () => import("./pages/AdminModule/User/UserTable")
);
export const AddNewRole = lazy(
  () => import("./pages/AdminModule/Role/AddNewRole")
);
export const RoleTable = lazy(
  () => import("./pages/AdminModule/Role/RoleTable")
);
export const Company = lazy(() => import("./pages/OfficeModule/Company"));
export const CandidateDetail = lazy(
  () => import("./pages/RecruitmentModule/Candidates/CandidateDetail")
);
export const Recruitment = lazy(() => import("./pages/RecruitmentModule"));
export const Candidates = lazy(
  () => import("./pages/RecruitmentModule/Candidates")
);
export const DepartmentDetail = lazy(
  () => import("./pages/OfficeModule/Department/DepartmentDetail")
);
export const DesignationList = lazy(
  () => import("./pages/OfficeModule/Designation/DesignationList")
);
export const DepartmentLayout = lazy(
  () => import("./pages/OfficeModule/Department")
);
export const DepartmentList = lazy(
  () => import("./pages/OfficeModule/Department/DepartmentList")
);
export const DesignationLayout = lazy(
  () => import("./pages/OfficeModule/Designation")
);
export const EditDesignation = lazy(
  () => import("./pages/OfficeModule/Designation/EditDesignation")
);
export const DesignationDetail = lazy(
  () => import("./pages/OfficeModule/Designation/DesignationDetail")
);
export const ShiftLayout = lazy(() => import("./pages/OfficeModule/Shift"));
export const ShiftList = lazy(
  () => import("./pages/OfficeModule/Shift/ShiftList")
);
export const PolicyLayout = lazy(() => import("./pages/OfficeModule/Policy"));
export const PolicyList = lazy(
  () => import("./pages/OfficeModule/Policy/PolicyList")
);
export const CreatePolicy = lazy(
  () => import("./pages/OfficeModule/Policy/AddPolicy/CreatePolicy.tsx")
);
export const ManagePolicy = lazy(
  () => import("./pages/OfficeModule/Policy/EditPolicy")
);
export const PolicyDetail = lazy(
  () => import("./pages/OfficeModule/Policy/PolicyDetail")
);
export const EditShift = lazy(
  () => import("./pages/OfficeModule/Shift/EditShift")
);
export const HolidayLayout = lazy(() => import("./pages/OfficeModule/Holiday"));
export const EmployeeLayout = lazy(() => import("./pages/EmployeeModule"));
export const EmplyeeTable = lazy(
  () => import("./pages/EmployeeModule/Employee/EmployeeTable")
);
export const AddEmployee = lazy(
  () => import("./pages/EmployeeModule/Employee/AddEmployee")
);
export const EditEmployee = lazy(
  () => import("./pages/EmployeeModule/Employee/EditEmployee")
);
export const EmployeeDetail = lazy(
  () => import("./pages/EmployeeModule/Employee/EmplyeeDetail")
);

export const AttendanceTable = lazy(
  () => import("./pages/EmployeeModule/AttendanceTable")
);
export const Overtime = lazy(() => import("./pages/EmployeeModule/Overtime"));
export const Leave = lazy(() => import("./pages/EmployeeModule/Leave"));
export const TicketLayout = lazy(() => import("./pages/TicketModule"));
export const TicketList = lazy(() => import("./pages/TicketModule/TicketList"));
export const AnnouncementLayout = lazy(
  () => import("./pages/AnnouncementModule")
);
export const AnnouncementList = lazy(
  () => import("./pages/AnnouncementModule/AnnouncementList")
);
export const EditAnnnouncement = lazy(
  () => import("./pages/AnnouncementModule/EditAnnouncement")
);
export const CertificationLayout = lazy(
  () => import("./pages/EmployeeModule/Certification")
);
export const CertificationTable = lazy(
  () => import("./pages/EmployeeModule/Certification/CertificationTable")
);
export const CertificationDetail = lazy(
  () => import("./pages/EmployeeModule/Certification/CertificationDetail")
);
export const AddCertification = lazy(
  () => import("./pages/EmployeeModule/Certification/AddCertification")
);

export const HomeOfficeLayout = lazy(
  () => import("./pages/EmployeeModule/HomeOffice")
);
export const HomeOfficeTable = lazy(
  () => import("./pages/EmployeeModule/HomeOffice/HomeOfficeTable")
);
export const HomeOfficeDetail = lazy(
  () => import("./pages/EmployeeModule/HomeOffice/HomeOfficeDetail")
);
export const CreateHomeOffice = lazy(
  () => import("./pages/EmployeeModule/HomeOffice/CreateHomeOffice")
);

export const InventoryLayout = lazy(() => import("./pages/InventoryModule"));

export const TangiblesInventory = lazy(
  () => import("./pages/InventoryModule/TangibleInventory")
);
export const ConsumablesInventory = lazy(
  () => import("./pages/InventoryModule/ConsumableInventory")
);

// Category
export const CategoryLayout = lazy(
  () => import("./pages/EmployeeModule/Category")
);
export const CategoryList = lazy(
  () => import("./pages/EmployeeModule/Category/CategoryList")
);
export const AddCategory = lazy(
  () => import("./pages/EmployeeModule/Category/AddCategory")
);
export const UpdateCategory = lazy(
  () => import("./pages/EmployeeModule/Category/UpdateCategory")
);
