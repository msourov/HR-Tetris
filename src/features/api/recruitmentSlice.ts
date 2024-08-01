import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypes } from "./tags";
import baseQuery from "./baseApi";
import { CandidatesResponse } from "./types";

export const recruitmentApi = createApi({
  reducerPath: "recruitmentApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.RECRUITMENT],
  endpoints: (builder) => ({
    getCandidates: builder.query<CandidatesResponse, void>({
      query: () => ({
        url: "recruitment/all",
        method: "GET",
      }),
    }),
    getCandidateDetail: builder.query<CandidatesResponse, { uid?: string }>({
      query: ({ uid }) => ({
        url: `recruitment/${uid}`,
        method: "GET",
      }),
    }),
      }),
});

export const {
  useGetCandidatesQuery,
  useGetCandidateDetailQuery,
} = recruitmentApi;
