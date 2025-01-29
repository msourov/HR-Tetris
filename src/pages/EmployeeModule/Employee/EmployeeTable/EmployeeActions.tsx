import { Button, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useDeleteEmployeeMutation } from "../../../../features/api/employeeSlice";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

interface EmplyeeActionProp {
  id: string;
  name: string;
  department: string;
  designation: string;
}

const EmployeeActions: React.FC<EmplyeeActionProp> = ({
  id,
  name,
  department,
  designation,
}) => {
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteEmployee, { isLoading, error }] = useDeleteEmployeeMutation();
  const navigate = useNavigate();

  const DeleteEmployee = async () => {
    try {
      const response = await deleteEmployee({ id }).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: "Employee Deleted Successfully",
        icon: <IconCheck />,
        color: "red",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message: "Couldn't delete employee",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeDelete();
    }
  };

  if (isLoading) {
    return (
      <>
        <Loader type="dots" />
      </>
    );
  }

  if (error) {
    <ErrorAlert message="Something went wrong!" />;
  }
  return (
    <>
      {/* <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
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
            onClick={() => navigate(`${id}/edit-employee`)}
          >
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
      </Menu> */}
      <div className="flex items-center gap-2 text-gray-600">
        <button
          onClick={() => navigate(`${id}/detail`)}
          className="text-blue-400 transition-all duration-300 hover:text-blue-500 hover:drop-shadow-[0_0_8px_#3b82f6]"
        >
          <IoEyeOutline className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(`${id}/edit-employee`)}
          className="text-yellow-600 transition-all duration-300 hover:text-orange-800 hover:drop-shadow-[0_0_8px_#facc15]"
        >
          <CiEdit className="w-5 h-5" />
        </button>
        <button
          onClick={openDelete}
          className="text-red-600 transition-all duration-300 hover:text-red-500 hover:drop-shadow-[0_0_8px_#ef4444]"
        >
          <MdDeleteOutline className="w-5 h-5" />
        </button>
      </div>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDelete}
        centered
        withCloseButton={false}
      >
        <p className="text-lg font-thin text-gray-500 mb-4 text-center">
          Are you sure you want to delete this employee?
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-left text-gray-900 mb-2">
            <p className="mb-1">
              <span className="font-medium text-gray-500">🧑</span> {name}{" "}
              <span className="text-gray-500">({id}</span>)
            </p>
            <p className="mb-1">
              <span className="font-medium text-gray-500">🏢</span> {department}
            </p>
            <p className="mb-1">
              <span className="font-medium text-gray-500">💼</span>{" "}
              {designation}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-center mt-4">
          <Button color="red" onClick={DeleteEmployee}>
            Confirm
          </Button>
          <Button color="gray" onClick={closeDelete}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EmployeeActions;
