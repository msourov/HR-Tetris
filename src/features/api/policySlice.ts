import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import { Policy, SinglePolicy } from "./types";

export const policyApi = createApi({
  reducerPath: "policyApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.POLICY],
  endpoints: (builder) => ({
    getPolicies: builder.query<Policy, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `policy/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Policy" as const,
                id: uid,
              })),
              { type: "Policy", id: "LIST" },
            ]
          : [{ type: "Policy", id: "LIST" }],
    }),
    getPolicyDetail: builder.query<SinglePolicy, { uid: string | undefined }>({
      query: ({ uid }) => ({
        url: `policy/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [{ type: "Policy", id: uid }],
    }),
    createPolicy: builder.mutation<
      Response,
      { name: string; written_policy: string }
    >({
      query: (data) => ({
        url: "policy/create-text",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Policy", id: "LIST" }],
    }),
    uploadPolicy: builder.mutation<
      Response,
      { upload_file: FormData; name: string }
    >({
      query: ({ name, upload_file }) => ({
        url: `policy/create-file?${name}`,
        method: "POST",
        body: upload_file,
      }),
    }),
    editPolicy: builder.mutation<
      Response,
      { uid: string; name: string; written_policy: string; active: boolean }
    >({
      query: (data) => ({
        url: "policy/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Policy", id: uid },
      ],
    }),
    deletePolicy: builder.mutation<Response, { id: string }>({
      query: ({ id: delete_id }) => ({
        url: `policy/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Policy", id }],
    }),
    showPolicyFile: builder.query<{ uid: string }, void>({
      query: (uid) => ({
        url: `policy/show/file/${uid}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  useGetPolicyDetailQuery,
  useCreatePolicyMutation,
  useUploadPolicyMutation,
  useEditPolicyMutation,
  useDeletePolicyMutation,
  useShowPolicyFileQuery,
} = policyApi;