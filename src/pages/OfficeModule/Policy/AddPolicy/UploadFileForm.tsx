import {
  Box,
  Button,
  FileButton,
  Loader,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContextModalProps } from "@mantine/modals";
import axios, { AxiosError } from "axios";
import { getToken } from "../../../../services/utils/getToken";
import { MdOutlineFileUpload } from "react-icons/md";

const schema = z.object({
  name: z.string().min(2),
});

type UploadPolicy = z.infer<typeof schema>;
interface UploadPolicyFileProps extends ContextModalProps {
  id: string;
}

const UploadPolicyFile = ({ context, id }: UploadPolicyFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [uploadPolicy, { isLoading }] = useUploadPolicyMutation();
  const token = getToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadPolicy>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: UploadPolicy) => {
    setIsLoading(true);
    try {
      if (!file) {
        notifications.show({
          title: "Error!",
          message: "Please select a file to upload.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
        return;
      }

      const formData = new FormData();
      formData.append("upload_file", file);

      // const response = await uploadPolicy({
      //   name: data.name,
      //   upload_file: file,
      // }).unwrap();
      const response = await axios.post(
        `https://api.hr-infozilion.pitetris.com/v1/mak/policy/create-file?name=${encodeURIComponent(
          data.name
        )}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notifications.show({
        title: "Success!",
        message: "Policy uploaded successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      context.closeModal(id);
      console.log(response);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        if (error.response) {
          notifications.show({
            title: "Error!",
            message: error.response.data.detail,
            icon: <IconX />,
            color: "red",
            autoClose: 3000,
          });
        } else {
          notifications.show({
            title: "Error!",
            message: error.message,
            icon: <IconX />,
            color: "red",
            autoClose: 3000,
          });
        }
      } else {
        notifications.show({
          title: "Error!",
          message: "An unexpected error occurred.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="md" radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          {...register("name")}
          error={errors.name?.message as React.ReactNode}
        />
        <Box mt={20} className="flex flex-col">
          <FileButton
            onChange={setFile}
            accept="image/png,image/jpeg,application/pdf"
          >
            {(props) => (
              <Button
                variant="outline"
                {...props}
                leftSection={<MdOutlineFileUpload size={20} />}
              >
                Upload file
              </Button>
            )}
          </FileButton>
          {file && (
            <Text size="sm" ta="center" mt="sm" c="blue">
              {file.name}
            </Text>
          )}
        </Box>
        <Button
          type="submit"
          className="rounded-lg mt-6"
          bg="black"
          disabled={isLoading}
        >
          {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
        </Button>
      </form>
    </Paper>
  );
};

export default UploadPolicyFile;
