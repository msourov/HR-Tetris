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

// export interface AllTangibles extends PaginatedApiResponse<Tangible[] | Tangible> {}

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

// export interface ConsumableDetails extends getDataResponse<Consumable> {}

// export interface AllTangibles
//   extends PaginatedApiResponse<Tangible[] | Tangible> {}
