import { Logs, PaginatedApiResponse } from "./shared";

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

export interface DashboardResponse {
  status_code: number;
  success: boolean;
  data: {
    employee: {
      total_employee: number;
      active_employee: number;
      inactive_employee: number;
    };
    leave: {
      accept_leaves: number;
      total_leaves: number;
      pending_leaves: number;
    };
    shift_schedule: {
      total: number;
      active: number;
      inactive: number;
    };
    designation: {
      total: number;
      active: number;
      inactive: number;
    };
    department: {
      total: number;
      active: number;
      inactive: number;
    };
    current_date: string;
  };
}

export interface CompanyResponse extends PaginatedApiResponse<Company[]> {}
