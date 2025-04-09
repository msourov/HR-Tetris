import { useForm, SubmitHandler } from "react-hook-form";
import { PasswordInput, Button, Card, Grid } from "@mantine/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineLock } from "react-icons/md";
import { useChangeOwnPasswordMutation } from "../../features/api/userSlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse } from "react-router-dom";

const schema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters long"),
  password: z
    .object({
      newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters long"),
      confirmPassword: z.string().min(6, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

type SettingsFormValues = z.infer<typeof schema>;

const Settings = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
  });
  const [changeOwnPassword, { isLoading, error }] =
    useChangeOwnPasswordMutation();

  const onSubmit: SubmitHandler<SettingsFormValues> = async (data) => {
    console.log("Form submitted:", data);
    const uid = localStorage.getItem("uid") || "";
    const payload: { uid: string; old_password: string; new_password: string } =
      {
        uid: uid,
        old_password: data.currentPassword,
        new_password: data.password.newPassword,
      };
    try {
      const response = await changeOwnPassword(payload).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.message || "Succesfully updated password",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse).data.detail || "Couldn't update password",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      reset();
    }
  };

  console.log(error);

  return (
    <div className="flex justify-center py-10">
      <Card padding="xl" radius="md" className="w-[90%]">
        <div className="space-y-6">
          <p className="text-xl py-3 text-center text-white bg-orange-400">
            Password & Security Section
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <PasswordInput
                label="Current Password"
                placeholder="Enter Current Password"
                leftSection={<MdOutlineLock />}
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
              />

              <Grid>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new Password"
                    leftSection={<MdOutlineLock />}
                    {...register("password.newPassword")}
                    error={errors.password?.newPassword?.message}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm new Password"
                    leftSection={<MdOutlineLock />}
                    {...register("password.confirmPassword")}
                    error={errors.password?.confirmPassword?.message}
                  />
                </Grid.Col>
              </Grid>
              <div className="flex justify-end">
                <Button
                  variant="light"
                  disabled={isLoading}
                  type="submit"
                  size="sm"
                  color="blue"
                  w={100}
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

// const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   if (!file) {
//     alert("Please select a file to upload.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("mobile", mobile);
//   formData.append("upload_file", file);

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_APP_BASE_URL}role-user/upload`,
//       formData
//     );
//     console.log(response);
//     notifications.show({
//       title: "Success!",
//       message: response.data.message || "Image uploaded succesfully",
//       icon: <IconCheck />,
//       color: "green",
//       autoClose: 3000,
//     });

//     setPreview(URL.createObjectURL(file));
//     refetch();
//   } catch (error) {
//     console.error(error);
//     console.error(error);
//     notifications.show({
//       title: "Error!",
//       message:
//         (error as ErrorResponse).data.detail || "Couldn't update password",
//       icon: <IconX />,
//       color: "red",
//       autoClose: 3000,
//     });
//   }
// };
