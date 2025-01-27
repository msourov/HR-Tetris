/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  useCreateEmployeeMutation,
  useGetEmployeeDetailQuery,
} from "../features/api/employeeSlice";
import useOptions from "../services/utils/getOptions";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateEmployeeProps,
  Permissions,
} from "../pages/EmployeeModule/Employee/AddEmployee/types";
import { UnifiedEmployeePayload } from "../features/types/employee";

const schema = z.object({
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
  password: z.string().min(6, "Password must be at least 6 characters long"),
  joining_date: z.string(),
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

export const useEmployeeForm = (
  type: string,
  initialPermissionValues: Permissions[]
) => {
  const { uid } = useParams();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  useGetEmployeeDetailQuery({ uid }, { skip: type === "add" });
  const {
    departmentOptions,
    designationOptions,
    shiftOptions,
    employeeOptions,
  } = useOptions();
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
            password: draftValues?.password || "",
            joining_date: draftValues?.joining_date
              ? new Date(draftValues?.joining_date).toISOString()
              : new Date().toISOString(),
            employee_id: draftValues?.employee_id || "",
            marital_status: draftValues?.marital_status || "Single",
            bod: draftValues?.bod || new Date().toISOString(),
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

  const prepareRoleData = (permissions: Permissions[]) =>
    permissions.reduce((acc, item) => {
      acc[item.name] = item.checked ? "a" : "i";
      return acc;
    }, {} as { [key: string]: string });

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
        ? typeof data?.executives === "string"
          ? [data?.executives]
          : data?.executives
        : [],
    };
    const payload = { ...formattedData, ...preparedData };
    delete payload.permissions;
    try {
      await createEmployee(payload as UnifiedEmployeePayload).unwrap();
      sessionStorage.removeItem(draftKey);
      navigate(-1);
    } catch (error) {
      console.error("Failed to create employee", error);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    errors,
    onSubmit,
    isLoading,
    departmentOptions,
    designationOptions,
    shiftOptions,
    employeeOptions,
  };
};
