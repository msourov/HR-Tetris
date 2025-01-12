import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllEmployeesResponse,
  EmployeeHelperResponse,
  SingleEmployeeResponse,
  UnifiedEmployeePayload,
} from "../types/employee";
import { Response } from "../types/shared";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.EMPLOYEE],
  endpoints: (builder) => ({
    getEmployees: builder.query<
      AllEmployeesResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "employee/all",
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }: { uid: string }) => ({
                type: "Employee" as const,
                id: uid,
              })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),
    getEmployeeDetail: builder.query<
      SingleEmployeeResponse,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `employee/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Employee", id: uid },
      ],
    }),
    createEmployee: builder.mutation<Response, UnifiedEmployeePayload>({
      query: (data) => ({
        url: "employee/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
    editEmployee: builder.mutation<Response, UnifiedEmployeePayload>({
      query: (data) => ({
        url: "employee/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Employee", id: uid },
      ],
    }),
    deleteEmployee: builder.mutation<Response, { id: string }>({
      query: ({ id: delete_id }) => ({
        url: `employee/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),
    getEmplyeeHelper: builder.query<EmployeeHelperResponse, void>({
      query: () => ({
        url: "employee/helper",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailQuery,
  useCreateEmployeeMutation,
  useEditEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmplyeeHelperQuery,
} = employeeApi;
