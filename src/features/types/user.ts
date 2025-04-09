import { getDataResponse, Logs, PaginatedApiResponse } from "./shared";

export interface User {
  mobile: string;
  uid: string;
  id: number;
  name: string;
  role_id: string;
  role_name: string;
  super_admin: boolean;
  active: boolean;
  logs: Logs;
  create_at: string;
}

export interface UserResponseData {
  role_name: string;
  mobile: string;
  uid: string;
  id: number;
  name: string;
  role_id: string;
  super_admin: boolean;
  active: boolean;
  logs: Logs;
  create_at: string;
  update_at: string;
}

export interface EditUserRequest {
  uid: string | undefined;
  name: string;
  active: boolean;
  role: string;
}

export interface UserResponse extends PaginatedApiResponse<User[]> {}
export interface CreateUserResponse extends getDataResponse<User> {}
export interface SingleUserResponse
  extends getDataResponse<UserResponseData[]> {}
