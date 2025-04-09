import { getDataResponse, Log, PaginatedApiResponse } from "./shared";

export interface Overtime {
  id: number;
  uid: string;
  employee_id: string;
  employee_name: string;
  purpose: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  is_approved: ApprovalStatus;
  amount: number | null;
  logs: Log[] | Log;
  create_at: string;
  update_at: string;
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVE = "approved",
  REJECT = "reject",
}

export interface ApproveOvertimeRequest {
  uid: string;
  is_approved: string;
  reject_purpose?: string;
}

export interface CreateOvertime {
  purpose: string;
  employee_id: string;
  start_time: string;
  end_time: string;
}

export interface UpdateOvertime extends CreateOvertime {
  uid: string;
  amount: number;
}

export interface OvertimeDetail extends getDataResponse<Overtime> {}

export interface OvertimeResponse
  extends PaginatedApiResponse<Overtime[] | Overtime> {
  start_time?: string;
  end_time?: string;
  is_approved?: string;
  employee_id?: string;
  is_active?: boolean;
}
