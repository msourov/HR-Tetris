import {
  AccessPermissions,
  getDataResponse,
  Logs,
  PaginatedApiResponse,
} from "./shared";

export interface Role {
  name: string;
  uid: string;
  id: number;
  super_admin: boolean;
  active: boolean;
  access: AccessPermissions;
  logs: Logs;
  create_at: string;
}

interface RolePermissions {
  app_user_management: "a" | "i";
  employee_management: "a" | "i";
  user_management: "a" | "i";
  office_management: "a" | "i";
  clm_management: "a" | "i";
  ticket_management: "a" | "i";
  inventory_management: "a" | "i";
  anouncement_management: "a" | "i";
  recruitment_management: "a" | "i";
}

export interface CreateRoleRequest extends RolePermissions {
  name: string;
  active: boolean;
}

export interface EditRoleRequest extends RolePermissions {
  uid: string;
  name: string;
  active: boolean;
}

export interface RoleDetailResponse extends getDataResponse<Role> {}
export interface RoleResponse extends PaginatedApiResponse<Role[]> {}
