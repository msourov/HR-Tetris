import { Box, Button, Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import TangibleTable from "./TangiblesTable";
import AddTangible from "./AddTangible";

const Tangibles = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div>
      <Box
        w={"100%"}
        px={"2.25rem"}
        className="flex justify-end mb-6 py-4 mt-6"
      >
        <Button
          variant="filled"
          color="white"
          c="blue"
          size="sm"
          className="shadow-md text-sm hover:bg-blue-100 hover:text-white border-blue-300"
          leftSection={<IconPlus size={16} />}
          onClick={open}
        >
          Add Tangibles
        </Button>
      </Box>

      <div className="flex flex-col">
        <div className="w-[95%] mb-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
          <TangibleTable />
        </div>
      </div>
      <Modal opened={opened} onClose={close} size="lg">
        <AddTangible closeModal={close} />
      </Modal>
    </div>
  );
};

export default Tangibles;
