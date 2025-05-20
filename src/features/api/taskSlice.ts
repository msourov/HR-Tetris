import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { tagTypes } from "./tags";
import {
  AllTasksResponse,
  TaskCreatePayload,
  TaskDetailResponse,
  TaskUpdatePayload,
} from "../types/task";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.TASK],
  endpoints: (builder) => ({
    getTasks: builder.query<AllTasksResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `task/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ uid }) => ({
                type: "Task" as const,
                id: uid,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getTaskDetail: builder.query<TaskDetailResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: `task/${uid}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uid }) => [{ type: "Task", id: uid }],
    }),

    createTask: builder.mutation<Response, TaskCreatePayload>({
      query: (data) => ({
        url: "task/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<Response, TaskUpdatePayload & { uid: string }>(
      {
        query: ({ uid, ...rest }) => ({
          url: `task/update/${uid}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: (_result, _error, { uid }) => [
          { type: "Task", id: uid },
        ],
      }
    ),

    deleteTask: builder.mutation<Response, { uid: string }>({
      query: ({ uid }) => ({
        url: `task/delete/${uid}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "Task", id: uid },
        { type: "Task", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskDetailQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
