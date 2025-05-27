import { z } from "zod";
import {
  Drawer,
  Button,
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  NumberInput,
  Title,
  Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "@mantine/dates";
import { useGetSupervisorOptionsQuery } from "../../../../features/api/employeeSlice";
import { Executive, Supervisor } from "../../../../features/types/employee";
import PriorityItem from "../../../../components/ui/TaskPriorityItems";
import {
  useCreateTaskMutation,
  useGetTaskDetailQuery,
} from "../../../../features/api/taskSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse } from "react-router-dom";
import { useTaskDrawer } from "../../../../features/task/context/useTaskDrawer";
import { TaskEmployee } from "../../../../features/types/task";

// Zod validation schema
const taskSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    reporter_id: z.string().min(1, "Reporter is required"),
    assignee: z.array(z.string()).min(1, "At least one assignee is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    start_date: z.string().datetime(),
    due_date: z.string().datetime(),
    tags: z.array(z.string()),
    estimated_time: z.number().min(0, "Time must be positive"),
    actual_time_spent: z.number().min(0).optional(),
  })
  .refine((data) => new Date(data.due_date) > new Date(data.start_date), {
    message: "Due date must be after start date",
    path: ["due_date"],
  });

type TaskFormValues = z.infer<typeof taskSchema>;

const TaskFormDrawer = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const { close } = useTaskDrawer();
  const [isEdit] = useState(false);
  const [executivesOption, setExecutivesOption] = useState<
    Supervisor["executives"]
  >([]);
  const { data, isLoading, error } = useGetSupervisorOptionsQuery();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();

  const { taskId } = useTaskDrawer();
  const { data: detail, isLoading: isDetailLoading } = useGetTaskDetailQuery(
    taskId ? { uid: taskId } : skipToken,
    {
      skip: !opened || !taskId,
    }
  );

  const taskDetail = detail?.data;

  const supervisorOptions = (data?.data || []).map((sup: Supervisor) => ({
    value: sup.employee_id,
    label: sup.name,
  }));

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      assignee: [],
      reporter_id: "",
      priority: "",
      status: "",
      start_date: new Date().toISOString(),
      due_date: new Date().toISOString(),
      tags: [],
      estimated_time: 0,
      actual_time_spent: 0,
    },
  });

  useEffect(() => {
    if (taskDetail) {
      reset({
        name: taskDetail.name || "",
        description: taskDetail.description || "",
        assignee:
          taskDetail.assignees.map((a: TaskEmployee) => a.employee_id) ?? [],
        reporter_id: taskDetail?.reporter?.employee_id || "",
        priority: taskDetail.priority || "",
        status: taskDetail.status || "",
        start_date: taskDetail.start_date || new Date().toISOString(),
        due_date: taskDetail.due_date || new Date().toISOString(),
        tags: taskDetail.tags || [],
        estimated_time: taskDetail.estimated_time || 0,
        actual_time_spent: taskDetail.actual_time_spent || 0,
      });
    }
  }, [taskDetail, reset]);

  const reporterId = watch("reporter_id");
  console.log(reporterId, taskDetail?.reporter?.employee_id);

  useEffect(() => {
    if (reporterId && data?.data) {
      const selected = data?.data.find((s) => s.employee_id === reporterId);
      setExecutivesOption(selected?.executives || []);
      setValue("assignee", []);
    } else {
      setExecutivesOption([]);
      setValue("assignee", []);
    }
  }, [reporterId, data]);

  const onSubmit = async (values: TaskFormValues) => {
    console.log(values);
    try {
      const payload = {
        ...values,
        actual_time_spent: values.actual_time_spent ?? 0,
        comments: [],
        attachments: [],
        dependencies: [],
      };
      const response = await createTask(payload).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response?.message || "Task created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      reset();
      close();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail[0]?.msg ||
          "An unknown error occurred",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="xl"
      overlayProps={{ blur: 4 }}
      withCloseButton={false}
    >
      <div className="px-10">
        <Title order={3} fw={400} c="blue" ta="center" my={20}>
          Add Task
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              label="Task Name"
              placeholder="Enter task name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Textarea
              label="Description"
              placeholder="Task description"
              minRows={4}
              {...register("description")}
              error={errors.description?.message}
            />

            <Controller
              name="reporter_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Reporter"
                  placeholder="Select reporter"
                  data={supervisorOptions}
                  searchable
                  nothingFoundMessage={
                    error ? "Failed to load reporters" : "No reporters found"
                  }
                  rightSection={isLoading ? <Loader size="xs" /> : null}
                  disabled={isLoading || !!error}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.reporter_id?.message}
                />
              )}
            />

            <Controller
              name="assignee"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Assignees"
                  placeholder="Select assignees"
                  data={executivesOption.map((ex: Executive) => ({
                    value: ex.employee_id,
                    label: `${ex.name} (${ex.employee_id})`,
                  }))}
                  searchable
                  disabled={!reporterId}
                  nothingFoundMessage="Select a reporter first"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.assignee?.message}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Priority"
                    placeholder="Select priority"
                    data={[
                      { value: "high", label: "High" },
                      { value: "medium", label: "Medium" },
                      { value: "low", label: "Low" },
                    ]}
                    renderOption={PriorityItem}
                    {...field}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Status"
                    placeholder="Select status"
                    data={[
                      { value: "pending", label: "Pending" },
                      { value: "in-progress", label: "In Progress" },
                      { value: "completed", label: "Completed" },
                      { value: "backlog", label: "Backlog" },
                      { value: "hold", label: "On Hold" },
                    ]}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DateInput
                    label="Start Date"
                    valueFormat="DD MMM YYYY"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DateInput
                    label="Due Date"
                    valueFormat="DD MMM YYYY"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
            </div>

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Tags"
                  placeholder="Select tags"
                  data={[]}
                  searchable
                  {...field}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="estimated_time"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Estimated Time (hours)"
                    {...field}
                    onChange={(value) =>
                      field.onChange(typeof value === "number" ? value : 0)
                    }
                  />
                )}
              />

              <Controller
                name="actual_time_spent"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Actual Time Spent (hours)"
                    {...field}
                    onChange={(value) =>
                      field.onChange(typeof value === "number" ? value : 0)
                    }
                  />
                )}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={creating || isDetailLoading}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default TaskFormDrawer;
