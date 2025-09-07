import { Button, Group, Select, TextInput } from "@mantine/core";
import { IconCurrencyTaka } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddPayrollMutation } from "../../../../features/api/payrollSlice";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";

const createSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  salary: z.number().min(1, "Salary must be greater than 0"),
});

type CreatePayroll = z.infer<typeof createSchema>;

type CreatePayrollProps = {
  closeModal: () => void;
};

const CreatePayroll = ({ closeModal }: CreatePayrollProps) => {
  const { data: employees } = useGetEmployeeHelperQuery();
  const [addPayroll, { isLoading: isAdding }] = useAddPayrollMutation();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePayroll>({
    resolver: zodResolver(createSchema),
  });
  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  const onSubmit = async (data: CreatePayroll) => {
    try {
      await addPayroll(data).unwrap();
      closeModal();
    } catch (error) {
      console.error("Failed to create payroll:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-6 space-y-2 px-4">
      <Select
        variant="filled"
        label="Employee"
        placeholder="Select an employee"
        data={employeeOptions}
        {...register("employee_id")}
        onChange={(value) => setValue("employee_id", value || "")}
        error={errors.employee_id?.message}
        required
      />
      <TextInput
        label="Salary"
        type="number"
        {...register("salary", { valueAsNumber: true })}
        error={errors.salary?.message}
        rightSection={<IconCurrencyTaka size={18} />}
      />
      <Group justify="end" mt="sm">
        <Button variant="default" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" loading={isAdding}>
          Create
        </Button>
      </Group>
    </form>
  );
};

export default CreatePayroll;
