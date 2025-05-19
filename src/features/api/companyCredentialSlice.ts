import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import {
  CreateCredential,
  CredentialsResponse,
  UpdateCredential,
} from "../types/companyCredentials";
import { tagTypes } from "./tags";

export const credentialApi = createApi({
  reducerPath: "credentialApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.CREDENTIALS],
  endpoints: (builder) => ({
    getCredentials: builder.query<
      CredentialsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/credential/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Credential" as const,
                id: uid,
              })),
              { type: "Credential", id: "LIST" },
            ]
          : [{ type: "Credential", id: "LIST" }],
    }),

    getCredentialDetail: builder.query<Credential, { uid: string }>({
      query: ({ uid }) => ({
        url: `/credential/${uid}`,
        method: "GET",
      }),
      providesTags: (_res, _err, { uid }) => [{ type: "Credential", id: uid }],
    }),

    createCredential: builder.mutation<void, CreateCredential>({
      query: (body) => ({
        url: "/credential/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Credential", id: "LIST" }],
    }),

    updateCredential: builder.mutation<void, UpdateCredential>({
      query: (body) => ({
        url: "/credential/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { uid }) => [
        { type: "Credential", id: uid },
        { type: "Credential", id: "LIST" },
      ],
    }),
    deleteCredential: builder.mutation<void, { delete_id: string }>({
      query: ({ delete_id }) => ({
        url: `/credential/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { delete_id }) => [
        { type: "Credential", id: delete_id },
        { type: "Credential", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCredentialsQuery,
  useGetCredentialDetailQuery,
  useCreateCredentialMutation,
  useUpdateCredentialMutation,
  useDeleteCredentialMutation,
} = credentialApi;
