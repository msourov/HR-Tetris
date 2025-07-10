import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Grid,
  Flex,
  Paper,
  Switch,
  Text,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useCreateCredentialMutation } from "../../../features/api/companyCredentialSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import { ErrorResponse } from "react-router-dom";

// Zod schema validation
const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    descriptions: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    active: z.boolean(),
    notify_mobile: z
      .array(
        z.object({
          value: z.string(),
        })
      )
      .min(1, "At least one phone number is required"),
    notify_b_days: z
      .array(
        z.object({
          value: z.string().regex(/^\d+$/, "Must be a positive number"),
        })
      )
      .min(1, "At least one day is required"),
    creation_date: z.date({ required_error: "Creation date is required" }),
    expire_at: z.date({ required_error: "Expiration date is required" }),
  })
  .refine((data) => data.expire_at > data.creation_date, {
    message: "Expiration date must be after creation date",
    path: ["expire_at"],
  });

type CreateCredentialForm = {
  name: string;
  descriptions: string;
  active: boolean;
  notify_mobile: { value: string }[];
  notify_b_days: { value: string }[];
  creation_date: Date;
  expire_at: Date;
};

const CreateCredentialModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [createCredential, { isLoading }] = useCreateCredentialMutation();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCredentialForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      active: true,
      notify_mobile: [{ value: "" }],
      notify_b_days: [{ value: "" }],
      creation_date: new Date(),
      expire_at: new Date(),
    },
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "notify_mobile",
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control,
    name: "notify_b_days",
  });

  const activeStatus = watch("active");

  console.log(errors);

  const onSubmit = async (data: CreateCredentialForm) => {
    console.log(data);
    console.log(data.notify_mobile.map((item) => item.value));
    console.log(data.notify_b_days.map((item) => item.value));
    try {
      await createCredential({
        ...data,
        notify_mobile: data.notify_mobile.map((item) => item.value),
        notify_b_days: data.notify_b_days.map((item) => item.value),
        creation_date: new Date(data.creation_date).toISOString(),
        expire_at: new Date(data.expire_at).toISOString(),
      }).unwrap();

      notifications.show({
        title: "Success!",
        message: "Credential created successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "Failed to create credential",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      close();
    }
  };

  //   console.log(JSON.stringify(errors, undefined, 2));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Create New Credential"
        size="lg"
        centered
      >
        <Paper withBorder shadow="md" radius="md" p="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <TextInput
                  label="Name"
                  placeholder="Enter credential name"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  label="Description"
                  placeholder="Enter description"
                  error={errors.descriptions?.message}
                  {...register("descriptions")}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <Controller
                  name="creation_date"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      label="Creation Date"
                      valueFormat="DD MMM YYYY"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
                <Controller
                  name="expire_at"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      label="Expiration Date"
                      valueFormat="DD MMM YYYY"
                      minDate={new Date()}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Switch
                  label="Active"
                  checked={activeStatus}
                  {...register("active")}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Group mb="sm">
                  <Text fw={500}>Phone Numbers</Text>
                  <ActionIcon
                    color="blue"
                    onClick={() => {
                      if (phoneFields.length < 5) {
                        appendPhone({ value: "" });
                      }
                    }}
                    variant="light"
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </Group>

                <Stack gap="xs">
                  {phoneFields.map((field, index) => (
                    <Group key={field.id} gap="xs">
                      <TextInput
                        placeholder="01XXXXXXXXX"
                        error={errors.notify_mobile?.[index]?.message}
                        {...register(`notify_mobile.${index}.value`)}
                        style={{ flex: 1 }}
                      />
                      {index > 0 && (
                        <ActionIcon
                          color="red"
                          onClick={() => removePhone(index)}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  ))}
                </Stack>
              </Grid.Col>

              <Grid.Col span={12}>
                <Group mb="sm">
                  <Text fw={500}>Notification Days</Text>
                  <ActionIcon
                    color="blue"
                    onClick={() => appendDay({ value: "" })}
                    variant="light"
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </Group>

                <Stack gap="xs">
                  {dayFields.map((field, index) => (
                    <Group key={field.id} gap="xs">
                      <TextInput
                        placeholder="e.g., 7"
                        error={errors.notify_b_days?.[index]?.message}
                        {...register(`notify_b_days.${index}.value`)}
                        style={{ flex: 1 }}
                      />
                      {index > 0 && (
                        <ActionIcon
                          color="red"
                          onClick={() => removeDay(index)}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  ))}
                </Stack>
              </Grid.Col>

              <Grid.Col span={12}>
                <Group justify="flex-end" mt="md">
                  <Button variant="default" onClick={close}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={isLoading}>
                    Create
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>
      </Modal>

      <Flex justify="end" align="center" mb="xl">
        <Button onClick={open} leftSection={<IconPlus size={18} />}>
          Add Credential
        </Button>
      </Flex>
    </>
  );
};

export default CreateCredentialModal;
