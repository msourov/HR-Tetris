import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllCertificationsResponse,
  CertificationCreatePayload,
  CertificationResponse,
} from "../types/certification";
import { Response } from "../types/shared";

export const certificationApi = createApi({
  reducerPath: "certificationApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.CERTIFICATION],
  endpoints: (builder) => ({
    // Get all certifications with pagination
    getCertifications: builder.query<
      AllCertificationsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "certifications/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Certification" as const,
                id: uid,
              })),
              { type: "Certification", id: "LIST" },
            ]
          : [{ type: "Certification", id: "LIST" }],
    }),

    // Get a single certification by UID
    getCertificationDetail: builder.query<
      CertificationResponse,
      { uid: string | undefined }
    >({
      query: ({ uid }) => ({
        url: `certifications/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Certification", id: uid },
      ],
    }),

    // Create a new certification
    createCertification: builder.mutation<Response, CertificationCreatePayload>(
      {
        query: (data) => ({
          url: "certifications/create",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [{ type: "Certification", id: "LIST" }],
      }
    ),
  }),
});

export const {
  useGetCertificationsQuery,
  useGetCertificationDetailQuery,
  useCreateCertificationMutation,
} = certificationApi;
