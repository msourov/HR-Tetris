import { Loader, Alert, Card, Group, Badge, Button } from "@mantine/core";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUserDetailQuery } from "../../../../features/api/userSlice";
import { UserResponseData } from "../../../../features/types/user";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { IconCamera, IconCheck, IconX } from "@tabler/icons-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const UserDetail: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const { uid } = useParams<{ uid: string }>();
  const { formatDate } = useFormatDate();
  const { data, isLoading, error } = useGetUserDetailQuery(
    uid ? { uid } : skipToken
  );

  console.log(data, "data");

  const mobile = data?.data[0]?.mobile ?? "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user?.mobile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("mobile", user.mobile);
      formData.append("upload_file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}role-user/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      notifications.show({
        title: "Success!",
        message: response?.data?.message || "User Image uploaded Successfully",
        icon: <IconCheck />,
        color: "green",
      });

      setFile(null);
      setPreview(null);
      setImageKey(Date.now()); // Trigger image refresh
    } catch (err) {
      notifications.show({
        title: "Error!",
        message: "User Image upload failed",
        icon: <IconX />,
        color: "red",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" variant="dots" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert title="Error" color="red" className="max-w-md mx-auto">
        Error fetching user details
      </Alert>
    );
  }

  const user: UserResponseData | undefined = data?.data[0];

  const logsSteps = (Array.isArray(user?.logs) ? user.logs : [])
    .filter(Boolean)
    .map((log, index) => (
      <div key={index} className="border-b-2 pb-2">
        <p className="text-sm font-small text-blue-800 mb-1">
          {log?.admin || log?.user || "N/A"}
        </p>
        <p className="text-xs text-gray-500">{log?.message ?? "N/A"}</p>
        <p className="text-xs text-gray-500">
          <span className="text-blue-500">
            {log?.create_at ? formatDate(log.create_at, true) : "N/A"}
          </span>
        </p>
      </div>
    ));

  return (
    <div className="flex flex-col justify-between md:flex-row p-6 lg:py-10 gap-8 rounded-lg shadow-sm max-w-6xl mx-auto">
      {/* Left Section: User Details */}
      <Card withBorder radius="md" className="w-full flex-1 md:w-1/3 bg-white">
        <Card.Section p="md" className="flex flex-col items-center">
          <div className="relative w-36 h-36 mb-4">
            <LazyLoadImage
              src={preview || `${getImageUrl(mobile)}?t=${imageKey}`}
              alt="Profile Picture"
              effect="blur"
              className="w-36 h-36 object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/assets/profile-picture.png";
              }}
            />

            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 flex items-center justify-center bg-blue-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-600 transition-colors"
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

          {/* Upload button moved here with proper centering */}
          {file && (
            <Group justify="center" w="100%">
              <Button
                onClick={handleUpload}
                loading={isUploading}
                color="blue"
                disabled={isUploading}
                fullWidth
              >
                Upload Image
              </Button>
            </Group>
          )}
        </Card.Section>

        <Group mb="xs" className="mx-auto">
          <p className="font-medium text-lg text-center">{user?.name}</p>

          <Badge
            className={`${
              user?.active
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {user?.active ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <div className="flex-1 bg-gray-100 py-4">
          <p className="text-sm text-gray-500 flex items-center gap-2 justify-center">
            <FaPhoneAlt />
            <span>{user?.mobile}</span>
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            {user?.role_name}
          </p>
        </div>
      </Card>

      {/* Right Section: Activity Logs - unchanged */}
      <div className="bg-gray-50 shadow-md w-[260px] border mx-auto h-[460px] flex flex-col relative">
        <p className="text-center mb-2 bg-blue-900 text-white p-2">
          Activity Logs
        </p>

        {logsSteps.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-2 relative z-0">
              {logsSteps}
            </div>

            {/* Fade Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-10 z-10 pointer-events-none bg-gradient-to-t from-gray-50 to-transparent" />
          </>
        ) : (
          <p className="text-sm text-center text-gray-500">
            No activity logs available.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
