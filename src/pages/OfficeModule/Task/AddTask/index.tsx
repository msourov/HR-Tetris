import { z } from "zod";
import { useDisclosure } from "@mantine/hooks";
import {
  Drawer,
  Button,
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  NumberInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "@mantine/dates";
import { useGetSupervisorOptionsQuery } from "../../../../features/api/employeeSlice";
import { Executive, Supervisor } from "../../../../features/types/employee";
import PriorityItem from "../../../../components/ui/TaskPriorityItems";

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

const TaskFormDrawer = () => {
  const { data, isLoading, error } = useGetSupervisorOptionsQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [isEdit, setIsEdit] = useState(false);
  const [executivesOption, setExecutivesOption] = useState<
    Supervisor["executives"]
  >([]);

  const supervisorOptions = (data?.data || []).map((sup: Supervisor) => ({
    value: sup.uid,
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

  const reporterId = watch("reporter_id");

  useEffect(() => {
    if (reporterId && data?.data) {
      const selected = data?.data.find((s) => s.uid === reporterId);
      setExecutivesOption(selected?.executives || []);
      setValue("assignee", []);
    }
  }, [reporterId]);

  const onSubmit = (values: TaskFormValues) => {
    console.log(values);
    close();
    reset();
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
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
                    nothingFoundMessage="No reporters found"
                    {...field}
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
                      value: ex.uid,
                      label: `${ex.name} (${ex.employee_id})`,
                    }))}
                    searchable
                    disabled={!reporterId}
                    nothingFoundMessage="Select a reporter first"
                    {...field}
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
                        { value: "todo", label: "To Do" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "done", label: "Done" },
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
              <Button type="submit" color="blue">
                {isEdit ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      <Button onClick={open} color="blue">
        Add Task
      </Button>
    </>
  );
};

export default TaskFormDrawer;
