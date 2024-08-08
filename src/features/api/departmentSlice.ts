import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import {
  DepartmentDetail,
  DepartmentHelper,
  DepartmentResponse,
  Response,
} from "./types";
import { tagTypes } from "./tags";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.DEPARTMENT],
  endpoints: (builder) => ({
    getDepartments: builder.query<
      DepartmentResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `department/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Department" as const,
                id: uid,
              })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),
    getDepartmentDetail: builder.query<
      DepartmentDetail,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `department/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Department", id: uid },
      ],
    }),
    addDepartment: builder.mutation<
      Response,
      { name: string; active: boolean }
    >({
      query: (data) => ({
        url: "department/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),
    editDepartment: builder.mutation<
      Response,
      { uid: string; name: string; active: boolean }
    >({
      query: (data) => ({
        url: "department/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Department", id: uid },
      ],
    }),
    deleteDepartment: builder.mutation<Response, { id: string }>({
      query: ({ id: delete_id }) => ({
        url: `department/delete/${delete_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Department", id },
      ],
    }),
    departmentHelper: builder.query<DepartmentHelper, void>({
      query: () => ({
        url: "department/helper",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentDetailQuery,
  useAddDepartmentMutation,
  useEditDepartmentMutation,
  useDeleteDepartmentMutation,
  useDepartmentHelperQuery,
} = departmentApi;
