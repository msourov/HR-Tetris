import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Loader, Paper, Switch, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useAddDesignationMutation } from "../../../../features/api/designationSlice";

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
    console.log(data);
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
            bg="black"
            disabled={isLoading}
          >
            {isLoading ? <Loader type="dots" size="sm" /> : "Save"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddNewDesignation;
