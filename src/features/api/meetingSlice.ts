import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllMeetingsResponse,
  MeetingDetailResponse,
  MeetingCreatePayload,
  MeetingUpdatePayload,
} from "../types/meeting";
import { Response } from "../types/shared";

export const meetingApi = createApi({
  reducerPath: "meetingApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.MEETING],
  endpoints: (builder) => ({
    getMeetings: builder.query<
      AllMeetingsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `meeting/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Meeting" as const,
                id: uid,
              })),
              { type: "Meeting", id: "LIST" },
            ]
          : [{ type: "Meeting", id: "LIST" }],
    }),

    getMeetingDetail: builder.query<MeetingDetailResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: `meeting/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Meeting", id: uid },
      ],
    }),

    createMeeting: builder.mutation<Response, MeetingCreatePayload>({
      query: (data) => ({
        url: "meeting/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Meeting", id: "LIST" }],
    }),

    updateMeeting: builder.mutation<
      Response,
      MeetingUpdatePayload & { uid: string }
    >({
      query: ({ uid, ...data }) => ({
        url: "meeting/update",
        method: "PUT",
        body: { uid, ...data },
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Meeting", id: uid },
        { type: "Meeting", id: "LIST" },
      ],
    }),

    deleteMeeting: builder.mutation<Response, { uid: string }>({
      query: ({ uid }) => ({
        url: `meeting/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Meeting", id: uid },
        { type: "Meeting", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useGetMeetingDetailQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = meetingApi;
