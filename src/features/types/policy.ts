import { Logs, PaginatedApiResponse } from "./shared";

export interface AllPolicy {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  descriptions: string;
  is_approve: boolean | null;
  logs: Logs;
  create_at: string;
  update_at: string | null;
}

export interface PolicyResponse
  extends PaginatedApiResponse<AllPolicy | AllPolicy[]> {}
