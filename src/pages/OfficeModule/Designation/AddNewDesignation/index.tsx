import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Switch, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useAddDesignationMutation } from "../../../../features/api/designationSlice";
import AppLoader from "../../../../components/ui/AppLoader";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
});

type AddDesignation = z.infer<typeof schema>;
interface AddNewDesignationProps {
  toggleModal: () => void;
}

const AddNewDesignation: React.FC<AddNewDesignationProps> = ({
  toggleModal,
}) => {
  const [addDesignation, { isLoading }] = useAddDesignationMutation();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDesignation>({
    resolver: zodResolver(schema),
  });

  const activeStatus = watch("active");

  const onSubmit = async (data: AddDesignation) => {
    try {
      const response = await addDesignation(data).unwrap();
      notifications.show({
        title: "Success!",
        message: "Designation Created Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      console.log(response);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't create Designation",
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
      <Paper withBorder radius="md" p="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label={<p className="text-gray-500">Name</p>}
            {...register("name")}
            error={errors.name?.message as React.ReactNode}
          />
          <Box className="max-w-20 mt-2">
            <label className="text-sm text-gray-500">Status</label>
            <Switch
              defaultChecked={true}
              size="sm"
              color="blue"
              checked={activeStatus}
              {...register("active")}
            />
          </Box>
          <Box className="mt-6 space-x-2 flex justify-end">
            <Button variant="outline" onClick={toggleModal}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-lg" disabled={isLoading}>
              {isLoading ? <AppLoader /> : "Save"}
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default AddNewDesignation;
