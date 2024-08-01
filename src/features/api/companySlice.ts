// companyApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { CompanyResponse } from "./types";

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
  }),
});

export const { useGetCompanyQuery } = companyApi;
