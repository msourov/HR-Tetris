import { Departments } from "./department";
import { getDataResponse, Logs, PaginatedApiResponse } from "./shared";

interface ShiftBase {
  name: string;
  active: boolean;
  regular: boolean;
  descriptions?: string;
  day_start_time: string;
  day_end_time: string;
  off_day?: string;
  start_time: string;
  end_time: string;
}

export interface Shift extends ShiftBase {
  id: number;
  uid: string;
  logs: Logs[];
  create_at: string;
  update_at: string;
}

export interface AllShiftResponse extends PaginatedApiResponse<Shift[]> {}
export interface ShiftCreateRequest extends ShiftBase {}
export interface ShiftUpdateRequest extends ShiftBase {
  uid: string;
}
export interface ShiftHelper extends getDataResponse<Departments[]> {}
export interface ShiftDetailResponse extends getDataResponse<Shift> {}
