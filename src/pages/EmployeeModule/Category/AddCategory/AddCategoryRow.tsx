import { useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Select, TextInput, Group } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useCreateCategoryMutation } from "../../../../features/api/categorySlice";

// Zod schema for category creation
const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  values: z
    .string()
    .min(1, "Values is required")
    .max(255, "Values must be at most 255 characters"),
  model_type: z.enum([
    "designation",
    "holidays",
    "announcements",
    "consumables",
    "tangibles",
    "home-office",
    "certifications",
    "attendance",
    "tickets",
    "leave",
    "overtime",
    "employee",
    "shifts",
    "policy",
    "department",
    "recruitment",
  ]),
});

type AddCategoryRequest = z.infer<typeof schema>;

const AddCategoryRow: React.FC = () => {
  const [createCategory, { isLoading, error: createError }] =
    useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddCategoryRequest>({
    resolver: zodResolver(schema),
  });

  const modelTypes = useMemo(
    () => [
      { value: "designation", label: "Designation" },
      { value: "holidays", label: "Holidays" },
      { value: "announcements", label: "Announcements" },
      { value: "consumables", label: "Consumables" },
      { value: "tangibles", label: "Tangibles" },
      { value: "home-office", label: "Home Office" },
      { value: "certifications", label: "Certifications" },
      { value: "attendance", label: "Attendance" },
      { value: "tickets", label: "Tickets" },
      { value: "leave", label: "Leave" },
      { value: "overtime", label: "Overtime" },
      { value: "employee", label: "Employee" },
      { value: "shifts", label: "Shifts" },
      { value: "policy", label: "Policy" },
      { value: "department", label: "Department" },
      { value: "recruitment", label: "Recruitment" },
    ],
    []
  );

  const onSubmit: SubmitHandler<AddCategoryRequest> = async (data) => {
    try {
      const response = await createCategory(data).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Category created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      reset();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          (error as { data?: { detail?: string } })?.data?.detail ||
          "Failed to create category",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-4 p-2"
    >
      <TextInput
        placeholder="Name"
        withAsterisk
        {...register("name")}
        error={errors.name?.message}
        style={{ flex: 1 }}
      />
      <TextInput
        placeholder="Values"
        withAsterisk
        {...register("values")}
        error={errors.values?.message}
        style={{ flex: 1 }}
      />
      <Controller
        name="model_type"
        control={control}
        render={({ field }) => (
          <Select
            placeholder="Model Type"
            withAsterisk
            data={modelTypes}
            value={field.value}
            onChange={field.onChange}
            error={errors.model_type?.message}
            style={{ flex: 1 }}
          />
        )}
      />
      <Group>
        <Button
          type="submit"
          size="xs"
          loading={isLoading}
          disabled={isLoading}
        >
          Create
        </Button>
      </Group>
      {createError && (
        <div className="text-red-500 text-xs">Error creating category</div>
      )}
    </form>
  );
};

export default AddCategoryRow;
