import { getDataResponse, Log } from "./shared";

export interface Announcement {
  id: number;
  uid: string;
  name: string;
  descriptions: string;
  active: boolean;
  is_approve: "pending" | "approved" | "rejected";
  assignee: string | null;
  creator_name: string;
  department_name: string;
  logs: Log[];
  create_at: string;
  update_at: string;
}

export interface AnnouncementResponse extends getDataResponse<Announcement[]> {}
export interface SingleAnnouncementResponse
  extends getDataResponse<Announcement> {}