import { Box, NumberInput, Select, Switch } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormData } from "./EmployeeForm";

interface Tab2FieldsProps {
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors | undefined;
  departmentOptions: { label: string; value: string }[];
  designationOptions: { label: string; value: string }[];
  shiftOptions: { label: string; value: string }[];
  employeeOptions: { label: string; value: string }[];
}

const Tab2Fields: React.FC<Tab2FieldsProps> = ({
  watch,
  setValue,
  errors,
  departmentOptions,
  designationOptions,
  shiftOptions,
  employeeOptions,
}) => {
  return (
    <>
      <DatePickerInput
        variant="filled"
        label="Joining date"
        placeholder="pick date"
        value={watch("joining_date") || new Date()}
        onChange={(value) => {
          if (value) setValue("joining_date", value);
        }}
        error={
          errors?.joining_date
            ? (errors?.joining_date?.message as string)
            : null
        }
      />
      <Select
        variant="filled"
        label="Select department"
        data={departmentOptions}
        value={watch("department")}
        onChange={(value) => {
          if (value) setValue("department", value);
        }}
        error={
          errors?.department ? (errors.department.message as string) : null
        }
      />
      <Select
        variant="filled"
        label="Select Designation"
        data={designationOptions}
        value={watch("designation")}
        onChange={(value) => {
          if (value) setValue("designation", value);
        }}
        error={
          errors?.designation ? (errors.designation.message as string) : null
        }
      />
      <Select
        variant="filled"
        label="Select Shift"
        data={shiftOptions}
        value={watch("shift_and_schedule")}
        onChange={(value) => {
          if (value) setValue("shift_and_schedule", value);
        }}
        error={
          errors?.shift_and_schedule
            ? (errors.shift_and_schedule.message as string)
            : null
        }
      />
      <NumberInput
        variant="filled"
        label="Salary"
        placeholder="Enter salary"
        value={watch("salary")}
        onChange={(value) => setValue("salary", Number(value) || 0)}
        error={errors?.salary ? (errors.salary.message as string) : null}
        min={0}
      />
      <Box className="py-8 flex flex-col gap-4">
        <Switch
          label="Supervisor"
          required
          checked={watch("supervisor")}
          onChange={(event) =>
            setValue("supervisor", event.currentTarget.checked)
          }
          error={errors?.supervisor?.message as string}
        />
      </Box>
      {watch("supervisor") && (
        <Select
          className="-my-5"
          variant="filled"
          label="Select Executives"
          data={employeeOptions}
          value={watch("executives")}
          onChange={(value) => {
            if (value) setValue("executives", value);
          }}
          error={
            errors?.executives ? (errors.executives.message as string) : null
          }
        />
      )}
    </>
  );
};

export default Tab2Fields;
