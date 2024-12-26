import { zodResolver } from "@hookform/resolvers/zod";
import {
  Paper,
  Button,
  Checkbox,
  Text,
  Box,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDepartmentHelperQuery } from "../../../features/api/departmentSlice";
import { useDesignationHelperQuery } from "../../../features/api/designationSlice";
import { useShiftHelperQuery } from "../../../features/api/shiftSlice";
import { useEffect, useMemo } from "react";
import {
  useCreateEmployeeMutation,
  useGetEmplyeeHelperQuery,
} from "../../../features/api/employeeSlice";
// import { CreateEmployeePayload } from "../../../features/api/typesOld";
import Tab1Fields from "./Tab1Fields";
import Tab2Fields from "./Tab2Fields";
import {
  Employee,
  UnifiedEmployeePayload,
} from "../../../features/types/employee";

export type Permissions = {
  label: string;
  name: string;
  checked: boolean;
  key: string;
};
export type CreateEmployeeProps = {
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
  executives: string[];
  permissions?: Permissions[];
};

type EmployeeFormProps = {
  tab: string;
  handleTab: (operation: string) => void;
  type: string;
  editFormData?: Employee;
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

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  tab,
  handleTab,
  type,
  editFormData,
}) => {
  const [values, handlers] = useListState(initialValues);
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const { data: departments } = useDepartmentHelperQuery();
  const { data: designations } = useDesignationHelperQuery();
  const { data: shifts } = useShiftHelperQuery();
  const { data: employees } = useGetEmplyeeHelperQuery();

  const navigate = useNavigate();

  useEffect(() => {}, []);

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

  const draftValues = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("employeeDraftForm") || "{}");
    } catch {
      return {};
    }
  }, []);

  // console.log(
  //   "draftValues, editFormData",
  //   JSON.stringify(draftValues, undefined, 2),
  //   JSON.stringify(editFormData, undefined, 2)
  // );

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

  const saveDraft = () => {
    const formValues = watch();
    console.log(formValues);
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
      executives: data?.supervisor
        ? typeof data?.executives === "string"
          ? [data?.executives]
          : data?.executives
        : [],
    };
    const payload = { ...formattedData, ...preparedData };
    delete payload.permissions;
    try {
      const response = await createEmployee(
        payload as UnifiedEmployeePayload
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
              <Tab1Fields
                watch={watch}
                register={register}
                setValue={setValue}
                errors={errors}
              />
            )}

            {tab === "2" && (
              <Tab2Fields
                watch={watch}
                setValue={setValue}
                errors={errors}
                departmentOptions={departmentOptions || []}
                designationOptions={designationOptions || []}
                shiftOptions={shiftOptions || []}
                employeeOptions={employeeOptions || []}
              />
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
