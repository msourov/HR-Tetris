import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { DepartmentDetail, DepartmentResponse, Response } from "./types";
import { tagTypes } from "./tags";

export const designationApi = createApi({
  reducerPath: "designationApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.DEPARTMENT],
  endpoints: (builder) => ({
    getDesignations: builder.query<
      DepartmentResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `designation/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Designation" as const,
                id: uid,
              })),
              { type: "Designation", id: "LIST" },
            ]
          : [{ type: "Designation", id: "LIST" }],
    }),
    getDesignationDetail: builder.query<
      DepartmentDetail,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `designation/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Designation", id: uid },
      ],
    }),
    addDesignation: builder.mutation<
      Response,
      { name: string; active: boolean }
    >({
      query: (data) => ({
        url: "designation/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),
    editDesignation: builder.mutation<
      Response,
      { uid: string; name: string; active: boolean }
    >({
      query: (data) => ({
        url: "designation/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Designation", id: uid },
      ],
    }),
    deleteDesignation: builder.mutation<Response, { id: string }>({
      query: ({ id: delete_id }) => ({
        url: `designation/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Designation", id },
      ],
    }),
  }),
});

export const {
  useGetDesignationsQuery,
  useAddDesignationMutation,
  useEditDesignationMutation,
  useDeleteDesignationMutation,
} = designationApi;
