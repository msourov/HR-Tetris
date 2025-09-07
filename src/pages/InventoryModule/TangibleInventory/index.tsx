import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TangibleTable from "./TangiblesTable";
import AddTangible from "./AddTangible";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { LuPlus } from "react-icons/lu";

const Tangibles = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Tangible"
          Breadcrumb={{
            module: "Inventory Management",
            page: "Tangible",
          }}
          ShowAddButton={false}
        />
        <Button
          variant="filled"
          leftSection={<LuPlus size={18} />}
          onClick={open}
          className="my-10"
        >
          Add Tangibles
        </Button>
      </div>

      <TangibleTable />
      <Modal opened={opened} onClose={close} size="lg">
        <AddTangible closeModal={close} />
      </Modal>
    </div>
  );
};

export default Tangibles;
