import { getDataResponse, Logs } from "./shared";

export interface Attendance {
  id: number;
  uid: string;
  employee_id: string;
  employee_name: string;
  designation: string;
  department: string;
  employee_image: string;
  is_attend: boolean;
  is_late: boolean;
  is_home_office: boolean | null;
  ip_address: string | null;
  mac_address: string | null;
  logs: Logs | null;
  create_at: string;
  update_at: string | null;
  start_attended_date: string;
  end_attended_time: string;
}

export type AttendanceResponse = getDataResponse<Attendance[]>;
