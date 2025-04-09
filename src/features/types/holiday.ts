import { Logs, PaginatedApiResponse } from "./shared";

export interface Holiday {
  id: number;
  uid: string;
  name: string;
  active: boolean;
  is_approve: string;
  holiday_start_at: string;
  holiday_end_at: string;
  descriptions: string;
  logs: Logs[];
  create_at: string;
  update_at: string;
}

export interface CreateHoliday {
  name: string;
  descriptions: string;
  active: boolean;
  holiday_start_at: string;
  holiday_end_at: string;
}

export interface EditHoliday {
  uid: string;
  name: string;
  descriptions: string;
  active: boolean;
  holiday_start_at: string;
  holiday_end_at: string;
}

export interface HolidayResponse
  extends PaginatedApiResponse<Holiday[] | Holiday> {}
