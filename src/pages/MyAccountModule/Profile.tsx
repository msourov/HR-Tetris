import { useState } from "react";
import { Button, Card, Group, Stack } from "@mantine/core";
import { IconCamera, IconCheck, IconX } from "@tabler/icons-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { getImageUrl } from "../../services/utils/getImageUrl";

const Profile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  const mobile = localStorage.getItem("userId") ?? "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("mobile", mobile);
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
    <div className="flex justify-center py-10">
      <Card padding="xl" radius="md" className="w-[90%] relative">
        <form onSubmit={handleUpload}>
          <Stack gap="lg">
            <div className="relative w-36 h-36">
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

            <Group justify="right">
              <Button
                type="submit"
                color="blue"
                loading={isUploading}
                disabled={!file || isUploading}
              >
                Update Profile
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
