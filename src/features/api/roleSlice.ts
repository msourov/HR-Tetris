import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import {
  CreateRoleRequest,
  EditRoleRequest,
  Request,
  Response,
  RoleDetailResponse,
  RoleResponse,
} from "./types";
import { tagTypes } from "./tags";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.ROLE],
  endpoints: (builder) => ({
    getRoles: builder.query<RoleResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "role/all",
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Role" as const,
                id: uid,
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),
    getRoleDetail: builder.query<
      RoleDetailResponse,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `role/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [{ type: "Role", id: uid }],
    }),
    createRole: builder.mutation<Response, CreateRoleRequest>({
      query: (data) => ({
        url: "role/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    editRole: builder.mutation<Response, EditRoleRequest>({
      query: (data) => ({
        url: "role/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Role", id: uid },
      ],
    }),
    deleteRole: builder.mutation<Response, Request>({
      query: ({ id: delete_id }) => ({
        url: `role/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Role", id }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleDetailQuery,
  useCreateRoleMutation,
  useEditRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
