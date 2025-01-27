import {
  Button,
  Card,
  Loader,
  Modal,
  Pill,
  SimpleGrid,
  Textarea,
} from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../services/auth/useAuth";
import {
  useApproveAnnouncementMutation,
  useGetAllAnnouncementsQuery,
} from "../../../features/api/announcementSlice";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Response, Announcement } from "../../../features/api/typesOld";
import AppApprovalStatus from "../../../components/core/AppApprovalStatus";

const AnnouncementList = () => {
  const [value, setValue] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    approveAnnouncement,
    { isLoading: approveAnnLoading, error: approveAnnError },
  ] = useApproveAnnouncementMutation();
  const {
    data: announcementData,
    isLoading,
    error,
  } = useGetAllAnnouncementsQuery();
  const { logout } = useAuth();

  if (isLoading || approveAnnLoading) {
    <Loader type="dots" />;
  }

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error(error);
    }
  }

  console.log(approveAnnError);

  const handleApproveAnnouncement = async (uid: string) => {
    try {
      const response = await approveAnnouncement({
        uid,
        is_approve: "approved",
        reject_purpose: value,
      });
      if ("data" in response) {
        const data = response.data as Response;
        notifications.show({
          title: "Success!",
          message: data.message || "Announcement approved",
          icon: <IconCheck />,
          color: "green",
          autoClose: 3000,
        });
      }
      console.log(response);
    } catch (error) {
      console.error("Error approving overtime:", error);
      notifications.show({
        title: "Error!",
        message: "Something went wrong!",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      close();
    }
  };
  const handleRejectAnnouncement = async (uid: string) => {
    try {
      const response = await approveAnnouncement({
        uid,
        is_approve: "rejected",
        reject_purpose: value,
      });
      if ("data" in response) {
        const data = response.data as Response;
        notifications.show({
          title: "Success!",
          message: data.message || "Announcement rejected",
          icon: <IconCheck />,
          color: "green",
          autoClose: 3000,
        });
      }
      close();
    } catch (error) {
      console.error("Error approving overtime:", error);
      notifications.show({
        title: "Error!",
        message: "Something went wrong!",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      close();
    }
  };

  return (
    <div className="mt-6">
      <SimpleGrid
        cols={{ sm: 2, md: 2, xl: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {announcementData?.data?.map((selectedAnnouncement) => (
          <Card
            // padding="xl"
            component="a"
            withBorder
            maw={450}
            className="text-center flex-auto max-w-full overflow-hidden gap-2 cursor-pointer"
            onClick={() => {
              setSelectedAnnouncement(selectedAnnouncement);
              open();
            }}
          >
            <div className="flex justify-between">
              <p className="font-medium text-lg truncate">
                {selectedAnnouncement?.name}
              </p>
              <p className="text-right">
                <AppApprovalStatus status={selectedAnnouncement?.is_approve} />
              </p>
            </div>

            <p className="font-medium text-sm text-gray-500 my-2 text-left line-clamp-3">
              {selectedAnnouncement?.descriptions}
            </p>

            <div className="flex justify-between">
              <p className="text-left text-sm">
                Created By {selectedAnnouncement?.creator_name}
              </p>
              <p className="text-left">
                <Pill size="sm" className="text-gray-500">
                  {selectedAnnouncement?.department_name}
                </Pill>
              </p>
            </div>
          </Card>
        ))}
      </SimpleGrid>
      {selectedAnnouncement && (
        <Modal
          opened={opened}
          onClose={close}
          size="xl"
          withCloseButton={false}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          //   scrollAreaComponent={ScrollArea.Autosize}
        >
          <Card>
            <p className="font-medium text-xl text-center mb-4 text-[#212922]">
              {selectedAnnouncement?.name}
            </p>

            <p className="font-medium text-md text-gray-500 text-left mb-6 border px-2 py-4 text-[#212922]">
              {selectedAnnouncement?.descriptions}
            </p>

            <p className="text-left text-sm">
              Created By {selectedAnnouncement?.creator_name}
            </p>

            <p>
              <Pill size="md" className="text-gray-500 my-10">
                {selectedAnnouncement?.department_name}
              </Pill>
            </p>
          </Card>
          {selectedAnnouncement?.is_approve === "pending" && (
            <Textarea
              variant="filled"
              placeholder="Reason for rejection"
              className="w-[95%] mb-6 mx-auto"
              mb={20}
              value={value}
              onChange={(event) => {
                setValue(event.currentTarget.value);
              }}
            />
          )}
          {selectedAnnouncement?.is_approve === "pending" ? (
            <div className="flex justify-end gap-4">
              <Button
                variant="filled"
                bg="blue"
                onClick={() =>
                  handleApproveAnnouncement(selectedAnnouncement?.uid)
                }
              >
                Approve
              </Button>
              <Button
                variant="light"
                color="red"
                onClick={() =>
                  handleRejectAnnouncement(selectedAnnouncement?.uid)
                }
              >
                Reject
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <Pill className="bg-green-300 text-green-900 font-bold">
                Approved
              </Pill>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementList;
