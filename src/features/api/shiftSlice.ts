import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllShiftResponse,
  ShiftCreateRequest,
  ShiftDetailResponse,
  ShiftHelper,
  ShiftUpdateRequest,
} from "../types/shift";
import { Request, Response } from "../types/shared";

export const shiftApi = createApi({
  reducerPath: "shiftScheduleApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.SHIFT_SCHEDULE],
  endpoints: (builder) => ({
    getShifts: builder.query<AllShiftResponse, { page: number; limit: number }>(
      {
        query: ({ page, limit }) => ({
          url: "shifts/all",
          method: "GET",
          params: {
            page,
            limit,
          },
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ uid }) => ({
                  type: "Shift" as const,
                  id: uid,
                })),
                { type: "Shift", id: "LIST" },
              ]
            : [{ type: "Shift", id: "LIST" }],
      }
    ),
    getShiftDetail: builder.query<
      ShiftDetailResponse,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `shifts/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [{ type: "Shift", id: uid }],
    }),
    createShift: builder.mutation<Response, ShiftCreateRequest>({
      query: (data) => ({
        url: "shifts/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Shift", id: "LIST" }],
    }),
    editShift: builder.mutation<Response, ShiftUpdateRequest>({
      query: (data) => ({
        url: "shifts/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Shift", id: uid },
      ],
    }),
    deleteShift: builder.mutation<Response, Request>({
      query: ({ id: delete_id }) => ({
        url: `shifts/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Shift", id }],
    }),
    updateShiftStatus: builder.mutation<
      Response,
      { uid: string; active: boolean }
    >({
      query: (data) => ({
        url: "shift/update/status",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Shift", id: uid },
      ],
    }),
    regularShift: builder.mutation<Response, { uid: string; regular: boolean }>(
      {
        query: (data) => ({
          url: "shifts/regular",
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (_result, _error, { uid }) => [
          { type: "Shift", id: uid },
        ],
      }
    ),
    shiftHelper: builder.query<ShiftHelper, void>({
      query: () => ({
        url: "shifts/helper",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftDetailQuery,
  useCreateShiftMutation,
  useEditShiftMutation,
  useDeleteShiftMutation,
  useUpdateShiftStatusMutation,
  useRegularShiftMutation,
  useShiftHelperQuery,
} = shiftApi;
