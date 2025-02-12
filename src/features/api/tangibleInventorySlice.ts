import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  Tangible,
  TangibleFormParams,
  TangibleUpdate,
} from "../types/inventory";
import { Response } from "../types/shared";

export const tangibleApi = createApi({
  reducerPath: "tangibleApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.TANGIBLE],
  endpoints: (builder) => ({
    allTangibles: builder.query<Tangible[], { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "tangibles/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uid }) => ({ type: "Tangible", id: uid })),
              { type: "Tangible", id: "LIST" },
            ]
          : [{ type: "Tangible", id: "LIST" }],
    }),

    createTangible: builder.mutation<Response, TangibleFormParams>({
      query: (data) => ({
        url: "tangibles/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Tangible", id: "LIST" }],
    }),

    updateTangible: builder.mutation<Response, TangibleUpdate>({
      query: ({ uid, ...data }) => ({
        url: `tangibles/update/${uid}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Tangible", id: uid },
      ],
    }),

    deleteTangible: builder.mutation<Response, { uid: string }>({
      query: (uid) => ({
        url: `tangibles/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Tangible", id: uid },
        { type: "Tangible", id: "LIST" },
      ],
    }),

    showTangibleFile: builder.query<{ fileUrl: string }, string>({
      query: (uid) => ({
        url: `tangibles/show-file/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, uid) => [{ type: "Tangible", id: uid }],
    }),
  }),
});

export const {
  useAllTangiblesQuery,
  useCreateTangibleMutation,
  useUpdateTangibleMutation,
  useDeleteTangibleMutation,
  useShowTangibleFileQuery,
} = tangibleApi;
