import { Box, Button, Loader, Menu, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import EditRole from "../EditRole";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useDeleteRoleMutation } from "../../../../features/api/roleSlice";

interface RoleActionProps {
  name: string;
  id: string;
  disabled: boolean;
}

const RoleActions: React.FC<RoleActionProps> = ({ name, id, disabled }) => {
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();
  const closeModal = () => {
    closeEdit();
  };
  // console.log("id", id);
  const DeleteRole = async () => {
    try {
      const response = await deleteRole({ id }).unwrap();
      console.log(response);
      closeDelete();
      notifications.show({
        title: "Success!",
        message: "Role Deleted Successfully",
        icon: <IconCheck />,
        color: "red",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message: "Couldn't Delete role",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loader type="dots" />
      </div>
    );
  }

  return (
    <Box>
      <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
        <Menu.Target>
          <button disabled={disabled}>
            <BiDotsVerticalRounded style={{ opacity: disabled ? 0.4 : 1 }} />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          {/* <Menu.Item leftSection={<IoEyeOutline />}>View</Menu.Item> */}
          <Menu.Item leftSection={<CiEdit />} onClick={openEdit}>
            Edit
          </Menu.Item>
          <Menu.Item
            leftSection={<MdDeleteOutline />}
            className="text-red-600"
            onClick={openDelete}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal.Root opened={editOpened} onClose={closeEdit} centered>
        <Modal.Overlay className="bg-opacity-15" />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Role</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <EditRole id={id} name={name} closeModal={closeModal} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        centered
        className="text-center"
      >
        <Text>Are you sure you want to delete?</Text>
        <Box className="flex gap-2 justify-center mt-4">
          <Button color="red" onClick={DeleteRole}>
            Confirm
          </Button>
          <Button color="gray" onClick={closeDelete}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default RoleActions;
