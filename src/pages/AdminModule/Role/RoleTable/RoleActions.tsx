import { Button, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import EditRole from "../EditRole";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useDeleteRoleMutation,
  useGetRoleDetailQuery,
} from "../../../../features/api/roleSlice";
import { Role } from "../../../../features/types/role";

interface RoleActionProps {
  name: string;
  id: string;
  disabled: boolean;
}

const RoleActions: React.FC<RoleActionProps> = ({ name, id, disabled }) => {
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const { data: roleDetail, isLoading: isDetailLoading } =
    useGetRoleDetailQuery({ uid: id }, { skip: !editOpened });

  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();

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
      <>
        <Loader type="dots" />
      </>
    );
  }

  console.log(roleDetail);

  return (
    <>
      <div className="flex items-center gap-3 text-gray-600">
        <button
          onClick={openEdit}
          disabled={disabled}
          className={`
            p-1.5 rounded-md transition-all
            text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700
            disabled:text-gray-400 disabled:bg-transparent disabled:cursor-not-allowed
          `}
        >
          <CiEdit className="w-5 h-5" />
        </button>

        <button
          onClick={openDelete}
          disabled={disabled}
          className={`
            p-1.5 rounded-md transition-all
            text-red-600 hover:bg-red-50 hover:text-red-700
            disabled:text-gray-400 disabled:bg-transparent disabled:cursor-not-allowed
          `}
        >
          <MdDeleteOutline className="w-5 h-5" />
        </button>
      </div>

      <Modal opened={editOpened} onClose={closeEdit} title="Edit Role">
        {isDetailLoading ? (
          <div className="flex justify-center p-4">
            <Loader type="dots" />
          </div>
        ) : (
          <EditRole
            id={id}
            name={name}
            closeModal={closeEdit}
            roleData={roleDetail?.data ?? ({} as Role)}
          />
        )}
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        withCloseButton={false}
        centered
      >
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{name}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              color="red"
              onClick={DeleteRole}
              loading={isLoading}
              className="px-6"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              color="gray"
              onClick={closeDelete}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RoleActions;
