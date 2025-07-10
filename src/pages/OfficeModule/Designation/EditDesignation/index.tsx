import {
  Box,
  Button,
  Modal,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LuPlusCircle } from "react-icons/lu";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useDeleteDesignationMutation,
  useEditDesignationMutation,
  useGetDesignationsQuery,
} from "../../../../features/api/designationSlice";
import AddNewDesignation from "../AddNewDesignation";
import AppLoader from "../../../../components/ui/AppLoader";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
});

type EditDesignationType = z.infer<typeof schema>;

const EditDesignation = () => {
  const [des, setDes] = useState<string | null>(null);
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const { data: designations } = useGetDesignationsQuery({
    page: 1,
    limit: 10,
  });
  const [editDesignation, { isLoading: editDesLoading }] =
    useEditDesignationMutation();
  const [deleteDesignation, { isLoading: deleteDesLoading }] =
    useDeleteDesignationMutation();
  const toggleModal = () => {
    addClose();
  };

  const designationOptions = designations?.data.map((item) => ({
    value: item?.uid,
    label: item?.name,
  }));

  const designationDetail = designations?.data.find(
    (item) => item?.uid === des
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditDesignationType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (designationDetail) {
      reset({
        name: designationDetail?.name,
        active: designationDetail?.active,
      });
    }
  }, [designationDetail, reset]);

  const activeStatus = watch("active");

  const text = <Text fw={500}>Select Designation</Text>;

  const onSubmit = async (data: EditDesignationType) => {
    if (!des) {
      notifications.show({
        title: "Error!",
        message: "No designation selected",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    const obj = {
      ...data,
      uid: des as string,
    };
    try {
      await editDesignation(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: "Succesfully updated designation",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't update designation",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteDesignation({ id: des as string }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Designation deleted",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setDes(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't delete designation",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeDelete();
    }
  };

  return (
    <Box className="my-6">
      <Box className="flex justify-end">
        <Button leftSection={<LuPlusCircle />} onClick={addOpen}>
          Add
        </Button>
      </Box>
      <Modal opened={addOpened} onClose={addClose} title="Add Designation">
        <AddNewDesignation toggleModal={toggleModal} />
      </Modal>
      <Select
        label={text}
        data={designationOptions}
        value={des || ""}
        onChange={(value) => {
          if (value) {
            setDes(value);
          } else {
            setDes("");
          }
        }}
        mt={8}
      />
      {des && (
        <Paper shadow="sm" p="md" my={16}>
          {designationDetail ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="Name"
                {...register("name")}
                error={errors.name?.message as React.ReactNode}
              />
              <Box className="max-w-20 mt-4">
                <Switch
                  size="md"
                  color="blue"
                  checked={activeStatus}
                  {...register("active")}
                />
              </Box>

              <Button
                size="compact-md"
                type="submit"
                className="rounded-lg mt-6 text-xs w-[80px]"
                disabled={editDesLoading}
                bg="blue"
              >
                {editDesLoading ? <AppLoader /> : "Save"}
              </Button>
            </form>
          ) : (
            <Text className="text-center">Error loading data</Text>
          )}
        </Paper>
      )}
      {designationDetail && (
        <>
          <Box className="flex justify-end mt-10">
            <Button variant="light" color="red" onClick={openDelete}>
              Delete
            </Button>
          </Box>
          <Modal
            opened={deleteOpened}
            onClose={closeDelete}
            centered
            className="text-center"
          >
            <Text>Are you sure you want to delete?</Text>
            <Box className="flex gap-2 justify-center mt-4">
              <Button
                color="red"
                onClick={handleDelete}
                disabled={deleteDesLoading}
              >
                Confirm
              </Button>
              <Button
                color="gray"
                onClick={closeDelete}
                disabled={deleteDesLoading}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default EditDesignation;
