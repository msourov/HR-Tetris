import { getDataResponse, PaginatedApiResponse } from "./shared";

// Task Types
export interface TaskResponse {
  id: number;
  uid: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  start_date: string;
  due_date: string;
  estimated_time: number;
  actual_time_spent: number;
  active: boolean;
  reporter: Employee;
  assignees: Employee[];
  comments: Comment[];
  tags: string[];
  attachments: unknown[];
  logs: TaskLog[];
  created_at: string;
  updated_at: string;
  subtasks?: unknown;
  dependencies?: unknown[];
  feedback?: string | null;
}

export interface TaskCreatePayload {
  name: string;
  description: string;
  assignee: string[];
  reporter_id: string;
  priority: string;
  status: string;
  start_date: string;
  due_date: string;
  tags: string[];
  comments: Comment[];
  attachments: unknown[];
  estimated_time: number;
  actual_time_spent: number;
  dependencies: unknown[];
}

export interface TaskUpdatePayload extends TaskCreatePayload {
  uid: string;
  subtasks?: unknown[];
  updated_at: string;
}

export interface Employee {
  employee_id: string;
  name: string;
  department: string;
  designation: string;
}

export interface Comment {
  comment: string;
  employee_id: string;
}

export interface TaskLog {
  admin?: string;
  message?: string;
  create_at?: string;
  changes?: {
    status?: string;
    comments?: Comment[];
    estimated_time?: number;
  };
  employee?: string;
  updated_at?: string;
}

export interface AllTasksResponse
  extends PaginatedApiResponse<TaskResponse[]> {}
export interface TaskDetailResponse extends getDataResponse<TaskResponse> {}
