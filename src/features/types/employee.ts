import { getDataResponse, Log } from "./shared";

// export interface Employee {
//   id: number;
//   uid: string;
//   name: string;
//   active: boolean;
//   phone: string;
//   email: string;
//   address: string;
//   bod: string;
//   marital_status: "string";
//   salary: number;
//   joining_date: string;
//   employee_id: string;
//   spouse_name: "string";
//   emergency_contact: EmergencyContact;
//   work_location: string;
//   work_email: string;
//   is_probation: boolean;
//   probation_end_time: string;
//   supervisor: boolean;
//   executives: string[];
//   is_admin: boolean;
//   department: { uid: string; name: string };
//   designation: { uid: string; name: string };
//   company: { uid: string; name: string };
//   shift_and_schedule: { uid: string; name: string };
//   leave_manage: null;
//   temp_shift_and_schedule: boolean;
//   temp_sas_start_time: string;
//   temp_sas_end_time: string;
//   logs: Log | Log[];
//   created_at: string;
//   updated_at: string;
//   documents: Documents;
//   document_extensions: DocumentExtensions;
//   employee_access: EmployeeAccess;
// }

export interface Employee {
  id: number;
  uid: string;
  personal: PersonalInfo;
  work: WorkInfo;
  dependent_info: DependentInfo;
  emergency_contact: EmergencyContact;
  is_admin: boolean;
  leave_manage: null | LeaveManage;
  temp_shift_and_schedule: boolean;
  temp_sas_start_time: string;
  temp_sas_end_time: string;
  employee_access: EmployeeAccess;
  logs: Log | Log[];
  created_at: string;
  updated_at: string;
  document_extensions: DocumentExtensions;
}

export interface PersonalInfo {
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
}

export interface WorkInfo {
  work_location: string;
  work_email: string;
  salary: number;
  joining_date: string;
  employee_id: string;
  is_probation: boolean;
  probation_end_time: string;
  supervisor: boolean;
  executives: string[];
  department: { uid: string; name: string };
  designation: { uid: string; name: string };
  shift_and_schedule: { uid: string; name: string };
  company: { uid: string; name: string };
}

export interface DependentInfo {
  // Add specific dependent fields if available in the payload
}

export interface LeaveManage {
  // Add specific leave management fields if available in the payload
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

// export interface CreateEmployeePayload {
//   name: string;
//   phone: string;
//   email: string;
//   bod: string;
//   marital_status: string;
//   salary: number;
//   password: string;
//   joining_date: string;
//   employee_id: string;
//   department: string;
//   designation: string;
//   shift_and_schedule: string;
//   active: boolean;
//   is_probation: boolean;
//   company: string;
//   supervisor: boolean;
//   executives?: string[];
//   attendance_management: AccessLevel;
//   overtime_management: AccessLevel;
//   home_office_management: AccessLevel;
//   accounts_management: AccessLevel;
//   leave_management: AccessLevel;
//   announcement_management: AccessLevel;
//   certification_management: AccessLevel;
//   loan_equipment_management: AccessLevel;
//   reports_management: AccessLevel;
//   ticket_management: AccessLevel;
//   recruitment_management: AccessLevel;
//   employee_admin_management: AccessLevel;
//   overtime_approve_management: AccessLevel;
//   home_office_approve_management: AccessLevel;
//   accounts_admin_management: AccessLevel;
//   leave_approve_management: AccessLevel;
//   announcement_approve_management: AccessLevel;
//   certification_approve_management: AccessLevel;
//   loan_equipment_approve_management: AccessLevel;
//   reports_admin_management: AccessLevel;
//   ticket_admin_management: AccessLevel;
//   consumable_management: AccessLevel;
// }

export interface UnifiedEmployeePayload {
  uid?: string;
  name: string;
  active: boolean;
  address: string;
  home_phone: string;
  phone: string;
  email: string;
  nid_bid: string;
  bod: string;
  marital_status: string;
  spouse_name?: string;
  work_location?: string;
  work_email?: string;
  salary: number;
  joining_date: string;
  dependent_info: object;
  em_name: string;
  em_address: string;
  em_relationship: string;
  em_phone: string;
  is_probation: boolean;
  probation_end_time?: string;
  supervisor: boolean;
  executives?: string[];
  is_admin: boolean;
  department: string;
  designation: string;
  company: string;
  shift_and_schedule: string;
  temp_shift_and_schedule?: boolean;
  temp_sas_start_time?: string;
  temp_sas_end_time?: string;
  logs?: object;
  create_at?: string;
  update_at?: string;
  password?: string;
  employee_id: string;
  // Documents Flags
  is_cv?: boolean;
  is_nid?: boolean;
  is_tin?: boolean;
  is_birth_certificate?: boolean;
  is_academic?: boolean;
  is_passport?: boolean;
  is_joining_letter?: boolean;
  is_noc?: boolean;
  is_professional?: boolean;
  is_non_disclosure_agreement?: boolean;
  is_utility?: boolean;
  is_image?: boolean;
  // Access Levels
  announcement_management: AccessLevel;
  announcement_approve_management: AccessLevel;
  certification_management: AccessLevel;
  certification_approve_management: AccessLevel;
  leave_management: AccessLevel;
  leave_approve_management: AccessLevel;
  attendance_management: AccessLevel;
  overtime_management: AccessLevel;
  overtime_approve_management: AccessLevel;
  home_office_management: AccessLevel;
  home_office_approve_management: AccessLevel;
  loan_equipment_management: AccessLevel;
  loan_equipment_approve_management: AccessLevel;
  recruitment_management: AccessLevel;
  ticket_management: AccessLevel;
  ticket_admin_management: AccessLevel;
  consumable_management: AccessLevel;
  accounts_management: AccessLevel;
  accounts_admin_management: AccessLevel;
  reports_admin_management: AccessLevel;
  reports_management: AccessLevel;
  employee_admin_management: AccessLevel;
}

export interface employeeHelperInterface {
  uid: string;
  name: string;
  employee_id: string;
  designatio: string;
  department: string;
}

export interface EmployeeHelperResponse
  extends getDataResponse<employeeHelperInterface[]> {}

export type AccessLevel = "a" | "i";

export interface EmployeeAccess {
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

interface EmergencyContact {
  name: string;
  address: string;
  relationship: string;
  phone: string;
}

// interface Documents {
//   is_cv: boolean;
//   is_nid: boolean;
//   is_tin: boolean;
//   is_birth_certificate: boolean;
//   is_academic: boolean;
//   is_passport: boolean;
//   is_joining_letter: boolean;
//   is_noc: boolean;
//   is_professional: boolean;
//   is_non_disclosure_agreement: boolean;
//   is_utility: boolean;
//   is_image: boolean;
// }

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
