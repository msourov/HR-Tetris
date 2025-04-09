import {
  Box,
  Button,
  Loader,
  Modal,
  Paper,
  Select,
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
  useDeletePolicyMutation,
  useEditPolicyMutation,
  useGetPoliciesQuery,
} from "../../../../features/api/policySlice";
import { modals } from "@mantine/modals";
import { AllPolicy } from "../../../../features/api/typesOld";

const schema = z.object({
  active: z.boolean(),
  name: z.string().min(2),
  description: z.string().min(1, { message: "Description is required" }),
});

type EditDesignationType = z.infer<typeof schema>;

const ManagePolicy = () => {
  const [des, setDes] = useState<string>("");
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const { data: policies } = useGetPoliciesQuery({
    page: 1,
    limit: 10,
  });
  const [editPolicy, { isLoading: editDesLoading }] = useEditPolicyMutation();
  const [deleteDesignation, { isLoading: deleteDesLoading }] =
    useDeletePolicyMutation();
  // const toggleModal = () => {
  //   addClose();
  // };

  const policyOptions = Array.isArray(policies?.data)
    ? policies.data.map((item: AllPolicy) => ({
        value: item?.uid,
        label: item?.name,
      }))
    : [];

  const policyDetail = Array.isArray(policies?.data)
    ? policies.data.find((item) => item?.uid === des)
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditDesignationType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (policyDetail) {
      reset({
        name: policyDetail?.name,
        active: policyDetail?.active,
      });
    }
  }, [policyDetail, reset]);

  // const activeStatus = watch("active");

  const text = <Text fw={500}>Select Policy</Text>;

  const onSubmit = async (data: EditDesignationType) => {
    const obj = {
      ...data,
      written_policy: data.description,
      uid: des,
    };
    try {
      await editPolicy(obj).unwrap();
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
      await deleteDesignation({ id: des }).unwrap();
      setDes("");
      notifications.show({
        title: "Success!",
        message: "Designation deleted",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
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

  // const handleFirstModalConfirm = () => {
  //   console.log("modal clicked");
  //   modals.openConfirmModal({
  //     title: "This is the second modal",
  //     labels: { confirm: "Close modal", cancel: "Back" },
  //     closeOnConfirm: false,
  //     children: (
  //       <Text size="sm">
  //         When this modal is closed, the state will revert to the first modal.
  //       </Text>
  //     ),
  //     onConfirm: () => modals.closeAll(),
  //   });
  // };

  const handleAddButtonClick = () => {
    modals.openContextModal({
      modal: "demonstration",
      centered: true,
      innerProps: {
        // modalBody:
        //   "This modal was defined in ModalsProvider, you can open it anywhere in you app with useModals hook",
      },
    });
  };

  return (
    <Box className="my-6">
      <Box className="flex justify-end">
        {/* <Button
          leftSection={<LuPlusCircle />}
          color="black"
          variant="filled"
          // mt={-24}
          onClick={addOpen}
        >
          Add
        </Button> */}
        <Button
          leftSection={<LuPlusCircle />}
          color="black"
          variant="filled"
          onClick={handleAddButtonClick}
          bg="orange"
        >
          Add
        </Button>
      </Box>
      {/* <Modal
        opened={addOpened}
        onClose={addClose}
        title="Add Policy"
        size={"80%"}
      >
        <AddPolicy toggleModal={toggleModal} />
      </Modal> */}
      <Select
        label={text}
        data={policyOptions}
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
          {policyDetail ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="Name"
                {...register("name")}
                error={errors.name?.message as React.ReactNode}
              />
              {/* <Box className="max-w-20 mt-4">
                <Switch
                  size="lg"
                  onLabel="Disable"
                  offLabel="Activate"
                  color="black"
                  checked={activeStatus}
                  {...register("active")}
                />
              </Box> */}

              <Button
                type="submit"
                className="rounded-lg mt-6"
                bg="black"
                disabled={editDesLoading}
              >
                {editDesLoading ? <Loader type="dots" size="sm" /> : "Save"}
              </Button>
            </form>
          ) : (
            <Text className="text-center">Error loading data</Text>
          )}
        </Paper>
      )}
      {policyDetail && (
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

export default ManagePolicy;
