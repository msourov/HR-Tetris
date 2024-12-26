import { Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FormData } from "./EmployeeForm";

interface Tab1FieldsProps {
  watch: UseFormWatch<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors | undefined;
}

const Tab1Fields: React.FC<Tab1FieldsProps> = ({
  watch,
  register,
  setValue,
  errors,
}) => {
  return (
    <>
      <TextInput
        variant="filled"
        label="Name"
        placeholder="John Doe"
        autoComplete="no"
        required
        {...register("name")}
        error={errors && (errors.name?.message as string)}
      />
      <TextInput
        variant="filled"
        label="Phone Number"
        placeholder="0123-456-7890"
        autoComplete="no"
        required
        radius="md"
        {...register("phone")}
        error={errors && (errors.phone?.message as string)}
      />
      <TextInput
        variant="filled"
        label="Email"
        placeholder="johndoe@gmail.com"
        autoComplete="no"
        required
        radius="md"
        {...register("email")}
        error={errors && (errors.email?.message as string)}
      />
      <TextInput
        variant="filled"
        label="Password"
        placeholder="******"
        type="password"
        {...register("password")}
        error={errors && (errors.password?.message as string)}
      />
      <DatePickerInput
        variant="filled"
        label="Date of birth"
        placeholder="Pick date"
        {...register("bod")}
        value={watch("bod")}
        onChange={(value) => setValue("bod", value)}
        error={errors && (errors.password?.message as string)}
      />
      <TextInput
        variant="filled"
        label="Employee ID"
        placeholder="EMP12345"
        {...register("employee_id")}
        error={errors && (errors.employee_id?.message as string)}
      />
      <Select
        variant="filled"
        label="Select marital status"
        placeholder="Single / Married"
        data={["Married", "Single"]}
        {...register("marital_status")}
        value={watch("marital_status")}
        onChange={(value) =>
          setValue("marital_status", value as "Married" | "Single")
        }
        error={errors && (errors.marital_status?.message as string)}
      />
    </>
  );
};

export default Tab1Fields;
