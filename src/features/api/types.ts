export interface User {
  mobile: string;
  uid: string;
  id: number;
  name: string;
  role_id: string;
  role_name: string;
  super_admin: boolean;
  active: boolean;
  logs: {
    admin: string;
    message: string;
    create_at: string;
  };
  create_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total_page: number;
  total_items: number;
}

export interface UserResponse {
  status_code: number;
  success: boolean;
  data: User[];
  pagination: Pagination;
}

export interface CreateUserResponse {
  status_code: number;
  success: boolean;
  data: User;
}

export interface LoginRequest {
  mobile: string;
  password: string;
  otp: number;
}

export interface LoginResponse {
  access_token: string;
  role: {
    user_management: string;
    office_management: string;
    app_user_management: string;
    employee_management: string;
  };
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
  access: {
    user_management: string;
    office_management: string;
    app_user_management: string;
    employee_management: string;
  };
  logs: {
    admin: string;
    message: string;
    create_at: string;
  };
  create_at: string;
}

export interface RoleResponse {
  status_code: number;
  success: boolean;
  data: Role[];
  page: number;
  limit: number;
  total_items: number;
}

export interface CreateRoleRequest {
  name: string;
  active: boolean;
  app_user_management: "a" | "i";
  employee_management: "a" | "i";
  user_management: "a" | "i";
  office_management: "a" | "i";
}

export interface Response {
  status_code: number;
  success: boolean;
  message: string;
}

export interface EditRoleRequest {
  uid: string;
  name: string;
  active: boolean;
  app_user_management: "a" | "i";
  employee_management: "a" | "i";
  user_management: "a" | "i";
  office_management: "a" | "i";
}

interface Logs {
  admin: string;
  message: string;
  create_at: Date | undefined;
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
  create_at: Date;
  update_at: Date;
}

export interface SingleUserResponse {
  status_code: number;
  success: boolean;
  data: UserResponseData;
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

export interface RoleDetailResponse {
  status_code: number;
  success: boolean;
  data: Role;
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
  logs: {
    admin: string;
    message: string;
    create_at: string;
  };
  create_at: string;
}

export interface CompanyResponse {
  status_code: number;
  success: boolean;
  data: Company[];
  page: number;
  limit: number;
  total_items: number;
}

interface DepartmentData {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  company_id: string;
  logs: Logs[];
}

export interface DesignationDetail {

}

export interface DepartmentResponse {
  status_code: number;
  success: boolean;
  data: DepartmentData[];
  page: number;
  limit: number;
  total_items: number;
}

export interface DepartmentDetail {
  status_code: number;
  success: boolean;
  data: DepartmentData;
}

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
export interface CandidatesResponse {
  status_code: number;
  success: boolean;
  data: CandidateData[];
}
