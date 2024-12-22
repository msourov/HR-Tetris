// companyApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { CompanyResponse, DashboardResponse } from "./typesOld";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCompany: builder.query<CompanyResponse, { page: number; limit: number }>(
      {
        query: ({ page, limit }) => ({
          url: `sub-company/all?page=${page}&limit=${limit}`,
          method: "GET",
        }),
      }
    ),
    getDashboardResponse: builder.query<DashboardResponse, void>({
      query: () => ({
        url: "employee/dashboard",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCompanyQuery, useGetDashboardResponseQuery } = companyApi;
