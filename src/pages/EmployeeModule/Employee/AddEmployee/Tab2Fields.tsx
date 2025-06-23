import { Box, MultiSelect, NumberInput, Select, Switch } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormData } from "../EmployeeForm";

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
  console.log("executives", JSON.stringify(watch("executives"), undefined, 2));
  console.log("employeeOptions", JSON.stringify(employeeOptions, undefined, 2));

  return (
    <>
      <DatePickerInput
        variant="filled"
        label="Joining date"
        placeholder="pick date"
        value={
          isNaN(new Date(watch("joining_date")).getTime())
            ? new Date()
            : new Date(watch("joining_date"))
        }
        onChange={(value) => {
          if (value) setValue("joining_date", value.toISOString());
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
          color="blue"
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
        <MultiSelect
          className="-my-5"
          variant="filled"
          label="Select Subordinates"
          data={employeeOptions}
          value={(watch("executives") ?? []).map((ex) => ex.value)}
          multiple
          searchable
          onChange={(value) => {
            if (value) {
              const selectedExecutives = value
                .map((val) => {
                  const found = employeeOptions.find(
                    (opt) => opt.value === val
                  );
                  return found
                    ? { value: found.value, label: found.label }
                    : undefined;
                })
                .filter(Boolean) as { value: string; label: string }[];
              setValue("executives", selectedExecutives);
            }
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
