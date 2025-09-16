import { useEffect, useMemo, useState } from "react";
import { ErrorResponse } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Grid,
  Group,
  Loader,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX, IconCheck, IconLock, IconArrowDown } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { User } from "../../../../features/types/user";
import {
  useChangeUserPasswordMutation,
  useEditUserMutation,
} from "../../../../features/api/userSlice";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";
import {
  changePasswordSchema,
  ediUserSchema,
} from "../../../../features/schemas/userSchema";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

type EditUserRequest = z.infer<typeof ediUserSchema>;
type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

interface EditUserProps {
  id: string;
  closeModal: () => void;
  userData?: User;
}

const EditUser = ({ id, closeModal, userData }: EditUserProps) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [editUser, { isLoading }] = useEditUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeUserPasswordMutation();
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditUserRequest>({
    resolver: zodResolver(ediUserSchema),
    defaultValues: {
      name: userData?.name || "",
      role: userData?.role_id || "",
      active: userData?.active || false,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch: watchPasswordFields,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
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

  const onChangePassword = async () => {
    const { new_password, confirm_password } = watchPasswordFields();

    if (!new_password || !confirm_password) {
      notifications.show({
        title: "Error",
        message: "Both password fields are required",
        icon: <IconX />,
        color: "red",
      });
      return;
    }

    try {
      const res = await changePassword({ uid: id, new_password }).unwrap();
      notifications.show({
        title: "Success!",
        message: res.message || "Password changed successfully",
        icon: <IconCheck />,
        color: "green",
      });
      // Clear password fields
      resetPasswordForm({
        new_password: "",
        confirm_password: "",
      });
      setShowPasswordFields(false);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse).data?.detail || "Couldn't change password",
        icon: <IconX />,
        color: "red",
      });
    }
  };

  const activeValue = watch("active");
  const roleIdValue = watch("role");

  return (
    <Paper withBorder radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gutter="md">
          <Grid.Col span={12}>
            <TextInput
              label="Name"
              {...register("name")}
              error={errors.name?.message}
              withAsterisk
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Select
              label="User role"
              data={rolesOption || []}
              value={roleIdValue || ""}
              onChange={(value) => setValue("role", value || "")}
              error={errors.role?.message}
              withAsterisk
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Group justify="space-between">
              <Text fw={500} size="sm">
                Account Status
              </Text>
              <Switch
                size="md"
                color="blue"
                checked={activeValue}
                onChange={(e) => setValue("active", e.currentTarget.checked)}
              />
            </Group>
          </Grid.Col>

          <Grid.Col span={12} className="border-t py-4 mt-4">
            {/* <Divider my="sm" /> */}
            <Group
              justify="center"
              mb="sm"
              className="bg-blue-500 p-2 text-white items-center cursor-pointer"
              onClick={() => setShowPasswordFields((prev) => !prev)}
            >
              <Text size="md" fw={500}>
                Change Password
              </Text>
              <IconArrowDown
                size={18}
                className={`transition-transform duration-300 ${
                  showPasswordFields ? "rotate-180" : ""
                }`}
              />
            </Group>
            <AnimatePresence initial={false} mode="wait">
              {showPasswordFields && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                  style={{ originY: 0 }} // Add this
                >
                  <div className="bg-gray-200 px-4 py-4">
                    <div className="space-y-4">
                      <TextInput
                        type="password"
                        label="New Password"
                        {...registerPassword("new_password")}
                        error={passwordErrors.new_password?.message}
                        leftSection={<IconLock size={16} />}
                        placeholder="Enter new password"
                      />

                      <TextInput
                        type="password"
                        label="Confirm Password"
                        {...registerPassword("confirm_password")}
                        error={passwordErrors.confirm_password?.message}
                        leftSection={<IconLock size={16} />}
                        placeholder="Confirm new password"
                        mt="sm"
                      />
                      <Group justify="start" align="center" gap="sm" mt="xl">
                        <Button
                          color="blue"
                          size="compact-md"
                          onClick={handlePasswordSubmit(onChangePassword)}
                          loading={isChangingPassword}
                          disabled={isChangingPassword}
                          className="text-sm"
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outline"
                          color="gray"
                          size="compact-md"
                          onClick={() => setShowPasswordFields((prev) => !prev)}
                          disabled={isChangingPassword}
                          className="text-sm"
                        >
                          Cancel
                        </Button>
                      </Group>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid.Col>
        </Grid>

        <div className="flex items-center justify-end gap-2 my-2">
          <Button
            variant="outline"
            color="gray"
            onClick={closeModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftSection={isLoading ? <Loader size="xs" /> : null}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default EditUser;
