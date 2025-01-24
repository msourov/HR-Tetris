import {
  Box,
  Loader,
  Popover,
  Select,
  Button,
  Text,
  Modal,
  Textarea,
} from "@mantine/core";
import ErrorAlert from "../../../components/shared/ErrorAlert";

import { useState } from "react";
import { IoFilter, IoPersonCircle } from "react-icons/io5";
import { DateTimePicker } from "@mantine/dates";
import LeaveList from "./LeaveList";
import {
  useAllLeaveQuery,
  useCreateLeaveMutation,
} from "../../../features/api/leaveSlice";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetEmployeeHelperQuery } from "../../../features/api/employeeSlice";

const schema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  leave_start_date: z.date({ required_error: "Start date is required" }),
  leave_end_date: z.date({ required_error: "End date is required" }),
});

interface ErrorResponse {
  status: number;
  data: { detail: string };
}

type FormData = z.infer<typeof schema>;

const Leave = () => {
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [modalOpened, { open: modalOpen, close: modalClose }] =
    useDisclosure(false);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    is_approved: undefined as "pending" | "approved" | "rejected" | undefined,
    start_time: undefined as string | undefined,
    end_time: undefined as string | undefined,
  });

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

  const { data, isLoading, error, refetch } = useAllLeaveQuery(searchParams);
  const [createLeave, { isLoading: isCreating }] = useCreateLeaveMutation();
  const { data: employees } = useGetEmployeeHelperQuery();

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  if (error) return <ErrorAlert message="Error fetching leave" />;

  const handleSearch = () => {
    const newParams = {
      ...searchParams,
      is_approved: query as "pending" | "approved" | "rejected" | undefined,
      start_time: startDate?.toISOString(),
      end_time: endDate?.toISOString(),
    };
    setSearchParams(newParams);
    refetch();
    setOpened(false);
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      purpose: data.purpose,
      employee_id: data.employee_id,
      leave_type: "custom", // Adjust if dynamic
      leave_start_date: data.leave_start_date.toISOString(),
      leave_end_date: data.leave_end_date.toISOString(),
    };
    console.log(payload);
    try {
      const response = await createLeave(payload).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: "Leave created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      reset();
      modalClose();
      refetch();
    } catch (error) {
      console.error("Failed to create overtime:", error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "An error occurred while creating the ticket",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };
  const employeeId = watch("employee_id");

  return (
    <Box className="w-[85%] mx-auto rounded-lg px-4">
      <Box className="flex justify-end gap-6 items-center mt-6 mb-2 mr-4">
        <Button
          variant="filled"
          color="orange"
          size="compact-sm"
          className="w-[80px]"
          onClick={modalOpen}
        >
          Add
        </Button>
        <Popover
          opened={opened}
          onChange={setOpened}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button
              leftSection={<IoFilter />}
              size="compact-sm"
              color="white"
              bg="black"
              c="white"
              variant="outline"
              onClick={() => setOpened((o) => !o)}
            >
              Filter
            </Button>
          </Popover.Target>
          <Popover.Dropdown bg="var(--mantine-color-body)">
            <DateTimePicker
              variant="filled"
              valueFormat="DD MMM YYYY hh:mm A"
              placeholder="Pick Start Date"
              popoverProps={{ withinPortal: false }}
              value={startDate}
              onChange={setStartDate}
              className="mb-2"
            />
            <DateTimePicker
              variant="filled"
              valueFormat="DD MMM YYYY hh:mm A"
              placeholder="Pick End Date"
              popoverProps={{ withinPortal: false }}
              value={endDate}
              onChange={setEndDate}
              className="mb-2"
            />
            <Select
              variant="filled"
              placeholder="Select Status"
              comboboxProps={{ withinPortal: false }}
              data={["pending", "approved", "rejected"]}
              value={query}
              onChange={(value) => setQuery(value)}
            />
            <Box className="flex justify-end gap-2 mt-4">
              <Button
                variant="default"
                size="compact-sm"
                onClick={handleSearch}
              >
                Apply
              </Button>
              <Button
                variant="default"
                size="compact-sm"
                onClick={() => {
                  setQuery(null);
                  setStartDate(null);
                  setEndDate(null);
                  setSearchParams({
                    ...searchParams,
                    is_approved: undefined,
                    start_time: undefined,
                    end_time: undefined,
                  });
                }}
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="compact-sm"
                c="red"
                onClick={() => setOpened(false)}
              >
                Close
              </Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      </Box>
      <Box>
        {data && Array.isArray(data?.data) && data?.data.length > 0 ? (
          <LeaveList data={data?.data ?? []} />
        ) : (
          <Text ta="center">No data found</Text>
        )}
      </Box>
      <Modal opened={modalOpened} onClose={modalClose} withCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Employee ID"
            placeholder="Select an employee"
            leftSection={<IoPersonCircle />}
            data={employeeOptions}
            value={employeeId}
            onChange={(value) => {
              console.log(value);
              if (value) setValue("employee_id", value);
            }}
            error={errors.employee_id?.message as React.ReactNode}
            searchable
            required
            className="mb-2"
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
          <DateTimePicker
            label="Start Date"
            {...register("leave_start_date")}
            value={watch("leave_start_date") ?? new Date()}
            onChange={(date) =>
              setValue("leave_start_date", date ?? new Date())
            }
            error={errors.leave_start_date?.message}
            required
            className="mb-2"
          />
          <DateTimePicker
            label="End Date"
            {...register("leave_end_date")}
            value={watch("leave_end_date") ?? new Date()}
            onChange={(date) => setValue("leave_end_date", date ?? new Date())}
            error={errors.leave_end_date?.message}
            required
            className="mb-2"
          />

          <Box className="flex justify-end gap-4">
            <Button
              type="submit"
              variant="filled"
              color="blue"
              mt="md"
              disabled={isCreating}
            >
              Submit
            </Button>
            <Button
              type="submit"
              mt="md"
              variant="outline"
              onClick={modalClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Modal>
    </Box>
  );
};

export default Leave;
