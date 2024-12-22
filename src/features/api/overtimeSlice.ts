import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { OvertimeResponse, ApproveOvertimeRequest, Response } from "./typesOld";
import { tagTypes } from "./tags";

export const overtimeApi = createApi({
  reducerPath: "overtimeApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.OVERTIME],
  endpoints: (builder) => ({
    allOvertime: builder.query<
      OvertimeResponse,
      {
        page: number;
        limit: number;
        is_approved?: "pending" | "approved" | "rejected" | null;
        start_time?: string;
        end_time?: string;
      }
    >({
      query: ({ page, limit, is_approved, start_time, end_time }) => ({
        url: "overtime/all",
        method: "GET",
        params: {
          page,
          limit,
          ...(is_approved && { is_approved }),
          ...(start_time && { start_time }),
          ...(end_time && { end_time }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ uid }) => ({
                    type: "Overtime" as const,
                    id: uid,
                  }))
                : []),
              { type: "Overtime", id: "LIST" },
            ]
          : [{ type: "Overtime", id: "LIST" }],
    }),
    createOvertime: builder.mutation<
      Response,
      {
        purpose: string;
        employee_id: string;
        start_time: string;
        end_time: string;
      }
    >({
      query: (data) => ({
        url: "overtime/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Overtime", id: "LIST" }],
    }),
    approveOvertime: builder.mutation<void, ApproveOvertimeRequest>({
      query: (data) => ({
        url: "overtime/approval",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Overtime", id: uid },
      ],
    }),
  }),
});

export const {
  useAllOvertimeQuery,
  useCreateOvertimeMutation,
  useApproveOvertimeMutation,
} = overtimeApi;
