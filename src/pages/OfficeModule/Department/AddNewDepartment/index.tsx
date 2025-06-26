import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, Paper, Switch, TextInput } from "@mantine/core";
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
    <>
      <Paper radius="md" p="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Name"
            {...register("name")}
            error={errors.name?.message as React.ReactNode}
          />
          <div className="max-w-20 mt-2">
            <label className="text-sm">Status</label>
            <Switch
              size="sm"
              color="blue"
              checked={activeStatus}
              {...register("active")}
            />
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={toggleModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              // bg="black"
            >
              {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default AddNewDepartment;
