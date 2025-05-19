import { getDataResponse, Log, PaginatedApiResponse } from "./shared";

export interface PayrollRecord {
  id: number;
  employee_id: string;
  uid: string;
  employee_name: string;
  month: string;
  base_salary: number;
  housing_allowance: number;
  conveyance_allowance: number;
  medical_allowance: number;
  late_deductions: number;
  bonus: number;
  tds_deduction: number | null;
  increment_percentage: number;
  gross_salary: number | null;
  net_salary: number;
  attendance_report: unknown;
  logs: Log[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePayroll {
  employee_id: string;
  salary: number;
}

export interface AllPayrollResponse
  extends PaginatedApiResponse<PayrollRecord[]> {}

export interface PayrollDetailResponse extends getDataResponse<PayrollRecord> {}
