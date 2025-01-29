import { Button, Loader, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useDeleteUserMutation } from "../../../../features/api/userSlice";

interface RoleActionProps {
  id: string;
}

const UserActions: React.FC<RoleActionProps> = ({ id }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const navigate = useNavigate();
  //   const closeModal = () => {
  //     close();
  //   };

  const DeleteUser = async () => {
    try {
      const response = await deleteUser({ id }).unwrap();
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
      <>
        <Loader type="dots" />
      </>
    );
  }

  // if (error) {
  //   return <div>Error</div>;
  // }
  return (
    <>
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
          {/* {popoverOpen && (
            <Popover.Dropdown>
              <div>
                <Text>Are you sure you want to delete?</Text>
                <Button color="red" onClick={() => console.log("Deleted")}>
                  Confirm
                </Button>
                <Button color="gray" onClick={() => setPopoverOpen(false)}>
                  Cancel
                </Button>
              </div>
            </Popover.Dropdown>
          )} */}
        </Menu.Dropdown>
      </Menu>
      <Modal opened={opened} onClose={close} centered className="text-center">
        <p>Are you sure you want to delete?</p>
        <div className="flex gap-2 justify-center mt-4">
          <Button color="red" onClick={DeleteUser}>
            Confirm
          </Button>
          <Button color="gray" onClick={close}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UserActions;
