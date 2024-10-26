import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, Paper, Textarea, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useCreateAnnouncementMutation } from "../../../features/api/announcementSlice";
import React from "react";

const schema = z.object({
  name: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long" }),
  descriptions: z
    .string()
    .min(10, { message: "Descriptions must be at least 10 characters long" }),
});

type AddAnnouncement = z.infer<typeof schema>;
interface AddNewAnnouncement {
  toggleModal: () => void;
}

const AddNewAnnouncement: React.FC<AddNewAnnouncement> = ({ toggleModal }) => {
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAnnouncement>({
    resolver: zodResolver(schema),
  });

  //   const getErrorMessage = (
  //     error: FetchBaseQueryError | SerializedError
  //   ): string => {
  //     if ("status" in error) {
  //       // Handle FetchBaseQueryError
  //       return typeof error.data === "string"
  //         ? error.data
  //         : "An unexpected error occurred.";
  //     } else if ("message" in error) {
  //       // Handle SerializedError
  //       return error.message ?? "An unknown error occurred.";
  //     }
  //     return "An unknown error occurred.";
  //   };

  const onSubmit = async (data: AddAnnouncement) => {
    try {
      const response = await createAnnouncement(data).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.message,
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error!",
        message: "Something went wrong!",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      toggleModal();
    }
  };

  return (
    <div>
      <Paper withBorder shadow="md" radius="md" p="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            variant="filled"
            placeholder="Enter title"
            label="Title"
            {...register("name")}
            error={errors.name?.message as React.ReactNode}
          />
          <Textarea
            autosize
            maxRows={20}
            variant="filled"
            placeholder="Enter description"
            label="descriptions"
            mt={10}
            {...register("descriptions")}
            error={errors.descriptions?.message as React.ReactNode}
          />

          <Button
            type="submit"
            className="rounded-lg mt-6"
            disabled={isLoading}
            bg="black"
          >
            {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddNewAnnouncement;
