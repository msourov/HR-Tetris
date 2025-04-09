import { useEffect, useState } from "react";
import {
  Button,
  NumberInput,
  Textarea,
  TextInput,
  FileInput,
  Group,
  Paper,
  Alert,
} from "@mantine/core";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import {
  useGetTangibleDetailsQuery,
  useUpdateTangibleMutation,
} from "../../../../features/api/tangibleInventorySlice";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name must be at most 80 characters"),
  descriptions: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  quantity: z.number().int().min(0, "Quantity must be at least 0"),
  price: z.number().int().min(0, "Price must be at least 0"),
  location: z.string().optional(),
  category: z.string().optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .jpg, .png, and .pdf formats are supported"
    ),
});

type TangibleUpdateRequest = z.infer<typeof schema>;

interface TangibleUpdateProps {
  uid: string;
  closeEdit: () => void;
}

const TangibleUpdate = ({ uid, closeEdit }: TangibleUpdateProps) => {
  // Fetch the current tangible details (adjust hook and data shape as needed)
  const { data: tangibleDetail, isLoading: isLoadingDetails } =
    useGetTangibleDetailsQuery({ uid });
  const [updateTangible, { isLoading: updateLoading }] =
    useUpdateTangibleMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TangibleUpdateRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      descriptions: "",
      quantity: 0,
      price: 0,
      location: "",
      category: "",
      file: undefined,
    },
  });

  useEffect(() => {
    if (tangibleDetail) {
      reset({
        name: tangibleDetail.name,
        descriptions: tangibleDetail.descriptions,
        quantity: tangibleDetail.quantity,
        price: tangibleDetail.price,
        location: tangibleDetail.location || "",
        category: tangibleDetail.category || "",
        file: undefined, // Do not pre-populate file input
      });
    }
  }, [tangibleDetail, reset]);

  const onSubmit: SubmitHandler<TangibleUpdateRequest> = async (data) => {
    try {
      setServerError(null);
      const response = await updateTangible({
        uid,
        ...data,
        location: data.location || "",
        category: data.category || "",
        active: true,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Tangible updated successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeEdit();
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage =
        (error as { data?: { detail?: string } })?.data?.detail ||
        "Failed to update tangible";
      setServerError(errorMessage);
      notifications.show({
        title: "Error!",
        message: errorMessage,
        icon: <IconInfoCircle />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  if (isLoadingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Paper
      withBorder
      shadow="sm"
      p="md"
      radius="md"
      className="max-w-2xl mx-auto"
    >
      {serverError && (
        <Alert
          icon={<IconInfoCircle size="1rem" />}
          title="Error"
          color="red"
          mb="md"
        >
          {serverError}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              variant="filled"
              label="Name"
              placeholder="Enter tangible name"
              withAsterisk
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          name="descriptions"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              variant="filled"
              label="Description"
              placeholder="Enter detailed description"
              withAsterisk
              autosize
              minRows={3}
              error={errors.descriptions?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                variant="filled"
                label="Price ($)"
                placeholder="0"
                withAsterisk
                min={0}
                error={errors.price?.message}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                variant="filled"
                label="Quantity"
                placeholder="0"
                withAsterisk
                min={0}
                error={errors.quantity?.message}
              />
            )}
          />
        </div>

        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              variant="filled"
              label="Location"
              placeholder="Enter location (optional)"
              error={errors.location?.message}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              variant="filled"
              label="Category"
              placeholder="Enter category (optional)"
              error={errors.category?.message}
            />
          )}
        />

        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <FileInput
              {...field}
              variant="filled"
              label="Attachment (optional)"
              placeholder="Select file"
              accept={ACCEPTED_FILE_TYPES.join(",")}
              error={errors.file?.message as string}
              clearable
              onChange={(file) => field.onChange(file)}
              value={field.value || null}
            />
          )}
        />

        <Group justify="right" mt="xl">
          <Button
            variant="default"
            onClick={closeEdit}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={updateLoading}
            disabled={updateLoading}
          >
            Save Changes
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default TangibleUpdate;
