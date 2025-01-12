import { useDepartmentHelperQuery } from "../../features/api/departmentSlice";
import { useDesignationHelperQuery } from "../../features/api/designationSlice";
import { useShiftHelperQuery } from "../../features/api/shiftSlice";
import { useGetEmplyeeHelperQuery } from "../../features/api/employeeSlice";
import { useMemo } from "react";

const useOptions = () => {
  const { data: departments } = useDepartmentHelperQuery();
  const { data: designations } = useDesignationHelperQuery();
  const { data: shifts } = useShiftHelperQuery();
  const { data: employees } = useGetEmplyeeHelperQuery();

  const departmentOptions = useMemo(
    () =>
      departments?.data.map((item) => ({
        label: item.name,
        value: item.uid,
      })) || [],
    [departments]
  );

  const designationOptions = useMemo(
    () =>
      designations?.data.map((item) => ({
        label: item.name,
        value: item.uid,
      })) || [],
    [designations]
  );

  const shiftOptions = useMemo(
    () =>
      shifts?.data.map((item) => ({
        label: item?.name,
        value: item?.uid,
      })) || [],
    [shifts]
  );

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.uid,
      }))
    : [];

  return {
    departmentOptions,
    designationOptions,
    shiftOptions,
    employeeOptions,
  };
};

export default useOptions;
