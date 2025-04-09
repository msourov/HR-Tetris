import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import Cookies from "js-cookie";
import { tagTypes } from "./tags";
import { LoginRequest, LoginResponse } from "./typesOld";
import {
  CreateUserResponse,
  EditUserRequest,
  SingleUserResponse,
  User,
  UserResponse,
} from "../types/user";
import { Request, Response } from "../types/shared";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.USER, tagTypes.PROFILE],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "role-user/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("token", data.access_token, { expires: 1 });
        } catch (error) {
          console.error("Error during login:", error);
        }
      },
    }),
    getUsers: builder.query<
      UserResponse,
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "role-user/all",
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "User" as const,
                id: uid,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserDetail: builder.query<
      SingleUserResponse,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `role-user/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [{ type: "User", id: uid }],
    }),
    createUser: builder.mutation<CreateUserResponse, Partial<User>>({
      query: (data) => ({
        url: "role-user/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    editUser: builder.mutation<Response, EditUserRequest>({
      query: (data) => ({
        url: "role-user/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "User", id: uid },
      ],
    }),
    deleteUser: builder.mutation<Response, Request>({
      query: (id) => ({
        url: `role-user/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),
    changeOwnPassword: builder.mutation<
      Response,
      { uid: string; old_password: string; new_password: string }
    >({
      query: (data) => ({
        url: "role-user/self/chnage-password",
        method: "PUT",
        body: data,
      }),
    }),
    showProfileImage: builder.query<string, { mobile: string }>({
      query: ({ mobile }) => ({
        url: `role-user/show/file/${mobile}`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
      providesTags: (_result, _error, { mobile }) => [
        { type: tagTypes.PROFILE, id: mobile },
      ],
    }),

    uploadProfile: builder.mutation<Response, FormData>({
      query: (formData) => {
        return {
          url: "role-user/upload",
          method: "POST",
          body: formData,
          headers: {
            
          }
        };
      },
      invalidatesTags: (_result, _error, formData) => {
        const mobile = formData.get("mobile") as string;
        return [{ type: tagTypes.PROFILE, id: mobile }];
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
  useGetUserDetailQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useChangeOwnPasswordMutation,
  useShowProfileImageQuery,
  useUploadProfileMutation,
} = userApi;
