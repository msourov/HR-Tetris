import {
  Box,
  Button,
  Loader,
  Modal,
  Paper,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LuPlusCircle } from "react-icons/lu";
import AddNewDepartment from "../AddNewDepartment";
import {
  useDeleteDepartmentMutation,
  useEditDepartmentMutation,
  useGetDepartmentsQuery,
} from "../../../../features/api/departmentSlice";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
});

type EditDepartmentType = z.infer<typeof schema>;

const EditDepartment = () => {
  const [dept, setDept] = useState<string>("");
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const { data: departments } = useGetDepartmentsQuery({ page: 1, limit: 10 });
  const [editDepartment, { isLoading: editDeptLoading }] =
    useEditDepartmentMutation();
  const [deleteDepartment, { isLoading: deleteDeptLoading }] =
    useDeleteDepartmentMutation();
  // const {
  //   data: departmentDetail,
  //   isLoading: deptDetailLoading,
  //   error: deptDetailError,
  // } = useGetDepartmentDetailQuery({
  //   uid: dept,
  // });
  const toggleModal = () => {
    addClose();
  };

  const deptOptions = departments?.data.map((item) => ({
    value: item?.uid,
    label: item?.name,
  }));

  const departmentDetail = departments?.data.find((item) => item?.uid === dept);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditDepartmentType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (departmentDetail) {
      reset({
        name: departmentDetail?.name,
        active: departmentDetail?.active,
      });
    }
  }, [departmentDetail, reset]);

  const activeStatus = watch("active");

  const text = <Text fw={500}>Select Department</Text>;

  const onSubmit = async (data: EditDepartmentType) => {
    console.log("submitted data", data);
    const obj = {
      ...data,
      uid: dept,
    };
    try {
      await editDepartment(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: "Succesfully updated department",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't update department",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment({ id: dept }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Department deleted",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't delete department",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <Box className="my-6">
      <Box className="flex justify-end">
        <Button
          leftSection={<LuPlusCircle />}
          color="black"
          bg="orange"
          variant="filled"
          // mt={-24}
          onClick={addOpen}
        >
          Add
        </Button>
      </Box>
      <Modal opened={addOpened} onClose={addClose} title="Add Department">
        <AddNewDepartment toggleModal={toggleModal} />
      </Modal>
      <Select
        label={text}
        data={deptOptions}
        value={dept}
        onChange={(value) => {
          if (value) {
            setDept(value);
          }
        }}
        mt={8}
      />
      {dept && (
        <Paper shadow="sm" p="md" my={16}>
          {departmentDetail ? (
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
                disabled={editDeptLoading}
              >
                {editDeptLoading ? <Loader type="dots" size="sm" /> : "Save"}
              </Button>
            </form>
          ) : (
            <ErrorAlert message="Error updating department" />
          )}
        </Paper>
      )}
      {departmentDetail && (
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
                disabled={deleteDeptLoading}
              >
                Confirm
              </Button>
              <Button color="gray" onClick={close} disabled={deleteDeptLoading}>
                Cancel
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default EditDepartment;
