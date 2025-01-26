import { useForm, SubmitHandler } from "react-hook-form";
import { PasswordInput, Button, Card, Stack, Grid, Text } from "@mantine/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineLock } from "react-icons/md";
import { useChangeOwnPasswordMutation } from "../../features/api/userSlice";

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
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
  });
  const [changeOwnPassword, { isLoading, error }] =
    useChangeOwnPasswordMutation();

  const onSubmit: SubmitHandler<SettingsFormValues> = async (data) => {
    console.log("Form submitted:", data);
    const payload: { uid: string; old_password: string; new_password: string } =
      {
        uid: "",
        old_password: data.currentPassword,
        new_password: data.password.newPassword,
      };
    await changeOwnPassword(payload).unwrap();
  };

  console.log(error);

  return (
    <div className="flex justify-center py-10">
      <Card padding="xl" radius="md" className="w-[90%]">
        <Stack>
          <Text size="xl" ta="center" className="text-white bg-orange-400">
            Password & Security Section
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
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

              <Button
                disabled={isLoading}
                type="submit"
                size="sm"
                color="blue"
                w={100}
                className="self-end"
              >
                Update
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  );
};

export default Settings;
