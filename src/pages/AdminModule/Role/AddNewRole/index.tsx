import { zodResolver } from "@hookform/resolvers/zod";
import {
  Paper,
  Button,
  Checkbox,
  Switch,
  Text,
  Box,
  TextInput,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { randomId, useListState } from "@mantine/hooks";
import { CreateRoleRequest } from "../../../../features/api/types";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useCreateRoleMutation } from "../../../../features/api/roleSlice";

type Permissions = {
  label: string;
  name: string;
  checked: boolean;
  key: string;
};
type CreateRoleData = {
  name: string;
  status: boolean;
  permissions: Permissions[];
};

const schema = z.object({
  name: z.string().min(1, "Role name is required"),
  status: z.boolean(),
  permissions: z.array(
    z.object({
      label: z.string(),
      name: z.string(),
      checked: z.boolean(),
      key: z.string(),
    })
  ),
});

const initialValues = [
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

const AddNewRole = () => {
  const [values, handlers] = useListState(initialValues);
  const [createRole] = useCreateRoleMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      status: false,
      permissions: initialValues,
    },
  });

  const prepareRoleData = (
    permissions: Permissions[]
  ): { [key: string]: string } => {
    return permissions.reduce((acc, item) => {
      acc[item.name] = item.checked ? "a" : "i";
      return acc;
    }, {} as { [key: string]: string });
  };

  console.log("errors in formstate", errors);

  const onSubmit = async (data: CreateRoleData) => {
    console.log(data);
    const preparedData = prepareRoleData(data.permissions);
    const createData: CreateRoleRequest = {
      name: data.name,
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
    console.log("createData", JSON.stringify(createData, undefined, 2));
    try {
      const response = await createRole(createData).unwrap();
      notifications.show({
        title: "Success!",
        message: "Role Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
      navigate(-1);
    } catch (error) {
      console.error("Failed to create role", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't create role",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
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

  return (
    <Paper withBorder shadow="md" radius="md" p="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text c="dimmed">Role Name</Text>
        <TextInput
          // label="Role Name"
          placeholder="Enter role name"
          mb={10}
          {...register("name")}
          error={errors.name?.message}
        />
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
            {...register("status")}
          />
        </Box>

        <Button type="submit" className="rounded-lg mt-6 bg-black">
          Create
        </Button>
      </form>
    </Paper>
  );
};

export default AddNewRole;
