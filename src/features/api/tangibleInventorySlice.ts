import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllTangibles,
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
    getAllTangibles: builder.query<
      AllTangibles,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "tangibles/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ uid }) => ({ type: "Tangible", id: uid }))
                : [{ type: "Tangible", id: (result.data as Tangible).uid }]),
              { type: "Tangible", id: "LIST" },
            ]
          : [{ type: "Tangible", id: "LIST" }],
    }),
    getTangibleDetails: builder.query<Tangible, { uid: string }>({
      query: ({ uid }) => ({ url: `tangibles/${uid}`, method: "GET" }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Tangible", id: uid },
      ],
    }),
    createTangible: builder.mutation<Response, TangibleFormParams>({
      query: (data) => {
        // Destructure file and the rest of the parameters
        const { file, ...params } = data;

        // Convert parameters to query string
        const qs = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString();

        // Build the request object
        const request: { url: string; method: string; body?: FormData } = {
          url: `tangibles/create?${qs}`,
          method: "POST",
        };

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          request.body = formData;
        }

        return request;
      },
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
      query: ({ uid }) => ({
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
  useGetAllTangiblesQuery,
  useGetTangibleDetailsQuery,
  useCreateTangibleMutation,
  useUpdateTangibleMutation,
  useDeleteTangibleMutation,
  useShowTangibleFileQuery,
} = tangibleApi;
