import {
  Box,
  Button,
  Loader,
  Modal,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LuPlusCircle } from "react-icons/lu";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import AddShift from "../AddShift";
import {
  useCreateShiftMutation,
  useDeleteShiftMutation,
  useEditShiftMutation,
  useGetShiftsQuery,
} from "../../../../features/api/shift_schedule";

const schema = z.object({
  uid: z.string(),
  name: z.string().min(2),
  active: z.boolean(),
  regular: z.boolean(),
  descriptions: z.string().optional(),
  day_start_time: z.string().optional(),
  day_end_time: z.string().optional(),
  off_day: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

type EditShiftType = z.infer<typeof schema>;

const EditShift = () => {
  const [shiftUid, setShiftUid] = useState<string>("");
  const { data: shifts, isLoading: shiftLoading } = useGetShiftsQuery({
    page: 1,
    limit: 10,
  });
  // const [createShift, { isLoading, error }] = useCreateShiftMutation();
  // const [editShift, { isLoading: shiftEditLoading, error: shiftEditError }] =
  //   useEditShiftMutation();
  // const [
  //   deleteShift,
  //   { isLoading: shiftDeleteLoading, error: shiftDeleteError },
  // ] = useDeleteShiftMutation();
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  // const [deleteOpened, { open: openDelete, close: closeDelete }] =
  //   useDisclosure(false);

  const toggleModal = () => {
    addClose();
  };

  console.log("shifts", shifts);
  const shiftOptions = shifts?.data.map((item) => ({
    label: item?.name,
    value: item?.uid,
  }));
  console.log(shiftOptions);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditShiftType>({
    resolver: zodResolver(schema),
    defaultValues: {
      uid: "",
      name: "",
      active: false,
      regular: false,
      descriptions: "",
      day_start_time: "",
      day_end_time: "",
      off_day: "",
      start_time: "",
      end_time: "",
    },
  });

  const activeStatus = watch("active");

  // const onSubmit = async (data: EditShiftType) => {
  //   try {
  //     await editShift(data).unwrap();
  //     notifications.show({
  //       title: "Success!",
  //       message: "Successfully updated shift",
  //       icon: <IconCheck />,
  //       color: "green",
  //       autoClose: 3000,
  //     });
  //   } catch (error) {
  //     notifications.show({
  //       title: "Error!",
  //       message: "Couldn't update shift",
  //       icon: <IconX />,
  //       color: "red",
  //       autoClose: 3000,
  //     });
  //   }
  // };

  // const handleDelete = async () => {
  //   try {
  //     await deleteShift({ id: shiftUid }).unwrap();
  //     notifications.show({
  //       title: "Success!",
  //       message: "Shift deleted",
  //       icon: <IconCheck />,
  //       color: "green",
  //       autoClose: 3000,
  //     });
  //   } catch (error) {
  //     notifications.show({
  //       title: "Error!",
  //       message: "Couldn't delete shift",
  //       icon: <IconX />,
  //       color: "red",
  //       autoClose: 3000,
  //     });
  //   }
  // };

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
      <Modal opened={addOpened} onClose={addClose} title="Add Shift" size="80%">
        <AddShift toggleModal={toggleModal} />
      </Modal>
      <Select
        label={<Text fw={500}>Select Shift</Text>}
        data={shiftOptions}
        value={shiftUid}
        onChange={(value) => {
          if (value) {
            setShiftUid(value);
          }
        }}
        mt={8}
      />
      {/* {dept && (
        <Paper shadow="sm" p="md" my={16}>
          {shiftDetail ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="Name"
                {...register("name")}
                error={errors.name?.message as React.ReactNode}
              />
              <Box className="max-w-20 mt-4">
                <Switch
                  size="lg"
                  onLabel="Disable"
                  offLabel="Activate"
                  color="black"
                  checked={activeStatus}
                  {...register("active")}
                />
              </Box>
              <TextInput
                label="Description"
                {...register("descriptions")}
                error={errors.descriptions?.message as React.ReactNode}
                mt={4}
              />
              <TextInput
                label="Day Start Time"
                {...register("day_start_time")}
                error={errors.day_start_time?.message as React.ReactNode}
                mt={4}
              />
              <TextInput
                label="Day End Time"
                {...register("day_end_time")}
                error={errors.day_end_time?.message as React.ReactNode}
                mt={4}
              />
              <TextInput
                label="Off Day"
                {...register("off_day")}
                error={errors.off_day?.message as React.ReactNode}
                mt={4}
              />
              <TextInput
                label="Start Time"
                {...register("start_time")}
                error={errors.start_time?.message as React.ReactNode}
                mt={4}
              />
              <TextInput
                label="End Time"
                {...register("end_time")}
                error={errors.end_time?.message as React.ReactNode}
                mt={4}
              />
              <Button
                type="submit"
                className="rounded-lg mt-6"
                bg="black"
                disabled={shiftEditLoading}
              >
                {shiftEditLoading ? <Loader type="dots" size="sm" /> : "Save"}
              </Button>
            </form>
          ) : (
            <ErrorAlert message="Error updating shift" />
          )}
        </Paper>
      )}
      {shiftDetail && (
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
                disabled={shiftDeleteLoading}
              >
                Confirm
              </Button>
              <Button
                color="gray"
                onClick={closeDelete}
                disabled={shiftDeleteLoading}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </>
      )} */}
    </Box>
  );
};

export default EditShift;
