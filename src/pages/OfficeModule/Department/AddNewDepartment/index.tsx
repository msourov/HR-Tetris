import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Loader, Paper, Switch, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddDepartmentMutation } from "../../../../features/api/departmentSlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
});

type AddDepartment = z.infer<typeof schema>;
interface AddNewDepartmentProps {
  toggleModal: () => void;
}

const AddNewDepartment: React.FC<AddNewDepartmentProps> = ({ toggleModal }) => {
  const [addDepartment, { isLoading }] = useAddDepartmentMutation();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDepartment>({
    resolver: zodResolver(schema),
  });

  const activeStatus = watch("active");

  const onSubmit = async (data: AddDepartment) => {
    try {
      const response = await addDepartment(data).unwrap();
      notifications.show({
        title: "Success!",
        message: "Department Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't create Department",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      toggleModal();
    }
  };

  return (
    <div>
      <Paper withBorder shadow="md" radius="md" p="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Name"
            {...register("name")}
            error={errors.name?.message as React.ReactNode}
          />
          <Box className="max-w-20 mt-4">
            <Switch
              size="lg"
              onLabel="Disable"
              offLabel="Activate"
              color="black"
              checked={activeStatus}
              {...register("active")}
            />
          </Box>

          <Button
            type="submit"
            className="rounded-lg mt-6"
            disabled={isLoading}
            bg="black"
          >
            {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddNewDepartment;
