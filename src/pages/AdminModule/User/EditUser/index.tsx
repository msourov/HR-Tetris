import { useEffect, useMemo } from "react";
import { ErrorResponse } from "react-router-dom";
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
import { User } from "../../../../features/types/user";
import { useEditUserMutation } from "../../../../features/api/userSlice";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Role is required"),
});

type EditUserRequest = z.infer<typeof schema>;

interface EditUserProps {
  id: string;
  closeModal: () => void;
  userData?: User;
}

const EditUser = ({ id, closeModal, userData }: EditUserProps) => {
  const [editUser, { isLoading }] = useEditUserMutation();
  const {
    data: roles,
    // isLoading: isLoadingRoles,
  } = useGetRolesQuery({ page: 1, limit: 10 });

  const rolesOption = useMemo(
    () =>
      roles?.data.map((item) => ({
        value: item.uid,
        label: item.name,
      })),
    [roles]
  );
  console.log(userData);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditUserRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userData?.name || "",
      role: userData?.role_id || "",
      active: userData?.active || false,
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        role: userData.role_id || "",
        active: userData.active || false,
      });
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<EditUserRequest> = async (
    data: EditUserRequest
  ) => {
    try {
      const obj = { ...data, uid: id };
      const response = await editUser(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Succesfully updated user",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message: (error as ErrorResponse).data.detail || "Couldn't update user",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const activeValue = watch("active");
  const roleIdValue = watch("role");

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          {...register("name")}
          error={errors.name?.message as React.ReactNode}
        />
        <Select
          label="User role"
          data={rolesOption}
          value={roleIdValue || ""}
          onChange={(value) => setValue("role", value || "")}
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
            checked={activeValue} // Controlled value
            onChange={(e) => setValue("active", e.currentTarget.checked)}
          />
        </Box>

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

export default EditUser;
