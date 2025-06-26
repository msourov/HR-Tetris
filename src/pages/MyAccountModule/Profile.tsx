import { useState } from "react";
import { Button, Card, Grid, Group, PasswordInput, Text } from "@mantine/core";
import {
  IconCamera,
  IconCheck,
  IconDeviceMobile,
  IconUpload,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { getImageUrl } from "../../services/utils/getImageUrl";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../components/ui/AppModal";
import { MdOutlineLock } from "react-icons/md";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangeOwnPasswordMutation } from "../../features/api/userSlice";
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

const Profile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [opened, { open, close }] = useDisclosure(false);

  const [changeOwnPassword, { isLoading, error }] =
    useChangeOwnPasswordMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
  });

  console.error(error);

  const { name, id: mobile } = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

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
      close();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("mobile", mobile ?? "");
      formData.append("upload_file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}role-user/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      notifications.show({
        title: "Success!",
        message:
          response?.data?.message || "Profile image updated successfully",
        icon: <IconCheck />,
        color: "green",
      });

      // Clear cache and refetch
      setPreview(null);
      setImageKey(Date.now()); // This will trigger the useEffect to refetch
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to update profile image",
        icon: <IconX />,
        color: "red",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl shadow-lg mb-10">
          <Card
            px="xl"
            py="lg"
            radius="lg"
            className="bg-white relative overflow-visible"
          >
            {/* Decorative elements */}
            {/* <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-orange-500 w-24 h-1.5 rounded-full"></div> */}

            <div className="text-left mb-6">
              <Text size="lg" fw={700} className="text-blue-800">
                Your Profile
              </Text>
              <Text size="sm" className="text-gray-500">
                Manage your personal information
              </Text>
            </div>

            <form onSubmit={handleUpload}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile picture section */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    <div className="relative w-36 h-36 rounded-full shadow-lg">
                      <div className="w-full h-full bg-white rounded-full">
                        {preview || mobile ? (
                          <LazyLoadImage
                            src={
                              preview ||
                              `${getImageUrl(mobile || "")}?t=${imageKey}`
                            }
                            alt="Profile Picture"
                            effect="blur"
                            className="aspect-square w-36 object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/assets/profile-picture.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <IconUser size={60} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <label
                      htmlFor="file-upload"
                      className="absolute -bottom-1 -right-1 flex items-center justify-center bg-white text-blue-600 rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-50 transition-all border-2 border-blue-100"
                    >
                      <IconCamera size={18} />
                    </label>

                    <input
                      id="file-upload"
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="mt-4 text-center md:text-left">
                    <Text size="sm" className="text-gray-400 mb-1">
                      Allowed file types: JPG, PNG
                    </Text>
                    <Text size="sm" className="text-gray-400">
                      Max size: 5MB
                    </Text>
                  </div>
                </div>

                {/* Profile information */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <Text size="sm" className="text-gray-500 mb-1">
                        Full Name
                      </Text>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <IconUser className="text-blue-600" size={14} />
                        </div>
                        <Text size="md" className="text-gray-800 font-semibold">
                          {name}
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text size="sm" className="text-gray-500 mb-1">
                        Mobile Number
                      </Text>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <IconDeviceMobile
                            className="text-blue-600"
                            size={14}
                          />
                        </div>
                        <Text size="md" className="text-gray-700 font-semibold">
                          {mobile}
                        </Text>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Group justify="flex-end">
                        <Button
                          type="submit"
                          color="blue"
                          radius="md"
                          size="md"
                          loading={isUploading}
                          disabled={!file || isUploading}
                          className="transition-all shadow-md px-6 font-semibold"
                          leftSection={<IconUpload size={18} />}
                        >
                          Update Profile Picture
                        </Button>
                      </Group>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Additional profile info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-lg border-blue-100 bg-white rounded-xl">
            <Text
              size="lg"
              fw={500}
              className="text-gray-800 mb-4 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Personal Information
            </Text>
            <div className="space-y-3">
              {[
                { label: "Email", value: "john.doe@example.com" },
                { label: "Date of Birth", value: "January 15, 1985" },
                { label: "Department", value: "Sales / Business Development" },
                { label: "Position", value: "Executive Officer" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between border-b border-gray-100 pb-2"
                >
                  <Text size="sm" className="text-gray-500">
                    {item.label}
                  </Text>
                  <Text size="sm" className="text-gray-700 font-medium">
                    {item.value}
                  </Text>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border shadow-lg border-blue-100 bg-white rounded-xl">
            <Text
              size="lg"
              fw={500}
              className="text-gray-800 mb-4 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Account Security
            </Text>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <Text size="sm" className="text-gray-700 font-medium">
                    Password
                  </Text>
                  <Text size="sm" className="text-gray-500">
                    Last changed 3 months ago
                  </Text>
                </div>
                <Button variant="outline" color="blue" size="sm" onClick={open}>
                  Change
                </Button>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <Text size="sm" className="text-gray-700 font-medium">
                    Two-Factor Authentication
                  </Text>
                  <Text size="sm" className="text-gray-500">
                    Add an extra layer of security
                  </Text>
                </div>
                <Button variant="outline" color="orange" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <AppModal opened={opened} onClose={close} size="lg" padding={30}>
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
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
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
      </AppModal>
    </div>
  );
};

export default Profile;
