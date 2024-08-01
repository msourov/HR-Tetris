import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Loader,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";
import {
  useEditUserMutation,
  useGetUserDetailQuery,
} from "../../../../features/api/userSlice";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
  // role: z.string().uuid(), for production
  role: z.string(), // for testing
});

type EditUserRequest = z.infer<typeof schema>;

const EditUser = () => {
  const { uid } = useParams();
  const [editUser, { isLoading }] = useEditUserMutation();
  const {
    data: userDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetUserDetailQuery({ uid });
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
  console.log("edituser");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditUserRequest>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (userDetail?.data) {
      reset({
        ...userDetail.data,
        role: userDetail.data.role_id || "", // Ensure role_id is set
      });
    }
  }, [userDetail, reset]);

  const onSubmit: SubmitHandler<EditUserRequest> = async (
    data: EditUserRequest
  ) => {
    try {
      const obj = { ...data, uid };
      await editUser(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: "Succesfully updated user",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't update user",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const activeValue = watch("active");
  const roleIdValue = watch("role");

  if (isLoadingDetail || isLoadingRoles) {
    return <div>Loading...</div>;
  }

  if (detailError || rolesError) {
    return <div>Error loading data</div>;
  }

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          {...register("name")}
          error={errors.name?.message as React.ReactNode}
        />
        <Select
          label="Select role"
          data={rolesOption}
          value={roleIdValue} // Set the current value of the select
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
            // onLabel="Disable"
            // offLabel="Activate"
            color="black"
            {...register("active")}
            checked={activeValue}
            onChange={(e) => setValue("active", e.currentTarget.checked)}
          />
        </Box>

        <Button
          type="submit"
          className="rounded-lg mt-6 bg-black"
          disabled={isLoading}
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

export default EditUser;
