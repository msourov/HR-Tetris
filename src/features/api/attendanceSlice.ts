import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import { AttendanceResponse } from "../types/attendance";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.ATTENDANCE],
  endpoints: (builder) => ({
    getAllAttendance: builder.query<AttendanceResponse, void>({
      query: () => ({
        url: "attendance/all",
        method: "GET",
      }),
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

    getAttendance: builder.query<AttendanceResponse, { uid: string }>({
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

export const { useGetAllAttendanceQuery, useGetAttendanceQuery } =
  attendanceApi;
