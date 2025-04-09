import {
  Box,
  Container,
  Divider,
  Drawer,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useGetAllTicketsQuery } from "../../../features/api/ticketSlice";
import { Ticket } from "../../../features/api/typesOld";
import TicketChat from "./TicketChat";
import { ChatList } from "react-chat-elements";
import { useEffect, useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";

const TicketList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeChat, setActiveChat] = useState<number | null>(() => {
    const savedChatId = localStorage.getItem("activeChat");
    return savedChatId ? Number(savedChatId) : null;
  });
  const [activeArchivedTicket, setActiveArchivedTicket] = useState<
    number | null
  >(null);
  const { data, isLoading } = useGetAllTicketsQuery({
    page: 1,
    limit: 10,
  });
  const tickets = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    if (Array.isArray(tickets) && tickets.length > 0 && activeChat === null) {
      setActiveChat(tickets[0].id);
    }
  }, [activeChat, tickets]);

  useEffect(() => {
    if (activeChat !== null) {
      localStorage.setItem("activeChat", activeChat.toString());
    }
  }, [activeChat]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  const activeTicket = Array.isArray(tickets)
    ? tickets.find((ticket: Ticket) => ticket.id === activeChat)
    : null;

  const archivedTicket = Array.isArray(tickets)
    ? tickets.find((ticket: Ticket) => ticket.id === activeArchivedTicket)
    : null;

  const openTickets = Array.isArray(tickets)
    ? tickets.filter((item) => item?.status === "open")
    : [];

  const archivedTickets = Array.isArray(tickets)
    ? tickets.filter((item) => item?.status === "resolved")
    : [];
  console.log(archivedTickets);

  const handleArchiveChatOpen = (ticket: Ticket) => {
    setActiveArchivedTicket(ticket.id);
    open();
  };

  return (
    <Box className="w-full flex flex-row">
      <Container className="flex ml-0 mt-4 overflow-hidden px-0 w-[70%]">
        <Box
          w="30%"
          className="border-b border-gray-400 h-[70svh] min-w-[200px] overflow-hidden"
        >
          <Stack
            justify="center"
            gap="md"
            className="flex flex-col justify-start items-center gap-1 pt-2 h-full"
          >
            {openTickets.map((item: Ticket) => (
              <Box className="w-full" key={item.id}>
                <ChatList
                  className="chat-list"
                  id={item.uid}
                  lazyLoadingImage="path/to/lazy-loading-image.png"
                  onClick={() => setActiveChat(item.id)}
                  dataSource={[
                    {
                      id: item.uid,
                      avatar: `https://avatar.iran.liara.run/public/${item.uid}`,
                      alt: "employee",
                      title: item.name,
                      date: new Date(item.update_at),
                    },
                  ]}
                />
              </Box>
            ))}
          </Stack>
        </Box>
        <Box
          w="70%"
          className="min-w-[400px] h-[70svh] bg-[#cbd9ff] border-r-2 overflow-auto m-auto"
        >
          {activeChat && activeTicket && (
            <TicketChat ticket={activeTicket} open={true} />
          )}
        </Box>
      </Container>
      <Box className="w-[25%] border-l-1 border bg-slate-300 py-4 px-2">
        <Divider
          label={
            <>
              <Text ta="center" fw="bold" color="blue" mb={10}>
                Archived Tickets
              </Text>
            </>
          }
        />
        {Array.isArray(archivedTickets)
          ? archivedTickets.map((item) => (
              <ChatList
                key={item.uid}
                className="chat-list"
                id={`chat-list-${item.id}`}
                onClick={() => handleArchiveChatOpen(item)}
                dataSource={[
                  {
                    id: item?.id,
                    avatar: `https://avatar.iran.liara.run/public/${item?.uid}`,
                    alt: "avatar",
                    title: item?.name,
                    subtitle: "",
                    date: new Date(item?.update_at),
                  },
                ]}
                lazyLoadingImage="path/to/your/lazy-loading-image.png" // Provide a path to the lazy loading image
              />
            ))
          : []}
      </Box>
      <Drawer
        offset={8}
        position="right"
        radius="md"
        opened={opened}
        onClose={close}
      >
        <Text ta="center" fw="bold" color="dimmed" mb={30}>
          Archived Ticket
        </Text>
        {activeArchivedTicket && archivedTicket && (
          <TicketChat ticket={archivedTicket} open={false} />
        )}
      </Drawer>
    </Box>
  );
};

export default TicketList;
