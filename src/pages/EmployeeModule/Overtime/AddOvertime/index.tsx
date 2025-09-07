import { Select, Button, Textarea } from "@mantine/core";
import { z } from "zod";
import { useCreateOvertimeMutation } from "../../../../features/api/overtimeSlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoPersonCircle } from "react-icons/io5";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";
import { DateTimePicker } from "@mantine/dates";

const schema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  start_time: z.date({
    required_error: "Start time is required",
    invalid_type_error: "Invalid start time format",
  }),
  end_time: z.date({
    required_error: "End time is required",
    invalid_type_error: "Invalid end time format",
  }),
});

type ErrorResponse = { data: { detail: string } };

type FormData = z.infer<typeof schema>;

interface AddOvertimeProps {
  toggleModal: () => void;
}

const AddOvertime: React.FC<AddOvertimeProps> = ({ toggleModal }) => {
  const [createOvertime, { isLoading: isCreating }] =
    useCreateOvertimeMutation();
  const { data: employees } = useGetEmployeeHelperQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const employeeId = watch("employee_id");

  const onSubmit = async (data: FormData) => {
    const payload = {
      purpose: data.purpose,
      employee_id: data.employee_id,
      start_time: dayjs(data.start_time).toISOString(),
      end_time: dayjs(data.end_time).toISOString(),
    };

    try {
      const response = await createOvertime(payload).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Overtime created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      reset();
      toggleModal();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "Couldn't create overtime. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select
        label="Employee"
        placeholder="Select an employee"
        leftSection={<IoPersonCircle />}
        data={employeeOptions}
        value={employeeId}
        onChange={(value) => {
          if (value) setValue("employee_id", value);
        }}
        error={errors.employee_id?.message as React.ReactNode}
        searchable
        required
        className="mb-2"
      />

      <Textarea
        {...register("purpose")}
        label="Purpose"
        placeholder="Enter purpose"
        variant="filled"
        error={errors.purpose?.message}
        className="mb-2"
        required
      />

      <DateTimePicker
        variant="filled"
        label="Start time"
        valueFormat="DD MMM YYYY hh:mm A"
        placeholder="Pick start time"
        value={watch("start_time") ?? null}
        onChange={(date) => setValue("start_time", date ?? new Date())}
        error={errors.start_time?.message}
        className="mb-2"
        required
      />

      <DateTimePicker
        variant="filled"
        label="End time"
        valueFormat="DD MMM YYYY hh:mm A"
        placeholder="Pick end time"
        value={watch("end_time") ?? null}
        onChange={(date) => setValue("end_time", date ?? new Date())}
        error={errors.end_time?.message}
        className="mb-2"
        required
      />

      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          variant="filled"
          color="blue"
          mt="md"
          disabled={isCreating}
        >
          Submit
        </Button>
        <Button mt="md" variant="outline" onClick={toggleModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddOvertime;
