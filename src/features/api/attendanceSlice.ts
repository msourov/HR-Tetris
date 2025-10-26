import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import { AttendanceResponse, searchParamsType } from "../types/attendance";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.ATTENDANCE],
  endpoints: (builder) => ({
    getAllAttendance: builder.query<
      AttendanceResponse,
      { page: number; limit: number; searchParams: searchParamsType }
>({
  query: ({ page, limit, searchParams }) => {
    const queryParams: Record<string, string | number> = {
      page,
      limit,
    };

        if (searchParams?.employee_name)
      queryParams.employee_name = searchParams.employee_name;
    if (searchParams?.attended_date)
      queryParams.attended_date = searchParams.attended_date;
    if (searchParams?.start_date)
      queryParams.start_date = searchParams.start_date;
    if (searchParams?.end_date)
      queryParams.end_date = searchParams.end_date;

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
