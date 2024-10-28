import {
  Box,
  Button,
  FileButton,
  Loader,
  Popover,
  Text,
  TextInput,
} from "@mantine/core";
import { Chat, Ticket } from "../../../features/api/types";
import { IoMdSend } from "react-icons/io";
import { RiAttachment2 } from "react-icons/ri";
import { MessageBox } from "react-chat-elements";
import axios from "axios";
import {
  useGetAllTicketsQuery,
  useResolveTicketMutation,
} from "../../../features/api/ticketSlice";
import { getToken } from "../../../services/utils/getToken";
import { useState } from "react";
import { PiArchiveDuotone } from "react-icons/pi";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import ErrorAlert from "../../../components/shared/ErrorAlert";

interface TicketTypeProp {
  ticket: Ticket;
  open: boolean;
}

const TicketChat: React.FC<TicketTypeProp> = ({ ticket, open }) => {
  const [, setOpened] = useState(false);
  const { refetch } = useGetAllTicketsQuery({ page: 1, limit: 10 });
  const [resolveTicket, { isLoading, error }] = useResolveTicketMutation();
  const [value, setValue] = useState("");
  // const [files, setFiles] = useState<File[]>([]);
  // const [ticketUid, setTicketUid] = useState<string>("");
  // const [fileNames, setFileNames] = useState<string[]>([]);

  const rightPerson = localStorage.getItem("userId");
  const token = getToken();
  // const fileUrl = `${
  //   import.meta.env.VITE_APP_BASE_URL
  // }tickets/show/file/${ticketUid}/${fileNames}`;
  // useEffect(() => {
  //   const fetchFile = async () => {
  //     try {
  //       const response = await axios.get(fileUrl, {
  //         responseType: "blob",
  //       });
  //       console.log(response);
  //     } catch (error) {
  //       console.error("error fetching file", error);
  //     }
  //   };
  // }, [fileUrl]);
  // const handleFileChange = (file: File | null) => {
  //   if (file) {
  //     setFiles((prevFiles) => [...prevFiles, file]); // Append new file to the current list
  //   }
  // };
  if (isLoading) {
    <Loader type="dots" />;
  }
  if (error) {
    <ErrorAlert message="Something went wrong!" />;
  }
  const sendMessage = async (ticketId: string) => {
    const formData = new FormData();
    formData.append("message", value);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}tickets/chat/${ticketId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      setValue("");
      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const archiveTicket = async (uid: string) => {
    try {
      const response = await resolveTicket({ uid });
      console.log(response);
      notifications.show({
        title: "Success!",
        message: "Successfully Resolved",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error!",
        message: "An error occurred while archiving the ticket",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };
  return (
    <Box className=" w-full relative h-full flex flex-col">
      <Box className="px-4 pb-2 h-full overflow-y-auto">
        {open && (
          <div className="flex justify-end pt-2 pb-4">
            <Popover width={200} trapFocus position="top" withArrow shadow="md">
              <Popover.Target>
                <Button
                  variant="filled"
                  color="green"
                  size="xs"
                  leftSection={<PiArchiveDuotone />}
                  onClick={() => setOpened((o) => !o)}
                >
                  Mark as resolved
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text ta="center" my={6}>
                  Are you sure?
                </Text>
                <Box className="flex justify-center gap-4">
                  <Button
                    size="compact-sm"
                    variant="light"
                    onClick={() => archiveTicket(ticket?.uid)}
                  >
                    Yes
                  </Button>
                  <Button
                    size="compact-sm"
                    variant="subtle"
                    color="red"
                    onClick={() => setOpened((o) => !o)}
                  >
                    No
                  </Button>
                </Box>
              </Popover.Dropdown>
            </Popover>
          </div>
        )}

        {ticket?.chat.map((item: Chat, index: number) => {
          const position = rightPerson === item?.user_id ? "right" : "left";

          // Skip rendering if no message or uploads
          if (!item.message && !item.uploads?.length) return null;
          // setFileNames(item?.uploads.map((f) => f.file_name));
          return (
            // <Box
            //   key={index}
            //   className={`flex ${
            //     position === "left" ? "justify-start" : "justify-end"
            //   } w-full my-2`}
            // >
            //   <Box
            //     className={`${
            //       position === "left"
            //         ? "bg-gray-700 text-white"
            //         : "bg-blue-700 text-white"
            //     } px-2 py-1 rounded-md max-w-[50%]`}
            //   >
            //     <Text className="">{item?.message}</Text>
            //   </Box>
            // </Box>
            <MessageBox
              id={index.toString() || "default-id"}
              position={position}
              title={item?.user_name || "Unknown User"}
              type="text"
              text={item?.message || "No message available"}
              date={new Date(item?.create_at || Date.now())}
              replyButton={false}
              focus={false}
              titleColor="#000"
              forwarded={false}
              removeButton={false}
              status="sent"
              notch={true}
              retracted={false}
            />
          );
        })}
      </Box>
      {open && (
        <Box className="mt-auto py-3 flex items-center justify-center gap-1/2 w-full bg-[#374151]">
          <FileButton
            onChange={() => console.log("file upload")}
            accept="image/png,image/jpeg"
          >
            {(props) => (
              <Button {...props} variant="transparent" size="compact-lg">
                <RiAttachment2 size={25} color="white" />
              </Button>
            )}
          </FileButton>
          {/* <Button variant="transparent" size="compact-lg"></Button> */}

          <TextInput
            radius="xl"
            placeholder="Enter message"
            className="w-2/3"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <Button
            variant="transparent"
            size="compact-lg"
            onClick={() => sendMessage(ticket?.uid)}
          >
            <IoMdSend size={25} color="white" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TicketChat;
