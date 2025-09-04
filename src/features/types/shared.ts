export interface Response {
  status_code: number;
  success: boolean;
  message: string;
}

export interface getDataResponse<T> {
  status_code: number;
  success: boolean;
  data: T;
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

interface Pagination {
  page: number;
  total_pages: number;
  page_size: number;
  total_records: number;
}

export interface PaginatedApiResponse<T> {
  status_code: number;
  success: boolean;
  data: T;
  pagination: Pagination;
}

export interface Logs {
  admin: string;
  message: string;
  create_at: string | Date;
}

export interface Log {
  admin: string;
  message: string;
  create_at: string;
}

export interface Request {
  id: string;
}

export interface AccessPermissions {
  user_management: string;
  office_management: string;
  app_user_management: string;
  employee_management: string;
  clm_management: string;
  ticket_management: string;
  inventory_management: string;
  anouncement_management: string;
  recruitment_management: string;
}

export interface ApproveRequest {
  uid: string;
  is_approved: string;
  reject_purpose: string;
}
