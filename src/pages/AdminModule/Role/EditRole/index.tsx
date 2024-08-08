import { zodResolver } from "@hookform/resolvers/zod";
import { Paper, Button, Checkbox, Switch, Text, Box } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
import { EditRoleRequest } from "../../../../features/api/types";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useEditRoleMutation,
  useGetRoleDetailQuery,
} from "../../../../features/api/roleSlice";

type Permissions = {
  label: string;
  name:
    | "user_management"
    | "office_management"
    | "app_user_management"
    | "employee_management"
    | "clm_management"
    | "ticket_management"
    | "inventory_management"
    | "anouncement_management"
    | "recruitment_management";
  checked: boolean;
  key: string;
};

type EditRoleFormData = z.infer<typeof schema>;

interface EditRoleProps {
  id: string;
  name: string;
  closeModal: () => void;
}

const schema = z.object({
  status: z.boolean(),
  permissions: z.array(
    z.object({
      label: z.string(),
      name: z.union([
        z.literal("user_management"),
        z.literal("office_management"),
        z.literal("app_user_management"),
        z.literal("employee_management"),
        z.literal("clm_management"),
        z.literal("ticket_management"),
        z.literal("inventory_management"),
        z.literal("anouncement_management"),
        z.literal("recruitment_management"),
      ]),
      checked: z.boolean(),
      key: z.string(),
    })
  ),
});

const initialValues: Permissions[] = [
  {
    label: "Office Management",
    name: "office_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Employee Management",
    name: "employee_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "User Management",
    name: "user_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "App User Management",
    name: "app_user_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Certification and License Management",
    name: "clm_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Ticket Management",
    name: "ticket_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Employee Management",
    name: "employee_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Inventory Management",
    name: "inventory_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Announcement Management",
    name: "anouncement_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Recruitment Management",
    name: "recruitment_management",
    checked: false,
    key: randomId(),
  },
];

const EditRole = ({ id: uid, name, closeModal }: EditRoleProps) => {
  const [values, handlers] = useListState(initialValues);
  const { data: getRoleDetail, isLoading } = useGetRoleDetailQuery({ uid });
  const [editRole] = useEditRoleMutation();
  console.log("id", uid);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: false,
      permissions: initialValues,
    },
  });
  console.log(JSON.stringify(getRoleDetail, undefined, 2));

  const activeStatus = watch("status");

  useEffect(() => {
    if (getRoleDetail) {
      const rolePermissions = initialValues.map((permission) => ({
        ...permission,
        checked:
          getRoleDetail.data.access[
            permission.name as keyof typeof getRoleDetail.data.access
          ] === "a",
      }));

      handlers.setState(rolePermissions);
      setValue("permissions", rolePermissions);
      setValue("status", getRoleDetail.data.active);
    }
  }, [getRoleDetail, setValue]);

  const prepareEditRoleData = (
    permissions: Permissions[]
  ): { [key: string]: string } => {
    return permissions.reduce((acc, item) => {
      acc[item.name] = item.checked ? "a" : "i";
      return acc;
    }, {} as { [key: string]: string });
  };

  console.log("errors in formstate", errors);

  const onSubmit = async (data: EditRoleFormData) => {
    console.log(data);
    const preparedData = prepareEditRoleData(data.permissions);
    const editData: EditRoleRequest = {
      uid,
      name,
      active: data.status,
      ...(preparedData as {
        app_user_management: "a" | "i";
        employee_management: "a" | "i";
        user_management: "a" | "i";
        office_management: "a" | "i";
        clm_management: "a" | "i";
        ticket_management: "a" | "i";
        inventory_management: "a" | "i";
        anouncement_management: "a" | "i";
        recruitment_management: "a" | "i";
      }),
    };
    console.log("editData", JSON.stringify(editData, undefined, 2));
    try {
      await editRole(editData).unwrap();
      notifications.show({
        title: "Success!",
        message: "Succesfully updated role",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't update role",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeModal();
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    console.log(index, checked);
    handlers.setItemProp(index, "checked", checked);
    const updatedPermissions = getValues("permissions").map((permission, i) =>
      i === index ? { ...permission, checked } : permission
    );
    setValue("permissions", updatedPermissions);
  };

  const items = values.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      name={value.name}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        handleCheckboxChange(index, event.currentTarget.checked)
      }
    />
  ));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Paper withBorder shadow="md" radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text c="dimmed">Select Accesses</Text>
        {items}
        <Text c="dimmed" className="mt-6 mb-2">
          Set Status
        </Text>
        <Box className="max-w-20">
          <Switch
            size="lg"
            onLabel="Disable"
            offLabel="Activate"
            color="black"
            checked={activeStatus}
            {...register("status")}
          />
        </Box>

        <Button type="submit" className="rounded-lg mt-6 bg-black">
          Save
        </Button>
      </form>
    </Paper>
  );
};

export default EditRole;
