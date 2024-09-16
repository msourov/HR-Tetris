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
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import {
  useDeleteShiftMutation,
  useEditShiftMutation,
  useGetShiftsQuery,
} from "../../../../features/api/shiftSlice";
import AddShift from "../AddShift";

const schema = z
  .object({
    uid: z.string(),
    name: z
      .string()
      .min(2, { message: "Name should have at least 2 characters" }),
    active: z.boolean(),
    regular: z.boolean(),
    descriptions: z.string().optional(),
    day_start_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Start time must be in the format HH:mm"),
    day_end_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "End time must be in the format HH:mm"),
    off_day: z.string().nonempty({ message: "Off day is required" }),
    start_date: z.date({ required_error: "Start date is required" }),
    end_date: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.start_date <= data.end_date, {
    message: "Start date cannot be after end date",
    path: ["start_date"],
  });

type EditShiftType = z.infer<typeof schema>;

const EditShift = () => {
  const [shiftUid, setShiftUid] = useState<string>("");
  const { data: shifts } = useGetShiftsQuery({ page: 1, limit: 10 });
  const [editShift, { isLoading: shiftEditLoading }] = useEditShiftMutation();
  const [deleteShift, { isLoading: deleteShiftLoading }] =
    useDeleteShiftMutation();
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const toggleModal = () => {
    addClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditShiftType>({
    // resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      active: false,
      regular: false,
      descriptions: "",
      day_start_time: "",
      day_end_time: "",
      off_day: "",
      start_date: undefined,
      end_date: undefined,
    },
  });

  const formatTimeWithoutSeconds = (time: string) => {
    return time.split(":").slice(0, 2).join(":");
  };

  const ensureSeconds = (time: string) => {
    return time.includes(":") ? `${time}:00` : time;
  };

  const shiftDetail = shifts?.data.find((item) => item?.uid === shiftUid);

  useEffect(() => {
    if (shiftDetail) {
      reset({
        name: shiftDetail?.name,
        active: shiftDetail?.active,
        regular: shiftDetail?.regular,
        descriptions: shiftDetail?.descriptions || "",
        day_start_time: formatTimeWithoutSeconds(
          shiftDetail?.day_start_time || ""
        ),
        day_end_time: formatTimeWithoutSeconds(shiftDetail?.day_end_time || ""),
        off_day: shiftDetail?.off_day || "",
        start_date: new Date(shiftDetail?.start_time),
        end_date: new Date(shiftDetail?.end_time),
      });
    }
  }, [shiftDetail, reset]);

  const onSubmit = async (data: EditShiftType) => {
    console.log(data);
    if (!shiftDetail || !shiftDetail.uid) {
      notifications.show({
        title: "Error!",
        message: "Shift UID is missing. Cannot update the shift.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    const formattedData = {
      uid: shiftDetail.uid,
      name: data.name,
      active: data.active,
      regular: data.regular,
      descriptions: data.descriptions,
      day_start_time: ensureSeconds(data.day_start_time),
      day_end_time: ensureSeconds(data.day_end_time),
      off_day: data.off_day,
      start_time: data.start_date ? data.start_date.toISOString() : "",
      end_time: data.end_date ? data.end_date.toISOString() : "",
    };
    console.log(JSON.stringify(formattedData, undefined, 2));

    try {
      const response = await editShift(formattedData).unwrap();
      if (response.status_code === 200) {
        notifications.show({
          title: "Success!",
          message: "Shift updated successfully",
          icon: <IconCheck />,
          color: "green",
          autoClose: 3000,
        });

        reset({
          name: "",
          active: false,
          regular: false,
          descriptions: "",
          day_start_time: "",
          day_end_time: "",
          off_day: "",
          start_date: undefined,
          end_date: undefined,
        });
        setShiftUid("");
      }
    } catch (error) {
      // console.log(JSON.stringify(error.data.detail));
      notifications.show({
        title: "Error!",
        message: "Couldn't update shift",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteShift({ id: shiftUid }).unwrap();
      setShiftUid("");
      notifications.show({
        title: "Success!",
        message: "Shift deleted",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't delete shift",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeDelete();
    }
  };

  const shiftOptions = shifts?.data.map((item) => ({
    label: item.name,
    value: item.uid,
  }));

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
        value={shiftUid !== "" ? shiftUid : null}
        onChange={(value) => {
          if (value) setShiftUid(value);
          else setShiftUid("");
        }}
        mt={8}
      />
      {shiftDetail && (
        <Paper shadow="sm" p="xl" my={16}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Box mt={4} className="flex gap-6">
              <Switch
                label="Active"
                {...register("active")}
                checked={watch("active")}
              />
              <Switch
                label="Regular"
                {...register("regular")}
                checked={watch("regular")}
              />
            </Box>
            <TextInput
              label="Descriptions"
              {...register("descriptions")}
              error={errors.descriptions?.message}
              mt={4}
            />
            <TimeInput
              label="Day Start Time"
              {...register("day_start_time")}
              error={errors.day_start_time?.message}
              required
              mt={4}
            />
            <TimeInput
              label="Day End Time"
              {...register("day_end_time")}
              error={errors.day_end_time?.message}
              required
              mt={4}
            />
            <TextInput
              label="Off Day"
              {...register("off_day")}
              error={errors.off_day?.message}
              mt={4}
            />
            <DatePickerInput
              type="range"
              label="Pick dates range"
              placeholder="Pick dates range"
              value={
                watch("start_date") && watch("end_date")
                  ? [watch("start_date"), watch("end_date")]
                  : undefined
              }
              onChange={(value) => {
                if (value && value.length === 2) {
                  if (value[0] instanceof Date)
                    setValue("start_date", value[0]);
                  if (value[1] instanceof Date) setValue("end_date", value[1]);
                }
              }}
              error={errors.start_date?.message || errors.end_date?.message}
              required
              mt="sm"
            />
            <Button
              type="submit"
              className="rounded-lg mt-6"
              disabled={shiftEditLoading}
              bg="black"
            >
              {shiftEditLoading ? <Loader size="sm" /> : "Save"}
            </Button>
          </form>
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
                disabled={deleteShiftLoading}
              >
                Confirm
              </Button>
              <Button
                color="gray"
                onClick={closeDelete}
                disabled={deleteShiftLoading}
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

export default EditShift;
