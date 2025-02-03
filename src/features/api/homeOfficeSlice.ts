import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllHomeOfficeResponse,
  CreateHomeOffice,
  HomeOfficeDetail,
  UpdateHomeOffice,
} from "../types/homeOffice";
import { ApproveRequest, Response } from "../types/shared";

export const homeOfficeApi = createApi({
  reducerPath: "homeOfficeApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.HOME_OFFICE],
  endpoints: (builder) => ({
    getAllHomeOffices: builder.query<
      AllHomeOfficeResponse,
      {
        page?: number;
        limit?: number;
        start_time?: string;
        end_time?: string;
        is_approved?: string;
        employee_id?: string;
        is_active?: boolean;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        start_time,
        end_time,
        is_approved,
        employee_id,
        is_active,
      }) => ({
        url: "home-office/all",
        method: "GET",
        params: {
          page,
          limit,
          ...(start_time && { start_time }),
          ...(end_time && { end_time }),
          ...(is_approved && { is_approved }),
          ...(employee_id && { employee_id }),
          ...(is_active !== undefined && { is_active }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ uid }) => ({
                    type: "HomeOffice" as const,
                    id: uid,
                  }))
                : []),
              { type: "HomeOffice", id: "LIST" },
            ]
          : [{ type: "HomeOffice", id: "LIST" }],
    }),

    createHomeOffice: builder.mutation<Response, CreateHomeOffice>({
      query: (data) => ({
        url: "home-office/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "HomeOffice", id: "LIST" }],
    }),

    getHomeOfficeDetail: builder.query<HomeOfficeDetail, { uid: string }>({
      query: ({ uid }) => ({
        url: `home-office/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "HomeOffice", id: uid },
      ],
    }),

    updateHomeOffice: builder.mutation<Response, UpdateHomeOffice>({
      query: ({ uid, ...data }) => ({
        url: `home-office/update`,
        method: "PUT",
        body: { uid, ...data },
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "HomeOffice", id: uid },
        { type: "HomeOffice", id: "LIST" },
      ],
    }),

    deleteHomeOffice: builder.mutation<Response, { id: string }>({
      query: ({ id }) => ({
        url: `home-office/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "HomeOffice", id: "LIST" }],
    }),

    approveHomeOffice: builder.mutation<Response, ApproveRequest>({
      query: (data) => ({
        url: "home-office/approval",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "HomeOffice", id: uid },
      ],
    }),
  }),
});

export const {
  useGetAllHomeOfficesQuery,
  useCreateHomeOfficeMutation,
  useGetHomeOfficeDetailQuery,
  useUpdateHomeOfficeMutation,
  useDeleteHomeOfficeMutation,
  useApproveHomeOfficeMutation,
} = homeOfficeApi;
