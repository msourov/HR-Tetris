import { useEffect } from "react";
import {
  Button,
  Loader,
  NumberInput,
  Textarea,
  TextInput,
  Select, // Import Select here
} from "@mantine/core";
import { z } from "zod";
import {
  useGetLoanDetailsQuery,
  useUpdateLoanMutation,
} from "../../../../features/api/loanSlice";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse } from "react-router-dom";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  descriptions: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  guarantor_id: z.string().min(1, "Guarantor ID is required"),
  category: z.string().min(1, "Category is required"),
});

type EditLoanRequest = z.infer<typeof schema>;

interface EditLoanProps {
  uid: string;
  closeEdit: () => void;
}

const EditLoan = ({ uid, closeEdit }: EditLoanProps) => {
  const { data: loanDetail, isLoading } = useGetLoanDetailsQuery({ uid });
  const { data: employees, isLoading: employeesLoading } =
    useGetEmployeeHelperQuery();
  const [updateLoan, { isLoading: updateLoading }] = useUpdateLoanMutation();

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
    reset,
    formState: { errors },
  } = useForm<EditLoanRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      descriptions: "",
      price: 0,
      quantity: 0,
      guarantor_id: "",
      category: "",
    },
  });

  useEffect(() => {
    if (loanDetail?.data) {
      reset({
        name: loanDetail.data.name,
        descriptions: loanDetail.data.descriptions,
        price: loanDetail.data.price,
        quantity: loanDetail.data.quantity,
        guarantor_id: loanDetail.data.guarantor_id,
        category: loanDetail.data.category,
      });
    }
  }, [loanDetail, reset]);

  const onSubmit: SubmitHandler<EditLoanRequest> = async (data) => {
    try {
      const response = await updateLoan({
        uid,
        ...data,
        active: true,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Loan updated successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });

      closeEdit();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse).data?.detail || "Failed to update loan",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  if (isLoading || employeesLoading) {
    return <Loader type="dots" />;
  }

  return (
    <div className="px-4 py-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          variant="filled"
          label="Name"
          required
          {...register("name")}
          error={errors.name?.message}
        />

        <Textarea
          variant="filled"
          label="Description"
          autosize
          minRows={3}
          {...register("descriptions")}
          error={errors.descriptions?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                variant="filled"
                label="Price"
                required
                min={0}
                value={field.value || 0}
                onChange={(value) => field.onChange(value || 0)}
                error={errors.price?.message}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                variant="filled"
                label="Quantity"
                required
                min={0}
                value={field.value || 0}
                onChange={(value) => field.onChange(value || 0)}
                error={errors.quantity?.message}
              />
            )}
          />
        </div>

        {/* Guarantor select */}
        <Controller
          name="guarantor_id"
          control={control}
          render={({ field }) => (
            <Select
              variant="filled"
              label="Guarantor ID"
              placeholder="Select Guarantor"
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.guarantor_id?.message}
              data={employeeOptions?.map((employee) => ({
                value: employee.value,
                label: employee.label,
              }))}
            />
          )}
        />

        <TextInput
          variant="filled"
          label="Category"
          required
          {...register("category")}
          error={errors.category?.message}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={closeEdit}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateLoading}
            loading={updateLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLoan;
