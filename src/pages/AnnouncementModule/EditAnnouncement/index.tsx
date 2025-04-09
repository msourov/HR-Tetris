import {
  Box,
  Button,
  Loader,
  Modal,
  Paper,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LuPlusCircle } from "react-icons/lu";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useDeleteAnnouncementMutation,
  useGetAllAnnouncementsQuery,
  useUpdateAnnouncementMutation,
} from "../../../features/api/announcementSlice";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import AddNewAnnouncement from "../AddNewAnnouncement";

// Define the schema with z.object() and correct fields
const schema = z.object({
  name: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long" }),
  descriptions: z
    .string()
    .min(10, { message: "Descriptions must be at least 10 characters long" }),
});

type EditAnnouncementType = z.infer<typeof schema>;

const EditAnnouncement = () => {
  const [anmt, setAnmt] = useState<string>("");
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const { data: announcements } = useGetAllAnnouncementsQuery();
  const [updateAnnouncement, { isLoading: editAnmtLoading }] =
    useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: deleteAnmtLoading }] =
    useDeleteAnnouncementMutation();

  const toggleModal = () => {
    addClose();
  };

  const announcementOptions = announcements?.data.map((item) => ({
    value: item?.uid,
    label: item?.name,
  }));

  const announcementDetail = announcements?.data.find(
    (item) => item?.uid === anmt
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditAnnouncementType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (announcementDetail) {
      reset({
        name: announcementDetail?.name,
        descriptions: announcementDetail?.descriptions,
      });
    }
  }, [announcementDetail, reset]);

  const text = <Text fw={500}>Select Announcement</Text>;

  const onSubmit = async (data: EditAnnouncementType) => {
    const obj = {
      ...data,
      uid: anmt,
    };
    try {
      const response = await updateAnnouncement(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message,
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      reset({ name: "", descriptions: "" });
      setAnmt("");
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          error instanceof Error
            ? error.message
            : "Couldn't update announcement",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteAnnouncement({ uid: anmt }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message,
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          error instanceof Error
            ? error.message
            : "Couldn't delete announcement",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <Box className="my-6">
      <Box className="flex justify-end">
        <Button
          leftSection={<LuPlusCircle />}
          color="black"
          bg="orange"
          variant="filled"
          onClick={addOpen}
        >
          Add
        </Button>
      </Box>
      <Modal
        opened={addOpened}
        onClose={addClose}
        size="xl"
        title="Create Announcement"
      >
        <AddNewAnnouncement toggleModal={toggleModal} />
      </Modal>
      <Select
        label={text}
        data={announcementOptions}
        value={anmt}
        onChange={(value) => value && setAnmt(value)}
        mt={8}
      />
      {anmt && (
        <Paper shadow="sm" p="md" my={16}>
          {announcementDetail ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="Title"
                {...register("name")}
                error={errors.name?.message as React.ReactNode}
              />
              <Textarea
                autosize
                maxRows={15}
                variant="filled"
                placeholder="Enter description"
                label="Descriptions"
                mt={10}
                {...register("descriptions")}
                error={errors.descriptions?.message as React.ReactNode}
              />
              <Button
                type="submit"
                className="rounded-lg mt-6"
                bg="black"
                disabled={editAnmtLoading}
              >
                {editAnmtLoading ? <Loader type="dots" size="sm" /> : "Save"}
              </Button>
            </form>
          ) : (
            <ErrorAlert message="Error updating announcement" />
          )}
        </Paper>
      )}
      {announcementDetail && (
        <>
          <Box className="flex justify-end mt-10">
            <Button variant="light" color="red" onClick={openDelete}>
              Delete
            </Button>
          </Box>
          <Modal
            opened={deleteOpened}
            onClose={closeDelete}
            centered
            className="text-center"
          >
            <Text>Are you sure you want to delete?</Text>
            <Box className="flex gap-2 justify-center mt-4">
              <Button
                color="red"
                onClick={handleDelete}
                disabled={deleteAnmtLoading}
              >
                Confirm
              </Button>
              <Button
                color="gray"
                onClick={closeDelete}
                disabled={deleteAnmtLoading}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default EditAnnouncement;
