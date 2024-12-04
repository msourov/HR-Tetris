import { zodResolver } from "@hookform/resolvers/zod";
import {
  Paper,
  Button,
  Checkbox,
  Text,
  Box,
  SimpleGrid,
  Divider,
  Select,
  TextInput,
  NumberInput,
  Switch,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDepartmentHelperQuery } from "../../../features/api/departmentSlice";
import { useDesignationHelperQuery } from "../../../features/api/designationSlice";
import { useShiftHelperQuery } from "../../../features/api/shiftSlice";
import { useMemo } from "react";
import {
  useCreateEmployeeMutation,
  useGetEmplyeeHelperQuery,
} from "../../../features/api/employeeSlice";
import { CreateEmployeePayload } from "../../../features/api/types";

type Permissions = {
  label: string;
  name: string;
  checked: boolean;
  key: string;
};
type CreateEmployeeProps = {
  name: string;
  phone: string;
  email: string;
  password: string;
  joining_date: Date;
  employee_id: string;
  marital_status: string | null;
  bod: Date | null;
  salary: number;
  department: string;
  designation: string;
  shift_and_schedule: string;
  supervisor: boolean;
  executives: string;
  permissions?: Permissions[];
};

type EmployeeFormProps = {
  tab: string;
  handleTab: (operation: string) => void;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  email: z.string().email("Invalid email address"),
  bod: z.date().nullable(),
  marital_status: z.enum(["Married", "Single"]),
  salary: z.number().min(0, "Salary must be a positive number"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  joining_date: z.date(),
  employee_id: z
    .string()
    .min(6, "Employee ID must be at least 6 characters long"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  shift_and_schedule: z.string().min(1, "Shift and schedule is required"),
  supervisor: z.boolean(),
  executives: z.string(),
  permissions: z.array(
    z.object({
      label: z.string(),
      name: z.string(),
      checked: z.boolean(),
      key: z.string(),
    })
  ),
});

export type FormData = z.infer<typeof schema>;

const initialValues = [
  {
    label: "Attendance",
    name: "attendance_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Overtime",
    name: "overtime_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Home Office",
    name: "home_office_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Accounts",
    name: "accounts_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Leave",
    name: "leave_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Announcement",
    name: "announcement_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Certification",
    name: "certification_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Loan Equipments",
    name: "loan_equipment_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Reports",
    name: "reports_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Ticket",
    name: "ticket_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Recruitment",
    name: "recruitment_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Employee Admin",
    name: "employee_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Overtime Approval",
    name: "overtime_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Home Office Approval",
    name: "home_office_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Accounts Admin",
    name: "accounts_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Leave Approval",
    name: "leave_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Announcement Approval",
    name: "announcement_approve_management",
    checked: false,
    key: randomId(),
  },

  {
    label: "Certification Approval",
    name: "certification_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Loan Equipments Approval",
    name: "loan_equipment_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Reports",
    name: "reports_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Ticket Admin",
    name: "ticket_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Consumable",
    name: "consumable_management",
    checked: true,
    key: randomId(),
  },
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ tab, handleTab }) => {
  const [values, handlers] = useListState(initialValues);
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const navigate = useNavigate();
  const { data: departments } = useDepartmentHelperQuery();
  const { data: designations } = useDesignationHelperQuery();
  const { data: shifts } = useShiftHelperQuery();
  const { data: employees } = useGetEmplyeeHelperQuery();

  const departmentOptions = useMemo(
    () =>
      departments?.data.map((item) => ({
        label: item.name,
        value: item.uid,
      })),
    [departments]
  );

  const designationOptions = useMemo(
    () =>
      designations?.data.map((item) => ({
        label: item.name,
        value: item.uid,
      })),
    [designations]
  );

  const shiftOptions = useMemo(
    () =>
      shifts?.data.map((item) => ({
        label: item?.name,
        value: item?.uid,
      })),
    [shifts]
  );

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.uid,
      }))
    : [];

  const draftValues = JSON.parse(
    sessionStorage.getItem("employeeDraftForm") || "{}"
  );

  const parseDate = (value: string) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: draftValues?.name || "",
      phone: draftValues?.phone || "",
      email: draftValues?.email || "",
      password: draftValues?.password || "",
      joining_date: draftValues?.joining_date
        ? parseDate(draftValues?.joining_date)
        : new Date(),
      employee_id: draftValues?.employee_id || "",
      marital_status: draftValues?.marital_status || "Single",
      bod: draftValues?.bod ? parseDate(draftValues?.bod) : null,
      salary: draftValues?.salary || 0,
      department: draftValues?.department || "",
      designation: draftValues?.designation || "",
      shift_and_schedule: draftValues?.shift_and_schedule || "",
      supervisor: draftValues?.supervisor || false,
      executives: draftValues?.executives || [],
      permissions: draftValues?.permissions || initialValues,
    },
  });

  const marital_status = watch("marital_status");
  const bod = watch("bod");
  const joining_date = watch("joining_date");

  const saveDraft = () => {
    const formValues = watch();
    sessionStorage.setItem("employeeDraftForm", JSON.stringify(formValues));
  };

  const prepareRoleData = (
    permissions: Permissions[]
  ): { [key: string]: string } => {
    return permissions.reduce((acc, item) => {
      acc[item.name] = item.checked ? "a" : "i";
      return acc;
    }, {} as { [key: string]: string });
  };

  const onSubmit = async (data: CreateEmployeeProps) => {
    const preparedData = data.permissions
      ? prepareRoleData(data.permissions)
      : {};

    const formattedData = {
      ...data,
      active: true,
      is_probation: true,
      company: "112233445566778899",
      bod: data.bod?.toISOString(),
      joining_date: data.joining_date?.toISOString(),
      executives: data?.supervisor ? data?.executives : [],
    };
    const payload = { ...formattedData, ...preparedData };
    delete payload.permissions;
    try {
      const response = await createEmployee(
        payload as CreateEmployeePayload
      ).unwrap();
      sessionStorage.removeItem("employeeDraftForm");
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.message || "Employee Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      navigate(-1);
    } catch (error) {
      console.error("Failed to create employee", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't create employee",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    handlers.setItemProp(index, "checked", checked);
    const updatedPermissions = getValues("permissions").map(
      (permission: Permissions, i: number) =>
        i === index ? { ...permission, checked } : permission
    );
    setValue("permissions", updatedPermissions);
  };
  const items = values.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      name={value.name}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        handleCheckboxChange(index, event.currentTarget.checked)
      }
    />
  ));
  const getTabName = (tab: number) => {
    const tabs = ["Personal Information", "Work Information", "Authority"];
    return tabs[tab - 1];
  };

  return (
    <Paper radius="md" px="lg" className="mx-auto flex flex-col">
      <Box className="flex-1 flex flex-col">
        <Text
          component="h1"
          size="xl"
          className="drop-shadow-2xl font-bold mb-4"
        >
          {getTabName(parseInt(tab))}
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid cols={2} spacing="xl" verticalSpacing="xs">
            {tab === "1" && (
              <>
                <TextInput
                  variant="filled"
                  label="Name"
                  placeholder="John Doe"
                  autoComplete="no"
                  required
                  {...register("name")}
                  error={errors.name?.message as string}
                />
                <TextInput
                  variant="filled"
                  label="Phone Number"
                  placeholder="0123-456-7890"
                  autoComplete="no"
                  required
                  radius="md"
                  {...register("phone")}
                  error={errors.phone?.message as string}
                />
                <TextInput
                  variant="filled"
                  label="Email"
                  placeholder="johndoe@gmail.com"
                  autoComplete="no"
                  required
                  radius="md"
                  {...register("email")}
                  error={errors.email?.message as string}
                />
                <TextInput
                  variant="filled"
                  label="Password"
                  placeholder="******"
                  type="password"
                  {...register("password")}
                  error={errors.password?.message as string}
                />
                <DatePickerInput
                  variant="filled"
                  label="Date of birth"
                  placeholder="Pick date"
                  value={bod}
                  onChange={(value) => {
                    if (value) setValue("bod", value);
                  }}
                  error={errors.bod?.message}
                />
                <TextInput
                  variant="filled"
                  label="Employee ID"
                  placeholder="EMP12345"
                  {...register("employee_id")}
                  error={errors.employee_id?.message as string}
                />
                <Select
                  variant="filled"
                  label="Select marital status"
                  placeholder="Single / Married"
                  data={["Married", "Single"]}
                  value={marital_status}
                  onChange={(value) =>
                    setValue("marital_status", value as "Married" | "Single")
                  }
                  error={errors.marital_status?.message as string}
                />
              </>
            )}

            {tab === "2" && (
              <>
                <DatePickerInput
                  variant="filled"
                  label="Joining date"
                  placeholder="pick date"
                  value={joining_date || new Date()}
                  onChange={(value) => {
                    if (value) setValue("joining_date", value);
                  }}
                  error={errors.joining_date?.message}
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
                    errors.department
                      ? (errors.department.message as string)
                      : null
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
                    errors.designation
                      ? (errors.designation.message as string)
                      : null
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
                    errors.shift_and_schedule
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
                  error={
                    errors.salary ? (errors.salary.message as string) : null
                  }
                  min={0}
                />
                <Box className="py-8 flex flex-col gap-4">
                  <Switch
                    label="Supervisor"
                    required
                    checked={watch("supervisor")} // Use `checked` instead of `value`
                    onChange={(event) =>
                      setValue("supervisor", event.currentTarget.checked)
                    } // Update the value properly
                    error={errors.supervisor?.message as string} // Correct the error key
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
                      errors.executives
                        ? (errors.executives.message as string)
                        : null
                    }
                  />
                )}
              </>
            )}
          </SimpleGrid>
          {tab === "3" && (
            <>
              <Text c="dimmed">Assign Access</Text>
              <Divider w={"50%"} mx={"auto"} mb={"1rem"} />
              <SimpleGrid cols={2} spacing="xs">
                {items}
              </SimpleGrid>
            </>
          )}

          <Box className="p-4 w-full bg-white flex justify-end gap-4 mt-6">
            <Button
              bg="blue"
              className="rounded-lg"
              disabled={tab === "1"}
              onClick={() => (tab !== "1" ? handleTab("decrease") : null)}
            >
              Previous
            </Button>
            <Button
              className="rounded-lg"
              bg="orange"
              disabled={isLoading}
              onClick={() => {
                saveDraft();
                if (tab === "3") {
                  handleSubmit(onSubmit)();
                } else {
                  handleTab("increase");
                }
              }}
            >
              {`${tab === "3" ? "Create" : "Next"}`}
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;
