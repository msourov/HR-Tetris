import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  ApproveOvertimeRequest,
  OvertimeDetail,
  OvertimeResponse,
  UpdateOvertime,
  CreateOvertime,
} from "../types/overtime";
import { Response } from "../types/shared";

export const overtimeApi = createApi({
  reducerPath: "overtimeApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.OVERTIME],
  endpoints: (builder) => ({
    getAllOvertime: builder.query<
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
                    type: tagTypes.OVERTIME,
                    id: uid,
                  }))
                : []),
              { type: tagTypes.OVERTIME, id: "LIST" },
            ]
          : [{ type: tagTypes.OVERTIME, id: "LIST" }],
    }),

    getOvertimeDetail: builder.query<OvertimeDetail, { uid: string }>({
      query: ({ uid }) => ({
        url: `overtime/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: tagTypes.OVERTIME, id: uid },
      ],
    }),

    createOvertime: builder.mutation<Response, CreateOvertime>({
      query: (data) => ({
        url: "overtime/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: tagTypes.OVERTIME, id: "LIST" }],
    }),

    updateOvertime: builder.mutation<Response, UpdateOvertime>({
      query: (data) => ({
        url: "overtime/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: tagTypes.OVERTIME, id: uid },
        { type: tagTypes.OVERTIME, id: "LIST" },
      ],
    }),

    deleteOvertime: builder.mutation<Response, { overtime_id: string }>({
      query: ({ overtime_id }) => ({
        url: `overtime/delete/${overtime_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { overtime_id }) => [
        { type: tagTypes.OVERTIME, id: overtime_id },
        { type: tagTypes.OVERTIME, id: "LIST" },
      ],
    }),

    approveOvertime: builder.mutation<Response, ApproveOvertimeRequest>({
      query: (data) => ({
        url: "overtime/approval",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: tagTypes.OVERTIME, id: uid },
        { type: tagTypes.OVERTIME, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllOvertimeQuery,
  useGetOvertimeDetailQuery,
  useCreateOvertimeMutation,
  useUpdateOvertimeMutation,
  useDeleteOvertimeMutation,
  useApproveOvertimeMutation,
} = overtimeApi;
