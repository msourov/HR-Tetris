export interface OvertimePayment {
  uid: string;
  employee_id: string;
  employee_name: string;
  overtime_uid: string;
  created_at: string;
}

export interface AllOvertimePaymentsResponse {
  data: OvertimePayment[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateOvertimePaymentPayload {
  overtime_uid: string;
}
