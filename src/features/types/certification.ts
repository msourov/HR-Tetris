import { getDataResponse, PaginatedApiResponse } from "./shared";

export interface Certification {
  id: number;
  uid: string;
  employee_id: string;
  employee_name?: string;
  purpose: string;
  certification_type: string;
  apply_date: string;
  is_active: boolean;
  is_approved: "pending" | "approved" | "rejected";
  logs: {
    admin: string;
    message: string;
    create_at: string;
  }[];
  create_at: string;
  update_at: string;
}

export interface CertificationCreatePayload {
  employee_id: string;
  purpose: string;
  certification_type: string;
  apply_date: string;
}

export interface CertificationApprovalPayload {
  uid: string;
  is_approved: "approved" | "rejected";
  reject_purpose: string;
}

export interface AllCertificationsResponse
  extends PaginatedApiResponse<Certification[]> {}

export interface CertificationResponse extends getDataResponse<Certification> {}
