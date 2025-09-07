import { Button, Modal } from "@mantine/core";
import ConsumableTable from "./ConsumablesTable";
import { useDisclosure } from "@mantine/hooks";
import AddConsumable from "./AddConsumable";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { LuPlus } from "react-icons/lu";

const Consumables = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Consumable"
          Breadcrumb={{
            module: "Inventory Management",
            page: "Consumable",
          }}
          ShowAddButton={false}
        />
        <Button
          variant="filled"
          leftSection={<LuPlus size={18} />}
          onClick={open}
          className="my-10"
        >
          Add Consumables
        </Button>
      </div>

      <ConsumableTable />
      <Modal opened={opened} onClose={close} size="lg">
        <AddConsumable closeModal={close} />
      </Modal>
    </div>
  );
};

export default Consumables;
