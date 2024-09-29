export interface Response {
  status_code: number;
  success: boolean;
  message: string;
}

interface getDataResponse<T> {
  status_code: number;
  success: boolean;
  data: T;
}

interface AccessPermissions {
  user_management: string;
  office_management: string;
  app_user_management: string;
  employee_management: string;
  clm_management: string;
  ticket_management: string;
  inventory_management: string;
  anouncement_management: string;
  recruitment_management: string;
}

interface RolePermissions {
  app_user_management: "a" | "i";
  employee_management: "a" | "i";
  user_management: "a" | "i";
  office_management: "a" | "i";
  clm_management: "a" | "i";
  ticket_management: "a" | "i";
  inventory_management: "a" | "i";
  anouncement_management: "a" | "i";
  recruitment_management: "a" | "i";
}

export interface User {
  mobile: string;
  uid: string;
  id: number;
  name: string;
  role_id: string;
  role_name: string;
  super_admin: boolean;
  active: boolean;
  logs: Logs;
  create_at: string;
}

interface UserResponseData {
  role_name: string | number | boolean | Date | Logs | undefined;
  mobile: string;
  uid: string;
  id: number;
  name: string;
  role_id: string;
  super_admin: boolean;
  active: boolean;
  logs: Logs;
  create_at: string;
  update_at: string;
}

export interface CreateUserResponse extends getDataResponse<User> {}
export interface SingleUserResponse extends getDataResponse<UserResponseData> {}
export interface RoleDetailResponse extends getDataResponse<Role> {}
export interface DepartmentDetail extends getDataResponse<DepartmentData> {}
export interface CandidatesResponse extends getDataResponse<CandidateData[]> {}
export interface DepartmentHelper extends getDataResponse<Departments[]> {}
export interface DesignationHelper extends getDataResponse<Departments[]> {}
export interface ShiftHelper extends getDataResponse<Departments[]> {}
export interface ShiftDetailResponse extends getDataResponse<Shift> {}

export interface PaginatedApiResponse<T> {
  status_code: number;
  success: boolean;
  data: T;
  page: number;
  limit: number;
  total_items: number;
}

export interface UserResponse extends PaginatedApiResponse<User[]> {}
export interface RoleResponse extends PaginatedApiResponse<Role[]> {}
export interface CompanyResponse extends PaginatedApiResponse<Company[]> {}
export interface DepartmentResponse
  extends PaginatedApiResponse<DepartmentData[]> {}
export interface AllShiftResponse extends PaginatedApiResponse<Shift[]> {}
export interface PolicyResponse
  extends PaginatedApiResponse<AllPolicy | AllPolicy[]> {}
export interface HolidayResponse
  extends PaginatedApiResponse<Holiday[] | Holiday> {}

export interface LoginRequest {
  mobile: string;
  password: string;
  otp: number;
}

export interface Logs {
  admin: string;
  message: string;
  create_at: string | Date;
}

export interface LoginResponse {
  access_token: string;
  role: AccessPermissions;
  mobile: string;
  name: string;
  refresh_token: string;
}

export interface Role {
  name: string;
  uid: string;
  id: number;
  super_admin: boolean;
  active: boolean;
  access: AccessPermissions;
  logs: Logs;
  create_at: string;
}

export interface CreateRoleRequest extends RolePermissions {
  name: string;
  active: boolean;
}

export interface EditRoleRequest extends RolePermissions {
  uid: string;
  name: string;
  active: boolean;
}

export interface EditUserRequest {
  uid: string | undefined;
  name: string;
  active: boolean;
  role: string;
}

export interface Request {
  id: string;
}

interface Company {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  tin: string;
  location: string;
  logs: Logs;
  create_at: string;
}

interface DepartmentData {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  company_id: string;
  logs: Logs[];
}

export interface DesignationDetail {}

export interface CandidateData {
  uid: string;
  id: number;
  name: string;
  file_name: string;
  email: string;
  cover_letter: string;
  department: string;
  state: string;
  extension: string;
  logs: {
    user: string;
    message: string;
    create_at: string;
  };
  create_at: string;
  update_at: string;
}

interface Departments {
  uid: string;
  name: string;
}

interface ShiftBase {
  name: string;
  active: boolean;
  regular: boolean;
  descriptions?: string;
  day_start_time: string;
  day_end_time: string;
  off_day?: string;
  start_time: string;
  end_time: string;
}

