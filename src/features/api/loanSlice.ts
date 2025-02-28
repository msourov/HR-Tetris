import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import { Response } from "../types/shared";
import {
  AllLoanResponse,
  CreateLoan,
  LoanDetailResponse,
  UpdateLoan,
} from "../types/inventory";

export const loanApi = createApi({
  reducerPath: "loanApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.LOAN],
  endpoints: (builder) => ({
    getAllLoans: builder.query<
      AllLoanResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "loan/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: tagTypes.LOAN,
                id: uid,
              })),
              { type: tagTypes.LOAN, id: "LIST" },
            ]
          : [{ type: tagTypes.LOAN, id: "LIST" }],
    }),

    getLoanDetails: builder.query<LoanDetailResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: `loan/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: tagTypes.LOAN, id: uid },
      ],
    }),

    createLoan: builder.mutation<Response, CreateLoan>({
      query: (data) => ({
        url: `loan/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: tagTypes.LOAN, id: "LIST" }],
    }),

    updateLoan: builder.mutation<Response, UpdateLoan>({
      query: (data) => ({
        url: `loan/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: tagTypes.LOAN, id: uid },
      ],
    }),

    deleteLoan: builder.mutation<Response, { uid: string }>({
      query: ({ uid }) => ({
        url: `loan/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: tagTypes.LOAN, id: uid },
        { type: tagTypes.LOAN, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllLoansQuery,
  useGetLoanDetailsQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,
} = loanApi;
