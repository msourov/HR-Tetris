import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LoanTable from "./LoanTable";
import CreateLoan from "./AddLoan";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { LuPlus } from "react-icons/lu";

const Loan = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Issued Equipment"
          Breadcrumb={{
            module: "Inventory Management",
            page: "Issued Equipment",
          }}
          ShowAddButton={false}
        />
        <Button
          variant="filled"
          leftSection={<LuPlus size={18} />}
          onClick={open}
          className="my-10"
        >
          Add Loan
        </Button>
      </div>

      <LoanTable />
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <CreateLoan closeModal={close} />
      </Modal>
    </div>
  );
};

export default Loan;