export interface Shift extends ShiftBase {
  id: number;
  uid: string;
  logs: Logs[];
  create_at: string;
  update_at: string;
}

export interface ShiftCreateRequest extends ShiftBase {}

export interface ShiftUpdateRequest extends ShiftBase {
  uid: string;
}

export interface AllPolicy {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  descriptions: string;
  is_approve: boolean | null;
  logs: Logs;
  create_at: string;
  update_at: string | null;
}

export interface Holiday {
  id: number;
  uid: string;
  name: string;
  active: boolean;
  is_approve: boolean;
  holiday_at: string;
  descriptions: string;
  logs: Logs[] | Logs;
  create_at: string;
  update_at: string | null;
}

interface EmergencyContact {
  name: string;
  address: string;
  relationship: string;
  phone: string;
}

interface Documents {
  is_cv: boolean;
  is_nid: boolean;
  is_tin: boolean;
  is_birth_certificate: boolean;
  is_academic: boolean;
  is_passport: boolean;
  is_joining_letter: boolean;
  is_noc: boolean;
  is_professional: boolean;
  is_non_disclosure_agreement: boolean;
  is_utility: boolean;
  is_image: boolean;
}

interface DocumentExtensions {
  cv: string | null;
  nid: string | null;
  tin: string | null;
  birth_certificate: string | null;
  academic: string | null;
  passport: string | null;
  joining_letter: string | null;
  noc: string | null;
  professional: string | null;
  non_disclosure_agreement: string | null;
  utility: string | null;
  image: string | null;
  other_extensions: string | null;
}

interface EmployeeAccess {
  announcement_management: string;
  announcement_approve_management: string;
  certification_management: string;
  certification_approve_management: string;
  leave_management: string;
  leave_approve_management: string;
  attendance_management: string;
  overtime_management: string;
  overtime_approve_management: string;
  home_office_management: string;
  home_office_approve_management: string;
  loan_equipment_management: string;
  loan_equipment_approve_management: string;
  recruitment_management: string;
  ticket_management: string;
  ticket_admin_management: string;
  consumable_management: string;
  accounts_management: string;
  accounts_admin_management: string;
  reports_admin_management: string;
  reports_management: string;
  employee_admin_management: string;
}

interface Log {
  admin: string;
  message: string;
  create_at: string;
}

export interface Employee {
  id: number;
  uid: string;
  name: string;
  active: boolean;
  phone: string;
  email: string;
  bod: string;
  salary: number;
  joining_date: string;
  employee_id: string;
  emergency_contact: EmergencyContact;
  is_probation: boolean;
  probation_end_time: string;
  supervisor: boolean;
  executives: string[];
  is_admin: boolean;
  department: { uid: string; name: string };
  designation: { uid: string; name: string };
  company: string;
  shift_and_schedule: { uid: string; name: string };
  leave_manage: null;
  temp_shift_and_schedule: boolean;
  temp_sas_start_time: string;
  temp_sas_end_time: string;
  logs: Log | Log[];
  created_at: string;
  updated_at: string;
  documents: Documents;
  document_extensions: DocumentExtensions;
  employee_access: EmployeeAccess;
}

export interface SingleEmployeeResponse {
  status_code: number;
  success: boolean;
  data: Employee;
}

export interface AllEmployeesResponse {
  status_code: number;
  success: boolean;
  data: Employee[];
}

export interface CreateEmployeePayload {
  name: string;
  active: boolean;
  address: string;
  home_phone: string;
  phone: string;
  email: string;
  nid_bid: string;
  bod: string;
  marital_status: string;
  spouse_name: string;
  salary: number;
  joining_date: string;
  password: string;
  employee_id: string;
  dependent_info: Record<string, unknown>;
  em_name: string;
  em_address: string;
  em_relationship: string;
  em_phone: string;
  is_probation: boolean;
  probation_end_time: string;
  department: string;
  designation: string;
  shift_and_schedule: string;
  company: string;
  work_location: string;
  work_email: string;
  supervisor: boolean;
  executives: string[];
  is_admin: boolean;
  temp_shift_and_schedule: boolean;
  temp_sas_start_time: string;
  temp_sas_end_time: string;
  documents: Documents;
  employee_access: EmployeeAccess;
}
