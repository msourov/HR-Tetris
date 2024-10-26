import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseApi";
import { TicketResponse, CreateTicketRequest } from "./types";
import { tagTypes } from "./tags";

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
      query: (data) => ({
        url: "tickets/create",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
  }),
});

export const {
  useGetAllTicketsQuery,
  useCreateTicketMutation,
  useGetTicketByIdQuery,
} = ticketApi;
