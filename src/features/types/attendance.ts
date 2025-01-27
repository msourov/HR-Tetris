import { getDataResponse } from "./shared";

export interface Attendance {
  id: number;
  uid: string;
  employee_id: string;
  is_attend: boolean;
  is_home_office: boolean | null;
  ip_address: string | null;
  mac_address: string | null;
  logs: string | null;
  create_at: string;
  update_at: string | null;
  attended_date: string;
  end_attendent_time: string | null;
}

export type AttendanceResponse = getDataResponse<Attendance[]>;
