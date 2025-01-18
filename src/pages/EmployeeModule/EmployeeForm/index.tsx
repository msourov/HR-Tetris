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
import { useForm, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  CreateEmployeeProps,
  EmployeeFormProps,
  Permissions,
} from "../AddEmployee/types";
import {
  useCreateEmployeeMutation,
  useEditEmployeeMutation,
  useGetEmployeeDetailQuery,
} from "../../../features/api/employeeSlice";
import useOptions from "../../../services/utils/getOptions";
import {
  EmployeeAccess,
  UnifiedEmployeePayload,
} from "../../../features/types/employee";
import Tab1Fields from "../AddEmployee/Tab1Fields";
import Tab2Fields from "../AddEmployee/Tab2Fields";

const getSchema = (type: string) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    email: z.string().email("Invalid email address"),
    bod: z.string(),
    marital_status: z.enum(["Married", "Single"]),
    salary: z.number().min(0, "Salary must be a positive number"),
    password:
      type === "add"
        ? z.string().min(6, "Password must be at least 6 characters long")
        : z.string().optional(),
    joining_date: z.string(),
    employee_id:
      type === "add"
        ? z.string().min(6, "Employee ID must be at least 6 characters long")
        : z.string().optional(),
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

export type FormData = {
  name: string;
  phone: string;
  email: string;
  bod: string;
  marital_status: "Married" | "Single";
  salary: number;
  joining_date: string;
  employee_id: string;
  department: string;
  designation: string;
  shift_and_schedule: string;
  supervisor: boolean;
  executives: string;
  permissions: {
    label: string;
    name: string;
    checked: boolean;
    key: string;
  }[];
  password: string;
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  tab,
  handleTab,
  type,
  initialPermissionValues,
}) => {
  const schema = getSchema(type);
  const { uid } = useParams();
  const [values, handlers] = useListState(initialPermissionValues);
  const [createEmployee, { isLoading: createLoading }] =
    useCreateEmployeeMutation();
  const [editEmployee, { isLoading: editLoading }] = useEditEmployeeMutation();
  const { data } = useGetEmployeeDetailQuery({ uid }, { skip: type === "add" });
  const {
    departmentOptions,
    designationOptions,
    shiftOptions,
    employeeOptions,
  } = useOptions();

  const editFormData = data?.data;

  const navigate = useNavigate();

  const draftKey =
    type === "add" ? "employeeAddDraftForm" : `employeeEditDraftForm_${uid}`;

  const draftValues = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(draftKey) || "{}");
    } catch {
      return {};
    }
  }, [draftKey]);

  const parseDate = (value: string) => {
    const date = new Date(value);
    return isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "add"
        ? {
            name: draftValues?.name || "",
            phone: draftValues?.phone || "",
            email: draftValues?.email || "",
            password: draftValues?.password,
            joining_date: draftValues?.joining_date
              ? parseDate(draftValues?.joining_date)
              : new Date().toISOString(),
            employee_id: draftValues?.employee_id || "",
            marital_status: draftValues?.marital_status || "Single",
            bod: draftValues?.bod ? draftValues.bod : new Date().toISOString(),
            salary: draftValues?.salary || 0,
            department: draftValues?.department || "",
            designation: draftValues?.designation || "",
            shift_and_schedule: draftValues?.shift_and_schedule || "",
            supervisor: draftValues?.supervisor || false,
            executives: draftValues?.executives || "",
            permissions: draftValues?.permissions || initialPermissionValues,
          }
        : undefined,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
    }
  }, [errors]);

  const transformPermissions = (permissionsData: EmployeeAccess) => {
    return Object.entries(permissionsData).map(([name, value]) => ({
      label: name
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()), // Capitalize each word
      name,
      checked: value === "a",
      key: randomId(),
    }));
  };

  useEffect(() => {
    if (editFormData)
      handlers.setState(transformPermissions(editFormData.employee_access));
  }, [editFormData]);

  useEffect(() => {
    if (type === "edit" && editFormData) {
      reset({
        name: editFormData?.personal?.name || "",
        phone: editFormData?.personal?.phone || "",
        email: editFormData?.personal?.email || "",
        bod: editFormData?.personal?.bod
          ? parseDate(editFormData.personal.bod)
          : new Date().toISOString(),
        marital_status: ["Married", "Single"].includes(
          editFormData?.personal?.marital_status
        )
          ? editFormData?.personal?.marital_status
          : "Single",
        joining_date: editFormData?.work?.joining_date
          ? new Date(editFormData.work.joining_date).toISOString()
          : new Date().toISOString(),
        salary: editFormData?.work?.salary || 0,
        department: editFormData?.work?.department?.uid || "",
        designation: editFormData?.work?.designation?.uid || "",
        shift_and_schedule: editFormData?.work?.shift_and_schedule?.uid || "",
        supervisor: editFormData?.work?.supervisor || false,
        executives: editFormData?.work?.supervisor
          ? editFormData?.work?.executives[0]
          : "",
        permissions: transformPermissions(editFormData.employee_access),
      });
    }
  }, [editFormData, type, reset, initialPermissionValues]);

  const saveDraft = () => {
    const formValues = watch();
    sessionStorage.setItem(draftKey, JSON.stringify(formValues));
  };

  const clearDraft = () => {
    sessionStorage.removeItem(draftKey);
  };

  useEffect(() => {
    return () => {
      if (type === "edit") {
        clearDraft(); // Clear draft when leaving the form
      }
    };
  }, []);

  const prepareRoleData = (
    permissions: Permissions[]
  ): { [key: string]: string } => {
    return permissions.reduce((acc, item) => {
      acc[item.name] = item.checked ? "a" : "i";
      return acc;
    }, {} as { [key: string]: string });
  };

  const onSubmit = async (data: CreateEmployeeProps) => {
    console.log(data);
    const preparedData = data.permissions
      ? prepareRoleData(data.permissions)
      : {};

    const formattedData = {
      ...data,
      active: true,
      is_probation: true,
      company: "112233445566778899",
      bod: data.bod,
      joining_date: data.joining_date,
      executives: data?.supervisor
        ? typeof data?.executives === "string"
          ? [data?.executives]
          : data?.executives
        : [],
    };
    const payload = { ...formattedData, ...preparedData };
    delete payload.permissions;
    try {
      let response;

      // Handle create vs. edit
      if (type === "edit") {
        const updatedPayload = {
          ...payload,
          marital_status: payload.marital_status ?? undefined,
        };

        response = await editEmployee({
          uid: editFormData?.uid,
          ...updatedPayload,
        }).unwrap();
        sessionStorage.removeItem(draftKey);
        console.log(response);

        notifications.show({
          title: "Success!",
          message: response.message || "Employee updated successfully",
          icon: <IconCheck />,
          color: "green",
          autoClose: 3000,
        });
      } else {
        response = await createEmployee(
          payload as UnifiedEmployeePayload
        ).unwrap();
        sessionStorage.removeItem(draftKey);
        console.log(response);

        notifications.show({
          title: "Success!",
          message: response.message || "Employee Created Successfully",
          icon: <IconCheck />,
          color: "green",
          autoClose: 3000,
        });
      }

      // Redirect after success
      navigate(-1);
    } catch (error) {
      console.error("Failed to submit employee data", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't process the request",
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-[350px] flex flex-col gap-6 justify-between"
        >
          <Box>
            <SimpleGrid cols={2} spacing="xl" verticalSpacing="xs">
              {tab === "1" && (
                <Tab1Fields
                  type={type}
                  watch={watch as UseFormWatch<FormData>}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />
              )}

              {tab === "2" && (
                <Tab2Fields
                  watch={watch as UseFormWatch<FormData>}
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
          </Box>

          <Box className="p-4 w-full bg-white flex justify-end gap-4">
            <Button
              variant="outline"
              color="blue"
              className="rounded-lg"
              disabled={tab === "1"}
              onClick={() => (tab !== "1" ? handleTab("decrease") : null)}
            >
              Previous
            </Button>
            <Button
              variant="filled"
              color="blue"
              className={`rounded-lg ${
                tab === "3"
                  ? "bg-orange-500 text-white hover:bg-orange-400"
                  : ""
              } `}
              disabled={createLoading || editLoading}
              onClick={() => {
                saveDraft();
                if (tab === "3") {
                  console.log("triggering submit");
                  handleSubmit(onSubmit)();
                } else {
                  handleTab("increase");
                }
              }}
            >
              {`${
                tab === "3" ? (type === "add" ? "Create" : "Update") : "Next"
              }`}
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;
