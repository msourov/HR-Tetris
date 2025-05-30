import { getDataResponse, PaginatedApiResponse } from "./shared";

export interface MeetingPerson {
  employee_id: string;
  name: string;
  department: string;
  designation: string;
}

export interface Meeting {
  id: number;
  uid: string;
  supervisor: string;
  name: string;
  descriptions: string;
  meeting_type: "online" | "offline";
  online_link: string;
  active: boolean;
  is_done: boolean | null;
  is_approved: boolean | null;
  priority: "low" | "medium" | "high";
  agenda: string | null;
  duration: string | null;
  location: string | null;
  feedback: string | null;
  meeting_minutes: string | null;
  meeting_person: MeetingPerson[];
  participant_status: string | null;
  logs: {
    admin: string;
    message: string;
    create_at: string;
  };
  create_at: string;
  update_at: string;
  meeting_at: string;
  reminder_time: string | null;
  reject_purpose: string | null;
}

export interface AllMeetingsResponse {
  data: Meeting[];
  total: number;
}

export interface MeetingDetailResponse {
  data: Meeting;
}

export interface MeetingCreatePayload {
  name: string;
  descriptions: string;
  supervisor_id: string;
  meeting_type: "online" | "offline";
  active: boolean;
  meeting_person: string[]; // array of employee_ids
  online_link: string;
  priority: "low" | "medium" | "high";
  agenda: string;
  location: string;
  meeting_at: string; // ISO string
}

export interface MeetingUpdatePayload extends MeetingCreatePayload {
  duration?: string;
}

export interface AllMeetingResponse
  extends PaginatedApiResponse<AllMeetingsResponse[]> {}
export interface MeetingDetailResponse extends getDataResponse<Meeting> {}
