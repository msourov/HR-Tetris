import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse } from "react-router-dom";
import { useDeleteLoanMutation } from "../../../../features/api/loanSlice";
import EditLoan from "../EditLoan";
import { LoanWithGuarantorObj } from "../../../../features/types/inventory";

interface LoanActionsProps {
  data: LoanWithGuarantorObj;
}

const LoanActions: React.FC<LoanActionsProps> = ({ data }) => {
  const [editModalOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteLoan, { isLoading: deleteLoading }] = useDeleteLoanMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteLoan({ uid: data.uid }).unwrap();
      console.log(response);
      notifications.show({
        title: "Deleted",
        message: response.message || "Loan deleted successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: (error as ErrorResponse).data.detail || "Couldn't delete loan",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 text-gray-600">
        <button
          onClick={openEdit}
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

      {/* Edit Modal */}
      <Modal opened={editModalOpened} onClose={closeEdit} size="lg">
        <EditLoan uid={data?.uid} closeEdit={closeEdit} />
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDelete}
        centered
        withCloseButton={false}
      >
        <p className="text-lg font-thin text-gray-500 mb-4 text-center">
          Are you sure you want to delete this loan?
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

export default LoanActions;
