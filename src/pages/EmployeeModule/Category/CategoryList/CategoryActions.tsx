import { Button, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { MdDeleteOutline } from "react-icons/md";
import { useDeleteCategoryMutation } from "../../../../features/api/categorySlice";

interface CategoryActionsProps {
  uid: string;
}

const CategoryActions: React.FC<CategoryActionsProps> = ({ uid }) => {
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteCategory({ uid }).unwrap();
      notifications.show({
        title: "Deleted",
        message: response.message || "Category deleted successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeDelete();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message:
          (error as { data?: { detail?: string } })?.data?.detail ||
          "Couldn't delete category",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <button
        onClick={openDelete}
        className="text-red-600 transition-all duration-300 hover:text-red-500 hover:drop-shadow-[0_0_8px_#ef4444]"
      >
        <MdDeleteOutline className="w-5 h-5" />
      </button>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDelete}
        centered
        withCloseButton={false}
      >
        <p className="text-lg font-thin text-gray-500 mb-4 text-center">
          Are you sure you want to delete this Category?
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Confirm
          </Button>
          <Button color="gray" onClick={closeDelete} disabled={deleteLoading}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CategoryActions;
