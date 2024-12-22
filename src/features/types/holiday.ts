import { Logs, PaginatedApiResponse } from "./shared";

export interface Holiday {
  id: number;
  uid: string;
  name: string;
  active: boolean;
  is_approve: boolean;
  holiday_at: string;
  descriptions: string;
  logs: Logs[] | Logs;
  create_at: string;
  update_at: string | null;
}

export interface HolidayResponse
  extends PaginatedApiResponse<Holiday[] | Holiday> {}
