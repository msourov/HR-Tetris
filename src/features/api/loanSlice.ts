// import { createApi } from "@reduxjs/toolkit/query/react";
// import baseQuery from "./baseApi";
// import { tagTypes } from "./tags";

// import { Response } from "../types/shared";

// export const loanApi = createApi({
//   reducerPath: "loanApi",
//   baseQuery: baseQuery,
//   tagTypes: [tagTypes.LOAN],
//   endpoints: (builder) => ({
//     getAllLoans: builder.query<AllLoans, { page: number; limit: number }>({
//       query: ({ page, limit }) => ({
//         url: "loans/all",
//         method: "GET",
//         params: { page, limit },
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ uid }) => ({
//                 type: tagTypes.LOAN,
//                 id: uid,
//               })),
//               { type: tagTypes.LOAN, id: "LIST" },
//             ]
//           : [{ type: tagTypes.LOAN, id: "LIST" }],
//     }),

//     getLoanDetails: builder.query<LoanDetails, { uid: string }>({
//       query: ({ uid }) => ({
//         url: `loans/${uid}`,
//         method: "GET",
//       }),
//       providesTags: (_result, _error, { uid }) => [
//         { type: tagTypes.LOAN, id: uid },
//       ],
//     }),

//     createLoan: builder.mutation<Response, LoanFormParams>({
//       query: (data) => ({
//         url: `loans/create`,
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: [{ type: tagTypes.LOAN, id: "LIST" }],
//     }),

//     updateLoan: builder.mutation<Response, LoanUpdate>({
//       query: (data) => ({
//         url: `loans/update`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { uid }) => [
//         { type: tagTypes.LOAN, id: uid },
//       ],
//     }),

//     deleteLoan: builder.mutation<Response, { uid: string }>({
//       query: ({ uid }) => ({
//         url: `loans/delete/${uid}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (_result, _error, { uid }) => [
//         { type: tagTypes.LOAN, id: uid },
//         { type: tagTypes.LOAN, id: "LIST" },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetAllLoansQuery,
//   useGetLoanDetailsQuery,
//   useCreateLoanMutation,
//   useUpdateLoanMutation,
//   useDeleteLoanMutation,
// } = loanApi;
