// AnnouncementList.tsx
import { Card, Loader, Modal, Pill, SimpleGrid } from "@mantine/core";
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
import AnnouncementDetails from "./AnnouncementDetail";

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
    return <Loader type="dots" />;
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
      console.error("Error approving announcement:", error);
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
      console.error("Error rejecting announcement:", error);
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
    <div className="mt-6 py-6">
      <SimpleGrid
        cols={{ sm: 2, md: 2, xl: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {announcementData?.data?.map((announcement) => (
          <Card
            component="a"
            withBorder
            maw={450}
            className="text-center border-blue-200 flex-auto max-w-full overflow-hidden gap-2 cursor-pointer bg-gray-50"
            onClick={() => {
              setSelectedAnnouncement(announcement);
              open();
            }}
            key={announcement.uid}
          >
            <div className="flex justify-between">
              <p className="font-semibold truncate text-gray-600">
                {announcement.name}
              </p>
              <p className="text-right">
                <AppApprovalStatus status={announcement.is_approve} />
              </p>
            </div>

            <p className="font-medium text-sm text-gray-500 my-2 text-left line-clamp-3">
              {announcement.descriptions}
            </p>

            <div className="flex justify-between text-gray-400">
              <p className="text-left text-sm">
                Created By{" "}
                <span className="text-blue-400">
                  {announcement.creator_name}
                </span>
              </p>
              <p className="text-left">
                <Pill size="sm" className="text-white bg-orange-400">
                  {announcement.department_name}
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
        >
          <AnnouncementDetails
            announcement={selectedAnnouncement}
            value={value}
            setValue={setValue}
            handleApproveAnnouncement={handleApproveAnnouncement}
            handleRejectAnnouncement={handleRejectAnnouncement}
          />
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementList;
