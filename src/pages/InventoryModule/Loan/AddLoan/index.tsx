import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Loader,
  Paper,
  TextInput,
  Group,
  NumberInput,
  Select,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useCreateLoanMutation } from "../../../../features/api/loanSlice";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";
import { IoPersonCircle } from "react-icons/io5";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  employee_id: z.string().min(1, "Employee ID is required"),
  descriptions: z.string().default(""),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(1, "Price must be at least 1"),
  guarantor_id: z.string().min(1, "Guarantor ID is required"),
  category: z.string().min(1, "Category is required"),
});

type LoanRequest = z.infer<typeof schema>;

interface CreateLoanProps {
  closeModal: () => void;
}

const CreateLoan = ({ closeModal }: CreateLoanProps) => {
  const [createLoan, { isLoading, error: createError }] =
    useCreateLoanMutation();
  const { data: employees } = useGetEmployeeHelperQuery();

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoanRequest>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<LoanRequest> = async (data) => {
    try {
      const response = await createLoan(data).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Loan created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          (error as { data?: { detail?: string } })?.data?.detail ||
          "Failed to create loan",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (createError) {
    return <ErrorAlert message="Failed to create loan" />;
  }

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Name"
          placeholder="Enter loan name"
          withAsterisk
          {...register("name")}
          error={errors.name?.message}
        />
        <Controller
          name="employee_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Employee ID"
              placeholder="Select an employee"
              leftSection={<IoPersonCircle />}
              data={employeeOptions}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={errors.employee_id?.message as React.ReactNode}
              searchable
              required
              className="mb-2"
            />
          )}
        />
        <TextInput
          label="Description"
          placeholder="Enter description"
          {...register("descriptions")}
          error={errors.descriptions?.message}
        />
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Quantity"
              placeholder="Enter quantity"
              withAsterisk
              {...field}
              error={errors.quantity?.message}
            />
          )}
        />
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Price"
              placeholder="Enter price"
              withAsterisk
              {...field}
              error={errors.price?.message}
            />
          )}
        />
        <Controller
          name="guarantor_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Guarantor ID"
              placeholder="Select a guarantor"
              leftSection={<IoPersonCircle />}
              data={employeeOptions}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={errors.guarantor_id?.message as React.ReactNode}
              searchable
              required
              className="mb-2"
            />
          )}
        />

        <TextInput
          label="Category"
          placeholder="Enter category"
          withAsterisk
          {...register("category")}
          error={errors.category?.message}
        />
        <Group justify="right" mt="md">
          <Button type="submit">Create Loan</Button>
        </Group>
      </form>
    </Paper>
  );
};

export default CreateLoan;
