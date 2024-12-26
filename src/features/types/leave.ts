import { Log, PaginatedApiResponse } from "./shared";

export interface Leave {
  id: number;
  uid: string;
  employee_id: string;
  employee_name: string;
  purpose: string;
  leave_type: string;
  leave_start_date: string;
  leave_end_date: string;
  is_active: boolean;
  is_approved: "pending" | "approved" | "rejected" | null;
  logs: Log | Log[];
  create_at: string;
  update_at: string;
}

export interface CreateLeaveRequest {
  purpose: string;
  employee_id: string;
  leave_type: string;
  leave_start_date: string;
  leave_end_date: string;
}

export interface UpdateLeaveRequest extends CreateLeaveRequest {
  uid: string;
  amount: number;
}

export interface ApproveLeaveRequest {
  uid: string;
  is_approved: string;
  reject_purpose: string;
}

export interface LeaveResponse extends PaginatedApiResponse<Leave[] | Leave> {
  start_time?: string;
  end_time?: string;
  is_approved?: string;
  employee_id?: string;
  is_active?: boolean;
}