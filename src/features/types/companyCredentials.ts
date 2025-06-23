import { getDataResponse, Log, PaginatedApiResponse } from "./shared";

export interface CompanyCredential {
  id: number;
  uid: string;
  name: string;
  descriptions: string;
  active: boolean;
  notify_mobile: string[];
  notify_b_days: string[];
  creation_date: string;
  expire_at: string;
  logs: Log[];
  create_at: string;
  update_at: string;
}

export interface CreateCredential {
  name: string;
  descriptions: string;
  active: boolean;
  notify_mobile: string[];
  notify_b_days: string[];
  creation_date: string;
  expire_at: string;
}

export interface CredentialsResponse
  extends PaginatedApiResponse<CompanyCredential[]> {}
export interface CredentialDetailResponse
  extends getDataResponse<CompanyCredential> {}

export interface UpdateCredential extends CreateCredential {
  uid: string;
}
