// import { createApi } from "@reduxjs/toolkit/query/react";
// import baseQuery from "./baseApi";
// import {
//   UserResponse,
//   CreateUserResponse,
//   User,
//   LoginResponse,
//   LoginRequest,
//   RoleResponse,
//   EditRoleResponse,
//   EditRoleRequest,
//   SingleUserResponse,
//   EditUserRequest,
//   EditUserResponse,
//   DeleteResponse,
//   CreateRoleRequest,
//   CreateRoleResponse,
//   RoleDetailResponse,
//   Request,
//   CompanyResponse,
// } from "./types";
// import Cookies from "js-cookie";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: baseQuery,
//   tagTypes: ["Role", "User"],
//   endpoints: (builder) => ({
//     // check if user exist to send otp
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (data) => ({
//         url: "role-user/login",
//         method: "POST",
//         body: data,
//       }),
//       async onQueryStarted(_arg, { queryFulfilled }) {
//         try {
//           const { data } = await queryFulfilled;
//           Cookies.set("token", data.access_token, { expires: 1 });
//         } catch (error) {
//           console.error("Error during login:", error);
//         }
//       },
//     }),
//     getUsers: builder.query<
//       UserResponse,
//       { page: number; limit: number; search?: string }
//     >({
//       query: ({ page, limit, search }) => ({
//         url: "role-user/all",
//         method: "GET",
//         params: {
//           page,
//           limit,
//           search,
//         },
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ uid }) => ({
//                 type: "User" as const,
//                 id: uid,
//               })),
//               { type: "User", id: "LIST" },
//             ]
//           : [{ type: "User", id: "LIST" }],
//     }),
//     getUserDetail: builder.query<
//       SingleUserResponse,
//       { uid: string | undefined }
//     >({
//       query: ({ uid }) => ({
//         url: `role-user/${uid}`,
//         method: "GET",
//       }),
//       providesTags: (_result, _error, { uid }) => [{ type: "User", id: uid }],
//     }),
//     createUser: builder.mutation<CreateUserResponse, Partial<User>>({
//       query: (data) => ({
//         url: "role-user/create",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: [{ type: "User", id: "LIST" }],
//     }),
//     editUser: builder.mutation<EditUserResponse, EditUserRequest>({
//       query: (data) => ({
//         url: "role-user/update",
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { uid }) => [
//         { type: "User", id: uid },
//       ],
//     }),
//     deleteUser: builder.mutation<DeleteResponse, Request>({
//       query: (id) => ({
//         url: `role-user/delete/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
//     }),
//     getRoles: builder.query<RoleResponse, { page: number; limit: number }>({
//       query: ({ page, limit }) => ({
//         url: "role/all",
//         method: "GET",
//         params: {
//           page,
//           limit,
//         },
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ uid }) => ({
//                 type: "Role" as const,
//                 id: uid,
//               })),
//               { type: "Role", id: "LIST" },
//             ]
//           : [{ type: "Role", id: "LIST" }],
//     }),
//     getRoleDetail: builder.query<
//       RoleDetailResponse,
//       { uid: string | undefined }
//     >({
//       query: ({ uid }) => ({
//         url: `role/${uid}`,
//         method: "GET",
//       }),
//       providesTags: (_result, _error, { uid }) => [{ type: "Role", id: uid }],
//     }),
//     createRole: builder.mutation<CreateRoleResponse, CreateRoleRequest>({
//       query: (data) => ({
//         url: "role/create",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: [{ type: "Role", id: "LIST" }],
//     }),
//     editRole: builder.mutation<EditRoleResponse, EditRoleRequest>({
//       query: (data) => ({
//         url: "role/update",
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { uid }) => [
//         { type: "Role", id: uid },
//       ],
//     }),
//     deleteRole: builder.mutation<DeleteResponse, Request>({
//       query: ({ id: delete_id }) => ({
//         url: `role/delete/${delete_id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (_result, _error, { id }) => [{ type: "Role", id }],
//     }),
//     getCompany: builder.query<CompanyResponse, { page: number; limit: number }>(
//       {
//         query: ({ page, limit }) => ({
//           url: `sub-company/all?page=${page}&limit=${limit}`,
//           method: "GET",
//         }),
//       }
//     ),
//   }),
// });

// export const {
//   useLoginMutation,
//   useGetUsersQuery,
//   useGetUserDetailQuery,
//   useCreateUserMutation,
//   useEditUserMutation,
//   useDeleteUserMutation,
//   useGetRolesQuery,
//   useGetRoleDetailQuery,
//   useCreateRoleMutation,
//   useEditRoleMutation,
//   useDeleteRoleMutation,
//   useGetCompanyQuery,
// } = apiSlice;
