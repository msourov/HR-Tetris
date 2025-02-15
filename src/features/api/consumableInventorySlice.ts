import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllConsumables,
  ConsumableDetails,
  ConsumableFormParams,
  ConsumablesUpdate,
} from "../types/inventory";
import { Response } from "../types/shared";

export const consumableApi = createApi({
  reducerPath: "consumableApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.CONSUMABLE],
  endpoints: (builder) => ({
    getAllConsumables: builder.query<
      AllConsumables,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "consumables/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Consumable",
                id: uid,
              })),
              { type: "Consumable", id: "LIST" },
            ]
          : [{ type: "Consumable", id: "LIST" }],
    }),
    getConsumableDetails: builder.query<ConsumableDetails, { uid: string }>({
      query: ({ uid }) => ({
        url: `consumables/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Consumable", id: uid },
      ],
    }),
    createConsumable: builder.mutation<Response, ConsumableFormParams>({
      query: (data) => {
        // Destructure file and the rest of the parameters
        const { file, buyer_at, ...params } = data;
        const formattedBuyerAt = buyer_at
          ? new Date(buyer_at).toISOString()
          : "";

        // Convert parameters to query string
        const qs = new URLSearchParams(
          Object.entries({
            ...params,
            buyer_at: formattedBuyerAt,
          }).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString();

        // Build the request object
        const request: { url: string; method: string; body?: FormData } = {
          url: `consumables/create?${qs}`,
          method: "POST",
        };

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          request.body = formData;
        }

        return request;
      },
      invalidatesTags: [{ type: "Consumable", id: "LIST" }],
    }),

    updateConsumable: builder.mutation<Response, ConsumablesUpdate>({
      query: (data) => ({
        url: `consumables/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Consumable", id: uid },
      ],
    }),

    deleteConsumable: builder.mutation<Response, { uid: string }>({
      query: ({ uid }) => ({
        url: `consumables/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Consumable", id: uid },
        { type: "Consumable", id: "LIST" },
      ],
    }),

    showConsumableFile: builder.query<{ fileUrl: string }, string>({
      query: (uid) => ({
        url: `consumables/show-file/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, uid) => [{ type: "Consumable", id: uid }],
    }),
  }),
});

export const {
  useGetAllConsumablesQuery,
  useGetConsumableDetailsQuery,
  useCreateConsumableMutation,
  useUpdateConsumableMutation,
  useDeleteConsumableMutation,
  useShowConsumableFileQuery,
} = consumableApi;
