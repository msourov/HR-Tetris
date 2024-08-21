import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Loader,
  Paper,
  PasswordInput,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../../../features/api/userSlice";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
  mobile: z.string().min(10).max(15),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be no more than 32 characters long")
    .regex(/\d/, "Password must contain at least one number"),
  // role: z.string().uuid(), for production
  role: z.string(), // for testing
});

type AddUserRequest = z.infer<typeof schema>;

const AddNewUser = () => {
  const [addUser, { isLoading, error: createUserError }] =
    useCreateUserMutation();
  const navigate = useNavigate();
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useGetRolesQuery({ page: 1, limit: 10 });

  const rolesOption = useMemo(
    () =>
      roles?.data.map((item) => ({
        value: item.uid,
        label: item.name,
      })),
    [roles]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddUserRequest>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<AddUserRequest> = async (
    data: AddUserRequest
  ) => {
    try {
      const response = await addUser(data).unwrap();
      notifications.show({
        title: "Success!",
        message: "User Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
      navigate(-1);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't create user",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const activeValue = watch("active");
  const roleIdValue = watch("role");

  if (isLoading || isLoadingRoles) {
    return <div>Loading...</div>;
  }

  if (rolesError || createUserError) {
    return (
      <ErrorAlert
        message={rolesError ? "Error fetching roles" : "Error creating user"}
      />
    );
  }

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          {...register("name")}
          error={errors.name?.message as React.ReactNode}
        />
        <TextInput
          label="Phone"
          {...register("mobile")}
          error={errors.mobile?.message as React.ReactNode}
        />
        <Select
          label="Select role"
          data={rolesOption}
          value={roleIdValue}
          onChange={(value) => {
            if (value) {
              setValue("role", value);
            }
          }}
          error={errors.role?.message as React.ReactNode}
          mt={8}
        />
        <Text c="dimmed" className="mt-6 mb-2">
          Set Status
        </Text>
        <Box className="max-w-20">
          <Switch
            size="lg"
            color="black"
            {...register("active")}
            checked={activeValue}
            onChange={(e) => setValue("active", e.currentTarget.checked)}
          />
        </Box>

        <PasswordInput
          label="Password"
          {...register("password")}
          error={errors.password?.message as React.ReactNode}
          mt={8}
        />

        <Button
          type="submit"
          className="rounded-lg mt-6"
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

export default AddNewUser;
