import { getDataResponse } from "./shared";

export interface AttendanceLog {
  id: number;
  uid: string;
  employee_id: string;
  is_attend: boolean;
  is_home_office: boolean | null;
  ip_address: string | null;
  mac_address: string | null;
  logs: string | null;
  create_at: string; // ISO date string
  update_at: string | null; // ISO date string or null
  attended_date: string; // ISO date string
  end_attendent_time: string | null; // ISO date string or null
}

export type AttendanceResponse = getDataResponse<
  AttendanceLog | AttendanceLog[]
>;
