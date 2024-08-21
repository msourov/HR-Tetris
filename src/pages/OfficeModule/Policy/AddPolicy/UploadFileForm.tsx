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
import { useUploadPolicyMutation } from "../../../../features/api/policySlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2),
});

type UploadPolicy = z.infer<typeof schema>;

const UploadPolicyFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPolicy, { isLoading }] = useUploadPolicyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadPolicy>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: UploadPolicy) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("upload_file", file);
      }
      const response = await uploadPolicy({
        name: data.name,
        formData,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Policy uploaded successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't upload policy",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
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
          <FileButton onChange={setFile} accept="image/png,image/jpeg,pdf/pdf">
            {(props) => (
              <Button {...props} bg="orange">
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
