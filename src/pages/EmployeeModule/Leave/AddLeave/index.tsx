import { Select, Button, Textarea } from "@mantine/core";
import { IoPersonCircle } from "react-icons/io5";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CiCalendarDate } from "react-icons/ci";
import dayjs from "dayjs";
import React from "react";
import { useCreateLeaveMutation } from "../../../../features/api/leaveSlice";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";
import { ErrorResponse } from "react-router-dom";

const schema = z
  .object({
    leave_type: z.string().min(1, "Leave type is required"),
    leave_period: z.string().min(1, "Leave Period is required"),
    purpose: z.string().min(1, "Purpose is required"),
    employee_id: z.string().min(1, "Employee ID is required"),
    leave_start_date: z.date({ required_error: "Start date is required" }),
    leave_end_date: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.leave_end_date > data.leave_start_date, {
    message: "End date must be later than start date",
    path: ["leave_end_date"],
  });

type FormData = z.infer<typeof schema>;

interface AddNewLeaveProps {
  toggleModal: () => void;
}

const AddLeave: React.FC<AddNewLeaveProps> = ({ toggleModal }) => {
  const [dropdownOpened, { toggle }] = useDisclosure();

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

  const [createLeave, { isLoading: isCreating, error: createLeaveError }] =
    useCreateLeaveMutation();
  const { data: employees } = useGetEmployeeHelperQuery();

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  const onSubmit = async (data: FormData) => {
    const payload = {
      leave_type: data.leave_type,
      leave_preiod: data.leave_period,
      purpose: data.purpose,
      employee_id: data.employee_id,
      leave_start_date: dayjs(data.leave_start_date).toISOString(),
      leave_end_date: dayjs(data.leave_end_date).toISOString(),
    };
    try {
      const response = await createLeave(payload).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Leave created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      reset();
      toggleModal();
    } catch (error) {
      console.error("Failed to create leave:", error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "Couldn't create leave. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  console.log(createLeaveError, "createLeaveError");

  const employeeId = watch("employee_id");
  return (
    <div className="py-4 px-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="Employee ID"
          placeholder="Select an employee"
          variant="filled"
          leftSection={<IoPersonCircle />}
          data={employeeOptions}
          value={employeeId}
          onChange={(value) => {
            if (value) {
              setValue("employee_id", value);
              toggle();
            }
          }}
          onClick={toggle}
          error={errors.employee_id?.message as React.ReactNode}
          searchable
          required
          className="mb-2"
          autoFocus={false}
          dropdownOpened={dropdownOpened}
        />
        <Textarea
          {...register("leave_type")}
          label="Type"
          placeholder="Enter type"
          variant="filled"
          error={errors.leave_type?.message}
          className="mb-2"
          required
        />
        <Textarea
          {...register("purpose")}
          label="Reason"
          placeholder="Enter purpose"
          variant="filled"
          error={errors.purpose?.message}
          className="mb-2"
          required
        />
        <Textarea
          {...register("leave_period")}
          label="Period"
          placeholder="Enter period"
          variant="filled"
          error={errors.leave_period?.message}
          className="mb-2"
          required
        />
        <DateTimePicker
          label="Start Date"
          variant="filled"
          leftSection={<CiCalendarDate />}
          {...register("leave_start_date")}
          value={
            watch("leave_start_date")
              ? dayjs(watch("leave_start_date")).toDate()
              : new Date()
          }
          onChange={(date) =>
            setValue(
              "leave_start_date",
              date ? dayjs(date).toDate() : new Date()
            )
          }
          error={errors.leave_start_date?.message}
          required
          className="mb-2"
        />
        <DateTimePicker
          label="End Date"
          variant="filled"
          leftSection={<CiCalendarDate />}
          {...register("leave_end_date")}
          value={
            watch("leave_end_date")
              ? dayjs(watch("leave_end_date")).toDate()
              : new Date()
          }
          onChange={(date) =>
            setValue("leave_end_date", date ? dayjs(date).toDate() : new Date())
          }
          error={errors.leave_end_date?.message}
          required
          className="mb-2"
        />

        <div className="flex justify-end gap-4">
          <Button
            color="gray"
            type="submit"
            mt="md"
            variant="outline"
            onClick={toggleModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            color="blue"
            mt="md"
            disabled={isCreating}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLeave;
