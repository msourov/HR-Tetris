import { Departments } from "./department";
import { getDataResponse } from "./shared";

export interface DesignationHelper extends getDataResponse<Departments[]> {}
export interface DesignationDetail {}