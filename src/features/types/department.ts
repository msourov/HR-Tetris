import { getDataResponse, Logs, PaginatedApiResponse } from "./shared";

interface DepartmentData {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  company_id: string;
  logs: Logs[];
}

interface Employee {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  supervisor: boolean;
  is_probation: boolean;
  designation: string;
}

interface DepartmentDetail {
  uid: string;
  id: number;
  name: string;
  company_id: string;
  active: boolean;
  logs: Logs | Logs[];
  create_at: string;
  update_at: string | null;
  employees: Employee[];
}

export interface Departments {
  uid: string;
  name: string;
}

export interface DepartmentResponse
  extends PaginatedApiResponse<DepartmentData[]> {}
export interface DepartmentDetailResponse
  extends getDataResponse<DepartmentDetail> {}
export interface DepartmentHelper extends getDataResponse<Departments[]> {}
