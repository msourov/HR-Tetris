import { Button, Loader, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useDeleteUserMutation,
  useGetUserDetailQuery,
} from "../../../../features/api/userSlice";
import EditUser from "../EditUser";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

interface RoleActionProps {
  id: string;
}

const UserActions: React.FC<RoleActionProps> = ({ id }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const {
    data: userDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetUserDetailQuery({ uid: id });

  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const navigate = useNavigate();

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

  if (detailError) {
    return <ErrorAlert message="Error fetching user detail" />;
  }

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
          <Menu.Item leftSection={<CiEdit />} onClick={openEdit}>
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
      <Modal opened={editOpened} onClose={closeEdit} title="Edit User">
        {isLoadingDetail ? (
          <div className="flex justify-center p-4">
            <Loader type="dots" />
          </div>
        ) : (
          <EditUser
            id={id}
            closeModal={closeEdit}
            userData={userDetail?.data[0]}
          />
        )}
      </Modal>
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
