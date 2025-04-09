import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useCreateHomeOfficeMutation } from "../../../../features/api/homeOfficeSlice";
import { DatePickerInput } from "@mantine/dates";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";
import { useNavigate } from "react-router-dom";

// Define the schema for form validation
const homeOfficeSchema = z
  .object({
    employee_id: z.string().min(1, "Employee ID is required"),
    purpose: z.string().min(1, "Purpose is required"),
    home_office_start_date: z.date({
      required_error: "Start date is required",
    }),
    home_office_end_date: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.home_office_end_date > data.home_office_start_date, {
    message: "End date must be later than start date",
    path: ["home_office_end_date"],
  });

const CreateHomeOffice = () => {
  const [createHomeOffice, { isLoading }] = useCreateHomeOfficeMutation();
  const { data: employees } = useGetEmployeeHelperQuery();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(homeOfficeSchema),
    defaultValues: {
      employee_id: "",
      purpose: "",
      home_office_start_date: new Date(),
      home_office_end_date: new Date(),
    },
  });

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  const onSubmit = async (data: {
    employee_id: string;
    purpose: string;
    home_office_start_date: Date;
    home_office_end_date: Date;
  }) => {
    try {
      const payload = {
        ...data,
        home_office_start_date: data.home_office_start_date.toISOString(),
        home_office_end_date: data.home_office_end_date.toISOString(),
      };
      const response = await createHomeOffice(payload).unwrap();
      notifications.show({
        title: "Success!",
        message:
          response.message || "Home Office Request Submitted Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      navigate(-1);
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message: "Failed to submit home office request. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg border my-10">
      <h1 className="text-xl font-semibold text-orange-400 mb-6 text-center">
        Apply for Home Office
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Employee ID */}
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

        {/* Purpose */}
        <Textarea
          variant="filled"
          label="Purpose"
          placeholder="Enter the purpose of your home office request"
          {...register("purpose")}
          error={errors.purpose?.message}
          required
        />

        {/* Start Date */}
        <DatePickerInput
          variant="filled"
          label="Start Date"
          value={watch("home_office_start_date")}
          onChange={(date) =>
            setValue("home_office_start_date", date || new Date(), {
              shouldValidate: true,
            })
          }
          error={errors.home_office_start_date?.message}
          required
        />

        {/* End Date */}
        <DatePickerInput
          variant="filled"
          label="End Date"
          value={watch("home_office_end_date")}
          onChange={(date) =>
            setValue("home_office_end_date", date || new Date(), {
              shouldValidate: true,
            })
          }
          error={errors.home_office_end_date?.message}
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="filled"
          color="blue"
          fullWidth
          loading={isLoading}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateHomeOffice;
