import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";

import { tagTypes } from "./tags";
import {
  CreateTicketRequest,
  TicketResolveResponse,
  TicketResponse,
} from "../types/ticket";
import { getToken } from "../../services/utils/getToken";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: baseQuery,
  tagTypes: [tagTypes.TICKET],
  endpoints: (builder) => ({
    getAllTickets: builder.query<
      TicketResponse,
      {
        employee_id?: string;
        page: number;
        limit: number;
        start_date?: string;
        end_date?: string;
        t_status?: string;
        category?: string;
      }
    >({
      query: ({
        employee_id,
        page,
        limit,
        start_date,
        end_date,
        t_status,
        category,
      }) => ({
        url: "tickets/all",
        method: "GET",
        params: {
          ...(employee_id && { employee_id }),
          page,
          limit,
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
          ...(t_status && { t_status }),
          ...(category && { category }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result.data)
                ? result.data.map(({ id }) => ({
                    type: "Ticket" as const,
                    id,
                  }))
                : []),
              { type: "Ticket", id: "LIST" },
            ]
          : [{ type: "Ticket", id: "LIST" }],
    }),

    getTicketById: builder.query<TicketResponse, { ticket_id: string }>({
      query: ({ ticket_id }) => ({
        url: `tickets/${ticket_id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { ticket_id }) => [
        { type: "Ticket", id: ticket_id },
      ],
    }),

    createTicket: builder.mutation<void, CreateTicketRequest>({
      query: (data) => {
        const formData = new FormData();

        // Required fields
        formData.append("employee_id", data.employee_id);
        formData.append("type", data.type);
        formData.append("message", data.message);

        // Optional fields
        data.name && formData.append("name", data.name);

        // Fix 3: Use correct array format for assignees
        data.assignee?.forEach((assignee) => {
          formData.append("assignee[]", assignee); // Add [] for array format
        });

        // Files handling (already correct)
        data.files?.forEach((file) => {
          formData.append("files", file);
        });

        return {
          url: "tickets/create",
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        };
      },
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),

    sendMessageToTicket: builder.mutation<
      void,
      { ticket_id: string; message: string; files?: string[] }
    >({
      query: ({ ticket_id, message, files }) => ({
        url: `tickets/chat/${ticket_id}`,
        method: "POST",
        body: { message, files },
      }),
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),

    fetchChatFiles: builder.mutation<void, { uid: string; file_name: string }>({
      query: ({ uid, file_name }) => ({
        url: `tickets/show/file/${uid}/${file_name}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    resolveTicket: builder.mutation<TicketResolveResponse, { uid: string }>({
      query: ({ uid }) => ({
        url: "tickets/update-status",
        method: "PUT",
        body: { uid, status: "resolved", closed_at: new Date() },
      }),
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useCreateTicketMutation,
  useGetTicketByIdQuery,
  useResolveTicketMutation,
  useSendMessageToTicketMutation,
} = ticketApi;
