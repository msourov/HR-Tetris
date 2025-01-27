import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Loader, Paper, Text, TextInput, Select } from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCreateCertificationMutation } from "../../../../features/api/certificationSlice";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";

const schema = z.object({
  purpose: z.string().min(2),
  employee_id: z.string().min(1),
  certification_type: z.string(),
  apply_date: z.string().min(1),
});

type AddCertificationRequest = z.infer<typeof schema>;

const AddCertification = () => {
  const [addCertification, { isLoading, error: createCertificationError }] =
    useCreateCertificationMutation();
  const navigate = useNavigate();

  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: employeeError,
  } = useGetEmployeeHelperQuery();

  const certificationTypesOption = useMemo(
    () => [
      { value: "employment_certificate", label: "Employment Certificate" },
      { value: "experience_certificate", label: "Experience Certificate" },
      {
        value: "training_completion_certificate",
        label: "Training Completion Certificate",
      },
      {
        value: "no_objection_certificate",
        label: "No Objection Certificate (NOC)",
      },
    ],
    []
  );

  const employeeOptions = useMemo(
    () =>
      employees?.data?.map((employee) => ({
        value: employee.employee_id,
        label: employee.name,
      })) || [],
    [employees]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddCertificationRequest>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<AddCertificationRequest> = async (
    data: AddCertificationRequest
  ) => {
    const formattedData = {
      ...data,
      apply_date: new Date(data.apply_date).toISOString(),
    };

    try {
      const response = await addCertification(formattedData).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Certification Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      navigate(-1);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: (error as Error).message || "Couldn't create certification",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const certificationTypeValue = watch("certification_type");
  const employeeIdValue = watch("employee_id");

  if (isLoading || isLoadingEmployees) {
    return <div>Loading...</div>;
  }

  if (employeeError || createCertificationError) {
    return (
      <ErrorAlert
        message={
          employeeError
            ? "Error fetching employees"
            : "Error creating certification"
        }
      />
    );
  }

  return (
    <Paper radius="md" p="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          variant="filled"
          label={
            <Text c="dimmed" size="sm">
              Select Employee
            </Text>
          }
          data={employeeOptions}
          value={employeeIdValue}
          onChange={(value) => {
            if (value) {
              setValue("employee_id", value);
            }
          }}
          error={errors.employee_id?.message as React.ReactNode}
        />
        <TextInput
          variant="filled"
          label={
            <Text c="dimmed" size="sm">
              Purpose
            </Text>
          }
          {...register("purpose")}
          error={errors.purpose?.message as React.ReactNode}
          mt={8}
        />
        <Select
          variant="filled"
          label={
            <Text c="dimmed" size="sm">
              Select Certification Type
            </Text>
          }
          data={certificationTypesOption}
          value={certificationTypeValue}
          onChange={(value) => {
            if (value) {
              setValue("certification_type", value);
            }
          }}
          error={errors.certification_type?.message as React.ReactNode}
          mt={8}
        />
        <TextInput
          variant="filled"
          label={
            <Text c="dimmed" size="sm">
              Application Date
            </Text>
          }
          type="datetime-local"
          {...register("apply_date")}
          error={errors.apply_date?.message as React.ReactNode}
          mt={8}
        />

        <Button
          type="submit"
          size="sm"
          className="rounded-lg my-6 float-right"
          disabled={isLoading}
          bg="black"
        >
          {!isLoading ? (
            "Save"
          ) : (
            <Loader color="rgba(255, 255, 255, 1)" size={20} />
          )}
        </Button>
      </form>
    </Paper>
  );
};

export default AddCertification;
