import { Box, Container, Loader, Stack } from "@mantine/core";
import { useGetAllTicketsQuery } from "../../../features/api/ticketSlice";
import { Ticket } from "../../../features/api/types";
import TicketChat from "./TicketChat";
import { ChatList } from "react-chat-elements";
import { useEffect, useState, useMemo } from "react";

const TicketList = () => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const { data, isLoading } = useGetAllTicketsQuery({
    page: 1,
    limit: 10,
  });
  const tickets = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    if (Array.isArray(tickets) && tickets.length > 0) {
      setActiveChat(tickets[0].id);
    }
  }, [tickets]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  const activeTicket = Array.isArray(tickets)
    ? tickets.find((ticket: Ticket) => ticket.id === activeChat)
    : null;

  return (
    <Container className="flex ml-0 overflow-hidden px-0" py="30">
      <Box
        w="30%"
        className="border-b border-gray-400 h-[70svh] min-w-[200px] overflow-hidden"
      >
        <Stack
          justify="center"
          gap="md"
          className="flex flex-col justify-start items-center gap-1 pt-2 h-full"
        >
          {Array.isArray(tickets)
            ? tickets.map((item: Ticket) => (
                <Box className="bg-blue-400">
                  <ChatList
                    className="chat-list"
                    id={item?.uid}
                    lazyLoadingImage="path/to/lazy-loading-image.png"
                    onClick={() => setActiveChat(item?.id)}
                    dataSource={[
                      {
                        id: item?.uid,
                        avatar: `https://avatar.iran.liara.run/public/${item?.uid}`,
                        alt: "employee",
                        title: item?.name,
                        date: new Date(item?.update_at),
                        unread: 3,
                      },
                    ]}
                  />
                </Box>
              ))
            : []}
        </Stack>
      </Box>
      <Box
        w="70%"
        className="min-w-[400px] h-[70svh] bg-[#cbd9ff] border-r-2 overflow-auto m-auto"
      >
        {activeChat && activeTicket && <TicketChat ticket={activeTicket} />}
      </Box>
    </Container>
  );
};

export default TicketList;
