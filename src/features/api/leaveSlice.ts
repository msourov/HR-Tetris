import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import {
  LeaveResponse,
  CreateLeaveRequest,
  UpdateLeaveRequest,
  ApproveLeaveRequest,
} from "./typesOld";
import { tagTypes } from "./tags";

export const leaveApi = createApi({
  reducerPath: "leaveApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.LEAVE],
  endpoints: (builder) => ({
    allLeave: builder.query<
      LeaveResponse,
      {
        page: number;
        limit: number;
        is_approved?: "pending" | "approved" | "rejected" | null;
        leave_type?: string;
        employee_id?: string;
        is_active?: boolean;
        start_time?: string;
        end_time?: string;
      }
    >({
      query: ({
        page,
        limit,
        is_approved,
        leave_type,
        employee_id,
        is_active,
        start_time,
        end_time,
      }) => ({
        url: "leave/all",
        method: "GET",
        params: {
          page,
          limit,
          ...(is_approved && { is_approved }),
          ...(leave_type && { leave_type }),
          ...(employee_id && { employee_id }),
          ...(typeof is_active === "boolean" && { is_active }),
          ...(start_time && { start_time }),
          ...(end_time && { end_time }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ uid }) => ({
                    type: "Leave" as const,
                    id: uid,
                  }))
                : []),
              { type: "Leave", id: "LIST" },
            ]
          : [{ type: "Leave", id: "LIST" }],
    }),

    createLeave: builder.mutation<void, CreateLeaveRequest>({
      query: (data) => ({
        url: "leave/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Leave", id: "LIST" }],
    }),

    getLeaveById: builder.query<LeaveResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: `leave/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [{ type: "Leave", id: uid }],
    }),
    updateLeave: builder.mutation<void, UpdateLeaveRequest>({
      query: ({ uid, ...data }) => ({
        url: `leave/update`,
        method: "PUT",
        body: { uid, ...data },
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Leave", id: uid },
      ],
    }),

    approveLeave: builder.mutation<void, ApproveLeaveRequest>({
      query: (data) => ({
        url: "leave/approval",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Leave", id: uid },
      ],
    }),
  }),
});

export const {
  useAllLeaveQuery,
  useCreateLeaveMutation,
  useGetLeaveByIdQuery,
  useUpdateLeaveMutation,
  useApproveLeaveMutation,
} = leaveApi;
