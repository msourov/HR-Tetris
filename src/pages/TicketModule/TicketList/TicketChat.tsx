import { Box, Button, FileButton, Text, TextInput } from "@mantine/core";
import { Chat, Ticket } from "../../../features/api/types";
import { IoMdSend } from "react-icons/io";
import { RiAttachment2 } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";

interface TicketTypeProp {
  ticket: Ticket;
}

const TicketChat: React.FC<TicketTypeProp> = ({ ticket }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [ticketUid, setTicketUid] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  const leftPerson = ticket?.chat[0]?.user_id;

  const fileUrl = `${
    import.meta.env.VITE_APP_BASE_URL
  }tickets/show/file/${ticketUid}/${fileNames}`;
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(fileUrl, {
          responseType: "blob",
        });
        console.log(response);
      } catch (error) {
        console.error("error fetching file", error);
      }
    };
  });
  console.log(fileNames);
  const handleFileChange = (file: File | null) => {
    if (file) {
      setFiles((prevFiles) => [...prevFiles, file]); // Append new file to the current list
    }
  };

  return (
    <Box className=" w-full outline relative h-full flex flex-col">
      <Box className="p-4">
        {ticket?.chat.map((item: Chat, index: number) => {
          const position = leftPerson === item?.user_id ? "left" : "right";

          // Skip rendering if no message or uploads
          if (!item.message && !item.uploads?.length) return null;
          setFileNames(item?.uploads.map((f) => f.file_name));
          return (
            <Box
              key={index}
              className={`flex ${
                position === "left" ? "justify-start" : "justify-end"
              } w-full my-2`}
            >
              <Box
                className={`${
                  position === "left"
                    ? "bg-gray-700 text-white"
                    : "bg-blue-700 text-white"
                } px-2 py-1 rounded-md max-w-[50%]`}
              >
                <Text className="">{item?.message}</Text>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box className="mt-auto py-3 flex items-center justify-center gap-1/2 w-full bg-[#374151]">
        <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
          {(props) => (
            <Button {...props} variant="transparent" size="compact-lg">
              <RiAttachment2 size={25} color="white" />
            </Button>
          )}
        </FileButton>
        {/* <Button variant="transparent" size="compact-lg"></Button> */}

        <TextInput radius="xl" placeholder="Enter message" className="w-2/3" />
        <Button variant="transparent" size="compact-lg">
          <IoMdSend size={25} color="white" />
        </Button>
      </Box>
    </Box>
  );
};

export default TicketChat;
