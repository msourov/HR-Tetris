import { Button, Modal, Paper, Select, Switch, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
import AppLoader from "../../../../components/ui/AppLoader";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
});

type EditDepartmentType = z.infer<typeof schema>;

const EditDepartment = () => {
  const [dept, setDept] = useState<string | null>(null);
  const [changesMade, setChangesMade] = useState(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const { data: departments } = useGetDepartmentsQuery({ page: 1, limit: 30 });
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

  useEffect(() => {
    if (!departmentDetail) return;

    const hasChanges =
      watch("name") !== departmentDetail.name ||
      watch("active") !== departmentDetail.active;

    setChangesMade(hasChanges);
  }, [watch("name"), watch("active"), departmentDetail]);

  const activeStatus = watch("active");

  const text = <p className="font-medium text-gray-600">Select Department</p>;

  const onSubmit = async (data: EditDepartmentType) => {
    if (!dept) return;
    const obj = {
      ...data,
      uid: dept,
    };
    try {
      const response = await editDepartment(obj).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Succesfully updated department",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setChangesMade(false);
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
      const response = await deleteDepartment({ id: dept as string }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Department deleted",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setDept(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Couldn't delete department",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeDelete();
    }
  };

  return (
    <div className="my-6">
      <Select
        searchable
        label={text}
        data={deptOptions}
        value={dept}
        onChange={(value) => {
          if (value) {
            setDept(value);
          }
        }}
        mt={8}
        classNames={{
          dropdown: "glass-dropdown",
        }}
      />
      {dept && (
        <Paper shadow="sm" p="md" my={16}>
          {departmentDetail && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="Name"
                {...register("name")}
                error={errors.name?.message as React.ReactNode}
              />
              <div className="max-w-20 mt-4">
                <label>Status</label>
                <Switch checked={activeStatus} {...register("active")} />
              </div>
              <div className="flex items-center justify-between mt-8">
                <Button
                  type="submit"
                  className="rounded-lg"
                  disabled={editDeptLoading || !changesMade}
                >
                  {editDeptLoading ? <AppLoader /> : "Save"}
                </Button>

                <Button variant="light" color="red" onClick={openDelete}>
                  Delete
                </Button>
              </div>
            </form>
          )}
        </Paper>
      )}

      <Modal
        withCloseButton={false}
        opened={deleteOpened}
        onClose={closeDelete}
        centered
        className="text-center"
      >
        <p>Are you sure you want to delete?</p>
        <div className="flex gap-2 justify-center mt-4">
          <Button
            color="red"
            onClick={handleDelete}
            disabled={deleteDeptLoading}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            color="gray"
            onClick={close}
            disabled={deleteDeptLoading}
          >
            No
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditDepartment;
