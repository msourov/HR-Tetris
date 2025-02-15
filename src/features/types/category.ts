import { Log } from "./shared";

export interface Category {
  id: number;
  uid: string;
  values: string;
  active: boolean;
  create_at: string; // ISO string timestamp
  update_at: string | null; // Nullable timestamp
  model_type:
    | "designation"
    | "holidays"
    | "announcements"
    | "consumables"
    | "tangibles"
    | "home-office"
    | "certifications"
    | "attendance"
    | "tickets"
    | "leave"
    | "overtime"
    | "employee"
    | "shifts"
    | "policy"
    | "department"
    | "recruitment";
  name: string;
  logs: Log[];
}

export interface CategoryForm {
  name: string;
  values: string;
  model_type: Category["model_type"];
}

export interface CategoryUpdate {
  uid: string;
  name: string;
  values: string;
  model_type: string;
  active: boolean;
}
