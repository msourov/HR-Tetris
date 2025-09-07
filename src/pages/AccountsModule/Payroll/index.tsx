import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { Button } from "@mantine/core";
import { LuPlus } from "react-icons/lu";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../../components/ui/AppModal";
import CreatePayroll from "./CreatePayroll";

const PayrollLayout = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Payroll"
          Breadcrumb={{ module: "Accounts Management", page: "Payroll" }}
          ShowAddButton={false}
        />
        <Button
          leftSection={<LuPlus size={18} />}
          variant="filled"
          onClick={open}
          className="my-10"
        >
          Create Payroll
        </Button>
      </div>
      <Outlet />;
      <AppModal opened={opened} onClose={close} size="md">
        <CreatePayroll closeModal={close} />
      </AppModal>
    </div>
  );
};

export default PayrollLayout;
