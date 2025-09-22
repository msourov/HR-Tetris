import { zodResolver } from "@hookform/resolvers/zod";
import {
  Paper,
  Button,
  Checkbox,
  Text,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { useForm, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse, useNavigate, useParams } from "react-router-dom";
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
} from "../../../../features/api/employeeSlice";
import useOptions from "../../../../services/utils/getOptions";
import {
  EmployeeAccess,
  UnifiedEmployeePayload,
} from "../../../../features/types/employee";
import Tab1Fields from "../AddEmployee/Tab1Fields";
import Tab2Fields from "../AddEmployee/Tab2Fields";
import AddDocument from "../EmpDocument/AddDocument";

const getSchema = (type: string) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().regex(/^01[0-9]{9}$/, "Invalid Bangladeshi phone number"),
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
        ? z.string().min(3, "Employee ID must be at least 3 characters long")
        : z.string().optional(),
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(1, "Designation is required"),
    shift_and_schedule: z.string().min(1, "Shift and schedule is required"),
    supervisor: z.boolean(),
    executives: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .nullable()
      .default([]),
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
  executives: { value: string; label: string }[];
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
  const { data, refetch } = useGetEmployeeDetailQuery(
    { uid },
    { skip: type === "add" }
  );
  const {
    departmentOptions,
    designationOptions,
    shiftOptions,
    employeeOptions,
  } = useOptions();

  const editFormData = data?.data;

  console.log(editFormData?.document_extensions, "editFormData");

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
            executives: draftValues?.executives || [],
            permissions: draftValues?.permissions || initialPermissionValues,
          }
        : undefined,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const error = Object.entries(errors)[0][1].message;
      console.log(error);
      notifications.show({
        title: "Error!",
        message: typeof error === "string" ? error : "Fields missing",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
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
          ? (editFormData?.work?.executives ?? [])
              .filter(
                (ex) =>
                  typeof ex === "object" &&
                  ex !== null &&
                  "uid" in ex &&
                  "name" in ex
              )
              .map((ex) => ({
                value: (ex as { uid: string }).uid,
                label: (ex as { name: string }).name,
              }))
          : [],

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

  const handleCheckboxChange = (index: number, checked: boolean) => {
    handlers.setItemProp(index, "checked", checked);
    const updatedPermissions = getValues("permissions").map(
      (permission: Permissions, i: number) =>
        i === index ? { ...permission, checked } : permission
    );
    setValue("permissions", updatedPermissions);
  };

  // const items = values.map((value, index) => (
  //   <Checkbox
  //     mt="xs"
  //     ml={33}
  //     label={value.label}
  //     name={value.name}
  //     key={value.key}
  //     checked={value.checked}
  //     onChange={(event) =>
  //       handleCheckboxChange(index, event.currentTarget.checked)
  //     }
  //   />
  // ));

  const onSubmit = async (data: CreateEmployeeProps) => {
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
        ? data?.executives
            ?.filter(
              (ex) => typeof ex === "object" && ex !== null && "value" in ex
            )
            .map((ex: { label: string; value: string }) => ex.value)
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
    } catch (err) {
      console.error("Failed to submit employee data", err);
      notifications.show({
        title: "Error!",
        message:
          (err as ErrorResponse).data?.detail?.[0]?.msg ||
          "Couldn't create employee",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <Paper radius="md" px="lg" className="mx-auto flex flex-col">
      <Box className="flex-1 flex flex-col">
        {/* <Text
          component="h1"
          size="xl"
          className="drop-shadow-2xl font-bold mb-4"
        >
          {getTabName(parseInt(tab))}
        </Text> */}
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
                <SimpleGrid cols={2} spacing="xs">
                  {/* {items} */}
                  <div>
                    <Text fw={700} c="gray" mb="lg" className="font-semibold">
                      Assign Employee Access
                    </Text>
                    {/* <Divider w={"100%"} mx={"auto"} mb={"1rem"} /> */}
                    {values
                      .filter(
                        (v) =>
                          !v.name.includes("_approve_") &&
                          !v.name.includes("_admin_")
                      )
                      .map((value, index) => (
                        <Checkbox
                          mt="xs"
                          label={value.label}
                          name={value.name}
                          key={value.key}
                          checked={value.checked}
                          onChange={(event) =>
                            handleCheckboxChange(
                              index,
                              event.currentTarget.checked
                            )
                          }
                        />
                      ))}
                  </div>

                  {/* Admin Access Column */}
                  <div>
                    <Text fw={700} c="gray" mb="lg" className="font-semibold">
                      Assign Admin Access
                    </Text>
                    {values
                      .filter(
                        (v) =>
                          v.name.includes("_approve_") ||
                          v.name.includes("_admin_")
                      )
                      .map((value, index) => (
                        <Checkbox
                          mt="xs"
                          label={value.label}
                          name={value.name}
                          key={value.key}
                          checked={value.checked}
                          onChange={(event) =>
                            handleCheckboxChange(
                              index,
                              event.currentTarget.checked
                            )
                          }
                        />
                      ))}
                  </div>
                </SimpleGrid>
              </>
            )}
            {tab === "4" && (
              <AddDocument
                editFormData={editFormData}
                editLoading={editLoading}
                refetchDocs={refetch}
              />
            )}
          </Box>
          {tab !== "4" && (
            <Box className="p-4 w-full bg-white flex justify-end gap-4">
              <Button
                variant="outline"
                color="gray"
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
          )}
        </form>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;
