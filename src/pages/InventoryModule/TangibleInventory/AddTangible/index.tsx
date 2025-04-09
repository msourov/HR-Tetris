import { useState } from "react";
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
import { useCreateTangibleMutation } from "../../../../features/api/tangibleInventorySlice";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// Zod schema for tangible creation
const addTangibleSchema = z.object({
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

type AddTangibleRequest = z.infer<typeof addTangibleSchema>;

interface AddTangibleProps {
  closeModal: () => void;
}

const AddTangible = ({ closeModal }: AddTangibleProps) => {
  const [createTangible, { isLoading: createLoading }] =
    useCreateTangibleMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTangibleRequest>({
    resolver: zodResolver(addTangibleSchema),
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

  const onSubmit: SubmitHandler<AddTangibleRequest> = async (data) => {
    try {
      setServerError(null);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined) return;
        if (key === "file" && value) {
          if (value instanceof FileList) {
            formData.append("file", value[0]);
          }
        } else if (value instanceof FileList) {
          // Handled separately
        } else {
          formData.append(key, value.toString());
        }
      });

      const response = await createTangible(data).unwrap();

      notifications.show({
        title: "Success!",
        message: response.message || "Consumable created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });

      closeModal();
    } catch (error) {
      console.error("Creation error:", error);
    }
  };

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
                label="Price ($)"
                placeholder="0.00"
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
              value={field.value || null}
              onChange={(file) => field.onChange(file)}
              label="Attachment"
              placeholder="Select file"
              accept={ACCEPTED_FILE_TYPES.join(",")}
              error={errors.file?.message as string}
              clearable
            />
          )}
        />

        <Group justify="right" mt="xl">
          <Button
            variant="default"
            onClick={closeModal}
            disabled={createLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createLoading}
            disabled={createLoading}
          >
            Create
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default AddTangible;
