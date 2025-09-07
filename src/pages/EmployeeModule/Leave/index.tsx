import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../../components/ui/AppModal";
import AddLeave from "./AddLeave";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { LuPlus } from "react-icons/lu";
import { Outlet } from "react-router-dom";

const LeaveLayout = () => {
  const [modalOpened, { open: modalOpen, close: modalClose }] =
    useDisclosure(false);

  const toggleModal = () => {
    modalClose();
  };

  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Leave"
          Breadcrumb={{ module: "Employee Management", page: "Leave" }}
          ShowAddButton={false}
        />
        <Button
          leftSection={<LuPlus size={18} />}
          variant="filled"
          onClick={modalOpen}
          className="my-10"
        >
          Add Leave
        </Button>
      </div>
      <div>
        <Outlet />
      </div>
      <AppModal
        opened={modalOpened}
        onClose={modalClose}
        withCloseButton={false}
        size="xl"
      >
        <AddLeave toggleModal={toggleModal} />
      </AppModal>
    </div>
  );
};

export default LeaveLayout;
