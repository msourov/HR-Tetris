import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import {
  AnnouncementResponse,
  Response,
  SingleAnnouncementResponse,
} from "./types";
import { tagTypes } from "./tags";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.ANNOUNCEMENT],
  endpoints: (builder) => ({
    GetAllAnnouncements: builder.query<AnnouncementResponse, void>({
      query: () => ({
        url: "announcements/all",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ uid }) => ({
                    type: "Announcement" as const,
                    id: uid,
                  }))
                : []),
              { type: "Announcement", id: "LIST" },
            ]
          : [{ type: "Announcement", id: "LIST" }],
    }),
    getAnnouncement: builder.query<SingleAnnouncementResponse, { uid: string }>(
      {
        query: ({ uid }) => ({
          url: `announcements/${uid}`,
          method: "GET",
        }),
        providesTags: (result, _error, { uid }) => [
          { type: "Announcement", id: uid },
        ],
      }
    ),
    createAnnouncement: builder.mutation<
      Response,
      { name: string; descriptions: string }
    >({
      query: (data) => ({
        url: "announcements/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),
    updateAnnouncement: builder.mutation<
      Response,
      { uid: string; name: string; descriptions: string }
    >({
      query: (data) => ({
        url: "announcements/update",
        method: "PUT",
        body: { ...data, active: true },
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Announcement", id: uid },
      ],
    }),
    changeAnnouncementStatus: builder.mutation<
      Response,
      { uid: string; active: boolean }
    >({
      query: (data) => ({
        url: "announcements/status",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Announcement", id: uid },
      ],
    }),
    approveAnnouncement: builder.mutation<
      Response,
      { uid: string; is_approve: string; reject_purpose: string }
    >({
      query: (data) => ({
        url: "announcements/approval",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Announcement", id: uid },
      ],
    }),
    deleteAnnouncement: builder.mutation<Response, { uid: string }>({
      query: ({ uid }) => ({
        url: `announcements/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Announcement", id: uid },
      ],
    }),
  }),
});

export const {
  useGetAllAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useChangeAnnouncementStatusMutation,
  useApproveAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
