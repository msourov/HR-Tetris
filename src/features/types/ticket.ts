import { getDataResponse, Log, PaginatedApiResponse } from "./shared";

export interface Upload {
  file_name: string;
  file_path: string;
  file_type: string;
}

export interface Chat {
  message: string;
  uploads: Upload[];
  user_id: string;
  create_at: string;
  user_name: string;
}

export interface Ticket {
  id: number;
  uid: string;
  employee_id: string;
  name: string;
  priority: string | null;
  status: string;
  descriptions: string | null;
  active: boolean;
  category: string | null;
  logs: Log;
  assignee: string | null;
  create_at: string;
  chat: Chat[];
  update_at: string;
}

export interface CreateTicketRequest {
  employee_id: string;
  name?: string;
  type: string;
  message: string;
  files?: File[];
}

export interface TicketResolve {
  uid: string;
  status: string;
  closed_at: string | null;
  update_at: string;
}

export interface TicketResponse
  extends PaginatedApiResponse<Ticket[] | Ticket> {}

export interface TicketResolveResponse extends getDataResponse<TicketResolve> {}
