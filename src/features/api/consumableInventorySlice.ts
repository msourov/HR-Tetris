import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  Consumable,
  ConsumableFormParams,
  ConsumablesUpdate,
} from "../types/inventory";
import { Response } from "../types/shared";

export const consumableApi = createApi({
  reducerPath: "consumableApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.CONSUMABLE],
  endpoints: (builder) => ({
    allConsumables: builder.query<
      Consumable[],
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
              ...result.map(({ uid }) => ({ type: "Consumable", id: uid })),
              { type: "Consumable", id: "LIST" },
            ]
          : [{ type: "Consumable", id: "LIST" }],
    }),

    createConsumable: builder.mutation<Response, ConsumableFormParams>({
      query: (data) => ({
        url: "consumables/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Consumable", id: "LIST" }],
    }),

    updateConsumable: builder.mutation<Response, ConsumablesUpdate>({
      query: ({ uid, ...data }) => ({
        url: `consumables/update/${uid}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Consumable", id: uid },
      ],
    }),

    deleteConsumable: builder.mutation<Response, { uid: string }>({
      query: (uid) => ({
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
  useAllConsumablesQuery,
  useCreateConsumableMutation,
  useUpdateConsumableMutation,
  useDeleteConsumableMutation,
  useShowConsumableFileQuery,
} = consumableApi;
