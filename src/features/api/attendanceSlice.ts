import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import { AttendanceResponse } from "../types/attendance";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.ATTENDANCE],
  endpoints: (builder) => ({
    getAllAttendance: builder.query<
      AttendanceResponse,
      {
        employee_name?: string;
        attended_date?: string;
        start_date?: string;
        end_date?: string;
      }
    >({
      query: (params) => {
        const queryParams: Record<string, string> = {};

        if (params.employee_name)
          queryParams.employee_name = params.employee_name;
        if (params.attended_date)
          queryParams.attended_date = params.attended_date;
        if (params.start_date) queryParams.start_date = params.start_date;
        if (params.end_date) queryParams.end_date = params.end_date;

        return {
          url: "attendance/all",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ uid }) => ({
                    type: "Attendance" as const,
                    id: uid,
                  }))
                : []),
              { type: "Attendance", id: "LIST" },
            ]
          : [{ type: "Attendance", id: "LIST" }],
    }),

    getAttendanceDetail: builder.query<AttendanceResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: `attendance/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Attendance", id: uid },
      ],
    }),
  }),
});

export const { useGetAllAttendanceQuery, useGetAttendanceDetailQuery } =
  attendanceApi;
