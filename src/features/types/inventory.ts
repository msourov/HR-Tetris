import { getDataResponse, Log, PaginatedApiResponse } from "./shared";

// Consumables

export interface Consumable {
  id: number;
  uid: string;
  name: string;
  descriptions: string;
  price: number;
  active: boolean;
  logs: Log[];
  quantity: number;
  create_at: string;
  buyer_id: string;
  update_at: string | null;
  buyer_at: string | null;
  extension: string;
}

export interface AllConsumables extends PaginatedApiResponse<Consumable[]> {}
export interface ConsumableDetails extends getDataResponse<Consumable> {}

export interface ConsumableFormParams {
  name: string;
  quantity: number;
  price: number;
  descriptions?: string;
  buyer_id?: string;
  buyer_at?: string;
  file?: File;
}

export interface ConsumablesUpdate {
  uid: string;
  name: string;
  descriptions: string;
  quantity: number;
  price: number;
  buyer_id: string;
  buyer_at: string | null;
}

// Tangibles

export interface Tangible {
  uid: string;
  name: string;
  descriptions: string;
  active: boolean;
  quantity: number;
  price: number;
  location: string;
  category: string;
  create_at: string;
  update_at: string | null;
  extension: string | null;
  logs: Log[];
}

export interface AllTangibles extends PaginatedApiResponse<Tangible[]> {}

export interface TangibleFormParams {
  name: string;
  descriptions?: string;
  quantity: number;
  price: number;
  location?: string;
  category?: string;
  file?: File;
}

export interface TangibleUpdate {
  uid: string;
  name: string;
  descriptions: string;
  active: boolean;
  quantity: number;
  price: number;
  location: string;
  category: string;
}

// types/Guarantor.ts
export interface Guarantor {
  guarantor_id: string;
  guarantor_name: string;
  guarantor_designation: string;
  guarantor_department: string;
  guarantor_image: string;
}

// types/Employee.ts
export interface Employee {
  employee_id: string;
  employee_name: string;
  employee_designation: string;
  employee_department: string;
  employee_image: string;
}

export interface Loan {
  id: number;
  uid: string;
  name: string;
  descriptions: string;
  employee: Employee;
  price: number;
  active: boolean;
  logs: Log[];
  quantity: number;
  is_guarantor_approve: "pending" | "approved" | "rejected";
  is_admin_approve: "pending" | "approved" | "rejected";
  reject_purpose_guarantor: string | null;
  reject_purpose_admin: string | null;
  category: string;
  assignee: string | null;
  create_at: string;
  update_at: string | null;
  extension: string | null;
}

export interface LoanWithGuarantorObj extends Loan {
  guarantor: Guarantor;
}
export interface LoanWithGuarantorId extends Loan {
  guarantor_id: string;
}

export interface CreateLoan {
  name: string;
  employee_id: string;
  descriptions: string | undefined;
  quantity: number;
  price: number;
  guarantor_id: string;
  category: string;
}

export interface UpdateLoan {
  uid: string;
  name: string;
  descriptions: string;
  active: boolean;
  quantity: number;
  price: number;
  guarantor_id: string;
  category: string;
}

export interface AllLoanResponse
  extends PaginatedApiResponse<LoanWithGuarantorObj[]> {}
export interface LoanDetailResponse
  extends getDataResponse<LoanWithGuarantorId> {}
