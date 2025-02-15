import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";

import { Response } from "../types/shared";
import { Category, CategoryForm, CategoryUpdate } from "../types/category";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.CATEGORY],
  endpoints: (builder) => ({
    getAllCategories: builder.query<
      Category[],
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "categories/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uid }) => ({ type: "Category", id: uid })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryDetails: builder.query<Category, { uid: string }>({
      query: ({ uid }) => ({
        url: `categories/details/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [
        { type: "Category", id: uid },
      ],
    }),

    createCategory: builder.mutation<Response, CategoryForm>({
      query: (data) => ({
        url: "categories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation<Response, CategoryUpdate>({
      query: (data) => ({
        url: `categories/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Category", id: uid },
      ],
    }),

    deleteCategory: builder.mutation<Response, { uid: string }>({
      query: (uid) => ({
        url: `categories/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Category", id: uid },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryDetailsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
