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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
// import { notifications } from "@mantine/notifications";
// import { IconCheck, IconX } from "@tabler/icons-react";
// import { useNavigate } from "react-router-dom";
import { useDepartmentHelperQuery } from "../../../features/api/departmentSlice";
import { useDesignationHelperQuery } from "../../../features/api/designationSlice";
import { useMemo } from "react";
import { useShiftHelperQuery } from "../../../features/api/shiftSlice";

type Permissions = {
  label: string;
  name: string;
  checked: boolean;
  key: string;
};
type CreateRoleData = {
  name: string;
  mobile: string;
  email: string;
  password: string;
  joining_date: Date;
  employee_id: string;
  marital_status: string | null;
  bod: Date | null;
  salary: number;
  department: string;
  designation: string;
  shift: string;
  permissions: Permissions[];
};

type EmployeeFormProps = {
  tab: string;
  handleTab: (operation: string) => void;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z
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
  // shift: z.string().min(1, "Shift and schedule is required").optional(),
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
  // const navigate = useNavigate();

  const { data: departments } = useDepartmentHelperQuery();
  const { data: designations } = useDesignationHelperQuery();
  const { data: shifts } = useShiftHelperQuery();

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
      name: "",
      mobile: "",
      email: "",
      password: "",
      joining_date: new Date(),
      employee_id: "",
      marital_status: "Single",
      bod: new Date(),
      salary: 0,
      department: "",
      designation: "",
      permissions: initialValues,
    },
  });

  const marital_status = watch("marital_status");
  const bod = watch("bod");
  const department = watch("department");
  const designation = watch("designation");
  const joining_date = watch("joining_date");
  // const shift = watch("shift");

  const prepareRoleData = (
    permissions: Permissions[]
  ): { [key: string]: string } => {
    return permissions.reduce((acc, item) => {
      acc[item.name] = item.checked ? "a" : "i";
      return acc;
    }, {} as { [key: string]: string });
  };

  const onSubmit = async (data) => {
    console.log(data);
    const preparedData = prepareRoleData(data.permissions);
    // const createData: CreateRoleRequest = {
    //   name: data.name,
    //   active: data.status,
    //   ...(preparedData as {
    //     app_user_management: "a" | "i";
    //     employee_management: "a" | "i";
    //     user_management: "a" | "i";
    //     office_management: "a" | "i";
    //     clm_management: "a" | "i";
    //     ticket_management: "a" | "i";
    //     inventory_management: "a" | "i";
    //     anouncement_management: "a" | "i";
    //     recruitment_management: "a" | "i";
    //   }),
    // };
    // console.log("createData", JSON.stringify(createData, undefined, 2));
    // try {
    //   const response = await createRole(createData).unwrap();
    //   notifications.show({
    //     title: "Success!",
    //     message: "Role Created Successfully",
    //     icon: <IconCheck />,
    //     color: "green",
    //     autoClose: 3000,
    //   });
    //   console.log(response);
    //   navigate(-1);
    // } catch (error) {
    //   console.error("Failed to create role", error);
    //   notifications.show({
    //     title: "Error!",
    //     message: "Couldn't create role",
    //     icon: <IconX />,
    //     color: "red",
    //     autoClose: 3000,
    //   });
    // }
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    console.log(index, checked);
    handlers.setItemProp(index, "checked", checked);
    const updatedPermissions = getValues("permissions").map((permission, i) =>
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
                  error={errors.name?.message}
                />
                <TextInput
                  variant="filled"
                  label="Phone Number"
                  placeholder="0123-456-7890"
                  autoComplete="no"
                  required
                  radius="md"
                  {...register("mobile")}
                  error={errors.mobile?.message}
                />
                <TextInput
                  variant="filled"
                  label="Email"
                  placeholder="johndoe@gmail.com"
                  autoComplete="no"
                  required
                  radius="md"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <TextInput
                  variant="filled"
                  label="Password"
                  placeholder="******"
                  type="password"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <DatePickerInput
                  variant="filled"
                  label="Date of birth"
                  placeholder="Pick date"
                  value={bod || new Date()}
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
                  error={errors.employee_id?.message}
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
                  error={errors.marital_status?.message}
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
                  value={department}
                  onChange={(value) => {
                    if (value) setValue("department", value);
                  }}
                  error={errors.department ? errors.department.message : null}
                />
                <Select
                  variant="filled"
                  label="Select Designation"
                  data={designationOptions}
                  value={designation}
                  onChange={(value) => {
                    if (value) setValue("designation", value);
                  }}
                  error={errors.designation ? errors.designation.message : null}
                />
                {/* <Select
                  variant="filled"
                  label="Select Shift"
                  data={shiftOptions}
                  value={shift}
                  onChange={(value) => {
                    if (value) setValue("shift", value);
                  }}
                  error={errors.shift ? errors.shift.message : null}
                /> */}
                <NumberInput
                  variant="filled"
                  label="Salary"
                  placeholder="Enter salary"
                  value={watch("salary")}
                  onChange={(value) => setValue("salary", Number(value) || 0)}
                  error={errors.salary ? errors.salary.message : null}
                  min={0}
                />
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

          <Box className="p-4 right-0 max-w-[100%] bg-white fixed bottom-0 sm:mb-[15%] lg:mb-[8%] flex justify-between gap-4 mr-10">
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
              onClick={() => {
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
