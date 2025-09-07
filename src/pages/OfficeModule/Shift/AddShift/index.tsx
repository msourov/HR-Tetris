import {
  Button,
  Group,
  TextInput,
  Textarea,
  Switch,
  Loader,
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useCreateShiftMutation } from "../../../../features/api/shiftSlice";
import { ErrorResponse } from "react-router-dom";

const schema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name should have at least 2 characters" }),
    active: z.boolean(),
    regular: z.boolean(),
    descriptions: z.string().optional(),
    day_start_time: z.string().nonempty("Start time is required"),
    day_end_time: z.string().nonempty("End time is required"),
    off_day: z.array(z.string()),
    start_time: z.date({ invalid_type_error: "Start date is required" }),
    end_time: z.date({ invalid_type_error: "End date is required" }),
  })
  .refine(
    (data) => {
      const [sh, sm] = data.day_start_time.split(":").map(Number);
      const [eh, em] = data.day_end_time.split(":").map(Number);

      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      // valid if end > start (same day) OR end < start (overnight shift)
      return end !== start; // allow both same-day and overnight but not identical
    },
    {
      message: "End time cannot be same as start time",
      path: ["day_end_time"],
    }
  );

type AddShiftType = z.infer<typeof schema>;

interface AddShiftProps {
  toggleModal: () => void;
}

const AddShift: React.FC<AddShiftProps> = ({ toggleModal }) => {
  const [createShift, { isLoading }] = useCreateShiftMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<AddShiftType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      active: false,
      regular: false,
      descriptions: "",
      day_start_time: "",
      day_end_time: "",
      off_day: [],
      start_time: undefined,
      end_time: undefined,
    },
  });

  const onSubmit = async (data: AddShiftType) => {
    const formattedData = {
      ...data,
      day_start_time: `${data.day_start_time}:00`,
      day_end_time: `${data.day_end_time}:00`,
      start_time: data.start_time.toISOString(),
      end_time: data.end_time.toISOString(),
      descriptions: data.descriptions || "",
    };

    try {
      const response = await createShift(formattedData).unwrap();
      if (response.status_code === 201) {
        notifications.show({
          title: "Success!",
          message: "Shift created successfully",
          icon: <IconCheck />,
          color: "green",
          autoClose: 3000,
        });
      }
      toggleModal();
      reset();
    } catch (error) {
      if (error && typeof error === "object") {
        notifications.show({
          title: "Error!",
          message:
            (error as ErrorResponse)?.data?.detail[0]?.msg ||
            "An unknown error occurred",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: "Error!",
          message: "An unknown error occurred",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      }
    }
  };
  if (isLoading) {
    return <Loader color="rgba(255, 255, 255, 1)" size={20} />;
  }

  return (
    <div>
      <h2 className="text-lg text-gray-500 text-center">Add Shift</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
        <TextInput
          label="Name"
          {...register("name")}
          error={errors.name?.message}
          // required
        />

        <Group mt="sm">
          <Switch
            label="Active"
            {...register("active")}
            error={errors.active?.message}
          />
          <Switch
            label="Regular"
            {...register("regular")}
            error={errors.regular?.message}
          />
        </Group>

        <Textarea
          label="Descriptions"
          {...register("descriptions")}
          error={errors.descriptions?.message}
          mt="sm"
        />

        <TimeInput
          label="Day Start Time"
          {...register("day_start_time")}
          error={errors.day_start_time?.message}
          required
          mt="sm"
        />

        <TimeInput
          label="Day End Time"
          {...register("day_end_time")}
          error={errors.day_end_time?.message}
          required
          mt="sm"
        />

        <Controller
          name="off_day"
          control={control}
          render={({ field }) => (
            <MultiSelect
              label="Off Days"
              data={[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ]}
              placeholder="Select off days"
              value={field.value || []}
              onChange={field.onChange}
              required
              error={errors.off_day?.message}
              mt="sm"
            />
          )}
        />

        <DatePickerInput
          type="range"
          label="Pick dates range"
          placeholder="Pick dates range"
          value={
            watch("start_time") && watch("end_time")
              ? [watch("start_time"), watch("end_time")]
              : undefined
          }
          onChange={(value) => {
            if (value[0]) setValue("start_time", value[0]);
            if (value[1]) setValue("end_time", value[1]);
          }}
          error={errors.start_time?.message || errors.end_time?.message}
          required
          mt="sm"
        />

        <Group ta="right" mt="md">
          <Button color="blue" type="submit">
            Create
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default AddShift;
