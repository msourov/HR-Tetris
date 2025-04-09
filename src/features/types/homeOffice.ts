import { getDataResponse, Log, PaginatedApiResponse } from "./shared";

export interface HomeOffice {
  id: number;
  uid: string;
  employee_id: string;
  employee_name: string;
  purpose: string;
  home_office_start_date: string;
  home_office_end_date: string;
  is_active: boolean;
  is_approved: "pending" | "approved" | "rejected";
  logs: Log | Log[];
  create_at: string;
  update_at: string;
}

export interface CreateHomeOffice {
  employee_id: string;
  purpose: string;
  home_office_start_date: string;
  home_office_end_date: string;
}

export interface UpdateHomeOffice extends CreateHomeOffice {
  uid: string;
}

export interface AllHomeOfficeResponse
  extends PaginatedApiResponse<HomeOffice | HomeOffice[]> {}

export interface HomeOfficeDetail extends getDataResponse<HomeOffice> {}
