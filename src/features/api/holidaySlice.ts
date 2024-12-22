import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import { Holiday, HolidayResponse } from "./typesOld";

export const holidayApi = createApi({
  reducerPath: "holidayApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.HOLIDAY],
  endpoints: (builder) => ({
    getHolidays: builder.query<
      HolidayResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `holiday/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? Array.isArray(result.data)
            ? [
                ...result.data.map(({ uid }) => ({
                  type: "Holiday" as const,
                  id: uid,
                })),
                { type: "Holiday", id: "LIST" },
              ]
            : [
                { type: "Holiday" as const, id: result.data.uid },
                { type: "Holiday", id: "LIST" },
              ]
          : [{ type: "Holiday", id: "LIST" }],
    }),
    getHolidayDetail: builder.query<Holiday, { uid: string }>({
      query: ({ uid }) => ({
        url: `holiday/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Holiday", id: uid },
      ],
    }),
    createHoliday: builder.mutation<
      Response,
      { name: string; date: string; description?: string }
    >({
      query: (data) => ({
        url: "holiday/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Holiday", id: "LIST" }],
    }),
    editHoliday: builder.mutation<
      Response,
      { uid: string; name: string; date: string; description?: string }
    >({
      query: (data) => ({
        url: "holiday/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Holiday", id: uid },
      ],
    }),
    deleteHoliday: builder.mutation<Response, { id: string }>({
      query: ({ id: delete_id }) => ({
        url: `holiday/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Holiday", id }],
    }),
  }),
});

export const {
  useGetHolidaysQuery,
  useGetHolidayDetailQuery,
  useCreateHolidayMutation,
  useEditHolidayMutation,
  useDeleteHolidayMutation,
} = holidayApi;
