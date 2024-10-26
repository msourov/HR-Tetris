// import { createApi } from "@reduxjs/toolkit/query/react";
// import baseQuery from "./baseApi";
// import {
//   ConsumableResponse,
//   Response,
//   SingleConsumableResponse,
// } from "./types";
// import { tagTypes } from "./tags";

// export const consumableApi = createApi({
//   reducerPath: "consumableApi",
//   baseQuery: baseQuery,
//   tagTypes: [tagTypes.CONSUMABLE],
//   endpoints: (builder) => ({
//     getAllConsumables: builder.query<ConsumableResponse, any>({
//       query: (params) => ({
//         url: "consumables/all",
//         method: "GET",
//         params, // query params: page, limit, buyer_name, min_quantity, max_quantity, min_price, max_price, buyer_at, min_create_at, max_create_at
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...(Array.isArray(result.data)
//                 ? result.data.map(({ uid }) => ({
//                     type: "Consumable" as const,
//                     id: uid,
//                   }))
//                 : []),
//               { type: "Consumable", id: "LIST" },
//             ]
//           : [{ type: "Consumable", id: "LIST" }],
//     }),
//     getConsumable: builder.query<SingleConsumableResponse, { uid: string }>({
//       query: ({ uid }) => ({
//         url: `consumables/show/file/${uid}`,
//         method: "GET",
//       }),
//       providesTags: (result, _error, { uid }) => [
//         { type: "Consumable", id: uid },
//       ],
//     }),
//     createConsumable: builder.mutation<
//       Response,
//       {
//         name: string;
//         descriptions: string;
//         quantity: number;
//         buyer_name: string;
//         buyer_at: string;
//         file: File;
//       }
//     >({
//       query: (data) => ({
//         url: "consumables/create",
//         method: "POST",
//         body: data, // multipart/form-data
//       }),
//       invalidatesTags: [{ type: "Consumable", id: "LIST" }],
//     }),
//     updateConsumable: builder.mutation<
//       Response,
//       {
//         uid: string;
//         name: string;
//         descriptions: string;
//         active: boolean;
//         quantity: number;
//         price: number;
//         buyer_name: string;
//         buyer_at: string;
//       }
//     >({
//       query: (data) => ({
//         url: "consumables/update",
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { uid }) => [
//         { type: "Consumable", id: uid },
//       ],
//     }),
//     deleteConsumable: builder.mutation<Response, { uid: string }>({
//       query: ({ uid }) => ({
//         url: `consumables/delete/${uid}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (_result, _error, { uid }) => [
//         { type: "Consumable", id: uid },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetAllConsumablesQuery,
//   useGetConsumableQuery,
//   useCreateConsumableMutation,
//   useUpdateConsumableMutation,
//   useDeleteConsumableMutation,
// } = consumableApi;
