import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllPayrollResponse,
  CreatePayroll,
  PayrollDetailResponse,
} from "../types/payroll";

export const payrollApi = createApi({
  reducerPath: "payrollApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.PAYROLL],
  endpoints: (builder) => ({
    getPayrolls: builder.query<
      AllPayrollResponse,
      {
        page: number;
        limit: number;
        start_time?: string;
        end_time?: string;
        salary?: number;
        employee_id?: string;
      }
    >({
      query: (params) => ({
        url: "payroll/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Payroll" as const,
                id: uid,
              })),
              { type: "Payroll", id: "LIST" },
            ]
          : [{ type: "Payroll", id: "LIST" }],
    }),

    getPayrollDetail: builder.query<PayrollDetailResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: `payroll/${uid}`,
        method: "GET",
      }),
      providesTags: (_res, _err, { uid }) => [{ type: "Payroll", id: uid }],
    }),

    addPayroll: builder.mutation<Response, CreatePayroll>({
      query: (data) => ({
        url: "payroll/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Payroll", id: "LIST" }],
    }),

    editPayroll: builder.mutation<Response, CreatePayroll>({
      query: (data) => ({
        url: "payroll/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { employee_id }) => [
        { type: "Payroll", id: employee_id },
      ],
    }),
  }),
});

export const {
  useGetPayrollsQuery,
  useGetPayrollDetailQuery,
  useAddPayrollMutation,
  useEditPayrollMutation,
} = payrollApi;
