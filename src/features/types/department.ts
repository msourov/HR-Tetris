import { getDataResponse, Logs, PaginatedApiResponse } from "./shared";

interface DepartmentData {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  company_id: string;
  logs: Logs[];
}

export interface Departments {
  uid: string;
  name: string;
}

export interface DepartmentResponse
  extends PaginatedApiResponse<DepartmentData[]> {}
export interface DepartmentDetail extends getDataResponse<DepartmentData> {}
export interface DepartmentHelper extends getDataResponse<Departments[]> {}
