import { Box, Button, Loader, Menu, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useDeleteEmployeeMutation } from "../../../features/api/employeeSlice";
import ErrorAlert from "../../../components/shared/ErrorAlert";

interface EmplyeeActionProp {
  id: string;
}

const EmployeeActions: React.FC<EmplyeeActionProp> = ({ id }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteEmployee, { isLoading, error }] = useDeleteEmployeeMutation();
  const navigate = useNavigate();

  const DeleteUser = async () => {
    try {
      const response = await deleteEmployee({ id }).unwrap();
      console.log(response);
      close();
      notifications.show({
        title: "Success!",
        message: "User Deleted Successfully",
        icon: <IconCheck />,
        color: "red",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message: "Couldn't Delete user",
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

  if (error) {
    <ErrorAlert message="Something went wrong!" />;
  }
  return (
    <Box>
      <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
        <Menu.Target>
          <button>
            <BiDotsVerticalRounded />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IoEyeOutline />}
            onClick={() => navigate(`${id}/detail`)}
          >
            View
          </Menu.Item>
          <Menu.Item
            leftSection={<CiEdit />}
            onClick={() => navigate(`${id}/edit`)}
          >
            Edit
          </Menu.Item>
          <Menu.Item
            leftSection={<MdDeleteOutline />}
            className="text-red-600"
            onClick={open}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal opened={opened} onClose={close} centered className="text-center">
        <Text>Are you sure you want to delete?</Text>
        <Box className="flex gap-2 justify-center mt-4">
          <Button color="red" onClick={DeleteUser}>
            Confirm
          </Button>
          <Button color="gray" onClick={close}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeeActions;
