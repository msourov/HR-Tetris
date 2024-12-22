import { Logs, PaginatedApiResponse } from "./shared";

interface Company {
  name: string;
  uid: string;
  id: number;
  active: boolean;
  tin: string;
  location: string;
  logs: Logs;
  create_at: string;
}
export interface CompanyResponse extends PaginatedApiResponse<Company[]> {}
